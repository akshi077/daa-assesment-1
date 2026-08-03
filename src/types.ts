export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  description?: string;
}

export interface TestCaseResult {
  id: string;
  passed: boolean;
  input?: string; // provided only for visible test cases
  expectedOutput?: string; // provided only for visible test cases
  actualOutput?: string; // provided only for visible test cases
  error?: string; // compilation, runtime, or timeout error details
  isHidden: boolean;
  status: 'PASS' | 'FAIL' | 'COMPILE_ERROR' | 'RUNTIME_ERROR' | 'TIMEOUT';
}

export interface Problem {
  id: string;
  title: string;
  allocatedMarks: number;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  starterTemplate: string;
  sampleIO: { input: string; output: string; explanation?: string }[];
  testCases: TestCase[];
}

export interface ProblemResult {
  problemId: string;
  code: string;
  passedCount: number;
  totalCount: number;
  marksEarned: number;
  allocatedMarks: number;
  testCaseResults: TestCaseResult[];
  status: 'SOLVED' | 'ATTEMPTED' | 'UNATTEMPTED';
}

export interface CandidateSession {
  rollNo: string;
  name: string;
  startTime: number; // Unix timestamp in ms
  violations: number;
  codePerProblem: Record<string, string>;
  problemResults: Record<string, ProblemResult>;
  isSubmitted: boolean;
  submittedAt?: string;
  totalScore?: number;
  timeTakenSeconds?: number;
}

export interface SubmissionRecord {
  id: string;
  rollNo: string;
  name: string;
  totalScore: number;
  mergeSortMarks: number;
  binarySearchMarks: number;
  matrixMultMarks: number;
  violations: number;
  timeTakenSeconds: number;
  timeTakenFormatted: string;
  submittedAt: string;
  codePerProblem: Record<string, string>;
  problemResults: Record<string, {
    passedCount: number;
    totalCount: number;
    marksEarned: number;
    testResults: TestCaseResult[];
  }>;
}

export interface AdminStats {
  totalCandidates: number;
  averageScore: number;
  perfectScores: number;
  totalViolations: number;
}
