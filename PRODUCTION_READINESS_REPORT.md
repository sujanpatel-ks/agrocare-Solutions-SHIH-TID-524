# AgroCare AI — Production Readiness Report

## Executive summary

The project improved from 58/100. Authentication, UID-scoped diagnosis persistence, image validation, rate limiting, Firestore persistence API migration, IoT software integration, dependency remediation, and route-level code splitting were implemented. The current evidence-based score is 78/100.

Deployment verdict: **NOT READY FOR PRODUCTION**.

## Security changes

- Diagnosis, diagnosis history, delete, AI diagnosis, and agent orchestration requests require a Firebase ID token.
- The server derives ownership only from the verified token UID.
- Diagnosis storage uses `users/{uid}/diagnoses/{diagnosisId}`.
- Client history and recent-diagnosis retrieval use the authenticated API instead of a different Firestore path.
- Diagnosis images are bounded and checked for allowed MIME types, base64 validity, and file signatures.
- Diagnosis and demo endpoints have bounded per-IP rate limits.
- Firebase Admin credentials may be supplied through server-only `FIREBASE_SERVICE_ACCOUNT_JSON`.
- Firestore rules accept the `Severe` diagnosis severity emitted by the application.

## Demo User Login

- The login screen exposes `🚀 Demo User Login` with a loading state and a `Demo Mode` indicator after entry.
- The fixed identity is `demo-user-001` / `demo@agrocare.ai`; it is never selected from a caller-supplied user ID.
- With Firebase Admin configured, the server issues a Firebase custom token. In local development without Admin credentials, only the explicitly fixed demo header fallback is enabled.
- Demo diagnosis data is scoped to the demo UID; normal authentication remains unchanged and logout clears the demo marker and Firebase session.

## Performance

- Route-level lazy loading was added for heavy screens.
- Initial largest JavaScript chunk decreased from approximately 2.7 MB to approximately 1.15 MB raw (315 KB gzip).
- Remaining large chunks include diagnosis (603 KB), charts (326 KB), and shared runtime (1.15 MB).

## IoT status

Software integration is implemented through typed `SensorTelemetry`, `fetchSensorTelemetry`, and `SensorTelemetryCard` layers. The card polls `/api/context/sensors`, displays moisture, canopy temperature, battery, and gateway state, and handles offline/retry states.

Physical LoRaWAN/Bluetooth hardware was not available, so hardware connectivity is explicitly not claimed as verified.

## Remaining risks

1. `npm audit` reports 11 remaining transitive vulnerabilities (1 low, 10 moderate; 0 high/critical).
2. Firebase Admin credentials and deployed Firestore rules were not available for a real two-user isolation test.
3. Hero counters, desktop dropdown navigation, and full accessibility/responsive audits remain incomplete.
4. Google Maps and real sensor hardware require external configuration/devices.
