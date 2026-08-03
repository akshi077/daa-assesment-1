import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { PROBLEMS } from './data/problems';
import {
  CandidateSession,
  ProblemResult,
  TestCaseResult,
  SubmissionRecord
} from './types';
import { Header } from './components/Header';
import { StartPage } from './components/StartPage';
import { ProblemSidebar } from './components/ProblemSidebar';
import { ProblemDescription } from './components/ProblemDescription';
import { CodeEditor } from './components/CodeEditor';
import { ResultsPanel } from './components/ResultsPanel';
import { WarningModal } from './components/WarningModal';
import { ResultsScreen } from './components/ResultsScreen';
import { AdminPanel } from './components/AdminPanel';
import { PanelLeftClose, PanelLeftOpen, ChevronUp, ChevronDown, Sparkles, Layout } from 'lucide-react';

const STORAGE_KEY = 'daa_assessment_candidate_session_v1';

export default function App() {
  const [screen, setScreen] = useState<'start' | 'assessment' | 'results' | 'admin'>('start');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Candidate session state
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(3000); // 50 minutes
  const [violations, setViolations] = useState<number>(0);

  // Layout Space Toggles for maximum coding area
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);
  const [isResultsCollapsed, setIsResultsCollapsed] = useState(false);

  // Active problem & code per problem
  const [activeProblemId, setActiveProblemId] = useState<string>(PROBLEMS[0].id);
  const [codePerProblem, setCodePerProblem] = useState<Record<string, string>>({
    'merge-sorted-array': PROBLEMS[0].starterTemplate,
    'binary-search': PROBLEMS[1].starterTemplate,
    'matrix-multiplication': PROBLEMS[2].starterTemplate
  });

  const [problemResults, setProblemResults] = useState<Record<string, ProblemResult>>({});
  const [activeRunResults, setActiveRunResults] = useState<{
    results: TestCaseResult[];
    passedCount: number;
    totalCount: number;
    isRunOnly: boolean;
  } | null>(null);

  // Status flags
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmittingProblem, setIsSubmittingProblem] = useState(false);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [finalSubmissionRecord, setFinalSubmissionRecord] = useState<SubmissionRecord | null>(null);

  const timerRef = useRef<any>(null);

  // Check URL path or restores saved session on mount
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setScreen('admin');
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: CandidateSession = JSON.parse(saved);
        if (parsed && parsed.rollNo && !parsed.isSubmitted) {
          const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
          const remaining = Math.max(0, 3000 - elapsed);

          if (remaining > 0) {
            setRollNo(parsed.rollNo);
            setName(parsed.name);
            setStartTime(parsed.startTime);
            setTimeLeft(remaining);
            setViolations(parsed.violations || 0);
            if (parsed.codePerProblem) setCodePerProblem(parsed.codePerProblem);
            if (parsed.problemResults) setProblemResults(parsed.problemResults);
            setScreen('assessment');
          } else {
            // Timer expired while away -> clear expired draft
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (e) {
      console.error('Error restoring session:', e);
    }
  }, []);

  // Sync session to localStorage periodically
  useEffect(() => {
    if (screen === 'assessment' && rollNo && startTime) {
      const sessionData: CandidateSession = {
        rollNo,
        name,
        startTime,
        violations,
        codePerProblem,
        problemResults,
        isSubmitted: false
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    }
  }, [screen, rollNo, name, startTime, violations, codePerProblem, problemResults]);

  // Handle final submission logic
  const handleFinalSubmit = useCallback(async () => {
    if (isSubmittingFinal) return;
    setIsSubmittingFinal(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const elapsedSeconds = startTime ? Math.min(3000, Math.floor((Date.now() - startTime) / 1000)) : 3000;

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rollNo,
          name,
          codePerProblem,
          violations,
          timeTakenSeconds: elapsedSeconds
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.submission) {
        setFinalSubmissionRecord(data.submission);
        localStorage.removeItem(STORAGE_KEY);
        setScreen('results');
        window.history.pushState(null, '', '/results');
      } else {
        alert(`Submission failed: ${data.error || 'Server error'}. Retrying...`);
        setIsSubmittingFinal(false);
      }
    } catch (err: any) {
      console.error('Final submit error:', err);
      alert('Network error submitting assessment. Please click retry.');
      setIsSubmittingFinal(false);
    }
  }, [rollNo, name, codePerProblem, violations, startTime, isSubmittingFinal]);

  // Countdown timer effect
  useEffect(() => {
    if (screen === 'assessment' && startTime) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, 3600 - elapsed);
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(timerRef.current);
          handleFinalSubmit();
        }
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [screen, startTime, handleFinalSubmit]);

  // Anti-cheating listeners: Tab blur / window blur detection
  const triggerViolation = useCallback(() => {
    setViolations((prev) => {
      const nextCount = prev + 1;
      setShowWarningModal(true);

      // Sync to backend
      fetch('/api/violations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNo, violations: nextCount })
      }).catch(() => {});

      if (nextCount >= 3) {
        setTimeout(() => {
          handleFinalSubmit();
        }, 1500);
      }
      return nextCount;
    });
  }, [rollNo, handleFinalSubmit]);

  useEffect(() => {
    if (screen !== 'assessment') return;

    const handleWindowBlur = () => {
      triggerViolation();
    };

    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [screen, triggerViolation]);

  // Start Assessment handler
  const handleStartAssessment = (inputRollNo: string, inputName: string) => {
    const now = Date.now();
    setRollNo(inputRollNo);
    setName(inputName);
    setStartTime(now);
    setTimeLeft(3000);
    setViolations(0);
    setScreen('assessment');
    window.history.pushState(null, '', '/assessment');
  };

  // Active Problem Code Change
  const handleCodeChange = (newCode: string) => {
    setCodePerProblem((prev) => ({
      ...prev,
      [activeProblemId]: newCode
    }));
  };

  // Run Sample Cases
  const handleRunSamples = async () => {
    setIsRunning(true);
    const code = codePerProblem[activeProblemId] || '';

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: activeProblemId, code })
      });
      const data = await res.json();

      if (res.ok) {
        setActiveRunResults({
          results: data.testCaseResults,
          passedCount: data.passedCount,
          totalCount: data.totalCount,
          isRunOnly: true
        });
      } else {
        alert(`Run error: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Network error during run: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Problem
  const handleSubmitProblem = async () => {
    setIsSubmittingProblem(true);
    const code = codePerProblem[activeProblemId] || '';

    try {
      const res = await fetch('/api/submit-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: activeProblemId, code })
      });
      const data = await res.json();

      if (res.ok) {
        setActiveRunResults({
          results: data.testCaseResults,
          passedCount: data.passedCount,
          totalCount: data.totalCount,
          isRunOnly: false
        });

        if (data.passedCount === data.totalCount && data.totalCount > 0) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        const currentProb = PROBLEMS.find((p) => p.id === activeProblemId);
        const allocated = currentProb ? currentProb.allocatedMarks : 15;

        const probResult: ProblemResult = {
          problemId: activeProblemId,
          code,
          passedCount: data.passedCount,
          totalCount: data.totalCount,
          marksEarned: data.marksEarned,
          allocatedMarks: allocated,
          testCaseResults: data.testCaseResults,
          status: data.passedCount === data.totalCount ? 'SOLVED' : 'ATTEMPTED'
        };

        setProblemResults((prev) => ({
          ...prev,
          [activeProblemId]: probResult
        }));
      } else {
        alert(`Judge error: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Network error judging problem: ${err.message}`);
    } finally {
      setIsSubmittingProblem(false);
    }
  };

  // Next problem navigation
  const activeProblemIndex = PROBLEMS.findIndex((p) => p.id === activeProblemId);
  const isLastProblem = activeProblemIndex === PROBLEMS.length - 1;

  const handleNextProblem = () => {
    if (!isLastProblem) {
      const nextProb = PROBLEMS[activeProblemIndex + 1];
      setActiveProblemId(nextProb.id);
      setActiveRunResults(null);
    }
  };

  // Exit handler
  const handleExitAssessment = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRollNo('');
    setName('');
    setStartTime(null);
    setTimeLeft(3600);
    setViolations(0);
    setProblemResults({});
    setFinalSubmissionRecord(null);
    setScreen('start');
    window.history.replaceState(null, '', '/');
  };

  // Calculate total marks earned across all 3 problems
  const totalMarksEarned = (Object.values(problemResults) as ProblemResult[]).reduce(
    (acc, curr) => acc + (curr.marksEarned || 0),
    0
  );

  const solvedCount = (Object.values(problemResults) as ProblemResult[]).filter(
    (r) => r.status === 'SOLVED'
  ).length;

  const currentProblem = PROBLEMS.find((p) => p.id === activeProblemId) || PROBLEMS[0];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Screen 1: Start Page */}
      {screen === 'start' && (
        <StartPage
          onStartAssessment={handleStartAssessment}
          onOpenAdmin={() => {
            setScreen('admin');
            window.history.pushState(null, '', '/admin');
          }}
        />
      )}

      {/* Screen 2: Assessment Workspace */}
      {screen === 'assessment' && (
        <div className="flex flex-col h-screen overflow-hidden">
          <Header
            rollNo={rollNo}
            name={name}
            timeLeftSeconds={timeLeft}
            violations={violations}
            solvedCount={solvedCount}
            totalProblems={PROBLEMS.length}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onSubmitAll={handleFinalSubmit}
            isSubmitting={isSubmittingFinal}
          />

          {/* Quick Space Control Bar */}
          <div className="h-8 bg-[#11141B] border-b border-[#2A2D33] px-4 flex items-center justify-between text-xs text-slate-300 shrink-0 z-20">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden sm:inline">Workspace Controls:</span>
              <button
                onClick={() => setIsDescriptionCollapsed(!isDescriptionCollapsed)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#1D2128] hover:bg-[#2B2F3A] text-pink-300 font-semibold text-[11px] border border-[#2B2F3A] transition-colors cursor-pointer"
              >
                {isDescriptionCollapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
                <span>{isDescriptionCollapsed ? 'Show Problem Description' : 'Expand Code Space (Hide Description)'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsResultsCollapsed(!isResultsCollapsed)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#1D2128] hover:bg-[#2B2F3A] text-blue-300 font-semibold text-[11px] border border-[#2B2F3A] transition-colors cursor-pointer"
              >
                {isResultsCollapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                <span>{isResultsCollapsed ? 'Expand Test Console' : 'Maximize Editor Height (Minimize Console)'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Problem Navigation Sidebar */}
            <ProblemSidebar
              problems={PROBLEMS}
              activeProblemId={activeProblemId}
              onSelectProblem={(id) => {
                setActiveProblemId(id);
                setActiveRunResults(null);
              }}
              problemResults={problemResults}
              totalMarksEarned={totalMarksEarned}
              isDarkMode={isDarkMode}
            />

            {/* Main Workspace Split View */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
              {/* Problem Statement Panel (Collapsible) */}
              {!isDescriptionCollapsed && (
                <div className="w-full md:w-1/2 overflow-y-auto border-r border-slate-200 dark:border-slate-800 transition-all">
                  <ProblemDescription problem={currentProblem} isDarkMode={isDarkMode} />
                </div>
              )}

              {/* Code Editor & Test Results Panel (Expands to 100% width when description is collapsed) */}
              <div className={`flex flex-col overflow-hidden transition-all ${isDescriptionCollapsed ? 'w-full' : 'w-full md:w-1/2'}`}>
                {/* Editor */}
                <div className="flex-1 min-h-[300px]">
                  <CodeEditor
                    code={codePerProblem[activeProblemId] || ''}
                    onChangeCode={handleCodeChange}
                    starterTemplate={currentProblem.starterTemplate}
                    onRun={handleRunSamples}
                    onSubmitProblem={handleSubmitProblem}
                    onNextProblem={handleNextProblem}
                    onViolationAttempt={triggerViolation}
                    isRunning={isRunning}
                    isSubmittingProblem={isSubmittingProblem}
                    isLastProblem={isLastProblem}
                    isDarkMode={isDarkMode}
                    isExpanded={isDescriptionCollapsed}
                    onToggleExpand={() => setIsDescriptionCollapsed(!isDescriptionCollapsed)}
                  />
                </div>

                {/* Judge Results Panel (Collapsible for Max Height) */}
                <div className={`border-t border-slate-200 dark:border-slate-800 overflow-y-auto bg-slate-900/40 transition-all ${isResultsCollapsed ? 'h-9 overflow-hidden' : 'h-64'}`}>
                  {isResultsCollapsed ? (
                    <button
                      onClick={() => setIsResultsCollapsed(false)}
                      className="w-full h-full px-4 flex items-center justify-between text-xs font-mono text-slate-300 hover:text-white bg-[#11141B] cursor-pointer"
                    >
                      <span>Test Results Console (Click to Expand)</span>
                      <ChevronUp className="h-4 w-4 text-blue-400" />
                    </button>
                  ) : (
                    <ResultsPanel
                      testResults={activeRunResults ? activeRunResults.results : null}
                      passedCount={activeRunResults ? activeRunResults.passedCount : 0}
                      totalCount={activeRunResults ? activeRunResults.totalCount : 0}
                      marksEarned={problemResults[activeProblemId]?.marksEarned}
                      allocatedMarks={currentProblem.allocatedMarks}
                      isDarkMode={isDarkMode}
                      isRunOnly={activeRunResults?.isRunOnly}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 3: Results View */}
      {screen === 'results' && finalSubmissionRecord && (
        <ResultsScreen submission={finalSubmissionRecord} onExit={handleExitAssessment} />
      )}

      {/* Screen 4: Admin View */}
      {screen === 'admin' && (
        <AdminPanel
          onBackToHome={() => {
            setScreen('start');
            window.history.pushState(null, '', '/');
          }}
        />
      )}

      {/* Cheating Warning Modal */}
      {showWarningModal && (
        <WarningModal
          violationCount={violations}
          maxViolations={3}
          onClose={() => setShowWarningModal(false)}
        />
      )}
    </div>
  );
}
