
export interface UserStats {
  dailyStreak: number;
  weeklyStreak: number;
  monthlyStreak: number;
  yearlyStreak: number;
  totalTimeReadMinutes: number;
  totalTimeWrittenMinutes: number;
  totalPagesRead: number;
  currentWPM: number;
  coins: number;
  xp: number;
  level: number;
}

export interface ReadingSession {
  id: string;
  date: string; // ISO string
  durationSeconds: number;
  wpm: number;
  pages?: number;
  type: 'speed-test' | 'manual-log' | 'writing';
  passageTitle?: string;
  subject?: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: 'minutes' | 'pages';
  period: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  reminderTime?: string; // Format: "HH:MM" (24h)
  subject?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // references an icon name
  unlocked: boolean;
  color: string;
  condition: (stats: UserStats) => boolean;
}

export interface ReadingPassage {
  title: string;
  content: string;
  wordCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ReadingInsight {
  message: string;
  type: 'encouragement' | 'analysis' | 'tip';
}

export interface ActivityItem {
  id: string;
  date: string; // ISO
  type: 'syllabus' | 'goal';
  subtype: 'completion' | 'creation' | 'progress';
  description: string;
  subject?: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  PRACTICE = 'practice',
  GOALS = 'goals',
  SYLLABUS = 'syllabus',
  REWARDS = 'rewards',
  INSIGHTS = 'insights',
}
