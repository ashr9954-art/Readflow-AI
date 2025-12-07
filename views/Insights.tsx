
import React, { useEffect, useState } from 'react';
import { UserStats, ReadingSession, ReadingInsight } from '../types';
import { generateReadingInsights } from '../services/geminiService';
import { ChartIcon, ZapIcon, EditIcon, CheckCircleIcon, BookIcon, PenIcon } from '../components/Icons';

interface InsightsProps {
  stats: UserStats;
  history: ReadingSession[];
  onUpdateWPM: (wpm: number) => void;
}

export const Insights: React.FC<InsightsProps> = ({ stats, history, onUpdateWPM }) => {
  const [insights, setInsights] = useState<ReadingInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  
  // WPM Editing State
  const [isEditingWPM, setIsEditingWPM] = useState(false);
  const [tempWpm, setTempWpm] = useState(stats.currentWPM.toString());

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      // Simulate taking the last 5 sessions
      const recent = history.slice(0, 5);
      const result = await generateReadingInsights(recent);
      setInsights(result);
      setLoading(false);
    };
    
    if (history.length > 0) {
      fetchInsights();
    }
  }, [history]);

  const saveWPM = () => {
    const val = parseInt(tempWpm);
    if (!isNaN(val) && val > 0) {
      onUpdateWPM(val);
      setIsEditingWPM(false);
    }
  };

  // Sort history by date descending
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const displayedHistory = showAllHistory ? sortedHistory : sortedHistory.slice(0, 10);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 pb-24 view-transition pt-2">
      <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Insights</h1>

      {/* WPM Trend Chart */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
         <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-slate-800 flex items-center text-lg">
              <div className="bg-indigo-50 p-2 rounded-lg mr-3">
                 <ChartIcon className="w-5 h-5 text-indigo-600" />
              </div>
              Reading Speed
            </h2>
            
            {isEditingWPM ? (
                <div className="flex items-center space-x-2 animate-[fadeIn_0.2s_ease-out]">
                    <input 
                        type="number" 
                        value={tempWpm} 
                        onChange={e => setTempWpm(e.target.value)}
                        className="w-20 px-3 py-1 border-2 border-indigo-100 rounded-lg text-lg font-bold text-slate-800 focus:outline-none focus:border-indigo-500 bg-slate-50"
                        autoFocus
                    />
                    <button 
                      onClick={saveWPM} 
                      className="text-white bg-emerald-500 p-1.5 rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
                    >
                      <CheckCircleIcon className="w-5 h-5"/>
                    </button>
                </div>
            ) : (
                <div 
                  className="flex items-center space-x-2 group cursor-pointer bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all border border-transparent hover:border-indigo-100" 
                  onClick={() => { setTempWpm(stats.currentWPM.toString()); setIsEditingWPM(true); }}
                >
                     <span className="text-xl font-black text-slate-800">{stats.currentWPM}</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase">WPM</span>
                     <EditIcon className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 ml-1" />
                </div>
            )}
         </div>
         
         <div className="h-40 flex items-end space-x-3 sm:space-x-6">
            {history.length > 0 ? history.slice(-5).map((session, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end group">
                <div className="flex justify-center mb-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <span className="bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-md shadow-lg">{session.wpm}</span>
                </div>
                <div 
                  className="bg-indigo-100 rounded-2xl w-full transition-all duration-500 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-300 relative group-hover:scale-[1.05]"
                  style={{ height: `${Math.min(100, Math.max(10, (session.wpm / 400) * 100))}%` }}
                >
                </div>
                <span className="text-[10px] text-center text-slate-400 font-bold mt-3">#{i+1}</span>
              </div>
            )) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                <p className="text-sm font-medium">No sessions recorded yet</p>
              </div>
            )}
         </div>
      </div>

      {/* AI Insights */}
      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">AI Analysis</h2>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-100">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-100 border-t-indigo-600 mb-3"></div>
            <p className="text-xs font-bold text-slate-400">Analyzing patterns...</p>
          </div>
        ) : (
          <div className="space-y-4">
             {insights.length > 0 ? insights.map((insight, i) => (
               <div key={i} className={`p-5 rounded-3xl border shadow-sm transition-transform hover:scale-[1.01] ${
                 insight.type === 'encouragement' ? 'bg-indigo-50 border-indigo-100' :
                 insight.type === 'tip' ? 'bg-emerald-50 border-emerald-100' :
                 'bg-amber-50 border-amber-100'
               }`}>
                 <div className="flex items-start mb-2">
                    <div className={`p-1.5 rounded-lg mr-3 ${
                        insight.type === 'encouragement' ? 'bg-indigo-200 text-indigo-700' :
                        insight.type === 'tip' ? 'bg-emerald-200 text-emerald-700' :
                        'bg-amber-200 text-amber-700'
                    }`}>
                        <ZapIcon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${
                        insight.type === 'encouragement' ? 'text-indigo-600' :
                        insight.type === 'tip' ? 'text-emerald-600' :
                        'text-amber-600'
                    }`}>
                    {insight.type}
                    </span>
                 </div>
                 <p className="text-slate-700 font-medium text-sm leading-relaxed ml-10">{insight.message}</p>
               </div>
             )) : (
               <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center">
                 <p className="text-slate-500 font-medium text-sm">Complete a few sessions to unlock personalized AI insights!</p>
               </div>
             )}
          </div>
        )}
      </section>

      {/* History */}
      <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Activity History</h2>
            {history.length > 0 && (
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {history.length} Total
                </span>
            )}
        </div>
        
        <div className="space-y-3">
          {displayedHistory.length > 0 ? displayedHistory.map(session => (
            <div key={session.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center space-x-4">
                   <div className={`p-3 rounded-xl ${
                       session.type === 'writing' ? 'bg-fuchsia-50 text-fuchsia-600' : 
                       session.type === 'speed-test' ? 'bg-violet-50 text-violet-600' : 'bg-emerald-50 text-emerald-600'
                   }`}>
                      {session.type === 'writing' ? <PenIcon className="w-5 h-5"/> : <BookIcon className="w-5 h-5"/>}
                   </div>
                   <div>
                      <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-800 text-sm">
                            {session.type === 'speed-test' ? 'Speed Test' : session.type === 'writing' ? 'Writing Session' : 'Manual Log'}
                          </h4>
                          {session.subject && (
                             <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                {session.subject}
                             </span>
                          )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">{formatDate(session.date)}</p>
                   </div>
                </div>
                <div className="text-right">
                   {session.type !== 'writing' && session.wpm > 0 && (
                       <div className="text-sm font-black text-slate-800">{session.wpm} <span className="text-[10px] font-bold text-slate-400">WPM</span></div>
                   )}
                   {session.type === 'writing' ? (
                       <div className="text-sm font-bold text-fuchsia-600">{Math.round(session.durationSeconds / 60)} <span className="text-[10px]">mins</span></div>
                   ) : (
                       <div className="text-xs font-bold text-slate-500">{session.pages ? `${session.pages} pages` : `${Math.round(session.durationSeconds / 60)} mins`}</div>
                   )}
                </div>
            </div>
          )) : (
            <div className="text-center py-8 text-slate-400 text-sm font-medium">No history yet. Start reading!</div>
          )}

          {history.length > 10 && (
            <button 
              onClick={() => setShowAllHistory(!showAllHistory)}
              className="w-full py-3 mt-4 text-xs font-bold uppercase tracking-wide text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100"
            >
               {showAllHistory ? 'Show Less' : `View All History (${history.length})`}
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
