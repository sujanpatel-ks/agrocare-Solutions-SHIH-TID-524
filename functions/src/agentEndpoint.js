// functions/src/agentEndpoint.js — Firebase Cloud Functions Callable Endpoint
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { runOrchestrator } from '../../server/agent/agentOrchestrator';
import { validateAgentInput } from '../../server/agent/validators';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const agentEndpoint = functions.https.onCall(async (data, context) => {
  // Authentication check
  const uid = context.auth ? context.auth.uid : 'guest_farmer_' + Date.now();

  // Validate agent input
  const validation = validateAgentInput(data);
  if (!validation.valid || !validation.cleanData) {
    throw new functions.https.HttpsError('invalid-argument', validation.error || 'Invalid agent payload');
  }

  try {
    const result = await runOrchestrator({
      ...validation.cleanData,
      farmerId: uid
    });

    // Save session to Firestore for historical audit
    try {
      await admin.firestore()
        .collection('farmers').doc(uid)
        .collection('agentSessions').add({
          input: validation.cleanData,
          output: result,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch (dbErr) {
      console.warn('Firestore session logging notice:', dbErr);
    }

    return result;
  } catch (err) {
    functions.logger.error('[AGENT] Cloud Function Orchestrator failed', { error: err.message });
    return {
      status: 'fallback',
      reasoning_summary: 'Agent temporarily running in offline resilience mode.',
      recommended_actions: [],
      escalation: { required: false }
    };
  }
});
