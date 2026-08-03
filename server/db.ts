import fs from 'fs';
import path from 'path';
import { SubmissionRecord } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// In-memory submissions array (ensures full functionality even on read-only serverless environments like Vercel)
let memorySubmissionsCache: SubmissionRecord[] = [];

// Try initializing directory and reading pre-existing submissions safely
try {
  if (fs.existsSync(SUBMISSIONS_FILE)) {
    const content = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
    memorySubmissionsCache = JSON.parse(content) as SubmissionRecord[];
  } else if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2), 'utf8');
    } catch (writeErr) {
      console.warn('Read-only environment detected, operating in-memory:', writeErr);
    }
  }
} catch (e) {
  console.warn('Filesystem initialization notice (using in-memory store):', e);
}

export function getAllSubmissionsLocal(): SubmissionRecord[] {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const content = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
      memorySubmissionsCache = JSON.parse(content) as SubmissionRecord[];
    }
  } catch (err) {
    // Return memory cache on filesystem read errors
  }
  return memorySubmissionsCache;
}

export function saveLocalSubmissions(records: SubmissionRecord[]) {
  memorySubmissionsCache = records;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not persist to disk (retaining in-memory store):', err);
  }
}

export async function getAllSubmissionsAsync(): Promise<SubmissionRecord[]> {
  return getAllSubmissionsLocal();
}

export function getAllSubmissions(): SubmissionRecord[] {
  return getAllSubmissionsLocal();
}

export async function getSubmissionByRollNoAsync(rollNo: string): Promise<SubmissionRecord | undefined> {
  const submissions = getAllSubmissionsLocal();
  return submissions.find(
    (s) => s.rollNo.trim().toLowerCase() === rollNo.trim().toLowerCase()
  );
}

export function getSubmissionByRollNo(rollNo: string): SubmissionRecord | undefined {
  const submissions = getAllSubmissionsLocal();
  return submissions.find(
    (s) => s.rollNo.trim().toLowerCase() === rollNo.trim().toLowerCase()
  );
}

export async function saveOrUpdateSubmissionAsync(record: SubmissionRecord): Promise<SubmissionRecord> {
  const submissions = getAllSubmissionsLocal();
  const index = submissions.findIndex(
    (s) => s.rollNo.trim().toLowerCase() === record.rollNo.trim().toLowerCase()
  );

  if (index >= 0) {
    submissions[index] = record;
  } else {
    submissions.push(record);
  }

  saveLocalSubmissions(submissions);
  return record;
}

export function saveOrUpdateSubmission(record: SubmissionRecord): SubmissionRecord {
  saveOrUpdateSubmissionAsync(record).catch(console.error);
  return record;
}

export async function deleteSubmissionByRollNoAsync(rollNo: string): Promise<boolean> {
  let submissions = getAllSubmissionsLocal();
  const initialLength = submissions.length;
  submissions = submissions.filter(
    (s) => s.rollNo.trim().toLowerCase() !== rollNo.trim().toLowerCase()
  );

  if (submissions.length !== initialLength) {
    saveLocalSubmissions(submissions);
    return true;
  }
  return false;
}

export function deleteSubmissionByRollNo(rollNo: string): boolean {
  deleteSubmissionByRollNoAsync(rollNo).catch(console.error);
  let submissions = getAllSubmissionsLocal();
  const initialLength = submissions.length;
  submissions = submissions.filter(
    (s) => s.rollNo.trim().toLowerCase() !== rollNo.trim().toLowerCase()
  );
  if (submissions.length !== initialLength) {
    saveLocalSubmissions(submissions);
    return true;
  }
  return false;
}

export async function generateCSVExportAsync(): Promise<string> {
  const submissions = await getAllSubmissionsAsync();
  const headers = [
    'Roll No',
    'Student Name',
    'Total Score (/50)',
    'Merge Sorted Array (/15)',
    'Binary Search (/15)',
    'Matrix Multiplication (/20)',
    'Violations Count',
    'Time Taken',
    'Submitted At'
  ];

  const rows = submissions.map((s) => [
    `"${s.rollNo}"`,
    `"${s.name}"`,
    s.totalScore,
    s.mergeSortMarks,
    s.binarySearchMarks,
    s.matrixMultMarks,
    s.violations,
    `"${s.timeTakenFormatted || s.timeTakenSeconds + 's'}"`,
    `"${s.submittedAt}"`
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function generateCSVExport(): string {
  const submissions = getAllSubmissionsLocal();
  const headers = [
    'Roll No',
    'Student Name',
    'Total Score (/50)',
    'Merge Sorted Array (/15)',
    'Binary Search (/15)',
    'Matrix Multiplication (/20)',
    'Violations Count',
    'Time Taken',
    'Submitted At'
  ];

  const rows = submissions.map((s) => [
    `"${s.rollNo}"`,
    `"${s.name}"`,
    s.totalScore,
    s.mergeSortMarks,
    s.binarySearchMarks,
    s.matrixMultMarks,
    s.violations,
    `"${s.timeTakenFormatted || s.timeTakenSeconds + 's'}"`,
    `"${s.submittedAt}"`
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}


