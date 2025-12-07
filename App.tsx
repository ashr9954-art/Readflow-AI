
import React, { useState, useEffect } from 'react';
import { AppTab, UserStats, Goal, ReadingSession, Badge, ActivityItem } from './types';
import { Dashboard } from './views/Dashboard';
import { Practice } from './views/Practice';
import { Goals } from './views/Goals';
import { Rewards } from './views/Rewards';
import { Insights } from './views/Insights';
import { TaskDetail } from './views/TaskDetail';
import { Syllabus } from './views/Syllabus'; 
import { HomeIcon, TargetIcon, AwardIcon, ChartIcon, ZapIcon, CheckCircleIcon, ClipboardIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  
  // -- State --
  const [stats, setStats] = useState<UserStats>({
    dailyStreak: 0,
    weeklyStreak: 0,
    monthlyStreak: 0,
    yearlyStreak: 0,
    totalTimeReadMinutes: 0,
    totalTimeWrittenMinutes: 0,
    totalPagesRead: 0,
    currentWPM: 0,
    coins: 0,
    xp: 0,
    level: 1
  });

  const [todaysStats, setTodaysStats] = useState({
    time: 0,
    pages: 0,
    wpm: 0
  });

  const [tasks, setTasks] = useState<Goal[]>([
    { id: '1', title: 'Read for 30 minutes', target: 30, current: 0, unit: 'minutes', period: 'daily', completed: false, reminderTime: '18:00' },
    { id: '2', title: 'Read 20 Pages', target: 20, current: 0, unit: 'pages', period: 'daily', completed: false },
    { id: '3', title: 'Finish 1 Book', target: 1, current: 0, unit: 'pages', period: 'weekly', completed: false },
  ]);

  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [selectedTask, setSelectedTask] = useState<Goal | null>(null);

  const [badges, setBadges] = useState<Badge[]>([
    { id: '1', name: '7 Day Streak', description: 'Read for 7 days in a row', icon: 'flame', unlocked: false, color: 'orange', condition: (s) => s.dailyStreak >= 7 },
    { id: '2', name: 'Speed Demon', description: 'Reach 300 WPM', icon: 'zap', unlocked: false, color: 'violet', condition: (s) => s.currentWPM >= 300 },
    { id: '3', name: 'Bookworm', description: 'Read 1000 Pages', icon: 'book', unlocked: false, color: 'emerald', condition: (s) => s.totalPagesRead >= 1000 },
  ]);

  // UI State for animations
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);

  // -- Global Timer State --
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [activeSessionSeconds, setActiveSessionSeconds] = useState(0);
  const [timerMode, setTimerMode] = useState<'reading' | 'writing'>('reading');

  // -- Persistence Logic --
  
  // Load data on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('readflow_stats');
    const savedTasks = localStorage.getItem('readflow_tasks');
    const savedSessions = localStorage.getItem('readflow_sessions');
    const savedActivities = localStorage.getItem('readflow_activities');

    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedActivities) setActivities(JSON.parse(savedActivities));
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem('readflow_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('readflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('readflow_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('readflow_activities', JSON.stringify(activities));
  }, [activities]);

  // Calculate Today's Stats whenever sessions change
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaysSessions = sessions.filter(s => s.date.startsWith(today));

    const time = todaysSessions
        .filter(s => s.type !== 'writing')
        .reduce((acc, s) => acc + Math.round(s.durationSeconds / 60), 0);
    
    const pages = todaysSessions.reduce((acc, s) => acc + (s.pages || 0), 0);
    
    // Calculate Average WPM for today (only count sessions with valid WPM)
    const wpmSessions = todaysSessions.filter(s => s.wpm > 0);
    const avgWpm = wpmSessions.length > 0 
        ? Math.round(wpmSessions.reduce((acc, s) => acc + s.wpm, 0) / wpmSessions.length)
        : 0;

    setTodaysStats({ time, pages, wpm: avgWpm });
  }, [sessions]);


  // Haptic Feedback Helper
  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      switch (style) {
        case 'light':
          navigator.vibrate(10); // Subtle click for tabs
          break;
        case 'medium':
          navigator.vibrate(20); // Action confirmation
          break;
        case 'heavy':
          navigator.vibrate([30, 50, 30]); // Success pattern
          break;
      }
    }
  };

  // Timer Tick
  useEffect(() => {
    let interval: any;
    if (isTimerActive) {
      interval = setInterval(() => {
        setActiveSessionSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  // -- Actions --
  
  const handleLogActivity = (item: ActivityItem) => {
    setActivities(prev => [item, ...prev]);
  };

  const handleStartTimer = (mode: 'reading' | 'writing' = 'reading') => {
    setTimerMode(mode);
    setIsTimerActive(true);
    triggerHaptic('medium');
  };

  const handleStopTimer = () => {
    setIsTimerActive(false);
    triggerHaptic('medium');
    const minutes = Math.floor(activeSessionSeconds / 60);
    
    if (activeSessionSeconds > 0) {
      const newSession: ReadingSession = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        durationSeconds: activeSessionSeconds,
        wpm: 0,
        type: timerMode === 'writing' ? 'writing' : 'manual-log'
      };
      
      handleSaveSession(newSession);

      // Update Time-based goals (Only for reading for now, unless we add writing goals)
      if (timerMode === 'reading') {
        setTasks(prev => prev.map(t => {
          if (t.unit === 'minutes') {
            const newCurrent = t.current + minutes;
            return { ...t, current: newCurrent };
          }
          return t;
        }));
      }
    }
    
    setActiveSessionSeconds(0);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newCompleted = !t.completed;
        if (newCompleted) {
          triggerHaptic('heavy');
          setStats(s => ({ ...s, xp: s.xp + 50, coins: s.coins + 10 }));
          setShowCompletionEffect(true);
          setTimeout(() => setShowCompletionEffect(false), 1500);

          // Log Activity
          handleLogActivity({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            type: 'goal',
            subtype: 'completion',
            description: `Completed goal: ${t.title}`,
            subject: t.subject
          });

        } else {
          // Subtle feedback when unchecking, if desired, or none.
          triggerHaptic('light'); 
          setStats(s => ({ ...s, xp: Math.max(0, s.xp - 50), coins: Math.max(0, s.coins - 10) }));
        }
        
        // Also update selectedTask if it is the one being toggled
        if (selectedTask && selectedTask.id === id) {
            setSelectedTask({ ...t, completed: newCompleted });
        }
        
        return { ...t, completed: newCompleted };
      }
      return t;
    }));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    triggerHaptic('medium');
    if (selectedTask && selectedTask.id === id) {
        setSelectedTask(null);
    }
  };

  const handleAddGoal = (newGoal: Goal) => {
    setTasks(prev => [...prev, newGoal]);
    triggerHaptic('medium');
    handleLogActivity({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'goal',
      subtype: 'creation',
      description: `New goal set: ${newGoal.title}`,
      subject: newGoal.subject
    });
  };

  const handleUpdateWPM = (newWPM: number) => {
    setStats(prev => ({ ...prev, currentWPM: newWPM }));
    triggerHaptic('light');
  };

  const handleSaveSession = (session: ReadingSession) => {
    triggerHaptic('heavy'); // Strong feedback for saving a session
    setSessions(prev => [...prev, session]);
    
    // Note: todaysStats is now updated via useEffect dependent on sessions
    
    setStats(prev => ({
      ...prev,
      currentWPM: session.type === 'speed-test' ? session.wpm : prev.currentWPM,
      totalTimeReadMinutes: session.type !== 'writing' ? prev.totalTimeReadMinutes + Math.round(session.durationSeconds / 60) : prev.totalTimeReadMinutes,
      totalTimeWrittenMinutes: session.type === 'writing' ? (prev.totalTimeWrittenMinutes || 0) + Math.round(session.durationSeconds / 60) : (prev.totalTimeWrittenMinutes || 0),
      totalPagesRead: prev.totalPagesRead + (session.pages || 0),
      xp: prev.xp + 100, 
      coins: prev.coins + 20
    }));
  };

  const handleTaskClick = (task: Goal) => {
    setSelectedTask(task);
    triggerHaptic('light');
  };

  useEffect(() => {
    setBadges(prev => prev.map(b => {
      if (!b.unlocked && b.condition(stats)) {
        return { ...b, unlocked: true };
      }
      return b;
    }));
  }, [stats]);


  // -- Render View --
  const renderView = () => {
    if (selectedTask) {
        return (
            <TaskDetail 
                task={selectedTask} 
                onBack={() => setSelectedTask(null)} 
                onToggle={handleToggleTask}
            />
        );
    }

    switch (activeTab) {
      case AppTab.DASHBOARD:
        return (
          <Dashboard 
            stats={stats} 
            todaysStats={todaysStats} 
            dailyTasks={tasks} 
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            isTimerActive={isTimerActive}
            activeSessionSeconds={activeSessionSeconds}
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
            onTaskClick={handleTaskClick}
            timerMode={timerMode}
          />
        );
      case AppTab.PRACTICE:
        return <Practice onSaveSession={handleSaveSession} />;
      case AppTab.SYLLABUS:
        return <Syllabus activityHistory={activities} onLogActivity={handleLogActivity} />;
      case AppTab.GOALS:
        return <Goals goals={tasks} onAddGoal={handleAddGoal} onGoalClick={handleTaskClick} activityHistory={activities} />;
      case AppTab.REWARDS:
        return <Rewards stats={stats} badges={badges} />;
      case AppTab.INSIGHTS:
        return <Insights stats={stats} history={sessions} onUpdateWPM={handleUpdateWPM} />;
      default:
        return null;
    }
  };

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    setSelectedTask(null); // Clear selected task when changing tabs
    triggerHaptic('light');
  };

  return (
    <div className="min-h-screen bg-slate-100/50 text-slate-900 font-sans flex justify-center">
      <style>{`
        @keyframes floatUp {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          20% { transform: translate(-50%, -60%) scale(1); opacity: 1; }
          80% { opacity: 1; transform: translate(-50%, -60%) scale(1); }
          100% { transform: translate(-50%, -100%) scale(0.9); opacity: 0; }
        }
        .animate-float-up {
          animation: floatUp 1.5s ease-out forwards;
        }
        @keyframes checkScale {
          0% { transform: scale(0) rotate(-45deg); }
          50% { transform: scale(1.4) rotate(0deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .animate-check-scale {
          animation: checkScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
        }
      `}</style>

      {/* Mobile container simulation */}
      <div className="w-full max-w-md bg-[#F8FAFC] min-h-screen relative shadow-2xl overflow-hidden flex flex-col sm:border-x border-slate-200">
        
        {/* Global Completion Effect Overlay */}
        {showCompletionEffect && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-float-up flex flex-col items-center justify-center">
            <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl flex flex-col items-center border border-white/50 ring-1 ring-slate-100">
              <div className="bg-emerald-100 p-4 rounded-full mb-4 shadow-inner">
                <CheckCircleIcon className="w-12 h-12 text-emerald-600 animate-check-scale" />
              </div>
              <span className="text-3xl font-black text-slate-800 tracking-tight">Complete!</span>
              <span className="text-sm font-bold text-amber-500 mt-2 flex items-center bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100 shadow-sm">
                <span className="mr-1.5 font-black">+50 XP</span>
                <span className="text-lg">✨</span>
              </span>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-5 no-scrollbar scroll-smooth">
          {/* Key prop ensures the component re-mounts/animates when tab changes or selection changes */}
          <div key={selectedTask ? 'detail' : activeTab} className="view-transition">
             {renderView()}
          </div>
        </main>

        {/* Floating Glass Navigation */}
        <div className={`absolute bottom-6 left-2 right-2 z-40 transition-transform duration-300 ${selectedTask ? 'translate-y-32' : 'translate-y-0'}`}>
            <nav className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl shadow-indigo-500/10 rounded-3xl px-3 py-4 flex justify-between items-center">
            <button 
                onClick={() => handleTabChange(AppTab.DASHBOARD)}
                className={`flex-1 flex flex-col items-center space-y-1 transition-all active:scale-90 ${activeTab === AppTab.DASHBOARD ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <HomeIcon className={`w-5 h-5 ${activeTab === AppTab.DASHBOARD ? 'fill-indigo-100' : ''}`} />
            </button>
            
            <button 
                onClick={() => handleTabChange(AppTab.SYLLABUS)}
                className={`flex-1 flex flex-col items-center space-y-1 transition-all active:scale-90 ${activeTab === AppTab.SYLLABUS ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <ClipboardIcon className={`w-5 h-5 ${activeTab === AppTab.SYLLABUS ? 'fill-indigo-100' : ''}`} />
            </button>

            <button 
                onClick={() => handleTabChange(AppTab.PRACTICE)}
                className={`flex-1 flex flex-col items-center space-y-1 transition-all active:scale-90 ${activeTab === AppTab.PRACTICE ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <ZapIcon className={`w-5 h-5 ${activeTab === AppTab.PRACTICE ? 'fill-indigo-100' : ''}`} />
            </button>

            <button 
                onClick={() => handleTabChange(AppTab.GOALS)}
                className={`flex-1 flex flex-col items-center space-y-1 transition-all active:scale-90 ${activeTab === AppTab.GOALS ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <TargetIcon className={`w-5 h-5 ${activeTab === AppTab.GOALS ? 'fill-indigo-100' : ''}`} />
            </button>

            <button 
                onClick={() => handleTabChange(AppTab.INSIGHTS)}
                className={`flex-1 flex flex-col items-center space-y-1 transition-all active:scale-90 ${activeTab === AppTab.INSIGHTS ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <ChartIcon className={`w-5 h-5 ${activeTab === AppTab.INSIGHTS ? 'fill-indigo-100' : ''}`} />
            </button>

            <button 
                onClick={() => handleTabChange(AppTab.REWARDS)}
                className={`flex-1 flex flex-col items-center space-y-1 transition-all active:scale-90 ${activeTab === AppTab.REWARDS ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <AwardIcon className={`w-5 h-5 ${activeTab === AppTab.REWARDS ? 'fill-indigo-100' : ''}`} />
            </button>
            </nav>
        </div>
      </div>
    </div>
  );
};

export default App;
