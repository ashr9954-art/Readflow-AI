
import React, { useState, useEffect } from 'react';
import { Goal, ActivityItem } from '../types';
import { TargetIcon, CheckCircleIcon, PlusIcon, BellIcon, BookIcon, PenIcon } from '../components/Icons';

interface GoalsProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onGoalClick?: (goal: Goal) => void;
  activityHistory?: ActivityItem[];
}

const SUBJECTS = [
  "Dravyaguna",
  "Rasashastra",
  "Swasthavritta",
  "Roganidana",
  "Samhita",
  "Agadatantra",
  "General Knowledge", 
  "Other"
];

export const Goals: React.FC<GoalsProps> = ({ goals, onAddGoal, onGoalClick, activityHistory = [] }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(30);
  const [newGoalUnit, setNewGoalUnit] = useState<'minutes' | 'pages'>('minutes');
  const [newGoalPeriod, setNewGoalPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [newGoalTime, setNewGoalTime] = useState('');
  const [newGoalSubject, setNewGoalSubject] = useState('Dravyaguna');

  // Filter goals by period
  const dailyGoals = goals.filter(g => g.period === 'daily');
  const weeklyGoals = goals.filter(g => g.period === 'weekly');
  const monthlyGoals = goals.filter(g => g.period === 'monthly');

  const handleSubmit = () => {
    if (!newGoalTitle.trim()) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      target: newGoalTarget,
      current: 0,
      unit: newGoalUnit,
      period: newGoalPeriod,
      completed: false,
      reminderTime: newGoalTime || undefined,
      subject: newGoalSubject
    };

    onAddGoal(newGoal);
    setIsAdding(false);
    setNewGoalTitle('');
    setNewGoalTarget(30);
    setNewGoalTime('');
  };

  // Generate dynamic calendar days (current week)
  const today = new Date();
  const currentDay = today.getDay(); // 0 (Sun) to 6 (Sat)
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (currentDay - i));
    days.push({
      label: ['S','M','T','W','T','F','S'][i],
      date: d.getDate(),
      isToday: i === currentDay,
      hasActivity: i <= currentDay && i % 2 !== 0 
    });
  }

  const currentMonthName = today.toLocaleString('default', { month: 'long' });

  // Filter history for Goal items
  const goalHistory = activityHistory.filter(a => a.type === 'goal').slice(0, 10);
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  return (
    <div className="space-y-6 pb-24 view-transition pt-2 relative">
      <style>{`
        @keyframes checkPop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-check {
          animation: checkPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Goals</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Dynamic Calendar Strip */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-5 px-1">
          <h2 className="font-bold text-slate-800 text-lg">{currentMonthName}</h2>
          <div className="text-indigo-600 text-[10px] font-bold bg-indigo-50 px-2.5 py-1 rounded-md tracking-wide">WEEK {Math.ceil(today.getDate() / 7)}</div>
        </div>
        <div className="flex justify-between text-center">
          {days.map((day, i) => (
             <div key={i} className="flex flex-col items-center space-y-2.5 cursor-pointer group flex-1">
                <span className={`text-[10px] font-bold ${day.isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {day.label}
                </span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  day.isToday 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110 ring-4 ring-indigo-50' 
                    : 'text-slate-600 bg-slate-50 group-hover:bg-slate-100'
                }`}>
                  {day.date}
                </div>
                <div className={`w-1 h-1 rounded-full transition-all ${
                  day.hasActivity ? 'bg-emerald-500 scale-100' : 'bg-transparent scale-0'
                }`}></div>
             </div>
          ))}
        </div>
      </div>

      {/* Add Goal Form Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
           <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] p-8 w-full max-w-sm shadow-2xl animate-[slideUp_0.3s_ease-out] overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">New Goal</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Title</label>
                  <input 
                    type="text" 
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-bold"
                    placeholder="e.g. Read Charaka Samhita"
                    autoFocus
                  />
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                   <select 
                     value={newGoalSubject}
                     onChange={(e) => setNewGoalSubject(e.target.value)}
                     className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-800 font-bold appearance-none bg-white"
                   >
                     {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Target</label>
                     <input 
                        type="number" 
                        value={newGoalTarget}
                        onChange={(e) => setNewGoalTarget(parseInt(e.target.value) || 0)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-800 font-bold"
                        min="1"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Unit</label>
                     <select 
                       value={newGoalUnit}
                       onChange={(e) => setNewGoalUnit(e.target.value as 'minutes' | 'pages')}
                       className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-800 font-bold appearance-none bg-white"
                     >
                       <option value="minutes">Minutes</option>
                       <option value="pages">Pages</option>
                     </select>
                  </div>
                </div>

                 <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Frequency</label>
                     <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                       {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                         <button
                           key={period}
                           onClick={() => setNewGoalPeriod(period)}
                           className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                             newGoalPeriod === period 
                              ? 'bg-white text-indigo-600 shadow-sm scale-[1.02]' 
                              : 'text-slate-500 hover:text-slate-700'
                           }`}
                         >
                           {period.charAt(0).toUpperCase() + period.slice(1)}
                         </button>
                       ))}
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reminder (Optional)</label>
                     <div className="relative">
                        <BellIcon className="absolute left-5 top-4 w-5 h-5 text-slate-400" />
                        <input 
                            type="time" 
                            value={newGoalTime}
                            onChange={(e) => setNewGoalTime(e.target.value)}
                            className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-bold"
                        />
                     </div>
                  </div>

                  <div className="flex space-x-3 mt-8">
                    <button 
                      onClick={() => setIsAdding(false)}
                      className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={!newGoalTitle.trim()}
                      className="flex-1 py-4 bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all"
                    >
                      Create
                    </button>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* Goal Sections */}
      <div className="space-y-8">
        {[
            { title: 'Daily', data: dailyGoals },
            { title: 'Weekly', data: weeklyGoals },
            { title: 'Monthly', data: monthlyGoals }
        ].map((section) => (
            section.data.length > 0 && (
            <section key={section.title}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">{section.title}</h3>
                <div className="space-y-3">
                {section.data.map(goal => (
                  <GoalCard key={goal.id} goal={goal} onClick={() => onGoalClick && onGoalClick(goal)} />
                ))}
                </div>
            </section>
            )
        ))}
        
        {goals.length === 0 && (
           <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TargetIcon className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium mb-4">No active goals.</p>
              <button onClick={() => setIsAdding(true)} className="text-indigo-600 font-bold">Set a goal</button>
           </div>
        )}
      </div>

       {/* History Log */}
       {goalHistory.length > 0 && (
         <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Activity Log</h2>
            <div className="space-y-3">
                {goalHistory.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center shadow-sm animate-[fadeIn_0.3s_ease-out]">
                        <div className={`p-2 rounded-xl mr-3 ${
                            item.subtype === 'completion' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                            {item.subtype === 'completion' ? <CheckCircleIcon className="w-4 h-4" /> : <PenIcon className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm">{item.description}</h4>
                            <div className="flex items-center space-x-2 mt-0.5">
                                {item.subject && <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">{item.subject}</span>}
                                <span className="text-[10px] text-slate-400">{formatDate(item.date)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         </section>
      )}
    </div>
  );
};

const GoalCard: React.FC<{ goal: Goal; onClick?: () => void }> = ({ goal, onClick }) => {
  const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const [displayedPercent, setDisplayedPercent] = useState(0);

  useEffect(() => {
    // Animate from 0 to percentage on mount
    const timer = setTimeout(() => setDisplayedPercent(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);
  
  return (
    <div 
      onClick={onClick}
      className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden active:scale-[0.99] transition-transform cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl transition-colors duration-300 ${
              goal.completed ? 'bg-emerald-100' : 'bg-indigo-50'
            }`}>
              <TargetIcon className={`w-6 h-6 transition-colors duration-300 ${
                goal.completed ? 'text-emerald-600' : 'text-indigo-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-bold text-slate-800 transition-all text-base ${goal.completed ? 'line-through opacity-50' : ''}`}>
                {goal.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                 <span className="text-xs text-slate-400 font-medium">{goal.current} / {goal.target} {goal.unit}</span>
                 {goal.subject && (
                   <span className="text-[10px] font-bold bg-violet-50 text-violet-600 px-2 py-0.5 rounded-md">
                     {goal.subject}
                   </span>
                 )}
                 {goal.reminderTime && (
                    <span className="flex items-center text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded-md text-slate-500">
                        <BellIcon className="w-3 h-3 mr-1" />
                        {goal.reminderTime}
                    </span>
                 )}
              </div>
            </div>
        </div>
        
        {goal.completed && (
          <div className="animate-check bg-emerald-50 p-1 rounded-full">
             <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
          </div>
        )}
      </div>
      
      <div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                goal.completed ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${displayedPercent}%` }}
            >
              {!goal.completed && percentage > 0 && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};
