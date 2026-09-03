import * as admin from 'firebase-admin';
import { AgroCareContext } from './types';

const defaultMockProfile = {
  name: 'Ramesh Kumar (Mock Profile)',
  address: 'Tumkur, Karnataka, India',
  phone: '+91 98765 43210',
  size: '5 Acres',
  crops: 'Tomato, Corn, Potato',
  soilType: 'Red Loamy',
  irrigation: 'Drip Irrigation',
  lat: 13.3409,
  lng: 77.1010,
};

export async function buildAgroCareContext(req: any): Promise<AgroCareContext> {
  const body = req.body || {};
  const userId = req.user?.uid || body.userId || 'default_user_123';

  let farmerProfile: any = { ...defaultMockProfile };
  let recentDiagnoses: any[] = [];

  // Attempt to load profile and recent diagnoses from Firestore
  try {
    if (admin.apps.length > 0) {
      const db = admin.firestore();
      
      // Fetch user profile
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        farmerProfile = { ...farmerProfile, ...userDoc.data() };
      }

      // Fetch last 5 diagnoses
      try {
        const diagSnapshot = await db
          .collection('diagnoses')
          .orderBy('timestamp', 'desc')
          .limit(5)
          .get();

        if (!diagSnapshot.empty) {
          recentDiagnoses = diagSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
      } catch (diagErr) {
        // Fallback without timestamp ordering if index isn't present
        const diagSnapshot = await db.collection('diagnoses').limit(5).get();
        if (!diagSnapshot.empty) {
          recentDiagnoses = diagSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
      }
    }
  } catch (err) {
    console.warn('[AgroCare Context] Firestore query fallback to memory:', err);
  }

  const rawLat = body.location?.lat ?? body.lat ?? farmerProfile.lat ?? 13.3409;
  const rawLng = body.location?.lng ?? body.lng ?? farmerProfile.lng ?? 77.1010;
  const locationName = body.location?.name ?? body.locationName ?? farmerProfile.address ?? 'Tumkur, Karnataka';

  const language = body.language || farmerProfile.language || 'en';
  const crop = body.crop || farmerProfile.crops?.split(',')?.[0]?.trim() || 'Tomato';

  const currentDiagnosis = body.currentDiagnosis || (body.diagnosis ? {
    disease: body.diagnosis.disease || body.diagnosis.disease_name,
    confidence: body.diagnosis.confidence,
    severity: body.diagnosis.severity,
    imageUrl: body.diagnosis.imageUrl || body.imageBase64,
  } : undefined);

  const escalationThreshold = parseFloat(process.env.AGROCARE_ESCALATION_THRESHOLD || '0.70') || 0.70;

  const context: AgroCareContext = {
    userId,
    language,
    location: {
      lat: typeof rawLat === 'number' ? rawLat : parseFloat(rawLat) || 13.3409,
      lng: typeof rawLng === 'number' ? rawLng : parseFloat(rawLng) || 77.1010,
      name: locationName,
    },
    crop,
    currentDiagnosis,
    recentDiagnoses,
    farmerProfile,
    conversationSummary: body.conversationSummary || body.summary,
    safetyConstraints: {
      sprayBlock: true,
      escalationThreshold,
    },
  };

  return context;
}
