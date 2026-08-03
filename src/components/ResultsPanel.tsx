import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TestCaseResult } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, Clock, Bot, Sparkles } from 'lucide-react';
import { playPassSound, playFailSound } from '../utils/sound';

interface ResultsPanelProps {
  testResults: TestCaseResult[] | null;
  passedCount: number;
  totalCount: number;
  marksEarned?: number;
  allocatedMarks?: number;
  isDarkMode: boolean;
  isRunOnly?: boolean;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  testResults,
  passedCount,
  totalCount,
  marksEarned,
  allocatedMarks,
  isDarkMode,
  isRunOnly = false
}) => {
  useEffect(() => {
    if (testResults && totalCount > 0 && passedCount === totalCount) {
      playPassSound();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 }
      });
    } else if (testResults && passedCount < totalCount) {
      playFailSound();
    }
  }, [testResults, passedCount, totalCount]);

  if (!testResults) {
    return (
      <div className="p-6 text-center flex flex-col items-center justify-center min-h-[160px] text-slate-400 bg-[#0A0C10]">
        <Bot className="h-10 w-10 text-pink-500 mb-2 animate-bounce" />
        <p className="text-xs font-medium text-slate-300">Click <strong className="text-pink-400">"Run Samples"</strong> or <strong className="text-blue-400">"Submit Problem"</strong> to execute your Java code.</p>
      </div>
    );
  }

  const allPassed = passedCount === totalCount && totalCount > 0;

  return (
    <div className="p-4 space-y-4 bg-[#0A0C10] text-[#E0E0E0]">
      {/* Header Result Summary */}
      <div
        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
          allPassed
            ? 'bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-pink-950/40 border-pink-500/40 text-pink-300'
            : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Mascot Reaction */}
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-md ${
              allPassed ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white' : 'bg-amber-600 text-white'
            }`}
          >
            <Bot className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-xs font-black flex items-center gap-1.5 uppercase tracking-wider">
              <span>{allPassed ? 'All Test Cases Passed! 🎉' : 'Some Test Cases Failed'}</span>
            </h3>
            <p className="text-[11px] font-mono opacity-90 mt-0.5">
              Passed: <strong className="text-pink-400">{passedCount}</strong> / {totalCount} Test Cases
              {!isRunOnly && allocatedMarks !== undefined && marksEarned !== undefined && (
                <span> • Marks Secured: <strong className="text-blue-400">{marksEarned}</strong>/{allocatedMarks}</span>
              )}
            </p>
          </div>
        </div>

        {allPassed && (
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-pink-300 bg-pink-950/60 px-3 py-1 rounded-lg border border-pink-500/40">
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span>Problem Solved</span>
          </div>
        )}
      </div>

      {/* Test Case Cards */}
      <div className="space-y-2.5">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
          <span>Test Case Breakdown {isRunOnly ? '(Sample Cases)' : '(All Cases)'}</span>
          <span className="text-pink-400 font-mono text-[9px]">JAVA JDK 17</span>
        </h4>

        <div className="grid grid-cols-1 gap-2.5">
          {testResults.map((tc, idx) => {
            const isPass = tc.status === 'PASS';

            return (
              <div
                key={tc.id || idx}
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  isPass
                    ? 'bg-[#14171F] border-[#2A2D33] text-[#E0E0E0]'
                    : 'bg-[#14171F] border-red-900/50 text-[#E0E0E0]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 font-mono font-bold text-xs">
                    {isPass ? (
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                    )}
                    <span>
                      Case {idx + 1} {tc.isHidden ? '(Hidden Test)' : '(Visible Sample)'}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider ${
                      isPass
                        ? 'bg-blue-950/60 text-blue-400 border border-blue-800/50'
                        : 'bg-red-950/60 text-red-400 border border-red-800/50'
                    }`}
                  >
                    {tc.status}
                  </span>
                </div>

                {/* Details for visible test cases */}
                {!tc.isHidden ? (
                  <div className="mt-2 space-y-1.5 font-mono text-[11px] bg-[#0A0C10] p-2.5 rounded-lg border border-[#2A2D33]">
                    {tc.input && (
                      <div>
                        <span className="text-slate-400">Input:</span>{' '}
                        <span className="text-pink-300">{tc.input}</span>
                      </div>
                    )}
                    {tc.expectedOutput && (
                      <div>
                        <span className="text-slate-400">Expected Output:</span>{' '}
                        <span className="text-blue-400">{tc.expectedOutput}</span>
                      </div>
                    )}
                    {tc.actualOutput !== undefined && (
                      <div>
                        <span className="text-slate-400">Actual Output:</span>{' '}
                        <span className={isPass ? 'text-blue-400' : 'text-red-400 font-bold'}>
                          {tc.actualOutput || '(Empty Output)'}
                        </span>
                      </div>
                    )}
                    {tc.error && (
                      <div className="mt-1 p-2 rounded-lg bg-red-950/80 text-red-300 text-[11px] whitespace-pre-wrap font-mono border border-red-800/50">
                        {tc.error}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    {isPass
                      ? 'Hidden test case passed successfully.'
                      : 'Hidden test case failed. Details hidden to prevent hardcoding.'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
