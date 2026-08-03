import React, { useState, useEffect } from 'react';
import { Code2, ArrowRight, Shield, BookOpen, AlertCircle, Lock, Cpu } from 'lucide-react';
import heroImage from '../assets/images/college_students_lab_1785574455411.jpg';

interface StartPageProps {
  onStartAssessment: (rollNo: string, name: string) => void;
  onOpenAdmin: () => void;
}

export const StartPage: React.FC<StartPageProps> = ({ onStartAssessment, onOpenAdmin }) => {
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [rollNoError, setRollNoError] = useState('');
  const [nameError, setNameError] = useState('');
  const [typewriterText, setTypewriterText] = useState('');

  const fullText = "Welcome to DAA Assessment Platform";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypewriterText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 45);
    return () => clearInterval(timer);
  }, []);

  // Roll No Pattern Validation: YYYY-DEPT-NNN
  const validateRollNo = (val: string) => {
    const pattern = /^\d{4}-[A-Za-z0-9]+-\d{1,4}$/;
    if (!val) {
      setRollNoError('Roll number is required');
      return false;
    }
    if (!pattern.test(val.trim())) {
      setRollNoError('Pattern must be YYYY-DEPT-NNN (e.g. 2024-CSBS-108)');
      return false;
    }
    setRollNoError('');
    return true;
  };

  const validateName = (val: string) => {
    if (!val || val.trim().length < 2) {
      setNameError('Please enter candidate full name');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleRollNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRollNo(val);
    if (val) validateRollNo(val);
    else setRollNoError('');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (val) validateName(val);
    else setNameError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isRollValid = validateRollNo(rollNo);
    const isNameValid = validateName(name);

    if (isRollValid && isNameValid) {
      onStartAssessment(rollNo.trim(), name.trim());
    }
  };

  const isFormValid = rollNo.trim() !== '' && name.trim() !== '' && !rollNoError && !nameError;

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-pink-500 selection:text-white">
      {/* Animated Gradient Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(236,72,153,0.25),rgba(59,130,246,0.15))]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 p-0.5 shadow-lg shadow-pink-500/30">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Code2 className="h-6 w-6 text-pink-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400">
              DAA Assessment
            </span>
            <span className="hidden sm:inline-block text-[10px] text-pink-400/80 font-mono ml-2 font-semibold uppercase tracking-widest bg-pink-950/60 px-2 py-0.5 rounded border border-pink-800/40">
              Department of CSBS
            </span>
          </div>
        </div>

        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-pink-500/30 hover:border-pink-500/60 text-slate-300 hover:text-pink-300 text-xs font-semibold transition-all cursor-pointer backdrop-blur shadow-md shadow-pink-500/10"
        >
          <Lock className="h-3.5 w-3.5 text-pink-400" />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* Hero Section with AI College Students Banner Image */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-4 pb-12">
        {/* Top AI Image Banner Frame */}
        <div className="relative rounded-3xl overflow-hidden border border-pink-500/30 shadow-2xl shadow-pink-500/15 mb-12 group">
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
            <img
              src={heroImage}
              alt="AI College Students Coding Laboratory"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.85] contrast-[1.05]"
            />
            {/* Subtle Gradient Overlays for High Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />

            {/* Banner Floating Badges */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-blue-500/50 text-blue-300 text-xs font-bold backdrop-blur shadow-lg">
                <Cpu className="h-3.5 w-3.5 text-blue-400" />
                <span>Java OpenJDK 17 Judge</span>
              </span>
            </div>

            {/* Banner Bottom Caption & Stats */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
              <div className="max-w-xl">
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                  Practical Exam: Design & Analysis of Algorithms
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium leading-relaxed drop-shadow">
                  Solve real algorithm challenges under live test-case verification and strict proctoring supervision.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-2xl border border-pink-500/30 text-xs font-mono shrink-0">
                <div className="text-center px-2.5">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Problems</span>
                  <span className="text-sm font-black text-pink-400">3 Challenges</span>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div className="text-center px-2.5">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Max Marks</span>
                  <span className="text-sm font-black text-blue-400">50 Marks</span>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div className="text-center px-2.5">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
                  <span className="text-sm font-black text-amber-400">50 Mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content & Registration Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Typewriter Title */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {/* Subject Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold w-fit">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span>DAA Algorithms Practical Examination • Department of CSBS</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight min-h-[3.5rem] bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-200 to-blue-300 leading-tight">
              {typewriterText}
              <span className="animate-pulse text-pink-400">|</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Welcome candidates! Prepare your logic and code efficiently. You will write Java implementations for standard algorithm paradigms under live test-case verification and proctoring supervision.
            </p>
          </div>

          {/* Right Side: Candidate Registration Form Card */}
          <div className="lg:col-span-5">
            <div className="w-full bg-slate-900/95 border border-pink-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-pink-500/15 backdrop-blur-xl text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-bl-full pointer-events-none" />

              <div className="mb-6">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400 bg-pink-950/60 px-2.5 py-1 rounded border border-pink-800/50">
                  Candidate Login
                </span>
                <h2 className="text-xl font-black text-white mt-2">Enter Candidate Details</h2>
                <p className="text-xs text-slate-400 mt-1">Please enter your official college roll number to start.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Roll No */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Roll Number <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={handleRollNoChange}
                    placeholder="e.g. 2024-CSBS-108"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                      rollNoError ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-800 focus:border-pink-500 focus:ring-pink-500'
                    } text-slate-100 placeholder-slate-600 text-sm font-mono focus:outline-none focus:ring-2 transition-all`}
                  />
                  {rollNoError && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-mono">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{rollNoError}</span>
                    </p>
                  )}
                </div>

                {/* Student Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Candidate Name <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. Asmita"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                      nameError ? 'border-red-500/80 focus:ring-red-500' : 'border-slate-800 focus:border-pink-500 focus:ring-pink-500'
                    } text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 transition-all`}
                  />
                  {nameError && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-mono">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{nameError}</span>
                    </p>
                  )}
                </div>

                {/* Assessment Rules */}
                <div className="p-4 rounded-xl bg-pink-950/30 border border-pink-900/50 text-xs text-pink-200/90 space-y-2">
                  <div className="flex items-center gap-2 text-pink-300 font-bold">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span>Exam Regulations</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                    <li>Duration: <strong>50 Minutes</strong> (Timer starts immediately)</li>
                    <li>Anti-Cheating: <strong>3 Violations</strong> auto-submits exam</li>
                    <li>Write Java code in <code className="text-pink-300 font-mono">class Solution</code></li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 text-white font-black text-sm shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                >
                  <span>Begin Exam Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs text-slate-500 border-t border-slate-900">
        DAA Assessment Platform • Powered by Java OpenJDK Online Judge Engine
      </div>
    </div>
  );
};

