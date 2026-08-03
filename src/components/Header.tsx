import React from 'react';
import { Clock, Code2, ShieldAlert, CheckCircle2, Sun, Moon, LogOut } from 'lucide-react';

interface HeaderProps {
  rollNo: string;
  name: string;
  timeLeftSeconds: number;
  violations: number;
  solvedCount: number;
  totalProblems: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onSubmitAll: () => void;
  isSubmitting: boolean;
  onAdminClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  rollNo,
  name,
  timeLeftSeconds,
  violations,
  solvedCount,
  totalProblems,
  isDarkMode,
  onToggleDarkMode,
  onSubmitAll,
  isSubmitting,
  onAdminClick
}) => {
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isUrgent = timeLeftSeconds <= 300; // < 5 mins

  return (
    <header className="h-14 border-b border-[#2A2D33] bg-[#0E1117] flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-blue-500 p-0.5 shadow-md shadow-pink-500/20 flex items-center justify-center font-bold text-white text-xs">
          <div className="w-full h-full bg-[#0A0C10] rounded-[6px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
            DAA
          </div>
        </div>
        <div className="flex items-baseline">
          <h1 className="text-sm sm:text-base font-extrabold tracking-tight uppercase bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
            DAA Assessment
          </h1>
          <span className="text-slate-500 text-[10px] font-mono ml-2 hidden sm:inline-block">v2.4.0</span>
        </div>
      </div>

      {/* Candidate, Timer & Finish Action */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Candidate Info */}
        <div className="hidden md:flex items-center gap-3 pr-4 border-r border-[#2A2D33]">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase text-pink-400/80 tracking-widest font-bold">Candidate</span>
            <span className="text-xs font-semibold text-slate-200">{name} ({rollNo})</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500/20 to-blue-500/20 border border-pink-500/40 flex items-center justify-center text-xs font-mono text-pink-300 font-bold">
            {name ? name.slice(0, 2).toUpperCase() : 'EX'}
          </div>
        </div>

        {/* Solved Counter */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#181C24] border border-blue-500/30 text-blue-400 text-xs font-mono font-bold">
          <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
          <span>{solvedCount}/{totalProblems} Solved</span>
        </div>

        {/* Violations Badge */}
        {violations > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800/80 text-red-400 text-xs font-mono font-bold">
            <ShieldAlert className="h-3.5 w-3.5 text-red-400 animate-bounce" />
            <span>{violations}/3 Violations</span>
          </div>
        )}

        {/* Timer Display */}
        <div className="flex flex-col items-center justify-center">
          <div className={`text-lg sm:text-xl font-mono font-black ${isUrgent ? 'text-red-500 animate-pulse' : 'text-pink-400'}`}>
            {timeFormatted}
          </div>
          <span className="text-[9px] uppercase text-slate-400 tracking-widest font-bold -mt-0.5">Time Remaining</span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-1.5 rounded-lg bg-[#181C24] border border-[#2A2D33] text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Finish Assessment Button */}
        <button
          onClick={onSubmitAll}
          disabled={isSubmitting}
          className="px-4 h-9 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs tracking-wider transition-all shadow-md shadow-emerald-900/30 uppercase flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>SUBMITTING...</span>
            </>
          ) : (
            <>
              <LogOut className="h-3.5 w-3.5" />
              <span>FINISH ASSESSMENT</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

