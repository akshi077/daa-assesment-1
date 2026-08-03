import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Play, Send, RotateCcw, ArrowRight, ShieldAlert, Maximize2, Minimize2, Sparkles, Code } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  starterTemplate: string;
  onRun: () => void;
  onSubmitProblem: () => void;
  onNextProblem: () => void;
  onViolationAttempt: () => void;
  isRunning: boolean;
  isSubmittingProblem: boolean;
  isLastProblem: boolean;
  isDarkMode: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChangeCode,
  starterTemplate,
  onRun,
  onSubmitProblem,
  onNextProblem,
  onViolationAttempt,
  isRunning,
  isSubmittingProblem,
  isLastProblem,
  isDarkMode,
  isExpanded = false,
  onToggleExpand
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Intercept keyboard copy / paste / cut shortcuts in Monaco
    editor.onKeyDown((e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      // KeyCodes: KeyC = 33, KeyV = 52, KeyX = 54
      if (isCtrlOrCmd && (e.keyCode === monaco.KeyCode.KeyC || e.keyCode === monaco.KeyCode.KeyV || e.keyCode === monaco.KeyCode.KeyX)) {
        e.preventDefault();
        e.stopPropagation();
        onViolationAttempt();
      }
    });

    // Disable right click context menu inside editor container
    const domNode = editor.getDomNode();
    if (domNode) {
      domNode.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        onViolationAttempt();
      });
      domNode.addEventListener('copy', (e) => {
        e.preventDefault();
        onViolationAttempt();
      });
      domNode.addEventListener('paste', (e) => {
        e.preventDefault();
        onViolationAttempt();
      });
      domNode.addEventListener('cut', (e) => {
        e.preventDefault();
        onViolationAttempt();
      });
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset code to starter template? Your current edits for this problem will be replaced.')) {
      onChangeCode(starterTemplate);
    }
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  // Code Stats
  const lineCount = code.split('\n').length;
  const charCount = code.length;

  return (
    <div className="flex flex-col h-full bg-[#0A0C10] text-[#E0E0E0] border-l border-[#2A2D33] relative">
      {/* Editor Header Tab Bar */}
      <div className="h-10 px-4 bg-[#11141B] border-b border-[#2A2D33] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500/50" />
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
          </div>
          <div className="flex items-center gap-2 ml-2 px-2.5 py-0.5 rounded bg-[#1A1D26] border border-[#2B2F3A]">
            <Code className="h-3.5 w-3.5 text-pink-400" />
            <span className="text-xs font-mono text-slate-200 font-semibold">Solution.java</span>
            <span className="text-[9px] font-bold text-pink-400 bg-pink-950/60 px-1.5 rounded uppercase">JDK 17</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Format Document */}
          <button
            onClick={handleFormatCode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1D2128] hover:bg-[#2B2F3A] text-slate-300 hover:text-white text-xs font-mono border border-[#2B2F3A] transition-colors cursor-pointer"
            title="Auto-format Java code"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline">Format</span>
          </button>

          {/* Reset Template */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1D2128] hover:bg-[#2B2F3A] text-slate-300 hover:text-white text-xs font-mono border border-[#2B2F3A] transition-colors cursor-pointer"
            title="Reset to starter template"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Code</span>
          </button>

          {/* Expand Workspace Toggle */}
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-pink-950/50 hover:bg-pink-900/60 text-pink-300 text-xs font-mono border border-pink-800/50 transition-colors cursor-pointer"
              title={isExpanded ? 'Restore side panels' : 'Maximize code editor workspace'}
            >
              {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              <span className="font-bold">{isExpanded ? 'Exit Fullspace' : 'Expand Space'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 min-h-[280px] relative select-none bg-[#101217]">
        <Editor
          height="100%"
          defaultLanguage="java"
          theme="vs-dark"
          value={code}
          onChange={(val) => onChangeCode(val || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            contextmenu: false,
            tabSize: 4,
            insertSpaces: true,
            lineNumbers: 'on',
            folding: true,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>

      {/* Editor Footer Action & Stats Bar */}
      <div className="p-2.5 bg-[#11141B] border-t border-[#2A2D33] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
          <span className="bg-[#1D2128] px-2 py-0.5 rounded border border-[#2B2F3A]">
            Lines: <strong className="text-pink-400">{lineCount}</strong>
          </span>
          <span className="bg-[#1D2128] px-2 py-0.5 rounded border border-[#2B2F3A]">
            Chars: <strong className="text-blue-400">{charCount}</strong>
          </span>
          <span className="hidden lg:inline text-slate-500">
            Press "Run Samples" to check inputs • "Submit Problem" to evaluate test cases
          </span>
        </div>

        <div className="flex items-center gap-2.5 ml-auto">
          {/* Run Button */}
          <button
            onClick={onRun}
            disabled={isRunning || isSubmittingProblem}
            className="flex items-center gap-2 px-3.5 h-8 rounded-lg bg-[#1D2128] hover:bg-[#2B2F3A] border border-[#2B2F3A] text-slate-200 font-bold text-[10px] uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <>
                <div className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                <span>RUNNING...</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                <span>RUN SAMPLES</span>
              </>
            )}
          </button>

          {/* Submit Problem Button */}
          <button
            onClick={onSubmitProblem}
            disabled={isRunning || isSubmittingProblem}
            className="flex items-center gap-2 px-4 h-8 rounded-lg bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:to-blue-500 text-white font-bold text-[10px] uppercase tracking-wider transition-all shadow-md shadow-pink-900/30 disabled:opacity-50 cursor-pointer"
          >
            {isSubmittingProblem ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>JUDGING...</span>
              </>
            ) : (
              <>
                <Send className="h-3 w-3" />
                <span>SUBMIT PROBLEM</span>
              </>
            )}
          </button>

          {/* Next Problem Button */}
          {!isLastProblem && (
            <button
              onClick={onNextProblem}
              className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-[#1D2128] hover:bg-[#2B2F3A] border border-blue-500/40 text-blue-400 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>NEXT</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

