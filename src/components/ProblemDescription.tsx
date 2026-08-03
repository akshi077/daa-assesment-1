import React from 'react';
import { Problem } from '../types';
import { BookOpen, FileText, CheckSquare, Layers } from 'lucide-react';

interface ProblemDescriptionProps {
  problem: Problem;
  isDarkMode: boolean;
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem, isDarkMode }) => {
  return (
    <div className="p-5 space-y-6 overflow-y-auto max-h-full bg-[#0A0C10] text-[#E0E0E0]">
      {/* Title & Marks */}
      <div className="border-b border-[#2A2D33] pb-4">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-pink-950/60 text-pink-400 text-[9px] rounded-md uppercase font-extrabold border border-pink-800/60 tracking-wider">
              Problem Statement
            </span>
            <h2 className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-blue-300">
              {problem.title}
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[#14171F] border border-pink-500/30 text-pink-400 text-xs font-bold font-mono shadow-sm">
            {problem.allocatedMarks} Marks
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Java Class Name: <code className="bg-[#181C24] text-blue-300 px-2 py-0.5 rounded font-mono text-[11px] border border-blue-500/20">Solution</code>
        </p>
      </div>

      {/* Statement */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-pink-400" />
          <span>Description</span>
        </h3>
        <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
          {problem.statement}
        </p>
      </div>

      {/* Input / Output Format */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-xl bg-[#14171F] border border-[#2A2D33]">
          <h4 className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-pink-400" />
            <span>Input Format</span>
          </h4>
          <p className="text-xs text-slate-300 whitespace-pre-line font-mono">
            {problem.inputFormat}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#14171F] border border-[#2A2D33]">
          <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-blue-400" />
            <span>Output Format</span>
          </h4>
          <p className="text-xs text-slate-300 whitespace-pre-line font-mono">
            {problem.outputFormat}
          </p>
        </div>
      </div>

      {/* Sample I/O */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <CheckSquare className="h-3.5 w-3.5 text-pink-400" />
          <span>Sample Cases</span>
        </h3>
        <div className="space-y-3">
          {problem.sampleIO.map((sample, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#2A2D33] overflow-hidden text-xs bg-[#14171F]"
            >
              <div className="px-3.5 py-1.5 bg-[#181C24] border-b border-[#2A2D33] font-bold text-pink-300 text-[10px] uppercase tracking-wider flex items-center justify-between">
                <span>Sample Case {idx + 1}</span>
                <span className="text-blue-400 font-mono text-[9px]">Standard Stdin</span>
              </div>
              <div className="p-3.5 space-y-2.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Input</span>
                  <pre className="p-2.5 rounded-lg bg-[#0A0C10] font-mono text-xs border border-[#2A2D33] text-pink-300 overflow-x-auto">
                    {sample.input}
                  </pre>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Expected Output</span>
                  <pre className="p-2.5 rounded-lg bg-[#0A0C10] font-mono text-xs border border-[#2A2D33] text-blue-400 overflow-x-auto">
                    {sample.output}
                  </pre>
                </div>
                {sample.explanation && (
                  <p className="text-[11px] text-slate-400 italic">
                    Note: {sample.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Constraints */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Constraints
        </h3>
        <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 font-mono bg-[#14171F] p-3 rounded-xl border border-[#2A2D33]">
          {problem.constraints.map((c, idx) => (
            <li key={idx}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

