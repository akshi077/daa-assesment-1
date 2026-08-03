import fs from 'fs';
import path from 'path';
import os from 'os';
import vm from 'vm';
import { execFile } from 'child_process';
import { PROBLEMS } from '../src/data/problems';
import { TestCaseResult } from '../src/types';

const JAVAC_CMD = fs.existsSync('/usr/lib/jvm/java-17-openjdk-amd64/bin/javac')
  ? '/usr/lib/jvm/java-17-openjdk-amd64/bin/javac'
  : 'javac';

const JAVA_CMD = fs.existsSync('/usr/lib/jvm/java-17-openjdk-amd64/bin/java')
  ? '/usr/lib/jvm/java-17-openjdk-amd64/bin/java'
  : 'java';

let javaAvailableCache: boolean | null = null;

function execPromise(
  cmd: string,
  args: string[],
  options: { cwd: string; timeout: number }
): Promise<{ stdout: string; stderr: string; error?: Error; code?: number }> {
  const env = {
    ...process.env,
    PATH: `/usr/lib/jvm/java-17-openjdk-amd64/bin:${process.env.PATH || ''}`
  };

  return new Promise((resolve) => {
    try {
      execFile(cmd, args, { ...options, env }, (err, stdout, stderr) => {
        resolve({
          stdout: stdout || '',
          stderr: stderr || '',
          error: err || undefined,
          code: err ? (err as any).code : 0
        });
      });
    } catch (err: any) {
      resolve({
        stdout: '',
        stderr: err ? err.message : '',
        error: err || new Error('Command execution failed'),
        code: -1
      });
    }
  });
}

async function checkIsJavaAvailable(): Promise<boolean> {
  if (javaAvailableCache !== null) return javaAvailableCache;
  try {
    const res = await execPromise(JAVAC_CMD, ['-version'], { cwd: os.tmpdir(), timeout: 2000 });
    javaAvailableCache = !res.error && res.code === 0;
  } catch (e) {
    javaAvailableCache = false;
  }
  return javaAvailableCache;
}

function normalizeOutput(out: string): string {
  if (!out) return '';
  return out
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .replace(/\[\s+/g, '[')
    .replace(/\s+\]/g, ']')
    .replace(/\,\s+/g, ', ');
}

function generateMainJava(problemId: string): string {
  if (problemId === 'merge-sorted-array') {
    return `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        if (args.length == 0) return;
        int caseNum = Integer.parseInt(args[0]);
        switch (caseNum) {
            case 1: {
                int[] nums1 = new int[]{1, 2, 3, 0, 0, 0};
                int m = 3;
                int[] nums2 = new int[]{2, 5, 6};
                int n = 3;
                Solution.merge(nums1, m, nums2, n);
                System.out.println(Arrays.toString(nums1));
                break;
            }
            case 2: {
                int[] nums1 = new int[]{1};
                int m = 1;
                int[] nums2 = new int[]{};
                int n = 0;
                Solution.merge(nums1, m, nums2, n);
                System.out.println(Arrays.toString(nums1));
                break;
            }
            case 3: {
                int[] nums1 = new int[]{0};
                int m = 0;
                int[] nums2 = new int[]{1};
                int n = 1;
                Solution.merge(nums1, m, nums2, n);
                System.out.println(Arrays.toString(nums1));
                break;
            }
            case 4: {
                int[] nums1 = new int[]{4, 5, 6, 0, 0, 0};
                int m = 3;
                int[] nums2 = new int[]{1, 2, 3};
                int n = 3;
                Solution.merge(nums1, m, nums2, n);
                System.out.println(Arrays.toString(nums1));
                break;
            }
            case 5: {
                int[] nums1 = new int[]{0, 0, 0, 0};
                int m = 0;
                int[] nums2 = new int[]{1, 2, 3, 4};
                int n = 4;
                Solution.merge(nums1, m, nums2, n);
                System.out.println(Arrays.toString(nums1));
                break;
            }
        }
    }
}`;
  }

  if (problemId === 'binary-search') {
    return `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        if (args.length == 0) return;
        int caseNum = Integer.parseInt(args[0]);
        switch (caseNum) {
            case 1: {
                int[] arr = new int[]{1, 3, 5, 7, 9, 11};
                int target = 7;
                System.out.println(Solution.binarySearch(arr, target));
                break;
            }
            case 2: {
                int[] arr = new int[]{2, 4, 6, 8};
                int target = 5;
                System.out.println(Solution.binarySearch(arr, target));
                break;
            }
            case 3: {
                int[] arr = new int[]{10};
                int target = 10;
                System.out.println(Solution.binarySearch(arr, target));
                break;
            }
            case 4: {
                int[] arr = new int[]{};
                int target = 1;
                System.out.println(Solution.binarySearch(arr, target));
                break;
            }
            case 5: {
                int[] arr = new int[]{1, 2, 3, 4, 5};
                int target = 1;
                System.out.println(Solution.binarySearch(arr, target));
                break;
            }
        }
    }
}`;
  }

  if (problemId === 'matrix-multiplication') {
    return `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        if (args.length == 0) return;
        int caseNum = Integer.parseInt(args[0]);
        switch (caseNum) {
            case 1: {
                int[][] A = new int[][]{{1, 2}, {3, 4}};
                int[][] B = new int[][]{{5, 6}, {7, 8}};
                int[][] res = Solution.multiply(A, B);
                System.out.println(Arrays.deepToString(res));
                break;
            }
            case 2: {
                int[][] A = new int[][]{{1, 0}, {0, 1}};
                int[][] B = new int[][]{{2, 3}, {4, 5}};
                int[][] res = Solution.multiply(A, B);
                System.out.println(Arrays.deepToString(res));
                break;
            }
            case 3: {
                int[][] A = new int[][]{{1, 2, 3}};
                int[][] B = new int[][]{{1}, {1}, {1}};
                int[][] res = Solution.multiply(A, B);
                System.out.println(Arrays.deepToString(res));
                break;
            }
            case 4: {
                int[][] A = new int[][]{{2}};
                int[][] B = new int[][]{{3}};
                int[][] res = Solution.multiply(A, B);
                System.out.println(Arrays.deepToString(res));
                break;
            }
            case 5: {
                int[][] A = new int[][]{{1, 1}, {1, 1}};
                int[][] B = new int[][]{{1, 1}, {1, 1}};
                int[][] res = Solution.multiply(A, B);
                System.out.println(Arrays.deepToString(res));
                break;
            }
        }
    }
}`;
  }

  return '';
}

// In-Memory JavaScript Fallback Evaluator (used on Vercel Serverless where JDK/javac is absent)
function evaluateJavaInVM(
  problemId: string,
  candidateCode: string,
  testCasesToRun: any[],
  allocatedMarks: number
): {
  passedCount: number;
  totalCount: number;
  marksEarned: number;
  allocatedMarks: number;
  testCaseResults: TestCaseResult[];
} {
  if (!candidateCode || (!candidateCode.includes('Solution') && !candidateCode.includes('class'))) {
    const results: TestCaseResult[] = testCasesToRun.map((tc) => ({
      id: tc.id,
      passed: false,
      input: tc.isHidden ? undefined : tc.input,
      expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
      actualOutput: tc.isHidden ? undefined : '',
      error: tc.isHidden ? undefined : 'Compilation Error:\nClass "Solution" not found in submitted code.',
      isHidden: tc.isHidden,
      status: 'COMPILE_ERROR'
    }));
    return {
      passedCount: 0,
      totalCount: testCasesToRun.length,
      marksEarned: 0,
      allocatedMarks,
      testCaseResults: results
    };
  }

  let jsCode = candidateCode;
  jsCode = jsCode.replace(/package\s+[\w\.]+;/g, '');
  jsCode = jsCode.replace(/import\s+[\w\.\*]+;/g, '');

  jsCode = jsCode.replace(/new\s+int\s*\[\s*([^\]]+)\s*\]\s*\[\s*([^\]]+)\s*\]/g, 'Array.from({length: ($1)}, () => new Array(($2)).fill(0))');
  jsCode = jsCode.replace(/new\s+int\s*\[\s*([^\]]+)\s*\]/g, 'new Array(($1)).fill(0)');
  jsCode = jsCode.replace(/new\s+int\s*\[\s*\]\s*\[\s*\]\s*\{/g, '[');
  jsCode = jsCode.replace(/new\s+int\s*\[\s*\]\s*\{/g, '[');

  jsCode = jsCode.replace(/\b(int|double|float|long|boolean|String|char)\b/g, 'let');
  jsCode = jsCode.replace(/\b(int\[\]|int\[\]\[\]|double\[\]|String\[\])\b/g, 'let');

  jsCode = jsCode.replace(/\bpublic\s+static\s+let\b/g, 'static');
  jsCode = jsCode.replace(/\bpublic\s+let\b/g, '');
  jsCode = jsCode.replace(/\bpublic\s+static\s+void\b/g, 'static');
  jsCode = jsCode.replace(/\bpublic\s+void\b/g, '');
  jsCode = jsCode.replace(/\bstatic\s+void\b/g, 'static');
  jsCode = jsCode.replace(/\bstatic\s+let\b/g, 'static');

  jsCode = jsCode.replace(/System\.out\.println/g, 'console.log');

  let SolutionClass: any;
  try {
    const sandbox: any = {
      console,
      Math,
      Array,
      JSON,
      Solution: undefined
    };
    const context = vm.createContext(sandbox);
    const script = new vm.Script(`
      ${jsCode}
      if (typeof Solution !== 'undefined') {
        globalThis.Solution = Solution;
      }
    `);
    script.runInContext(context, { timeout: 2000 });
    SolutionClass = sandbox.Solution;

    if (!SolutionClass) {
      throw new Error('Solution class definition missing.');
    }
  } catch (err: any) {
    const results: TestCaseResult[] = testCasesToRun.map((tc) => ({
      id: tc.id,
      passed: false,
      input: tc.isHidden ? undefined : tc.input,
      expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
      actualOutput: tc.isHidden ? undefined : '',
      error: tc.isHidden ? undefined : `Compilation / Syntax Error:\n${err.message}`,
      isHidden: tc.isHidden,
      status: 'COMPILE_ERROR'
    }));
    return {
      passedCount: 0,
      totalCount: testCasesToRun.length,
      marksEarned: 0,
      allocatedMarks,
      testCaseResults: results
    };
  }

  const testResults: TestCaseResult[] = [];
  let passedCount = 0;

  for (const tc of testCasesToRun) {
    try {
      let actualVal: any = '';

      if (problemId === 'merge-sorted-array') {
        let nums1: number[] = [1, 2, 3, 0, 0, 0];
        let m = 3;
        let nums2: number[] = [2, 5, 6];
        let n = 3;

        if (tc.id === 'tc1') { nums1 = [1, 2, 3, 0, 0, 0]; m = 3; nums2 = [2, 5, 6]; n = 3; }
        else if (tc.id === 'tc2') { nums1 = [1]; m = 1; nums2 = []; n = 0; }
        else if (tc.id === 'tc3') { nums1 = [0]; m = 0; nums2 = [1]; n = 1; }
        else if (tc.id === 'tc4') { nums1 = [4, 5, 6, 0, 0, 0]; m = 3; nums2 = [1, 2, 3]; n = 3; }
        else if (tc.id === 'tc5') { nums1 = [0, 0, 0, 0]; m = 0; nums2 = [1, 2, 3, 4]; n = 4; }

        if (typeof SolutionClass.merge === 'function') {
          SolutionClass.merge(nums1, m, nums2, n);
        }
        actualVal = JSON.stringify(nums1);
      } else if (problemId === 'binary-search') {
        let arr: number[] = [];
        let target = 0;

        if (tc.id === 'tc1') { arr = [1, 3, 5, 7, 9, 11]; target = 7; }
        else if (tc.id === 'tc2') { arr = [2, 4, 6, 8]; target = 5; }
        else if (tc.id === 'tc3') { arr = [10]; target = 10; }
        else if (tc.id === 'tc4') { arr = []; target = 1; }
        else if (tc.id === 'tc5') { arr = [1, 2, 3, 4, 5]; target = 1; }

        if (typeof SolutionClass.binarySearch === 'function') {
          actualVal = String(SolutionClass.binarySearch(arr, target));
        } else {
          actualVal = '-1';
        }
      } else if (problemId === 'matrix-multiplication') {
        let A: number[][] = [];
        let B: number[][] = [];

        if (tc.id === 'tc1') { A = [[1, 2], [3, 4]]; B = [[5, 6], [7, 8]]; }
        else if (tc.id === 'tc2') { A = [[1, 0], [0, 1]]; B = [[2, 3], [4, 5]]; }
        else if (tc.id === 'tc3') { A = [[1, 2, 3]]; B = [[1], [1], [1]]; }
        else if (tc.id === 'tc4') { A = [[2]]; B = [[3]]; }
        else if (tc.id === 'tc5') { A = [[1, 1], [1, 1]]; B = [[1, 1], [1, 1]]; }

        if (typeof SolutionClass.multiply === 'function') {
          const resMatrix = SolutionClass.multiply(A, B);
          actualVal = JSON.stringify(resMatrix);
        } else {
          actualVal = '[[]]';
        }
      }

      const normActual = normalizeOutput(String(actualVal));
      const normExpected = normalizeOutput(tc.expectedOutput);
      const isPass = normActual === normExpected;

      if (isPass) passedCount++;

      testResults.push({
        id: tc.id,
        passed: isPass,
        input: tc.isHidden ? undefined : tc.input,
        expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
        actualOutput: tc.isHidden ? undefined : normActual,
        error: isPass
          ? undefined
          : tc.isHidden
          ? undefined
          : `Output Mismatch:\nExpected: ${tc.expectedOutput}\nGot: ${normActual}`,
        isHidden: tc.isHidden,
        status: isPass ? 'PASS' : 'FAIL'
      });
    } catch (err: any) {
      testResults.push({
        id: tc.id,
        passed: false,
        input: tc.isHidden ? undefined : tc.input,
        expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
        actualOutput: tc.isHidden ? undefined : '',
        error: tc.isHidden ? undefined : `Runtime Error:\n${err.message}`,
        isHidden: tc.isHidden,
        status: 'RUNTIME_ERROR'
      });
    }
  }

  const marksEarned = Math.round((passedCount / testCasesToRun.length) * allocatedMarks);

  return {
    passedCount,
    totalCount: testCasesToRun.length,
    marksEarned,
    allocatedMarks,
    testCaseResults: testResults
  };
}

export async function judgeCode(
  problemId: string,
  candidateCode: string,
  mode: 'run' | 'submit'
): Promise<{
  passedCount: number;
  totalCount: number;
  marksEarned: number;
  allocatedMarks: number;
  testCaseResults: TestCaseResult[];
}> {
  const problem = PROBLEMS.find((p) => p.id === problemId);
  if (!problem) {
    throw new Error(`Problem ${problemId} not found`);
  }

  const testCasesToRun =
    mode === 'run' ? problem.testCases.filter((tc) => !tc.isHidden) : problem.testCases;

  // Check if Java JDK is available on the system
  const isJavaAvailable = await checkIsJavaAvailable();

  if (!isJavaAvailable) {
    // Fallback to VM evaluator on Vercel or environments without JDK
    return evaluateJavaInVM(problemId, candidateCode, testCasesToRun, problem.allocatedMarks);
  }

  let tempDir = '';
  try {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'daa-judge-'));
    fs.writeFileSync(path.join(tempDir, 'Solution.java'), candidateCode, 'utf8');
    const mainJavaContent = generateMainJava(problemId);
    fs.writeFileSync(path.join(tempDir, 'Main.java'), mainJavaContent, 'utf8');

    // Attempt real compilation with javac
    const compileResult = await execPromise(JAVAC_CMD, ['Solution.java', 'Main.java'], {
      cwd: tempDir,
      timeout: 10000
    });

    const isCompileFailed = compileResult.error || (compileResult.code !== undefined && compileResult.code !== 0);

    if (isCompileFailed) {
      const compileErrMsg =
        compileResult.stderr || compileResult.stdout || (compileResult.error ? compileResult.error.message : 'Compilation failed');

      // If javac failed because executable not found, fallback to VM
      if (compileErrMsg.includes('ENOENT') || compileErrMsg.includes('not found')) {
        return evaluateJavaInVM(problemId, candidateCode, testCasesToRun, problem.allocatedMarks);
      }

      const results: TestCaseResult[] = testCasesToRun.map((tc) => ({
        id: tc.id,
        passed: false,
        input: tc.isHidden ? undefined : tc.input,
        expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
        actualOutput: tc.isHidden ? undefined : '',
        error: tc.isHidden ? undefined : `Compilation Error:\n${compileErrMsg}`,
        isHidden: tc.isHidden,
        status: 'COMPILE_ERROR'
      }));

      return {
        passedCount: 0,
        totalCount: testCasesToRun.length,
        marksEarned: 0,
        allocatedMarks: problem.allocatedMarks,
        testCaseResults: results
      };
    }

    // Run each test case in JVM with 5s timeout
    const testResults: TestCaseResult[] = [];
    let passedCount = 0;

    for (let i = 0; i < testCasesToRun.length; i++) {
      const tc = testCasesToRun[i];
      const caseIndex = problem.testCases.findIndex((t) => t.id === tc.id) + 1;

      const runResult = await execPromise(JAVA_CMD, ['Main', String(caseIndex)], {
        cwd: tempDir,
        timeout: 5000
      });

      if (runResult.error && (runResult.error as any).killed) {
        testResults.push({
          id: tc.id,
          passed: false,
          input: tc.isHidden ? undefined : tc.input,
          expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
          actualOutput: tc.isHidden ? undefined : 'Execution timed out',
          error: tc.isHidden ? undefined : 'Time Limit Exceeded (5s limit)',
          isHidden: tc.isHidden,
          status: 'TIMEOUT'
        });
        continue;
      }

      if (runResult.stderr && (runResult.stderr.includes('Exception') || runResult.stderr.includes('Error'))) {
        testResults.push({
          id: tc.id,
          passed: false,
          input: tc.isHidden ? undefined : tc.input,
          expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
          actualOutput: tc.isHidden ? undefined : '',
          error: tc.isHidden ? undefined : `Runtime Error:\n${runResult.stderr.trim()}`,
          isHidden: tc.isHidden,
          status: 'RUNTIME_ERROR'
        });
        continue;
      }

      const normActual = normalizeOutput(runResult.stdout);
      const normExpected = normalizeOutput(tc.expectedOutput);
      const isPass = normActual === normExpected;

      if (isPass) {
        passedCount++;
      }

      testResults.push({
        id: tc.id,
        passed: isPass,
        input: tc.isHidden ? undefined : tc.input,
        expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
        actualOutput: tc.isHidden ? undefined : normActual,
        error: isPass
          ? undefined
          : tc.isHidden
          ? undefined
          : `Output Mismatch:\nExpected: ${tc.expectedOutput}\nGot: ${normActual}`,
        isHidden: tc.isHidden,
        status: isPass ? 'PASS' : 'FAIL'
      });
    }

    const marksEarned = Math.round((passedCount / problem.testCases.length) * problem.allocatedMarks);

    return {
      passedCount,
      totalCount: testCasesToRun.length,
      marksEarned,
      allocatedMarks: problem.allocatedMarks,
      testCaseResults: testResults
    };
  } catch (err) {
    // Top-level fallback to VM evaluator if disk/process fails
    return evaluateJavaInVM(problemId, candidateCode, testCasesToRun, problem.allocatedMarks);
  } finally {
    if (tempDir) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {
        // ignore clean up error
      }
    }
  }
}

