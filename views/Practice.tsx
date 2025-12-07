
import React, { useState, useEffect } from 'react';
import { generateReadingPassage } from '../services/geminiService';
import { ReadingPassage, ReadingSession } from '../types';
import { RefreshIcon, ClockIcon, BookIcon, ZapIcon } from '../components/Icons';

interface PracticeProps {
  onSaveSession: (session: ReadingSession) => void;
}

const TOPICS = [
  "Dravyaguna",
  "Rasashastra",
  "Swasthavritta",
  "Roganidana",
  "Samhita",
  "Agadatantra",
  "General Knowledge", 
  "Science", 
  "History", 
  "Technology", 
  "Fiction", 
  "Philosophy",
  "Business"
];

// Helper for haptics
const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(20);
  }
};

export const Practice: React.FC<PracticeProps> = ({ onSaveSession }) => {
  const [mode, setMode] = useState<'menu' | 'speed-test' | 'manual'>('menu');
  const [passage, setPassage] = useState<ReadingPassage | null>(null);
  const [loading, setLoading] = useState(false);
  const [testState, setTestState] = useState<'ready' | 'reading' | 'finished'>('ready');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [manualPages, setManualPages] = useState('');
  const [manualTime, setManualTime] = useState('');
  const [selectedTopic, setSelectedTopic] = useState("Dravyaguna");

  // Speed Test Logic
  const startTest = async () => {
    triggerHaptic();
    setLoading(true);
    const newPassage = await generateReadingPassage(selectedTopic);
    setPassage(newPassage);
    setLoading(false);
    setMode('speed-test');
    setTestState('ready');
    setElapsedTime(0);
  };

  const beginReading = () => {
    triggerHaptic();
    setTestState('reading');
    setStartTime(Date.now());
  };

  const finishReading = () => {
    triggerHaptic();
    if (!startTime) return;
    const durationMs = Date.now() - startTime;
    const durationSec = Math.max(1, durationMs / 1000);
    setElapsedTime(durationSec);
    setTestState('finished');
  };

  const saveTestResult = () => {
    triggerHaptic();
    if (!passage) return;
    const wpm = Math.round((passage.wordCount / elapsedTime) * 60);
    
    onSaveSession({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      durationSeconds: Math.round(elapsedTime),
      wpm,
      type: 'speed-test',
      passageTitle: passage.title,
      subject: selectedTopic
    });
    setMode('menu');
  };

  // Timer for display
  useEffect(() => {
    let interval: any;
    if (testState === 'reading') {
      interval = setInterval(() => {
        if (startTime) setElapsedTime((Date.now() - startTime) / 1000);
      }, 50); // Update faster for smooth decimal display
    }
    return () => clearInterval(interval);
  }, [testState, startTime]);

  // Manual Log Logic
  const saveManualLog = () => {
    if (!manualTime || !manualPages) return;
    triggerHaptic();
    const estimatedWords = parseInt(manualPages) * 250;
    const wpm = Math.round(estimatedWords / parseInt(manualTime));

    onSaveSession({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      durationSeconds: parseInt(manualTime) * 60,
      wpm,
      pages: parseInt(manualPages),
      type: 'manual-log',
      subject: selectedTopic
    });
    setMode('menu');
    setManualPages('');
    setManualTime('');
  };

  if (mode === 'menu') {
    return (
      <div className="space-y-8 pb-24 view-transition pt-2">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Practice Arena</h1>
        
        {/* Topic Selection */}
        <div>
           <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Subject</label>
           <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar -mx-5 px-5 snap-x">
             {TOPICS.map(topic => (
               <button 
                 key={topic}
                 onClick={() => setSelectedTopic(topic)}
                 className={`flex-shrink-0 snap-start px-5 py-2.5 rounded-xl text-sm font-bold transition-all border shadow-sm whitespace-nowrap ${
                   selectedTopic === topic 
                    ? 'bg-slate-800 text-white border-slate-800 ring-2 ring-slate-200 ring-offset-2' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                 }`}
               >
                 {topic}
               </button>
             ))}
           </div>
        </div>
        
        <div 
          onClick={startTest}
          className="bg-gradient-to-br from-indigo-600 to-violet-600 p-8 rounded-3xl shadow-xl shadow-indigo-200 text-white cursor-pointer active:scale-95 transition-all relative overflow-hidden group"
        >
          {/* Decorative background */}
          <div className="absolute -right-10 -top-10 bg-white/10 w-40 h-40 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <ZapIcon className="w-8 h-8 text-white" />
                </div>
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20">AI Generated</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Start Speed Test</h2>
            <p className="text-indigo-100 font-medium opacity-90">Generate a "{selectedTopic}" passage and test your WPM now.</p>
          </div>
        </div>

        <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tools</label>
            <div 
            onClick={() => setMode('manual')}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-pointer active:scale-95 transition-transform flex items-center space-x-5 hover:shadow-md"
            >
            <div className="bg-emerald-50 p-4 rounded-2xl">
                <BookIcon className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-800">Log Manual Session</h2>
                <p className="text-slate-400 text-sm font-medium">Record paper book reading</p>
            </div>
            </div>
        </div>
      </div>
    );
  }

  if (mode === 'speed-test') {
    if (loading) return (
        <div className="flex flex-col h-[60vh] items-center justify-center view-transition">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600 mb-6"></div>
            <p className="text-slate-500 font-medium animate-pulse">Generating "{selectedTopic}" passage...</p>
        </div>
    );

    return (
      <div className="pb-24 pt-2 h-full flex flex-col view-transition">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-50/90 backdrop-blur-sm z-20 py-2">
          <button onClick={() => setMode('menu')} className="text-slate-500 text-sm font-bold hover:text-slate-800 px-2 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
            Cancel
          </button>
          
          {/* Prominent Timer */}
          <div className="flex items-center space-x-2 font-mono text-xl font-bold text-indigo-600 bg-white border border-indigo-100 px-4 py-2 rounded-xl shadow-sm min-w-[100px] justify-center">
            <ClockIcon className="w-4 h-4 text-indigo-400" />
            <span className="tabular-nums flex items-baseline">
              <span>{Math.floor(elapsedTime / 60).toString().padStart(2, '0')}</span>
              <span className="mx-0.5">:</span>
              <span>{(Math.floor(elapsedTime) % 60).toString().padStart(2, '0')}</span>
              <span className="text-base opacity-50 ml-0.5">.{(Math.floor((elapsedTime * 10) % 10)).toString()}</span>
            </span>
          </div>
        </div>

        {testState === 'ready' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-10">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
               <BookIcon className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 max-w-xs leading-tight">{passage?.title}</h2>
            <div className="flex items-center space-x-3 mb-10">
               <span className="bg-white border border-slate-200 px-4 py-1.5 rounded-full text-xs font-bold text-slate-500">{passage?.wordCount} words</span>
               <span className="bg-white border border-slate-200 px-4 py-1.5 rounded-full text-xs font-bold text-slate-500">{passage?.difficulty}</span>
            </div>
            
            <p className="text-slate-400 font-medium text-sm mb-8 max-w-[260px]">
              Tap start and read at your natural pace. Tap done immediately when finished.
            </p>

            <button 
              onClick={beginReading}
              className="w-full max-w-[280px] bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 active:scale-95 transition-all text-lg"
            >
              Start Reading
            </button>
          </div>
        )}

        {testState === 'reading' && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 relative">
                <p className="text-lg md:text-xl leading-9 text-slate-800 font-serif whitespace-pre-line text-justify">
                {passage?.content}
                </p>
                <div className="h-20"></div> {/* Spacer */}
            </div>
            <button 
                onClick={finishReading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-300 active:scale-95 transition-all text-lg"
            >
                I'm Done
            </button>
          </div>
        )}

        {testState === 'finished' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center -mt-10">
            <h2 className="text-xl font-bold text-slate-400 mb-4">Session Result</h2>
            
            <div className="relative mb-2">
                <div className="text-7xl font-black text-slate-800 tracking-tighter relative z-10">
                {Math.round((passage!.wordCount / elapsedTime) * 60)}
                </div>
                <div className="absolute -inset-4 bg-indigo-50 blur-2xl rounded-full -z-10"></div>
            </div>
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-10 bg-indigo-50 px-3 py-1 rounded-full">Words Per Minute</p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-10">
               <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">Time</div>
                  <div className="text-2xl font-bold text-slate-800">{elapsedTime.toFixed(1)}s</div>
               </div>
               <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">Total Words</div>
                  <div className="text-2xl font-bold text-slate-800">{passage?.wordCount}</div>
               </div>
            </div>
            
            <button 
              onClick={saveTestResult}
              className="w-full max-w-xs bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 active:scale-95 transition-transform"
            >
              Save Progress
            </button>
          </div>
        )}
      </div>
    );
  }

  // Manual Mode
  return (
    <div className="pb-24 pt-2 view-transition">
      <div className="flex items-center mb-8">
        <button onClick={() => setMode('menu')} className="mr-4 p-2 -ml-2 hover:bg-white rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Log Manual Reading</h1>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8">
        <div>
           <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Subject</label>
           <select 
             value={selectedTopic}
             onChange={(e) => setSelectedTopic(e.target.value)}
             className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold text-lg text-slate-800 transition-all"
           >
             {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
           </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Time Spent (minutes)</label>
          <div className="relative group">
             <ClockIcon className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
             <input 
               type="number" 
               value={manualTime}
               onChange={(e) => setManualTime(e.target.value)}
               className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold text-lg text-slate-800 transition-all placeholder:text-slate-300"
               placeholder="30"
             />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Pages Read</label>
           <div className="relative group">
             <BookIcon className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
             <input 
               type="number" 
               value={manualPages}
               onChange={(e) => setManualPages(e.target.value)}
               className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-lg text-slate-800 transition-all placeholder:text-slate-300"
               placeholder="15"
             />
          </div>
        </div>

        <button 
          onClick={saveManualLog}
          disabled={!manualTime || !manualPages}
          className="w-full bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 active:scale-95 transition-all mt-4"
        >
          Confirm Log
        </button>
      </div>
    </div>
  );
};
