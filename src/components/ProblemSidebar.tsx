import React from 'react';
import { Problem, ProblemResult } from '../types';
import { CheckCircle, Clock, CircleAlert, Code, Award, ShieldAlert } from 'lucide-react';

interface ProblemSidebarProps {
  problems: Problem[];
  activeProblemId: string;
  onSelectProblem: (id: string) => void;
  problemResults: Record<string, ProblemResult>;
  totalMarksEarned: number;
  isDarkMode: boolean;
}

export const ProblemSidebar: React.FC<ProblemSidebarProps> = ({
  problems,
  activeProblemId,
  onSelectProblem,
  problemResults,
  totalMarksEarned,
  isDarkMode
}) => {
  const solvedCount = (Object.values(problemResults) as ProblemResult[]).filter(
    (r) => r.status === 'SOLVED'
  ).length;
  const progressPercent = Math.round((solvedCount / problems.length) * 100);

  return (
    <aside className="w-full lg:w-72 shrink-0 border-r border-[#2A2D33] bg-[#0E1117] flex flex-col justify-between">
      <div className="p-4 border-b border-[#2A2D33]">
        <h2 className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-3 flex items-center justify-between">
          <span>Problems ({problems.length})</span>
          <span className="text-blue-400 font-mono text-[9px] bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40">DAA JAVA</span>
        </h2>
        
        <div className="space-y-2">
          {problems.map((p, idx) => {
            const res = problemResults[p.id];
            const isActive = p.id === activeProblemId;
            const isSolved = res && res.passedCount === res.totalCount && res.totalCount > 0;
            const isAttempted = res && res.passedCount > 0 && !isSolved;

            return (
              <div
                key={p.id}
                onClick={() => onSelectProblem(p.id)}
                className={`p-3 border-l-4 rounded-lg flex items-center justify-between group cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#181C24] border-pink-500 shadow-md shadow-pink-500/10'
                    : 'bg-transparent hover:bg-[#14171F] border-transparent'
                }`}
              >
                <div>
                  <p className={`text-xs font-bold ${isActive ? 'text-pink-300' : 'text-slate-200'}`}>
                    {idx + 1}. {p.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 italic font-mono">
                    {p.allocatedMarks} Marks • {idx === 0 ? 'Medium' : idx === 1 ? 'Easy' : 'Hard'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {isSolved ? (
                    <div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm shadow-blue-400/80 ring-2 ring-blue-500/30" title="Solved" />
                  ) : isAttempted ? (
                    <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80" title="Attempted" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-[#2A2D33]" title="Unsolved" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress & Score Widget */}
      <div className="p-4 bg-[#0A0C10] border-t border-[#2A2D33] space-y-4">
        {/* Score display */}
        <div className="p-3 bg-[#14171F] border border-[#2A2D33] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Current Score</span>
            <span className="text-sm font-black font-mono text-pink-400">{totalMarksEarned} / 50 Marks</span>
          </div>
          <Award className="h-5 w-5 text-blue-400" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Overall Progress</span>
            <span className="text-[10px] font-bold font-mono text-pink-300">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[#1C2029] rounded-full overflow-hidden p-0.5 border border-[#2A2D33]">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Footer Judge Info */}
        <div className="pt-2 text-[10px] font-mono text-slate-400 flex justify-between border-t border-[#2A2D33]">
          <span>Judge: OpenJDK 17</span>
          <span className="text-blue-400 font-bold">READY</span>
        </div>
      </div>
    </aside>
  );
};

