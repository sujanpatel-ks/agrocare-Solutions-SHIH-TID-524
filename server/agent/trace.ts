import { v4 as uuidv4 } from 'uuid';

export interface TraceStep {
  type: 'tool_call' | 'decision' | 'safety_gate' | 'error';
  name?: string;
  input?: any;
  output?: any;
  durationMs?: number;
  decision?: string;
  gate?: string;
  result?: any;
  timestamp: string;
}

export interface TraceEntry {
  traceId: string;
  userId: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  steps: TraceStep[];
  result?: any;
}

const MAX_TRACES = 100;
const traceStore = new Map<string, TraceEntry>();
const traceOrder: string[] = [];

export function startTrace(userId: string): string {
  const traceId = uuidv4();
  const entry: TraceEntry = {
    traceId,
    userId,
    startTime: Date.now(),
    steps: [],
  };

  traceStore.set(traceId, entry);
  traceOrder.push(traceId);

  // Evict oldest trace if exceeding capacity
  if (traceOrder.length > MAX_TRACES) {
    const oldestId = traceOrder.shift();
    if (oldestId) {
      traceStore.delete(oldestId);
    }
  }

  return traceId;
}

export function logToolCall(
  requestId: string,
  toolName: string,
  input: any,
  output: any,
  durationMs: number
): void {
  const trace = traceStore.get(requestId);
  if (!trace) return;

  trace.steps.push({
    type: 'tool_call',
    name: toolName,
    input,
    output,
    durationMs,
    timestamp: new Date().toISOString(),
  });
}

export function logAgentDecision(
  requestId: string,
  decision: string,
  payload?: any
): void {
  const trace = traceStore.get(requestId);
  if (!trace) return;

  trace.steps.push({
    type: 'decision',
    decision,
    result: payload,
    timestamp: new Date().toISOString(),
  });
}

export function logSafetyGate(
  requestId: string,
  gate: string,
  result: any
): void {
  const trace = traceStore.get(requestId);
  if (!trace) return;

  trace.steps.push({
    type: 'safety_gate',
    gate,
    result,
    timestamp: new Date().toISOString(),
  });
}

export function finalizeTrace(requestId: string, result?: any): TraceEntry | undefined {
  const trace = traceStore.get(requestId);
  if (!trace) return undefined;

  trace.endTime = Date.now();
  trace.durationMs = trace.endTime - trace.startTime;
  if (result) {
    trace.result = result;
  }

  console.log(`[TRACE] ${requestId} completed in ${trace.durationMs}ms with ${trace.steps.length} steps`);
  return trace;
}

export function getTrace(requestId: string): TraceEntry | undefined {
  return traceStore.get(requestId);
}
