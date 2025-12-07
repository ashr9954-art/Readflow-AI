import React from 'react';
import { UserStats, Badge } from '../types';
import { CoinIcon, AwardIcon } from '../components/Icons';

interface RewardsProps {
  stats: UserStats;
  badges: Badge[];
}

export const Rewards: React.FC<RewardsProps> = ({ stats, badges }) => {
  const nextLevelXp = stats.level * 1000;
  const progress = (stats.xp / nextLevelXp) * 100;

  return (
    <div className="space-y-8 pb-24 view-transition pt-2">
       <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Achievements</h1>

       {/* Level Card */}
       <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-8 rounded-[2rem] shadow-xl shadow-indigo-300 text-white relative overflow-hidden transform transition-all active:scale-[0.99]">
         {/* Decorative Circles */}
         <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none mix-blend-overlay">
           <AwardIcon className="w-48 h-48" />
         </div>
         <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/20 rounded-full blur-3xl"></div>
         
         <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
                <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 mb-4 backdrop-blur-md shadow-inner rotate-3">
                    <span className="text-4xl font-black">{stats.level}</span>
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-yellow-200">LEVEL</div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Master Scholar</h2>
            <div className="flex items-center space-x-2 mt-2 bg-black/30 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
              <CoinIcon className="w-4 h-4 text-yellow-300" />
              <span className="font-bold text-sm text-yellow-50">{stats.coins} Coins</span>
            </div>

            <div className="w-full mt-8">
              <div className="flex justify-between text-xs font-bold text-indigo-100 mb-2 uppercase tracking-wide opacity-80">
                <span>{stats.xp} XP</span>
                <span>{nextLevelXp} XP</span>
              </div>
              <div className="w-full bg-black/20 h-4 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div 
                  className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-full rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-center mt-3 text-indigo-200 font-medium">
                {nextLevelXp - stats.xp} XP until level {stats.level + 1}
              </p>
            </div>
         </div>
       </div>

       <section>
         <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Badges Collection</h2>
         <div className="grid grid-cols-3 gap-3">
           {badges.map(badge => (
             <div key={badge.id} className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
               <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all ${
                 badge.unlocked 
                  ? 'bg-gradient-to-br from-indigo-50 to-purple-50 ring-4 ring-indigo-50/50 scale-100 grayscale-0' 
                  : 'bg-slate-50 grayscale opacity-40 scale-90'
               }`}>
                 <span className="text-2xl drop-shadow-sm">{badge.icon === 'flame' ? '🔥' : badge.icon === 'zap' ? '⚡️' : '📚'}</span>
               </div>
               <span className={`text-xs font-bold leading-tight ${badge.unlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                 {badge.name}
               </span>
             </div>
           ))}
         </div>
       </section>

       <section>
         <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Marketplace</h2>
         <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between opacity-60">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-xl">🌙</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Dark Theme</h3>
                <p className="text-xs text-slate-400 font-medium">Coming soon</p>
              </div>
            </div>
            <button className="bg-slate-100 text-slate-400 px-4 py-2 rounded-xl text-xs font-bold" disabled>500 🪙</button>
         </div>
       </section>
    </div>
  );
};