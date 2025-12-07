
import React, { useState, useEffect } from 'react';
import { ClipboardIcon, LayersIcon, CheckCircleIcon, CalendarIcon, RefreshIcon, PlayIcon, PauseIcon, ChartIcon, TargetIcon, TrashIcon, PlusIcon, EditIcon } from '../components/Icons';
import { ActivityItem } from '../types';

interface Chapter {
  id: string;
  title: string;
  isCompleted: boolean;
  isInProgress: boolean;
}

interface Subject {
  name: string;
  chapters: Chapter[];
  color: string;
}

// Customized Mock Syllabus Data
const DEFAULT_SYLLABUS: Subject[] = [
  {
    name: "Dravyaguna",
    color: "emerald",
    chapters: [
      // Basic Principles
      { id: "dg1", title: "Dravya", isCompleted: false, isInProgress: false },
      { id: "dg2", title: "Guna", isCompleted: false, isInProgress: false },
      { id: "dg3", title: "Rasa", isCompleted: false, isInProgress: false },
      { id: "dg4", title: "Vipaka", isCompleted: false, isInProgress: false },
      { id: "dg5", title: "Virya", isCompleted: false, isInProgress: false },
      { id: "dg6", title: "Prabhava", isCompleted: false, isInProgress: false },
      { id: "dg7", title: "Interrelation of Rasa-Guna-Virya-Vipaka-Prabhava", isCompleted: false, isInProgress: false },
      { id: "dg8", title: "Karma", isCompleted: false, isInProgress: false },
      { id: "dg9", title: "Principles of General Pharmacology", isCompleted: false, isInProgress: false },
      { id: "dg10", title: "Karmas of Dashemani Gana", isCompleted: false, isInProgress: false },
      { id: "dg11", title: "Mishraka Gana", isCompleted: false, isInProgress: false },
      { id: "dg12", title: "Nomenclature of Dravya", isCompleted: false, isInProgress: false },
      { id: "dg13", title: "Prashasta Bheshaja & Bheshaja Pariksha", isCompleted: false, isInProgress: false },
      { id: "dg14", title: "Dravyasangrahana & Drug Collection (GFCP)", isCompleted: false, isInProgress: false },
      { id: "dg15", title: "GCP, Seed Bank, RET Plants", isCompleted: false, isInProgress: false },
      { id: "dg16", title: "Abhava Pratinidhi Dravya (Substitutes)", isCompleted: false, isInProgress: false },
      { id: "dg17", title: "Extract Techniques (Aqueous & Alcoholic)", isCompleted: false, isInProgress: false },
      { id: "dg18", title: "Adverse Drug Reaction & Pharmacovigilance", isCompleted: false, isInProgress: false },
      { id: "dg19", title: "Regulatory Bodies (NMPB, CCRAS, API, GCTM, PCIMH)", isCompleted: false, isInProgress: false },
      { id: "dg20", title: "Vrikshayurveda & Ethnomedicine", isCompleted: false, isInProgress: false },
      { id: "dg21", title: "Network Pharmacology & Bioinformatics", isCompleted: false, isInProgress: false },
      // Detailed Drugs
      { id: "dg22", title: "Amalaki", isCompleted: false, isInProgress: false },
      { id: "dg23", title: "Aragwadha", isCompleted: false, isInProgress: false },
      { id: "dg24", title: "Arjuna", isCompleted: false, isInProgress: false },
      { id: "dg25", title: "Ashoka", isCompleted: false, isInProgress: false },
      { id: "dg26", title: "Ashwagandha", isCompleted: false, isInProgress: false },
      { id: "dg27", title: "Ativisha", isCompleted: false, isInProgress: false },
      { id: "dg28", title: "Bala", isCompleted: false, isInProgress: false },
      { id: "dg29", title: "Beejaka", isCompleted: false, isInProgress: false },
      { id: "dg30", title: "Bhallataka", isCompleted: false, isInProgress: false },
      { id: "dg31", title: "Bharangi", isCompleted: false, isInProgress: false },
      { id: "dg32", title: "Bhrungaraja", isCompleted: false, isInProgress: false },
      { id: "dg33", title: "Bhumyamalaki", isCompleted: false, isInProgress: false },
      { id: "dg34", title: "Bilva", isCompleted: false, isInProgress: false },
      { id: "dg35", title: "Brahmi", isCompleted: false, isInProgress: false },
      { id: "dg36", title: "Chandana", isCompleted: false, isInProgress: false },
      { id: "dg37", title: "Chitraka", isCompleted: false, isInProgress: false },
      { id: "dg38", title: "Dadima", isCompleted: false, isInProgress: false },
      { id: "dg39", title: "Dhataki", isCompleted: false, isInProgress: false },
      { id: "dg40", title: "Dhamasa", isCompleted: false, isInProgress: false },
      { id: "dg41", title: "Eranda", isCompleted: false, isInProgress: false },
      { id: "dg42", title: "Gokshura", isCompleted: false, isInProgress: false },
      { id: "dg43", title: "Guduchi", isCompleted: false, isInProgress: false },
      { id: "dg44", title: "Guggulu", isCompleted: false, isInProgress: false },
      { id: "dg45", title: "Haridra", isCompleted: false, isInProgress: false },
      { id: "dg46", title: "Haritaki", isCompleted: false, isInProgress: false },
      { id: "dg47", title: "Hingu", isCompleted: false, isInProgress: false },
      { id: "dg48", title: "Jambu", isCompleted: false, isInProgress: false },
      { id: "dg49", title: "Jatamansi", isCompleted: false, isInProgress: false },
      { id: "dg50", title: "Jyotishmati", isCompleted: false, isInProgress: false },
      { id: "dg51", title: "Kanchanara", isCompleted: false, isInProgress: false },
      { id: "dg52", title: "Kantakari", isCompleted: false, isInProgress: false },
      { id: "dg53", title: "Kapikachhu", isCompleted: false, isInProgress: false },
      { id: "dg54", title: "Karkatshrungi", isCompleted: false, isInProgress: false },
      { id: "dg55", title: "Katuki", isCompleted: false, isInProgress: false },
      { id: "dg56", title: "Khadira", isCompleted: false, isInProgress: false },
      { id: "dg57", title: "Kumari", isCompleted: false, isInProgress: false },
      { id: "dg58", title: "Kutaja", isCompleted: false, isInProgress: false },
      { id: "dg59", title: "Latakaranja", isCompleted: false, isInProgress: false },
      { id: "dg60", title: "Lodhra", isCompleted: false, isInProgress: false },
      { id: "dg61", title: "Agnimanth", isCompleted: false, isInProgress: false },
      { id: "dg62", title: "Ahiphena (NK)", isCompleted: false, isInProgress: false },
      { id: "dg63", title: "Ajamoda (DK)", isCompleted: false, isInProgress: false },
      { id: "dg64", title: "Apamarga (DK)", isCompleted: false, isInProgress: false },
      { id: "dg65", title: "Asthishrunkhala", isCompleted: false, isInProgress: false },
      { id: "dg66", title: "Bakuchi", isCompleted: false, isInProgress: false },
      { id: "dg67", title: "Bruhati", isCompleted: false, isInProgress: false },
      { id: "dg68", title: "Chakramarda", isCompleted: false, isInProgress: false },
      { id: "dg69", title: "Dhanyaka", isCompleted: false, isInProgress: false },
      { id: "dg70", title: "Ela", isCompleted: false, isInProgress: false },
      { id: "dg71", title: "Gambhari", isCompleted: false, isInProgress: false },
      { id: "dg72", title: "Japa", isCompleted: false, isInProgress: false },
      { id: "dg73", title: "Jatiphala", isCompleted: false, isInProgress: false },
      { id: "dg74", title: "Jeeraka (DK)", isCompleted: false, isInProgress: false },
      { id: "dg75", title: "Kalamegha", isCompleted: false, isInProgress: false },
      { id: "dg76", title: "Kampillaka", isCompleted: false, isInProgress: false },
      { id: "dg77", title: "Kulatha (NK)", isCompleted: false, isInProgress: false },
      { id: "dg78", title: "Kumkum", isCompleted: false, isInProgress: false },
      { id: "dg79", title: "Lajjalu", isCompleted: false, isInProgress: false },
      { id: "dg80", title: "Lavanga", isCompleted: false, isInProgress: false },
      { id: "dg81", title: "Madanphala", isCompleted: false, isInProgress: false },
      { id: "dg82", title: "Mandukaparni", isCompleted: false, isInProgress: false },
      { id: "dg83", title: "Manjishta", isCompleted: false, isInProgress: false },
      { id: "dg84", title: "Maricha", isCompleted: false, isInProgress: false },
      { id: "dg85", title: "Meshashrungi", isCompleted: false, isInProgress: false },
      { id: "dg86", title: "Methika", isCompleted: false, isInProgress: false },
      { id: "dg87", title: "Musta", isCompleted: false, isInProgress: false },
      { id: "dg88", title: "Nagkeshar", isCompleted: false, isInProgress: false },
      { id: "dg89", title: "Nimba", isCompleted: false, isInProgress: false },
      { id: "dg90", title: "Nirgundi", isCompleted: false, isInProgress: false },
      { id: "dg91", title: "Palasha", isCompleted: false, isInProgress: false },
      { id: "dg92", title: "Pashanabheda", isCompleted: false, isInProgress: false },
      { id: "dg93", title: "Patha", isCompleted: false, isInProgress: false },
      { id: "dg94", title: "Pippali", isCompleted: false, isInProgress: false },
      { id: "dg95", title: "Punarnava", isCompleted: false, isInProgress: false },
      { id: "dg96", title: "Rasna", isCompleted: false, isInProgress: false },
      { id: "dg97", title: "Rasona", isCompleted: false, isInProgress: false },
      { id: "dg98", title: "Sarapagandha", isCompleted: false, isInProgress: false },
      { id: "dg99", title: "Sairayak", isCompleted: false, isInProgress: false },
      { id: "dg100", title: "Sariva", isCompleted: false, isInProgress: false },
      { id: "dg101", title: "Shallaki", isCompleted: false, isInProgress: false },
      { id: "dg102", title: "Shalmali(Mocharasa)", isCompleted: false, isInProgress: false },
      { id: "dg103", title: "Shankhapushpi", isCompleted: false, isInProgress: false },
      { id: "dg104", title: "Shatavari", isCompleted: false, isInProgress: false },
      { id: "dg105", title: "Shigru", isCompleted: false, isInProgress: false },
      { id: "dg106", title: "Shunthi", isCompleted: false, isInProgress: false },
      { id: "dg107", title: "Talisapatra (NK)", isCompleted: false, isInProgress: false },
      { id: "dg108", title: "Trivrut", isCompleted: false, isInProgress: false },
      { id: "dg109", title: "Tulasi", isCompleted: false, isInProgress: false },
      { id: "dg110", title: "Twak", isCompleted: false, isInProgress: false },
      { id: "dg111", title: "Usheera", isCompleted: false, isInProgress: false },
      { id: "dg112", title: "Vacha", isCompleted: false, isInProgress: false },
      { id: "dg113", title: "Varuna", isCompleted: false, isInProgress: false },
      { id: "dg114", title: "Vasa", isCompleted: false, isInProgress: false },
      { id: "dg115", title: "Vatsanabha", isCompleted: false, isInProgress: false },
      { id: "dg116", title: "Vibhitaki", isCompleted: false, isInProgress: false },
      { id: "dg117", title: "Vidanga", isCompleted: false, isInProgress: false },
      { id: "dg118", title: "Yashtimadhu", isCompleted: false, isInProgress: false },
    ]
  },
  {
    name: "Rasashastra",
    color: "fuchsia",
    chapters: [
      { id: "r1", title: "Parada (Mercury) Processing", isCompleted: false, isInProgress: false },
      { id: "r2", title: "Yantras (Instruments)", isCompleted: false, isInProgress: false },
      { id: "r3", title: "Musa Vijnana (Crucibles)", isCompleted: false, isInProgress: false },
      { id: "r4", title: "Bhasma Pariksha", isCompleted: false, isInProgress: false },
      { id: "r5", title: "Ratna & Uparanta", isCompleted: false, isInProgress: false },
    ]
  },
  {
    name: "Swasthavritta",
    color: "blue",
    chapters: [
      { id: "s1", title: "Dinacharya: Brahma Muhurta", isCompleted: false, isInProgress: false },
      { id: "s2", title: "Ritucharya: Visarga Kala", isCompleted: false, isInProgress: false },
      { id: "s3", title: "Adharaniya Vega", isCompleted: false, isInProgress: false },
      { id: "s4", title: "Nidra (Sleep) Physiology", isCompleted: false, isInProgress: false },
    ]
  },
  {
    name: "Roganidana",
    color: "orange",
    chapters: [
        { id: "ro1", title: "Nidan Panchak Overview", isCompleted: false, isInProgress: true },
        { id: "ro2", title: "Jwara Nidana (Fever)", isCompleted: false, isInProgress: false },
        { id: "ro3", title: "Pandu Roga (Anemia)", isCompleted: false, isInProgress: false },
        { id: "ro4", title: "Prameha (Diabetes)", isCompleted: false, isInProgress: false },
    ]
  },
  {
    name: "Samhita",
    color: "cyan",
    chapters: [
        { id: "sa1", title: "Charaka Sutra Ch 1: Dirghanjivitiya", isCompleted: false, isInProgress: false },
        { id: "sa2", title: "Sushruta Sutra Ch 1: Vedotpatti", isCompleted: false, isInProgress: false },
        { id: "sa3", title: "Ashtanga Hridaya Sutra Ch 1", isCompleted: false, isInProgress: false },
        { id: "sa4", title: "Tantrayukti", isCompleted: false, isInProgress: false },
    ]
  },
  {
    name: "Agadatantra",
    color: "rose",
    chapters: [
        { id: "ag1", title: "Classification of Visha", isCompleted: false, isInProgress: false },
        { id: "ag2", title: "Visha Vega (Impulses)", isCompleted: false, isInProgress: false },
        { id: "ag3", title: "Sarpa Visha (Snake Bite)", isCompleted: false, isInProgress: false },
        { id: "ag4", title: "Dushi Visha (Latent Poison)", isCompleted: false, isInProgress: false },
    ]
  }
];

interface SyllabusProps {
  activityHistory?: ActivityItem[];
  onLogActivity?: (item: ActivityItem) => void;
}

export const Syllabus: React.FC<SyllabusProps> = ({ activityHistory = [], onLogActivity }) => {
  const [syllabus, setSyllabus] = useState<Subject[]>(DEFAULT_SYLLABUS);
  const [isBufferDay, setIsBufferDay] = useState(false);
  const [activeSubjectIndex, setActiveSubjectIndex] = useState<number | null>(0);
  const [manualSubjectIndex, setManualSubjectIndex] = useState<number | null>(null);
  
  // Animation state for circular progress
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSyllabus = localStorage.getItem('readflow_syllabus_state');
    if (savedSyllabus) {
        setSyllabus(JSON.parse(savedSyllabus));
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('readflow_syllabus_state', JSON.stringify(syllabus));
  }, [syllabus]);

  // Calculate overall completion
  const totalChapters = syllabus.reduce((acc, sub) => acc + sub.chapters.length, 0);
  const completedChapters = syllabus.reduce((acc, sub) => acc + sub.chapters.filter(c => c.isCompleted).length, 0);
  const progressPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  // Smoothly animate progress on change
  useEffect(() => {
    const timeout = setTimeout(() => {
        setAnimatedProgress(progressPercentage);
    }, 100);
    return () => clearTimeout(timeout);
  }, [progressPercentage]);

  // Toggle Chapter Status
  const toggleChapter = (subjectIndex: number, chapterId: string) => {
    const newSyllabus = [...syllabus];
    const subject = newSyllabus[subjectIndex];
    const chapter = subject.chapters.find(c => c.id === chapterId);
    
    if (chapter) {
      if (!chapter.isCompleted && !chapter.isInProgress) {
        chapter.isInProgress = true;
        // Log Start
        if (onLogActivity) {
            onLogActivity({
                id: Date.now().toString(),
                date: new Date().toISOString(),
                type: 'syllabus',
                subtype: 'progress',
                description: `Started: ${chapter.title}`,
                subject: subject.name
            });
        }
      } else if (chapter.isInProgress) {
        chapter.isInProgress = false;
        chapter.isCompleted = true;
        // Log Completion
        if (onLogActivity) {
            onLogActivity({
                id: Date.now().toString(),
                date: new Date().toISOString(),
                type: 'syllabus',
                subtype: 'completion',
                description: `Completed: ${chapter.title}`,
                subject: subject.name
            });
        }
      } else {
        chapter.isCompleted = false;
        chapter.isInProgress = false;
      }
      setSyllabus(newSyllabus);
    }
  };

  // Add New Chapter
  const addChapter = (subjectIndex: number) => {
      const title = window.prompt("Enter new chapter title:");
      if (title && title.trim()) {
          const newSyllabus = [...syllabus];
          newSyllabus[subjectIndex].chapters.push({
              id: `custom_${Date.now()}`,
              title: title.trim(),
              isCompleted: false,
              isInProgress: false
          });
          setSyllabus(newSyllabus);
      }
  };

  // Delete Chapter
  const deleteChapter = (subjectIndex: number, chapterId: string) => {
      const newSyllabus = [...syllabus];
      newSyllabus[subjectIndex].chapters = newSyllabus[subjectIndex].chapters.filter(c => c.id !== chapterId);
      setSyllabus(newSyllabus);
  };

  // Reset Progress
  const resetProgress = () => {
      if (window.confirm("Are you sure you want to reset all progress to zero? This action cannot be undone.")) {
        const resetSyllabus = syllabus.map(subject => ({
            ...subject,
            chapters: subject.chapters.map(c => ({
                ...c,
                isCompleted: false,
                isInProgress: false
            }))
        }));
        setSyllabus(resetSyllabus);
        setAnimatedProgress(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  // Logic to determine "Smart Schedule" based on Day of Week or Manual Override
  const getTodaySchedule = () => {
    // 1. Manual Override logic (Tap to change)
    if (manualSubjectIndex !== null) {
        const subject = syllabus[manualSubjectIndex];
        const targetChapter = subject.chapters.find(c => !c.isCompleted) || subject.chapters[0];
        return { 
            type: 'manual', 
            title: subject.name, 
            subtitle: `Focus: ${targetChapter ? targetChapter.title : 'All Complete!'}`, 
            color: subject.color 
        };
    }

    // 2. Buffer Day logic (Toggle)
    if (isBufferDay) {
        return { 
            type: 'buffer', 
            title: 'Rest & Recharge', 
            subtitle: 'Take a break to consolidate memory.', 
            color: 'slate' 
        };
    }

    const day = new Date().getDay(); // 0 = Sun, 1 = Mon...
    
    // 3. Weekend Revision
    if (day === 0 || day === 6) { 
      return { 
          type: 'revision', 
          title: 'Weekly Revision', 
          subtitle: 'Review all "In Progress" topics', 
          color: 'indigo' 
      };
    }

    // 4. Default Weekday Schedule
    const subjectIndex = (day - 1) % syllabus.length;
    const subject = syllabus[subjectIndex];
    // Find first unfinished chapter
    const targetChapter = subject.chapters.find(c => !c.isCompleted) || subject.chapters[0];

    return { 
        type: 'study', 
        title: subject.name, 
        subtitle: `Focus: ${targetChapter ? targetChapter.title : 'All Complete!'}`, 
        color: subject.color 
    };
  };

  const cycleSchedule = () => {
      // If currently on Buffer, switch to first subject
      if (isBufferDay) {
          setIsBufferDay(false);
          setManualSubjectIndex(0);
          return;
      }

      // If Auto Mode (manualSubjectIndex is null)
      if (manualSubjectIndex === null) {
          setManualSubjectIndex(0);
      } else {
          // Increment index
          const nextIndex = manualSubjectIndex + 1;
          if (nextIndex >= syllabus.length) {
              // Cycle back to Auto Mode
              setManualSubjectIndex(null);
          } else {
              setManualSubjectIndex(nextIndex);
          }
      }
  };

  const schedule = getTodaySchedule();

  // Filter history for syllabus items
  const syllabusHistory = activityHistory.filter(a => a.type === 'syllabus').slice(0, 10); // Show last 10
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  return (
    <div className="space-y-8 pb-32 view-transition pt-2">
      <style>{`
        @keyframes togglePulse {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); transform: scale(1); }
            50% { transform: scale(1.05); }
            70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { transform: scale(1); }
        }
        .animate-toggle-active {
            animation: togglePulse 2s infinite;
        }
        @keyframes checkPop {
            0% { transform: scale(0.5); opacity: 0; }
            60% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
        }
        .check-pop-icon {
            animation: checkPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Syllabus Tracker</h1>
        {/* Completion Meter (Circular) */}
        <div className="relative w-16 h-16 group">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
            <circle 
              cx="32" cy="32" r="28" 
              stroke="currentColor" strokeWidth="6" 
              fill="transparent" 
              strokeDasharray={175} 
              strokeDashoffset={175 - (175 * animatedProgress) / 100}
              strokeLinecap="round"
              className="text-indigo-600 transition-all duration-1000 ease-out group-hover:text-indigo-500" 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
             <span className="text-xs font-black text-slate-800 transition-all duration-500">{animatedProgress}%</span>
          </div>
        </div>
      </div>

      {/* Smart Schedule Card */}
      <section className="relative">
        <div 
          onClick={cycleSchedule}
          className={`p-6 rounded-[2rem] shadow-lg border relative overflow-hidden transition-all duration-500 cursor-pointer active:scale-[0.98] group select-none ${
            schedule.type === 'buffer' ? 'bg-slate-800 border-slate-700 text-slate-300' :
            schedule.type === 'revision' ? 'bg-gradient-to-br from-violet-600 to-indigo-600 border-indigo-500 text-white' :
            'bg-white border-slate-100 text-slate-800 hover:border-indigo-200'
        }`}>
           {/* Decorative bg */}
           <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              {schedule.type === 'buffer' ? <PauseIcon className="w-24 h-24" /> : <CalendarIcon className="w-24 h-24" />}
           </div>
           
           {/* Tap Hint Overlay */}
           <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 text-black px-2 py-1 rounded text-[10px] font-bold">
               Tap to change
           </div>

           <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest py-1 px-2 rounded-lg ${
                        schedule.type === 'buffer' ? 'bg-slate-700 text-slate-400' :
                        schedule.type === 'revision' ? 'bg-white/20 text-indigo-50 backdrop-blur-md' :
                        'bg-indigo-50 text-indigo-600'
                    }`}>
                        {schedule.type === 'buffer' ? 'Buffer Mode' : 
                         schedule.type === 'manual' ? 'Custom Focus' : `Today's Schedule`}
                    </span>
                    {schedule.type === 'manual' && (
                         <div className="animate-pulse bg-emerald-100 text-emerald-600 rounded-full p-0.5">
                             <EditIcon className="w-3 h-3" />
                         </div>
                    )}
                  </div>
                  
                  {/* Buffer Toggle */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsBufferDay(!isBufferDay); setManualSubjectIndex(null); }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center space-x-1 active:scale-95 shadow-sm border ${
                        isBufferDay 
                        ? 'bg-emerald-500 border-emerald-400 text-white animate-toggle-active' 
                        : schedule.type === 'revision' ? 'bg-white/20 border-white/20 hover:bg-white/30 text-white' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isBufferDay ? <PlayIcon className="w-3 h-3 fill-current" /> : <PauseIcon className="w-3 h-3 fill-current" />}
                    <span>{isBufferDay ? 'Resume Study' : 'Buffer Day'}</span>
                  </button>
              </div>

              <div className="animate-[fadeIn_0.3s_ease-out]">
                  <h2 className="text-2xl font-black mb-1 leading-tight flex items-center">
                      {schedule.title}
                      {/* Hint arrow for auto/manual */}
                      {manualSubjectIndex === null && !isBufferDay && schedule.type !== 'revision' && (
                        <span className="text-xs opacity-30 ml-2 font-normal">(Auto)</span>
                      )}
                  </h2>
                  <p className={`font-medium ${
                      schedule.type === 'buffer' ? 'text-slate-400' : 
                      schedule.type === 'revision' ? 'text-indigo-100' : 'text-slate-500'
                  }`}>
                      {schedule.subtitle}
                  </p>
              </div>
           </div>
        </div>
      </section>

      {/* Weekly Targets - Bar Visualization */}
      <section>
        <div className="flex items-center justify-between mb-4">
             <div className="flex items-center space-x-2">
                <TargetIcon className="w-4 h-4 text-indigo-500" />
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Weekly Study Targets</h2>
             </div>
             <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">Target: 3 Chaps/Week</span>
        </div>
        
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 gap-4">
            {syllabus.map((subject, idx) => {
                const weeklyTarget = 3;
                const completedCount = subject.chapters.filter(c => c.isCompleted).length;
                const progress = Math.min(100, Math.round((completedCount / weeklyTarget) * 100));
                
                return (
                    <div key={idx} className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold bg-${subject.color}-50 text-${subject.color}-600 shrink-0`}>
                            {subject.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="flex justify-between text-[10px] font-bold mb-1.5">
                                 <span className="text-slate-700 truncate">{subject.name}</span>
                                 <span className={completedCount >= weeklyTarget ? 'text-emerald-500' : 'text-slate-400'}>
                                    {completedCount}/{weeklyTarget}
                                 </span>
                             </div>
                             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${completedCount >= weeklyTarget ? 'bg-emerald-500' : `bg-${subject.color}-500`}`} 
                                    style={{ width: `${progress}%` }}
                                 ></div>
                             </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </section>

      {/* Syllabus List */}
      <section className="space-y-4">
         <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Curriculum</h2>
         </div>
         
         {syllabus.map((subject, sIdx) => {
             const subCompleted = subject.chapters.filter(c => c.isCompleted).length;
             const subTotal = subject.chapters.length;
             const subPercent = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0;
             const isActive = activeSubjectIndex === sIdx;

             return (
                 <div key={subject.name} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm transition-all">
                     <div 
                        onClick={() => setActiveSubjectIndex(isActive ? null : sIdx)}
                        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                     >
                        <div className="flex items-center space-x-4">
                            <div className={`p-2.5 rounded-xl bg-${subject.color}-50 text-${subject.color}-600`}>
                                <LayersIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">{subject.name}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full bg-${subject.color}-500 rounded-full transition-all duration-700`} style={{ width: `${subPercent}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">{subPercent}%</span>
                                </div>
                            </div>
                        </div>
                        <div className={`transform transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                             <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-slate-300"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </div>
                     </div>
                     
                     {/* Chapters Accordion */}
                     {isActive && (
                         <div className="border-t border-slate-50 bg-slate-50/50 p-3 space-y-2 animate-[fadeIn_0.2s_ease-out]">
                             <button 
                                onClick={() => addChapter(sIdx)}
                                className="w-full py-2 flex items-center justify-center space-x-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-xs hover:border-indigo-300 hover:text-indigo-500 transition-colors"
                             >
                                <PlusIcon className="w-4 h-4" />
                                <span>Add Custom Chapter</span>
                             </button>

                             {subject.chapters.length > 0 ? subject.chapters.map(chapter => (
                                 <ChapterItem 
                                    key={chapter.id}
                                    chapter={chapter}
                                    subjectColor={subject.color}
                                    onToggle={() => toggleChapter(sIdx, chapter.id)}
                                    onDelete={() => deleteChapter(sIdx, chapter.id)}
                                 />
                             )) : (
                                <div className="text-center py-4 text-slate-400 text-xs font-medium italic">No chapters added.</div>
                             )}
                         </div>
                     )}
                 </div>
             );
         })}
      </section>

      {/* History Log */}
      {syllabusHistory.length > 0 && (
         <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Activity Log</h2>
            <div className="space-y-3">
                {syllabusHistory.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center shadow-sm animate-[fadeIn_0.3s_ease-out]">
                        <div className={`p-2 rounded-xl mr-3 ${
                            item.subtype === 'completion' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                            {item.subtype === 'completion' ? <CheckCircleIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm">{item.description}</h4>
                            <div className="flex items-center space-x-2 mt-0.5">
                                <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">{item.subject}</span>
                                <span className="text-[10px] text-slate-400">{formatDate(item.date)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         </section>
      )}

      {/* Prominent Reset Button */}
      <div className="pt-6 pb-6">
          <button 
            onClick={resetProgress}
            className="w-full flex items-center justify-center space-x-2 bg-rose-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all"
          >
            <RefreshIcon className="w-5 h-5" />
            <span>Reset Entire Syllabus</span>
          </button>
          <p className="text-center text-xs text-slate-400 mt-3 font-medium">This will clear all completed chapters and tracking data.</p>
      </div>
    </div>
  );
};

const ChapterItem: React.FC<{ 
    chapter: Chapter; 
    subjectColor: string; 
    onToggle: () => void; 
    onDelete: () => void;
}> = ({ chapter, subjectColor, onToggle, onDelete }) => {
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
      
      if (isLeftSwipe) setIsSwiped(true);
      if (isRightSwipe) setIsSwiped(false);
    };

    return (
        <div className="relative overflow-hidden rounded-xl">
             <div className="absolute inset-0 bg-red-500 flex items-center justify-end pr-4 rounded-xl">
                <button onClick={onDelete} className="text-white">
                    <TrashIcon className="w-5 h-5" />
                </button>
             </div>
             <div 
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onClick={() => {
                    if (isSwiped) setIsSwiped(false);
                    else onToggle();
                }}
                className={`flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:border-indigo-200 transition-transform duration-300 ease-out relative ${
                    isSwiped ? '-translate-x-16' : 'translate-x-0'
                }`}
            >
                <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        chapter.isCompleted ? `bg-${subjectColor}-500 border-${subjectColor}-500 scale-110` : 
                        chapter.isInProgress ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                        {chapter.isCompleted && <CheckCircleIcon className="w-3.5 h-3.5 text-white check-pop-icon" />}
                        {chapter.isInProgress && <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${chapter.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {chapter.title}
                    </span>
                </div>
                {chapter.isInProgress && !chapter.isCompleted && (
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded uppercase tracking-wide">In Progress</span>
                )}
            </div>
        </div>
    );
};
