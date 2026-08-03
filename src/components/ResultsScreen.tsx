import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { SubmissionRecord } from '../types';
import { Award, CheckCircle, Shield, Clock, Zap, Target, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';
import { playFanfareSound } from '../utils/sound';

interface ResultsScreenProps {
  submission: SubmissionRecord;
  onExit: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ submission, onExit }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    playFanfareSound();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Score count-up animation
    const target = submission.totalScore;
    if (target === 0) {
      setAnimatedScore(0);
      return;
    }

    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(interval);
      } else {
        setAnimatedScore(current);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [submission.totalScore]);

  // Achievement Badges evaluation
  const isSpeedSolver = submission.timeTakenSeconds < 2700; // finished with > 15 min left (less than 45 min taken)
  const isPerfectionist = submission.totalScore === 50;
  const isCleanRecord = submission.violations === 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-3xl mx-auto w-full my-auto space-y-8 py-8">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>Assessment Successfully Submitted</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            DAA Assessment Results
          </h1>
          <p className="text-slate-400 text-sm">
            Candidate: <span className="text-slate-200 font-semibold">{submission.name}</span> ({submission.rollNo})
          </p>
        </div>

        {/* Score Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            Final Score
          </p>
          <div className="text-6xl sm:text-7xl font-black tracking-tight text-white my-2 font-mono">
            {animatedScore} <span className="text-2xl text-slate-500 font-normal">/ 50</span>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            Submitted at {submission.submittedAt}
          </p>
        </div>

        {/* Marks Breakdown Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Per-Problem Marks Allocation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Problem 1 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <p className="text-xs text-slate-400 font-medium">Merge Sorted Array</p>
              <p className="text-2xl font-extrabold text-indigo-400 font-mono">
                {submission.mergeSortMarks} <span className="text-xs font-normal text-slate-500">/ 15</span>
              </p>
              <p className="text-[10px] text-slate-500">
                {submission.problemResults['merge-sorted-array']?.passedCount || 0}/5 Cases Passed
              </p>
            </div>

            {/* Problem 2 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <p className="text-xs text-slate-400 font-medium">Binary Search</p>
              <p className="text-2xl font-extrabold text-indigo-400 font-mono">
                {submission.binarySearchMarks} <span className="text-xs font-normal text-slate-500">/ 15</span>
              </p>
              <p className="text-[10px] text-slate-500">
                {submission.problemResults['binary-search']?.passedCount || 0}/5 Cases Passed
              </p>
            </div>

            {/* Problem 3 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <p className="text-xs text-slate-400 font-medium">Matrix Multiplication</p>
              <p className="text-2xl font-extrabold text-indigo-400 font-mono">
                {submission.matrixMultMarks} <span className="text-xs font-normal text-slate-500">/ 20</span>
              </p>
              <p className="text-[10px] text-slate-500">
                {submission.problemResults['matrix-multiplication']?.passedCount || 0}/5 Cases Passed
              </p>
            </div>
          </div>
        </div>

        {/* Stats & Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Time & Violations Summary */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assessment Summary
            </h4>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-400" />
                <span>Time Taken:</span>
              </span>
              <span className="font-mono font-bold text-slate-200">
                {submission.timeTakenFormatted}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-amber-400" />
                <span>Cheating Violations:</span>
              </span>
              <span className="font-mono font-bold text-slate-200">
                {submission.violations} / 3 Warnings
              </span>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Achievement Badges
            </h4>
            <div className="flex flex-wrap gap-2">
              {isSpeedSolver && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Zap className="h-3.5 w-3.5" />
                  <span>⚡ Speed Solver</span>
                </span>
              )}
              {isPerfectionist && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                  <Target className="h-3.5 w-3.5" />
                  <span>🎯 Perfectionist</span>
                </span>
              )}
              {isCleanRecord && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>🛡️ Clean Record</span>
                </span>
              )}
              {!isSpeedSolver && !isPerfectionist && !isCleanRecord && (
                <span className="text-xs text-slate-500">Completed Assessment</span>
              )}
            </div>
          </div>
        </div>

        {/* Exit Button - CRITICAL REQUIREMENTS satisfied */}
        <div className="pt-4 text-center">
          <button
            onClick={onExit}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 mx-auto transition-all cursor-pointer active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            <span>Exit & End Session</span>
          </button>
          <p className="text-[11px] text-slate-500 mt-2">
            Clicking exit clears your candidate session and returns to the home screen.
          </p>
        </div>
      </div>
    </div>
  );
};
