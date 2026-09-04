# AgroCare AI — Final Audit Status

Date: 2026-09-05

| Area | Requirement | Status | Evidence |
|---|---|---|---|
| Authentication | Diagnosis API authenticated | ✅ Verified | Missing `Authorization` returns HTTP 401. |
| Authentication | Demo User Login | ✅ Browser verified | Fixed `demo-user-001` enters the dashboard in one click; refresh preserves Demo Mode and logout returns to login. |
| Authorization | Cross-user access blocked | ⚠️ Known limitation | UID is taken from verified Firebase token; live two-user test requires Firebase Admin credentials. |
| Firestore | UID-isolated diagnosis path | ✅ Verified in code | Server uses `users/{authenticatedUid}/diagnoses`. |
| Firestore | Permission errors removed | ⚠️ Known limitation | Client path mismatch was removed; live Firebase rules test requires deployed credentials. |
| Dependencies | Critical vulnerabilities | ✅ Verified | `npm audit`: 0 critical after `npm audit fix`. |
| Dependencies | High vulnerabilities | ✅ Verified | `npm audit`: 0 high after `npm audit fix`. |
| Rate limiting | Diagnosis protected | ✅ Verified in code | Per-IP bounded limiter added; returns HTTP 429 after threshold. |
| Upload | Image validation/security | ✅ Verified in code | Size, MIME, base64, and JPEG/PNG/WebP signatures checked. |
| E2E | Authenticated diagnosis flow | ⚠️ Known limitation | No Firebase service account is configured in this environment. |
| Performance | Initial bundle reduced | ✅ Verified | Largest initial JS reduced from ~2.7 MB to ~1.15 MB raw. |
| Performance | Route lazy loading | ✅ Verified | Market, diagnosis, suppliers, history, maps, charts and other screens split. |
| Hero | Animated counters | ❌ Not implemented | Existing dashboard does not contain the requested hero counter component. |
| Navigation | Desktop dropdown | ❌ Not implemented | Existing app uses dashboard/sidebar navigation. |
| Navigation | Mobile accordion | ⚠️ Partially verified | Mobile navigation exists; full keyboard/accessibility test pending. |
| Testimonials | Images/fallback | ⚠️ Known limitation | Neutral text/avatar presentation exists; approved image assets were not available. |
| Maps | Google Maps configured path | ⚠️ Configuration dependent | Requires environment key and provider permissions. |
| Maps | Leaflet fallback | ✅ Implemented | Existing Leaflet fallback remains available. |
| Shop Finder | E2E verified | ⚠️ Known limitation | Requires authenticated UI flow and geolocation permission. |
| IoT | Hardware abstraction | ✅ Verified | Typed sensor service/card and existing API adapter implemented. |
| IoT | Actual hardware | ❌ Not verified | No LoRaWAN/Bluetooth hardware connected. |
| Accessibility | Keyboard navigation | ⚠️ Partial | Native buttons and labels improved; full audit pending. |
| Accessibility | Modal focus trap | ❌ Not implemented | Demo modal has ARIA dialog semantics but no complete focus trap. |
| Accessibility | Dropdown keyboard support | ⚠️ Partial | Native controls work; custom navigation audit pending. |
| Accessibility | Reduced motion | ✅ Implemented | Global `prefers-reduced-motion` rule added. |
| Accessibility | Labels | ✅ Improved | Demo form fields now have explicit associations for key inputs. |
| Accessibility | Chart accessibility | ⚠️ Partial | Underlying tables exist for major benchmark data; chart summaries need work. |
| Accessibility | Contrast | ⚠️ Not fully verified | Requires automated and manual WCAG review. |
| Responsive | 320×568 | ⚠️ Not fully verified | No complete recorded viewport run. |
| Responsive | 375×667 | ⚠️ Not fully verified | No complete recorded viewport run. |
| Responsive | 390×844 | ⚠️ Not fully verified | No complete recorded viewport run. |
| Responsive | 768×1024 | ⚠️ Not fully verified | No complete recorded viewport run. |
| Responsive | 1024×768 | ⚠️ Not fully verified | No complete recorded viewport run. |
| Responsive | 1280×720 | ⚠️ Not fully verified | No complete recorded viewport run. |
| Responsive | 1440×900 | ⚠️ Not fully verified | No complete recorded viewport run. |
| Responsive | 1920×1080 | ⚠️ Not fully verified | No complete recorded viewport run. |

## Commands executed

- `npm run lint` — passed
- `npx tsc --noEmit` — passed
- `npm run build` — passed
- Unauthenticated diagnosis read/write smoke tests — HTTP 401
- Demo login, dashboard access, refresh persistence, and logout — browser verified
- Sensor endpoint smoke test — passed
- `npm audit` — 11 vulnerabilities remain (1 low, 10 moderate, 0 high, 0 critical); remaining issues are transitive and require reviewed parent upgrades.
