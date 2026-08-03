import React, { useEffect } from 'react';
import { ShieldAlert, AlertTriangle, X } from 'lucide-react';
import { playWarningSound } from '../utils/sound';

interface WarningModalProps {
  violationCount: number;
  maxViolations: number;
  onClose: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({
  violationCount,
  maxViolations,
  onClose
}) => {
  useEffect(() => {
    playWarningSound();
  }, []);

  const isFinalWarning = violationCount >= maxViolations;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20 animate-bounce">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-100">
            Warning [{violationCount}/{maxViolations}]
          </h3>
          <p className="text-sm text-amber-300 font-semibold mt-1">
            Copy-paste is not allowed during this assessment.
          </p>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          {isFinalWarning
            ? 'You have reached the maximum allowed anti-cheating warnings. Your assessment is being automatically submitted now.'
            : `Attempting to copy, paste, cut, or switch windows is monitored. Reaching ${maxViolations} warnings will automatically submit your test.`}
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95"
        >
          {isFinalWarning ? 'Proceeding to Final Submission' : 'I Understand & Acknowledge'}
        </button>
      </div>
    </div>
  );
};
