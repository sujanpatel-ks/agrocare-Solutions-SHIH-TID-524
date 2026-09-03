// OBSERVABILITY & TRACE SERVICE — Step-by-Step Case Latency & Pipeline Observability
import { CaseTraceResponse, StepTrace } from './types';
import * as admin from 'firebase-admin';

const MAX_STORED_TRACES = 200;
const caseTraceMap = new Map<string, CaseTraceResponse>();
const caseOrder: string[] = [];

function isFirebaseInitialized(): boolean {
  try {
    return Boolean((admin as any)?.apps?.length || (admin as any)?.default?.apps?.length);
  } catch {
    return false;
  }
}

function getFirestoreDb(): admin.firestore.Firestore | null {
  try {
    if (isFirebaseInitialized()) {
      return (admin.firestore ? admin.firestore() : (admin as any).default?.firestore?.());
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Creates or updates a case trace record.
 */
export async function recordCaseTrace(trace: CaseTraceResponse): Promise<void> {
  caseTraceMap.set(trace.caseId, trace);
  caseOrder.push(trace.caseId);

  if (caseOrder.length > MAX_STORED_TRACES) {
    const oldest = caseOrder.shift();
    if (oldest) caseTraceMap.delete(oldest);
  }

  try {
    const db = getFirestoreDb();
    if (db) {
      await db.collection('case_traces').doc(trace.caseId).set(trace);
    }
  } catch (err) {
    console.warn('[Trace Service] Firestore trace save fallback to memory:', err);
  }
}

/**
 * Retrieves case trace by caseId.
 */
export async function getCaseTrace(caseId: string): Promise<CaseTraceResponse | null> {
  // Check in-memory first
  if (caseTraceMap.has(caseId)) {
    return caseTraceMap.get(caseId)!;
  }

  // Check Firestore
  try {
    const db = getFirestoreDb();
    if (db) {
      const doc = await db.collection('case_traces').doc(caseId).get();
      if (doc.exists) {
        return doc.data() as CaseTraceResponse;
      }
    }
  } catch (err) {
    console.warn('[Trace Service] Firestore trace get error:', err);
  }

  return null;
}

/**
 * Helper to measure asynchronous step execution with latency.
 */
export async function measureStep<T>(
  agent: StepTrace['agent'],
  fn: () => Promise<T>,
  summary?: string
): Promise<{ result: T; trace: StepTrace }> {
  const startTime = Date.now();
  const isoStart = new Date(startTime).toISOString();
  let status: StepTrace['status'] = 'completed';
  let data: any = undefined;

  try {
    const result = await fn();
    const endTime = Date.now();
    const isoEnd = new Date(endTime).toISOString();
    const latencyMs = endTime - startTime;

    return {
      result,
      trace: {
        agent,
        status,
        latencyMs,
        startTime: isoStart,
        endTime: isoEnd,
        summary: summary || `${agent.toUpperCase()} step executed in ${latencyMs}ms`,
        data: (result as any)?.status || (result as any)?.decision || 'ok'
      }
    };
  } catch (err: any) {
    const endTime = Date.now();
    const isoEnd = new Date(endTime).toISOString();
    const latencyMs = endTime - startTime;

    return {
      result: null as any,
      trace: {
        agent,
        status: 'failed',
        latencyMs,
        startTime: isoStart,
        endTime: isoEnd,
        summary: `${agent.toUpperCase()} step failed: ${err.message}`,
        data: { error: err.message }
      }
    };
  }
}
