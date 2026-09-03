// AGENT 9: FEEDBACK & FOLLOW-UP AGENT — Treatment Tracking & Longitudinal Case Memory
import { FeedbackCreateRequest, FollowUpItem } from './types';
import * as admin from 'firebase-admin';

// In-memory stores for fast fallback
const feedbackStore = new Map<string, any[]>();
const followUpStore = new Map<string, FollowUpItem>();

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
 * Records farmer treatment feedback (whether they followed the plan, rating, outcome).
 */
export async function saveFeedback(req: FeedbackCreateRequest): Promise<{ success: boolean; id: string }> {
  const id = `FDBK-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
  const feedbackDoc = {
    id,
    caseId: req.caseId || 'UNKNOWN',
    diagnosisId: req.diagnosisId || req.caseId || 'UNKNOWN',
    actionTaken: req.actionTaken,
    outcome: req.outcome,
    farmerRating: req.farmerRating,
    comments: req.comments || '',
    createdAt: new Date().toISOString()
  };

  // In-memory indexing
  const targetKey = feedbackDoc.diagnosisId;
  const existing = feedbackStore.get(targetKey) || [];
  existing.push(feedbackDoc);
  feedbackStore.set(targetKey, existing);

  // Firestore persistent storage if available
  try {
    const db = getFirestoreDb();
    if (db) {
      await db.collection('feedback').doc(id).set(feedbackDoc);
    }
  } catch (err) {
    console.warn('[Feedback Service] Firestore save fallback to in-memory:', err);
  }

  return { success: true, id };
}

/**
 * Gets all feedback entries for a specific diagnosis ID.
 */
export async function getFeedbackForDiagnosis(diagnosisId: string): Promise<any[]> {
  try {
    const db = getFirestoreDb();
    if (db) {
      const snap = await db.collection('feedback').where('diagnosisId', '==', diagnosisId).get();
      if (!snap.empty) {
        return snap.docs.map((doc: any) => doc.data());
      }
    }
  } catch (err) {
    console.warn('[Feedback Service] Firestore query fallback to memory:', err);
  }

  return feedbackStore.get(diagnosisId) || [];
}

/**
 * Creates and schedules an automated 24-72h follow-up message for the farmer.
 */
export async function createFollowUp(params: {
  caseId: string;
  hoursFromNow?: number;
  purpose?: string;
  contactMethod?: 'whatsapp' | 'sms' | 'app_notification';
}): Promise<FollowUpItem> {
  const hours = params.hoursFromNow ?? 48;
  const scheduledDate = new Date(Date.now() + hours * 60 * 60 * 1000);
  const id = `FLWUP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

  const item: FollowUpItem = {
    id,
    caseId: params.caseId,
    scheduledTime: scheduledDate.toISOString(),
    scheduledHoursFromNow: hours,
    purpose: params.purpose || `Evaluate symptom recovery after applying recommended treatment window.`,
    status: 'scheduled',
    contactMethod: params.contactMethod || 'whatsapp'
  };

  followUpStore.set(id, item);

  try {
    const db = getFirestoreDb();
    if (db) {
      await db.collection('followups').doc(id).set(item);
    }
  } catch (err) {
    console.warn('[FollowUp Service] Firestore save fallback to in-memory:', err);
  }

  return item;
}

/**
 * Retrieves follow-up details by ID.
 */
export async function getFollowUpById(id: string): Promise<FollowUpItem | null> {
  try {
    const db = getFirestoreDb();
    if (db) {
      const doc = await db.collection('followups').doc(id).get();
      if (doc.exists) {
        return doc.data() as FollowUpItem;
      }
    }
  } catch (err) {
    console.warn('[FollowUp Service] Firestore get fallback to in-memory:', err);
  }

  return followUpStore.get(id) || null;
}
