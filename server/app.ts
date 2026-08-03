import express from 'express';
import { judgeCode } from './judge';
import {
  getAllSubmissionsAsync,
  getSubmissionByRollNoAsync,
  saveOrUpdateSubmissionAsync,
  deleteSubmissionByRollNoAsync,
  generateCSVExportAsync
} from './db';
import { SubmissionRecord } from '../src/types';

export const app = express();

// Enable CORS for Vercel and multi-origin requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Vercel Serverless Body Parser Compatibility:
// Vercel automatically parses JSON bodies prior to function invocation.
// express.json() will hang on consumed streams if re-parsed on Vercel.
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    return next();
  }
  express.json({ limit: '10mb' })(req, res, next);
});

const apiRouter = express.Router();

// API Routes
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Run visible sample test cases
apiRouter.post('/run', async (req, res) => {
  try {
    const { problemId, code } = req.body || {};
    if (!problemId || typeof code !== 'string') {
      res.status(400).json({ error: 'Missing problemId or code' });
      return;
    }

    const result = await judgeCode(problemId, code, 'run');
    res.json(result);
  } catch (err: any) {
    console.error('Error in /run:', err);
    res.status(500).json({ error: err.message || 'Internal judge error' });
  }
});

// Submit problem (all test cases: visible + hidden)
apiRouter.post('/submit-problem', async (req, res) => {
  try {
    const { problemId, code } = req.body || {};
    if (!problemId || typeof code !== 'string') {
      res.status(400).json({ error: 'Missing problemId or code' });
      return;
    }

    const result = await judgeCode(problemId, code, 'submit');
    res.json(result);
  } catch (err: any) {
    console.error('Error in /submit-problem:', err);
    res.status(500).json({ error: err.message || 'Internal judge error' });
  }
});

// Final submit of all problems
apiRouter.post('/submit', async (req, res) => {
  try {
    const { rollNo, name, codePerProblem, violations, timeTakenSeconds } = req.body || {};

    if (!rollNo || !name || !codePerProblem) {
      res.status(400).json({ error: 'Missing rollNo, name, or codePerProblem' });
      return;
    }

    const msaCode = codePerProblem['merge-sorted-array'] || '';
    const bsCode = codePerProblem['binary-search'] || '';
    const mmCode = codePerProblem['matrix-multiplication'] || '';

    // Helper for safe judging without crashing submission
    const safeJudge = async (pId: string, code: string) => {
      try {
        return await judgeCode(pId, code, 'submit');
      } catch (err: any) {
        console.error(`Judge error for ${pId}:`, err);
        return {
          passedCount: 0,
          totalCount: 5,
          marksEarned: 0,
          allocatedMarks: pId === 'matrix-multiplication' ? 20 : 15,
          testCaseResults: []
        };
      }
    };

    const msaRes = await safeJudge('merge-sorted-array', msaCode);
    const bsRes = await safeJudge('binary-search', bsCode);
    const mmRes = await safeJudge('matrix-multiplication', mmCode);

    const mergeSortMarks = msaRes.marksEarned;
    const binarySearchMarks = bsRes.marksEarned;
    const matrixMultMarks = mmRes.marksEarned;
    const totalScore = mergeSortMarks + binarySearchMarks + matrixMultMarks;

    const timeSec = typeof timeTakenSeconds === 'number' ? timeTakenSeconds : 0;
    const minutes = Math.floor(timeSec / 60);
    const seconds = timeSec % 60;
    const timeTakenFormatted = `${minutes}m ${seconds}s`;

    const submissionRecord: SubmissionRecord = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      rollNo: String(rollNo).trim(),
      name: String(name).trim(),
      totalScore,
      mergeSortMarks,
      binarySearchMarks,
      matrixMultMarks,
      violations: typeof violations === 'number' ? violations : 0,
      timeTakenSeconds: timeSec,
      timeTakenFormatted,
      submittedAt: new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'medium'
      }) + ' IST',
      codePerProblem: {
        'merge-sorted-array': msaCode,
        'binary-search': bsCode,
        'matrix-multiplication': mmCode
      },
      problemResults: {
        'merge-sorted-array': {
          passedCount: msaRes.passedCount,
          totalCount: msaRes.totalCount,
          marksEarned: msaRes.marksEarned,
          testResults: msaRes.testCaseResults
        },
        'binary-search': {
          passedCount: bsRes.passedCount,
          totalCount: bsRes.totalCount,
          marksEarned: bsRes.marksEarned,
          testResults: bsRes.testCaseResults
        },
        'matrix-multiplication': {
          passedCount: mmRes.passedCount,
          totalCount: mmRes.totalCount,
          marksEarned: mmRes.marksEarned,
          testResults: mmRes.testCaseResults
        }
      }
    };

    await saveOrUpdateSubmissionAsync(submissionRecord);
    res.json({ success: true, submission: submissionRecord });
  } catch (err: any) {
    console.error('Error in /submit:', err);
    res.status(500).json({ error: err.message || 'Error processing final submission' });
  }
});

// System storage status check
apiRouter.get('/supabase/status', async (req, res) => {
  res.json({
    configured: true,
    connected: true,
    url: 'Self-Contained Local Storage',
    table: 'submissions',
    mode: 'Local Standalone Engine'
  });
});

// Sync violation count
apiRouter.post('/violations/sync', async (req, res) => {
  try {
    const { rollNo, violations } = req.body || {};
    if (rollNo && typeof violations === 'number') {
      const existing = await getSubmissionByRollNoAsync(rollNo);
      if (existing) {
        existing.violations = violations;
        await saveOrUpdateSubmissionAsync(existing);
      }
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get candidate submission results
apiRouter.get('/results/:rollNo', async (req, res) => {
  try {
    const record = await getSubmissionByRollNoAsync(req.params.rollNo);
    if (!record) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }
    res.json(record);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Login
apiRouter.post('/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (password === '250806') {
    res.json({ success: true, token: 'admin-authorized-250806' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid admin passcode' });
  }
});

// Admin Get All Results
apiRouter.get('/admin/results', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.includes('admin-authorized-250806')) {
      res.status(401).json({ error: 'Unauthorized access' });
      return;
    }
    const submissions = await getAllSubmissionsAsync();
    res.json(submissions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Delete Candidate Submission
apiRouter.delete('/admin/candidate/:rollNo', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.includes('admin-authorized-250806')) {
      res.status(401).json({ error: 'Unauthorized access' });
      return;
    }
    const rollNo = req.params.rollNo;
    const deleted = await deleteSubmissionByRollNoAsync(rollNo);
    if (deleted) {
      res.json({ success: true, message: `Submission for Roll No ${rollNo} deleted successfully.` });
    } else {
      res.status(404).json({ error: 'Submission not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Export CSV
apiRouter.get('/admin/export-csv', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.includes('admin-authorized-250806')) {
      res.status(401).json({ error: 'Unauthorized access' });
      return;
    }
    const csvData = await generateCSVExportAsync();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="DAA_Assessment_Results.csv"');
    res.send(csvData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Fallback 404 handler for API routes
apiRouter.use((req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl || req.url}` });
});

// Mount API router under /api
app.use('/api', apiRouter);

// Fallback for direct API routes (e.g. if Vercel rewrites strip /api prefix)
app.use((req, res, next) => {
  const url = req.url || '';
  if (
    url.startsWith('/run') ||
    url.startsWith('/submit-problem') ||
    url.startsWith('/submit') ||
    url.startsWith('/health') ||
    url.startsWith('/supabase/status') ||
    url.startsWith('/violations/sync') ||
    url.startsWith('/results/') ||
    url.startsWith('/admin/')
  ) {
    return apiRouter(req, res, next);
  }
  next();
});

// Global Error Handler for API routes
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled server error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

