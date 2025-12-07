
import React, { useState, useEffect, useRef } from 'react';
import { UserStats, Goal } from '../types';
import { FlameIcon, ClockIcon, BookIcon, ZapIcon, CheckCircleIcon, PlayIcon, StopIcon, TrashIcon, BellIcon, CalendarIcon, MaximizeIcon, MinimizeIcon, PenIcon } from '../components/Icons';

interface DashboardProps {
  stats: UserStats;
  todaysStats: { time: number; pages: number; wpm: number };
  dailyTasks: Goal[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  // Timer props
  isTimerActive: boolean;
  activeSessionSeconds: number;
  onStartTimer: (mode: 'reading' | 'writing') => void;
  onStopTimer: () => void;
  // Navigation props
  onTaskClick?: (task: Goal) => void;
  timerMode?: 'reading' | 'writing';
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  stats, 
  todaysStats, 
  dailyTasks, 
  onToggleTask,
  onDeleteTask,
  isTimerActive,
  activeSessionSeconds,
  onStartTimer,
  onStopTimer,
  onTaskClick,
  timerMode = 'reading'
}) => {
  // Filter for only daily tasks
  const tasksToShow = dailyTasks.filter(t => t.period === 'daily');

  // Digital Clock State
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Full Screen Mode State
  const [isFullScreenClock, setIsFullScreenClock] = useState(false);

  // Local state for UI toggle (Reading vs Writing) when inactive
  const [selectedMode, setSelectedMode] = useState<'reading' | 'writing'>('reading');

  // Notification logic
  useEffect(() => {
    // Request permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Check reminders every minute
  useEffect(() => {
    const checkReminders = () => {
        const now = new Date();
        const currentHours = now.getHours().toString().padStart(2, '0');
        const currentMinutes = now.getMinutes().toString().padStart(2, '0');
        const currentTimeStr = `${currentHours}:${currentMinutes}`;
        
        // Find tasks that match current time
        tasksToShow.forEach(task => {
            if (task.reminderTime === currentTimeStr && !task.completed) {
                if (Notification.permission === 'granted') {
                    new Notification(`Time to read!`, {
                        body: `Don't forget your goal: ${task.title}`,
                        icon: '/favicon.ico' // fallback
                    });
                }
            }
        });
    };
    
    // Check immediately and then every minute
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [tasksToShow]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeMinutes = Math.floor(activeSessionSeconds / 60);
  const isWriting = timerMode === 'writing';

  return (
    <div className="space-y-6 pb-24 view-transition">
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); }
          80% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .check-pop {
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Full Screen Clock Overlay */}
      {isFullScreenClock && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-6 animate-[fadeIn_0.3s_ease-out]">
            <button
                onClick={() => setIsFullScreenClock(false)}
                className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors shadow-lg"
                title="Exit Full Screen"
            >
                <MinimizeIcon className="w-8 h-8 text-white" />
            </button>

            <div className="flex flex-col items-center space-y-4 text-center">
                 <h2 className="text-7xl sm:text-9xl font-black tracking-tighter tabular-nums bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent select-none drop-shadow-2xl">
                    {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                 </h2>
                 <p className="text-2xl sm:text-4xl text-indigo-300 font-bold uppercase tracking-widest opacity-80">
                    {currentTime.toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'})}
                 </p>

                 {isTimerActive && (
                    <div className="mt-16 flex flex-col items-center animate-pulse">
                        <div className={`text-5xl sm:text-7xl font-mono font-bold tabular-nums tracking-wider drop-shadow-lg ${isWriting ? 'text-fuchsia-400' : 'text-emerald-400'}`}>
                           {formatTimer(activeSessionSeconds)}
                        </div>
                        <p className={`text-base sm:text-lg mt-2 font-bold tracking-wide uppercase ${isWriting ? 'text-fuchsia-500/80' : 'text-emerald-500/80'}`}>
                            {isWriting ? 'Writing Session Active' : 'Reading Session Active'}
                        </p>
                        
                        <button
                           onClick={(e) => {
                             e.stopPropagation();
                             onStopTimer();
                           }}
                           className="mt-8 flex items-center space-x-3 bg-rose-600 hover:bg-rose-500 text-white border border-rose-400 px-10 py-4 rounded-full font-bold shadow-lg shadow-rose-900/40 transition-all active:scale-95"
                        >
                           <StopIcon className="w-6 h-6" />
                           <span className="text-lg">Stop Session</span>
                        </button>
                    </div>
                 )}
            </div>
        </div>
      )}

      <header className="flex justify-between items-end px-1">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Hello, Reader</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Ready for your daily session?</p>
        </div>
        <div className="flex items-center space-x-1.5 bg-orange-50 px-3 py-1.5 rounded-full text-orange-600 border border-orange-100 shadow-sm">
          <FlameIcon className="w-5 h-5 fill-orange-500 text-orange-600" />
          <span className="font-bold text-sm">{stats.dailyStreak} Days</span>
        </div>
      </header>

      {/* Digital Clock & Session Timer - Dark Widget Design */}
      <section className="bg-slate-900 rounded-3xl shadow-xl shadow-slate-200 overflow-hidden relative text-white group transition-all hover:shadow-2xl">
         {/* Background Elements */}
         <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            {isTimerActive && isWriting ? <PenIcon className="w-48 h-48 text-fuchsia-300" /> : <ClockIcon className="w-48 h-48 text-indigo-300" />}
         </div>
         <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none ${isTimerActive && isWriting ? 'bg-fuchsia-600/30' : 'bg-indigo-600/30'}`}></div>

         {/* Full Screen Toggle Button */}
         <button
            onClick={() => setIsFullScreenClock(true)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-indigo-200 transition-all hover:text-white backdrop-blur-sm z-20"
            title="Enter Full Screen"
         >
             <MaximizeIcon className="w-5 h-5" />
         </button>

         <div className="p-7 relative z-10 flex flex-col items-center text-center">
            {/* Clock Display */}
            <div className="mb-6 mt-2">
              <h2 className="text-5xl sm:text-6xl font-black tracking-tighter tabular-nums bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
              </h2>
              <p className="text-indigo-200 font-semibold uppercase tracking-widest text-xs mt-2 opacity-80">
                {currentTime.toLocaleDateString([], {weekday: 'long', month: 'short', day: 'numeric'})}
              </p>
            </div>

            {/* Mode Switcher (Visible only when inactive) */}
            {!isTimerActive && (
                <div className="bg-slate-800/50 p-1 rounded-xl flex space-x-1 mb-6 backdrop-blur-sm border border-white/5">
                    <button 
                        onClick={() => setSelectedMode('reading')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            selectedMode === 'reading' 
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <BookIcon className="w-4 h-4" />
                        <span>Reading</span>
                    </button>
                    <button 
                        onClick={() => setSelectedMode('writing')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            selectedMode === 'writing' 
                            ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <PenIcon className="w-4 h-4" />
                        <span>Writing</span>
                    </button>
                </div>
            )}

            {/* Timer Controls */}
            <div className="w-full">
              {isTimerActive ? (
                <div className="flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
                  <div className="relative mb-6">
                    <div className="text-4xl font-mono font-bold text-white tabular-nums tracking-wider relative z-10">
                      {formatTimer(activeSessionSeconds)}
                    </div>
                    <div className={`absolute inset-0 blur-xl rounded-full opacity-30 ${isWriting ? 'bg-fuchsia-500' : 'bg-indigo-500'}`}></div>
                  </div>
                  
                   <button 
                     onClick={onStopTimer}
                     className="flex items-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-rose-900/20 active:scale-95 transition-all w-full justify-center max-w-[200px]"
                   >
                     <StopIcon className="w-5 h-5" />
                     <span>Stop Session</span>
                   </button>
                   <p className="text-[10px] text-indigo-300/80 mt-4 animate-pulse font-medium tracking-wide">
                     {isWriting ? 'Writing in progress...' : 'Updating your progress live...'}
                   </p>
                </div>
              ) : (
                <button 
                  onClick={() => onStartTimer(selectedMode)}
                  className={`w-full text-slate-900 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-900/20 active:scale-95 transition-all flex items-center justify-center space-x-3 hover:bg-slate-50 ${
                      selectedMode === 'writing' ? 'bg-fuchsia-50' : 'bg-white'
                  }`}
                >
                  <PlayIcon className={`w-5 h-5 fill-current ${selectedMode === 'writing' ? 'text-fuchsia-600' : 'text-indigo-600'}`} />
                  <span>Start {selectedMode === 'writing' ? 'Writing' : 'Reading'} Session</span>
                </button>
              )}
            </div>
         </div>
      </section>

      {/* Today's Overview - Widget Grid */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { icon: ClockIcon, val: todaysStats.time, label: 'Reading', color: 'blue' },
          { icon: PenIcon, val: stats.totalTimeWrittenMinutes, label: 'Writing (All)', color: 'fuchsia' },
          { icon: ZapIcon, val: todaysStats.wpm, label: 'Avg WPM', color: 'violet' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
            <div className={`bg-${item.color}-50 p-2.5 rounded-xl mb-3`}>
              <item.icon className={`w-5 h-5 text-${item.color}-600`} />
            </div>
            <span className="text-2xl font-extrabold text-slate-800 leading-none mb-1">{item.val}</span>
            <span className="text-xs font-semibold text-slate-400">{item.label}</span>
          </div>
        ))}
      </section>

      {/* Daily Checklist */}
      <section>
        <div className="flex justify-between items-center mb-4 px-1">
           <h2 className="text-lg font-bold text-slate-800">Today's Focus</h2>
           <span className="text-xs font-medium text-slate-400">{Math.round((tasksToShow.filter(t => t.completed).length / tasksToShow.length) * 100) || 0}% Complete</span>
        </div>
        
        <div className="space-y-3">
          {tasksToShow.length > 0 ? tasksToShow.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              activeMinutes={activeMinutes} 
              isTimerActive={isTimerActive && !isWriting} // Only animate reading progress if timer is in reading mode
              onToggle={() => onToggleTask(task.id)} 
              onDelete={() => onDeleteTask(task.id)}
              onClick={() => onTaskClick && onTaskClick(task)}
            />
          )) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
              No tasks for today. Relax!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const TaskItem: React.FC<{ 
  task: Goal; 
  activeMinutes: number; 
  isTimerActive: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onClick?: () => void;
}> = ({ task, activeMinutes, isTimerActive, onToggle, onDelete, onClick }) => {
  const isTimeTask = task.unit === 'minutes';
  const dynamicCurrent = isTimeTask && isTimerActive ? task.current + activeMinutes : task.current;
  const progressPercent = Math.min(100, Math.round((dynamicCurrent / task.target) * 100));
  const isLive = isTimeTask && isTimerActive;

  // Swipe logic
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiped, setIsSwiped] = useState(false);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setIsSwiped(true);
    } 
    if (isRightSwipe) {
      setIsSwiped(false);
    }
  };

  // Google Calendar Integration
  const openGoogleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Build Google Calendar URL
    const title = encodeURIComponent(task.title);
    const details = encodeURIComponent('Daily reading goal from ReadFlow');
    
    // Construct times. Use today's date + task.reminderTime
    // If reminderTime is "18:30", make it ISO string
    const now = new Date();
    const timeStr = task.reminderTime || '09:00';
    const [h, m] = timeStr.split(':').map(Number);
    
    // Start Time
    const startDate = new Date(now);
    startDate.setHours(h, m, 0, 0);
    const startISO = startDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    // End Time (assume 30 mins duration)
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30);
    const endISO = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startISO}/${endISO}&recur=RRULE:FREQ=DAILY`;
    
    window.open(url, '_blank');
  };

  // Progress animation
  const [displayedPercent, setDisplayedPercent] = useState(0);
  useEffect(() => {
    // Small delay to trigger animation
    const timer = setTimeout(() => setDisplayedPercent(progressPercent), 100);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background Delete Button */}
      <div className="absolute inset-0 bg-red-500 flex items-center justify-end pr-5 rounded-2xl">
        <button onClick={onDelete} className="p-2 text-white">
           <TrashIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Foreground Content */}
      <div 
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => { 
            if(!isSwiped) {
                // If clicked on body, open detail, unless handled elsewhere or is simple toggle
                if(onClick) onClick();
                else onToggle(); 
            } else {
                setIsSwiped(false);
            }
        }}
        className={`relative bg-white p-4 border transition-all duration-300 ease-out cursor-pointer ${
           isSwiped ? '-translate-x-20' : 'translate-x-0'
        } ${
          task.completed ? 'border-slate-100 opacity-60' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100'
        }`}
      >
        <div className="flex items-start">
          <div 
            onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}
            className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-4 transition-all duration-300 cursor-pointer ${
            task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-200 hover:border-indigo-400'
          }`}>
            {task.completed && <CheckCircleIcon className="w-4 h-4 text-white check-pop" />}
          </div>
          
          <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className={`font-semibold text-sm transition-all duration-300 truncate pr-2 ${task.completed ? 'text-slate-400 line-through decoration-2' : 'text-slate-800'}`}>
                  {task.title}
                </p>
                {isLive ? (
                  <span className="text-[10px] font-black tracking-wide bg-rose-500 text-white px-1.5 py-0.5 rounded-md animate-pulse shadow-sm shadow-rose-200">LIVE</span>
                ) : (
                    // Show Reminder Time if set
                    task.reminderTime && !task.completed && (
                        <div className="flex items-center space-x-2">
                             <div className="flex items-center bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
                                <BellIcon className="w-3 h-3 text-slate-400 mr-1" />
                                <span className="text-[10px] font-bold text-slate-500">{task.reminderTime}</span>
                             </div>
                             {/* Calendar Button (Only show if not swiped, stop propagation) */}
                             <button 
                                onClick={openGoogleCalendar}
                                className="bg-indigo-50 p-1 rounded-md text-indigo-600 hover:bg-indigo-100"
                                title="Add to Calendar"
                             >
                                 <CalendarIcon className="w-3 h-3" />
                             </button>
                        </div>
                    )
                )}
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
                  <span>{dynamicCurrent} / {task.target} {task.unit}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        task.completed ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${displayedPercent}%` }}
                    ></div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
