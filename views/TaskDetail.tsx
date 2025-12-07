
import React from 'react';
import { Goal } from '../types';
import { ArrowLeftIcon, TargetIcon, FlameIcon, TrendUpIcon, CheckCircleIcon, CalendarIcon, ClockIcon } from '../components/Icons';

interface TaskDetailProps {
  task: Goal;
  onBack: () => void;
  onToggle: (id: string) => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onBack, onToggle }) => {
  const percentage = Math.min(100, Math.round((task.current / task.target) * 100));

  return (
    <div className="space-y-6 pb-24 view-transition pt-2">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 active:scale-95 transition-transform"
        >
          <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Task Details</h1>
      </div>

      {/* Main Card */}
      <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <TargetIcon className="w-40 h-40 text-indigo-600" />
        </div>
        
        <div className="relative z-10 text-center">
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-lg ${
                task.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
            }`}>
                <TargetIcon className="w-10 h-10" />
            </div>

            <h2 className="text-3xl font-black text-slate-800 mb-2">{task.title}</h2>
            <div className="flex justify-center items-center space-x-2 mb-8">
                <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {task.period} Goal
                </span>
                {task.reminderTime && (
                    <span className="bg-amber-100 px-3 py-1 rounded-full text-xs font-bold text-amber-700 flex items-center">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {task.reminderTime}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Target</div>
                    <div className="text-xl font-black text-slate-800">{task.target}</div>
                    <div className="text-[10px] font-bold text-slate-400">{task.unit}</div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                    <div className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-1">Current</div>
                    <div className="text-xl font-black text-indigo-600">{task.current}</div>
                    <div className="text-[10px] font-bold text-indigo-400">{task.unit}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Left</div>
                    <div className="text-xl font-black text-slate-800">{Math.max(0, task.target - task.current)}</div>
                    <div className="text-[10px] font-bold text-slate-400">{task.unit}</div>
                </div>
            </div>

            <button 
                onClick={() => onToggle(task.id)}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2 ${
                    task.completed 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-300'
                }`}
            >
                {task.completed ? (
                    <>
                        <CheckCircleIcon className="w-6 h-6" />
                        <span>Completed</span>
                    </>
                ) : (
                    <span>Mark as Complete</span>
                )}
            </button>
        </div>
      </div>

      {/* History / Consistency */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center">
                <CalendarIcon className="w-5 h-5 text-indigo-500 mr-2" />
                Consistency
            </h3>
        </div>
        {/* Mock Chart for visualization */}
        <div className="flex items-end justify-between h-32 space-x-2">
            {[40, 70, 30, 85, 50, 60, task.completed ? 100 : percentage].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end space-y-2 group">
                    <div className="w-full bg-slate-100 rounded-t-lg rounded-b-md relative overflow-hidden h-full">
                         <div 
                            className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${i === 6 ? 'bg-indigo-500' : 'bg-indigo-200'}`} 
                            style={{ height: `${Math.max(10, h)}%` }}
                         ></div>
                    </div>
                    <span className="text-[10px] text-center font-bold text-slate-400">
                        {['S','M','T','W','T','F','T'][i]}
                    </span>
                </div>
            ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-3xl shadow-lg shadow-indigo-200 text-white">
         <div className="flex items-center mb-4">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md mr-3">
                <TrendUpIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-lg">Smart Insight</h3>
         </div>
         <p className="text-indigo-100 font-medium leading-relaxed mb-4">
            {task.unit === 'minutes' 
                ? "You're most productive with this goal in the evenings. Try setting a reminder for 8 PM to boost consistency." 
                : "Breaking this page goal into two smaller sessions might help you increase retention by 15%."
            }
         </p>
         <div className="flex items-center space-x-2 text-xs font-bold text-indigo-200 bg-black/20 px-3 py-1.5 rounded-lg inline-flex">
            <FlameIcon className="w-3 h-3" />
            <span>AI Generated Tip</span>
         </div>
      </div>
    </div>
  );
};
