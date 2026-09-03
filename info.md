# AgroCare AI — Master System Architecture & Developer Specification (`info.md`)

> **Document Version:** 2.0.0 (Production Release)  
> **Target Audience:** Autonomous AI Engineering Agents, Systems Architects, and Full-Stack Developers  
> **Purpose:** Standalone, exhaustive documentation enabling any AI agent or human engineer to comprehend, reproduce, extend, or maintain the AgroCare AI ecosystem without access to the original conversation history or external commentary.

---

## Table of Contents
1. [Project Overview](#section-1-project-overview)
2. [Tech Stack & Complete Dependencies](#section-2-tech-stack--dependencies)
3. [Project Structure & File Map](#section-3-project-structure--file-map)
4. [Design System, Styling & UX Tokens](#section-4-design-system-styling--ux-tokens)
5. [Frontend Components Reference](#section-5-frontend-components-reference)
6. [Backend Architecture & API Route Directory](#section-6-backend-architecture--api-route-directory)
7. [Multi-Agent Orchestration Engine & RAG Pipelines](#section-7-multi-agent-orchestration-engine--rag-pipelines)
8. [External Integrations, APIs & Grounding Services](#section-8-external-integrations-apis--grounding-services)
9. [Data Models, Schemas & TypeScript Types](#section-9-data-models-schemas--typescript-types)
10. [State Management, Custom Hooks & Offline Engine](#section-10-state-management-custom-hooks--offline-engine)
11. [Configuration & Environment Variables](#section-11-configuration--environment-variables)
12. [Testing, Quality Assurance & Verification Suites](#section-12-testing-quality-assurance--verification-suites)
13. [Production Build System & Cloud Deployment](#section-13-production-build-system--cloud-deployment)
14. [Quick Start & Developer Extension Playbook](#section-14-quick-start--developer-extension-playbook)

---

## Section 1: Project Overview

### 1.1 Executive Summary
**AgroCare AI** is an enterprise-grade, mobile-first agricultural intelligence platform engineered specifically for smallholder farmers across South Asia (with primary localization for Karnataka, Maharashtra, Uttar Pradesh, and Tamil Nadu). Operating as a full-stack, voice-first progressive web application backed by a Node.js/Express service orchestrating Google's Gemini multimodal models, AgroCare AI bridges the critical gap between complex agricultural science and rural operational realities.

The platform provides end-to-end crop protection: from sub-second leaf diagnostic scans using Gemini Vision models, to real-time meteorological spray gatekeeping (preventing pesticide chemical washout during rain), down to localized mandi commodity price arbitrage and automated, licensed input supplier geolocation.

### 1.2 Core Purpose & Target Audience
- **Primary Users:** Smallholder and marginal farmers managing 1 to 5 acres of cultivable land, agricultural extension officers (KVK Krishi Vigyan Kendra scientists), village agricultural co-operatives, and fertilizer retailers.
- **Problem Statement:** Rural farmers lose up to 35% of annual crop yield to misidentified fungal/bacterial leaf infections, spray during unfavorable meteorological windows (wasting inputs through rain washout), purchase adulterated agrochemicals from unlicensed vendors, and sell produce to intermediary middlemen at depressed prices without awareness of neighboring mandi rates.
- **Solution:** AgroCare AI offers an offline-resilient, multi-lingual, voice-interactive assistant that provides ICAR (Indian Council of Agricultural Research) validated remedies, checks real-time spray safety windows, locates verified dealers, calculates mandi price arbitrage, and generates auditable, multi-agent reasoning traces.

### 1.3 Key Features
- **Multimodal Leaf Pathology Diagnosis:** High-precision vision diagnostics identifying 50+ diseases across major Indian staple and cash crops (Tomato, Paddy/Rice, Potato, Cotton, Wheat, Maize, Sugarcane, Coconut, Chilli, Brinjal, Onion).
- **Meteorological Treatment Gatekeeper:** Real-time integration with Open-Meteo telemetry evaluating ambient temperature, wind drift risk (>20 km/h), relative humidity, and precipitation probability to enforce a hard safety gate (`DO NOT SPRAY NOW`) when rain is forecasted within 6 to 12 hours.
- **Multi-Agent Directed Acyclic Graph (DAG) Pipeline:** A 6-stage autonomous orchestration workflow (Sentinel -> Context -> Planner -> Safety -> Executor -> Escalation) with millisecond-precision tracing, fail-safe fallbacks, and human-in-the-loop expert escalation when confidence drops below 0.70.
- **FCO 1985 Fertilizer Control Order RAG:** Retrieval-Augmented Generation agent querying statutory fertilizer formulations, NPK stoichiometrics, application timings, and chemical incompatibility rules.
- **Bi-Directional Real-Time Voice Streaming:** Gemini 2.0 Live WebSockets (`/api/live-ws`) delivering 16kHz PCM audio conversation with sub-500ms response latencies in vernacular languages.
- **Mandi Price Arbitrage Calculator:** Real-time commodity tracking across APMC mandis with automated Haversine distance logistics calculations and net margin projections.
- **Verified Agro-Input Locator:** Google Maps Platform grounding cross-referenced with licensed fertilizer retailer records, stock verification, and 1-click turn-by-turn navigation.
- **100% Offline Resiliency:** IndexedDB client-side database (`agrocare_offline_db`) pre-populated with curated ICAR offline treatment profiles, ensuring uninterrupted diagnostic capabilities without cellular network connectivity.
- **Native Android Studio Workspace:** An integrated Jetpack Compose simulator that exposes ready-to-compile Kotlin source code, AndroidManifest, and Gradle configurations.

### 1.4 Deployment Endpoints
- **Live Production / Preview:** Cloud Run container ingress on port 3000.
- **Public Domain Access:** Managed by Google AI Studio Cloud Run reverse proxy.

---

## Section 2: Tech Stack & Dependencies

### 2.1 Core Architectural Tiers
| Tier | Technology | Rationale |
|---|---|---|
| **Frontend Framework** | React 18.3.1 + Vite 6.0.5 | Blazing fast client hydration, tree-shaking, and rapid component development. |
| **Language** | TypeScript 5.6.3 | Strict compile-time contracts across both client and server codebases. |
| **Styling & Design** | Tailwind CSS v4 (@import "tailwindcss") | Utility-first styling with custom CSS variables and responsive breakpoints. |
| **Animation Engine** | `motion/react` (Framer Motion v12.4.7) | Fluid physical springs, layout morphs, biometric HUD sweeps, and micro-interactions. |
| **Data Visualization** | Recharts 2.15.1 + D3 Shape | Responsive charts for NPK balance, treatment cost comparison, and mandi price trends. |
| **Backend Runtime** | Node.js (ESM / CommonJS hybrid) | High-throughput asynchronous I/O handling REST endpoints and WebSockets. |
| **Backend Framework** | Express 4.21.2 | Lightweight, battle-tested HTTP server handling API routes and middleware. |
| **Server Bundler** | `esbuild` 0.25.0 | Bundles `server.ts` into a standalone CommonJS file (`dist/server.cjs`) for production. |
| **Local Persistence** | IndexedDB + better-sqlite3 11.8.1 | Client-side zero-latency offline storage + server-side trace/cache persistence. |
| **Cloud Database** | Firebase Firestore 11.4.0 | Real-time cloud synchronization for user profiles, diagnoses, and feedback. |
| **Authentication** | Firebase Auth 11.4.0 (Google Identity) | Zero-friction OAuth popup sign-in with auto-provisioning. |
| **AI / GenAI SDK** | `@google/genai` 0.1.2 | Official Google GenAI SDK powering Gemini 2.5 Flash, Gemini 2.0 Live, and Flash Thinking. |
| **Geospatial & Maps** | Google Maps JS API + Leaflet 1.9.4 | Native Google Maps Places/Directions with Leaflet client fallback. |
| **Voice & Speech** | Web Audio API + Gemini Live WebSockets | Bidirectional 16kHz PCM audio capture and playback. |

### 2.2 Complete Dependency Manifest (`package.json`)

#### Production Dependencies (`dependencies`)
| Package Name | Version | Functional Purpose |
|---|---|---|
| `@google/genai` | `^0.1.2` | Official Google GenAI SDK for Gemini 2.5 Flash, multimodal vision, and function calling. |
| `better-sqlite3` | `^11.8.1` | Embedded, synchronous SQLite engine for caching mandi prices and pipeline trace logs. |
| `clsx` | `^2.1.1` | Utility for constructing conditional CSS className strings. |
| `cors` | `^2.8.5` | Cross-Origin Resource Sharing middleware for Express API routes. |
| `d3-shape` | `^3.2.0` | Mathematical path generator for custom agricultural charts and gauges. |
| `express` | `^4.21.2` | Core backend HTTP web application framework. |
| `firebase` | `^11.4.0` | Client Firebase SDK for Firestore persistence and Google Authentication. |
| `html2canvas` | `^1.4.1` | Client-side screenshot engine for generating downloadable crop advisory cards. |
| `i18next` | `^24.2.2` | Internationalization framework providing translations in EN, HI, KN, TA, TE, MR. |
| `i18next-browser-languagedetector` | `^8.0.4` | Automatically detects the farmer's browser language and region. |
| `jspdf` | `^2.5.2` | PDF generator for official agricultural advisory reports. |
| `leaflet` | `^1.9.4` | Lightweight interactive mapping library used for offline/fallback supplier maps. |
| `lucide-react` | `^0.475.0` | Vector icon library for modern, accessible UI controls. |
| `motion` | `^12.4.7` | Production animation library (imported from `motion/react`). |
| `react` | `^18.3.1` | Declarative UI component library. |
| `react-dom` | `^18.3.1` | DOM renderer for React. |
| `react-i18next` | `^15.4.1` | React bindings and hooks (`useTranslation`) for i18next. |
| `react-leaflet` | `^5.0.0` | React component wrappers for Leaflet interactive maps. |
| `react-markdown` | `^10.0.1` | Markdown renderer for AI-generated agronomic recommendations. |
| `recharts` | `^2.15.1` | Composable charting library for NPK and price analytics. |
| `sonner` | `^2.0.1` | Toast notification manager for feedback, warnings, and copy alerts. |
| `tailwind-merge` | `^3.0.1` | Merges Tailwind class strings without style conflicts. |
| `ws` | `^8.18.1` | High-performance WebSocket library for Gemini Live voice proxying. |

#### Development Dependencies (`devDependencies`)
| Package Name | Version | Functional Purpose |
|---|---|---|
| `@tailwindcss/vite` | `^4.0.7` | Vite plugin integrating Tailwind CSS v4 directly into the build pipeline. |
| `@types/better-sqlite3` | `^7.6.12` | TypeScript definitions for better-sqlite3. |
| `@types/cors` | `^2.8.17` | TypeScript definitions for Express cors middleware. |
| `@types/d3-shape` | `^3.1.7` | TypeScript definitions for d3-shape. |
| `@types/express` | `^4.17.21` | TypeScript definitions for Express core. |
| `@types/leaflet` | `^1.9.16` | TypeScript definitions for Leaflet. |
| `@types/node` | `^22.13.4` | TypeScript definitions for Node.js standard runtime. |
| `@types/react` | `^18.3.18` | TypeScript definitions for React. |
| `@types/react-dom` | `^18.3.5` | TypeScript definitions for React DOM. |
| `@types/ws` | `^8.5.14` | TypeScript definitions for the ws WebSocket library. |
| `@vitejs/plugin-react` | `^4.3.4` | Vite plugin providing fast React HMR and JSX transformation. |
| `esbuild` | `^0.25.0` | Fast JavaScript bundler compiling `server.ts` to `dist/server.cjs`. |
| `tailwindcss` | `^4.0.7` | Utility-first CSS engine. |
| `tsx` | `^4.19.2` | TypeScript Execute engine for instant dev server execution (`npx tsx server.ts`). |
| `typescript` | `^5.6.3` | TypeScript compiler for type checking (`tsc --noEmit`). |
| `vite` | `^6.0.5` | Next-generation frontend tooling and bundler. |

---

## Section 3: Project Structure & File Map

### 3.1 High-Level Architecture Tree
```text
agrocare-ai/
├── .env.example                     # Environment template (GEMINI_API_KEY, etc.)
├── AGENTS.md                        # Persistent agent context & instructions
├── firebase-blueprint.json          # Firestore schema definition
├── firestore.rules                  # Firestore security access rules
├── index.html                       # Single Page Entry HTML with meta & fonts
├── metadata.json                    # App metadata, permissions & capabilities
├── package.json                     # NPM packages & build commands
├── server.ts                        # Master Express backend & Vite middleware
├── tsconfig.json                    # TypeScript compiler configuration
├── tsconfig.node.json               # TypeScript config for Node scripts
├── vite.config.ts                   # Vite bundler configuration
│
├── scripts/                         # Automated verification & test suites
│   ├── test-agent-suite.ts          # Comprehensive 11-suite agent test runner
│   └── test-multiagent.ts           # Standalone orchestrator test harness
│
├── server/                          # Backend Multi-Agent & Service Infrastructure
│   ├── agent/                       # Auxiliary agent modules & tools
│   │   ├── agentOrchestrator.ts     # Function-calling agent with tool schemas
│   │   ├── mapsAgent.ts             # Google Maps Grounded Spatial Agent
│   │   ├── trace.ts                 # Legacy trace logger
│   │   └── fertilizer/              # RAG-based FCO 1985 Fertilizer Agent
│   │       ├── fertilizerAgent.ts   # Core fertilizer reasoning engine
│   │       ├── ingestion.ts         # Statutory document chunker & parser
│   │       ├── knowledgeBase.ts     # Curated FCO 1985 fertilizer records
│   │       ├── retriever.ts         # Cosine & keyword knowledge retriever
│   │       ├── safetyEngine.ts      # Chemical incompatibility & dosage verifier
│   │       └── types.ts             # Fertilizer agent interfaces
│   │
│   └── agents/                      # Production DAG Multi-Agent Pipeline
│       ├── types.ts                 # Master agent contracts & trace types
│       ├── trace.ts                 # Latency measurement, step logger & storage
│       ├── sentinelAgent.ts         # Vision quality gate & disease classifier
│       ├── contextAgent.ts          # Weather, soil & sensor fusion
│       ├── plannerAgent.ts          # Integrated Pest Management (IPM) planner
│       ├── safetyAgent.ts           # Biological & weather safety gatekeeper
│       ├── executorAgent.ts         # Suppliers, schemes & follow-up scheduler
│       ├── escalationAgent.ts       # Confidence thresholding (<0.70) & ticketing
│       └── orchestrator.ts          # Master DAG pipeline orchestrator
│
└── src/                             # Client-Side React 18 Application
    ├── main.tsx                     # React DOM root entry point
    ├── App.tsx                      # Root screen router & state coordinator
    ├── AuthProvider.tsx             # Firebase Auth context provider
    ├── constants.ts                 # Static crop types, initial tasks & defaults
    ├── firebase.tsx                 # Firebase client initialization
    ├── i18n.ts                      # Multi-lingual internationalization setup
    ├── index.css                    # Tailwind CSS v4 imports & custom styles
    ├── types.ts                     # Shared client TypeScript types
    │
    ├── components/                  # React UI Views & Functional Components (51 files)
    │   ├── ui/                      # Specialized micro-components & badges
    │   │   ├── AlternativeDiagnosesCard.tsx
    │   │   ├── ConfidenceBadge.tsx
    │   │   ├── DeficiencyCard.tsx
    │   │   ├── ImageEnhancerTool.tsx
    │   │   ├── ManualSymptomSelector.tsx
    │   │   └── WeatherAdvisoryBanner.tsx
    │   ├── AgentStepsDisplay.jsx
    │   ├── AndroidWorkspace.tsx
    │   ├── ArbitrageAnalyzer.tsx
    │   ├── BottomNav.tsx
    │   ├── Calendar.tsx
    │   ├── CameraDiagnosis.tsx
    │   ├── Chat.tsx
    │   ├── Community.tsx
    │   ├── CropDetails.tsx
    │   ├── Dashboard.tsx
    │   ├── DemoRequestModal.tsx
    │   ├── Diagnosis.tsx
    │   ├── DiagnosticResults.tsx
    │   ├── ErrorBoundary.tsx
    │   ├── FertilizerFilters.jsx
    │   ├── FertilizerMap.jsx
    │   ├── FertilizerMapSection.jsx
    │   ├── FertilizerShopCard.jsx
    │   ├── FileUploader.tsx
    │   ├── FloatingFarmerActionDock.tsx
    │   ├── FoliageBiometricHUD.tsx
    │   ├── GoogleFertilizerMap.tsx
    │   ├── GoogleMapsAgent.tsx
    │   ├── HeroCard.jsx
    │   ├── HeroSection.jsx
    │   ├── History.tsx
    │   ├── LanguageSelector.tsx
    │   ├── LiveAudioChat.tsx
    │   ├── Market.tsx
    │   ├── MultiAgentPipelineRibbon.tsx
    │   ├── NewHomeDashboard.tsx
    │   ├── OfflineBanner.tsx
    │   ├── Profile.tsx
    │   ├── SchemeFinder.tsx
    │   ├── SoilAnalysis.tsx
    │   ├── Suppliers.tsx
    │   ├── TaskSpeechReminder.tsx
    │   ├── TestimonialsCarousel.tsx
    │   ├── TopNav.jsx
    │   ├── TreatmentComparisonView.tsx
    │   ├── TreatmentPlanView.tsx
    │   ├── TreatmentRechartsComparison.tsx
    │   ├── VoiceNavigation.tsx
    │   ├── VoiceTaskModal.tsx
    │   ├── WeatherForecast.tsx
    │   ├── WeatherSummary.tsx
    │   └── WhatsAppShare.tsx
    │
    ├── data/                        # Static JSON data & inventories
    │   ├── fertilizerShops.js       # Verified fertilizer retailers dataset
    │   ├── itk-knowledge.ts         # ICAR Indigenous Technical Knowledge corpus
    │   ├── mandi-data.json          # Karnataka Agmarknet mandi market records
    │   ├── market_data.json         # Pan-India commodity price dataset
    │   ├── operatingHours.js        # Business operational schedules
    │   └── supplierReviews.js       # Dealer ratings & farmer feedback
    │
    ├── hooks/                       # Custom React Hooks
    │   └── useGeolocation.ts        # GPS location hook with Karnataka fallback
    │
    ├── lib/                         # Agronomic knowledge bases & algorithms
    │   ├── confidenceHandler.ts     # Confidence tiering & uncertainty logic
    │   ├── diseaseDatabase.ts       # 1,300+ line verified crop pathology database
    │   ├── nutrientDeficiency.ts    # Comprehensive NPK & micronutrient database
    │   └── promptTemplates.ts       # Specialized system instructions for Gemini
    │
    ├── locales/                     # i18n JSON translation files
    │   ├── en.json                  # English
    │   ├── hi.json                  # Hindi (हिंदी)
    │   ├── kn.json                  # Kannada (ಕನ್ನಡ)
    │   ├── mr.json                  # Marathi (मराठी)
    │   ├── ta.json                  # Tamil (தமிழ்)
    │   └── te.json                  # Telugu (తెలుగు)
    │
    ├── services/                    # API clients & service adapters
    │   ├── agentService.ts          # Client connector to backend agent pipeline
    │   ├── connectivity.ts          # Online/offline network status detector
    │   ├── fertilizerService.ts     # Client connector to FCO fertilizer RAG
    │   ├── gemini.ts                # Client Gemini proxy caller (vision, speech)
    │   ├── gemma.ts                 # Local Gemma fallback router
    │   ├── mapsAgentService.ts      # Spatial agent client adapter
    │   ├── marketApi.ts             # Mandi price fetcher & aggregator
    │   ├── placesService.ts         # Google Maps Places client service
    │   ├── speechSynthesisService.ts# Browser & cloud TTS generator
    │   └── weatherService.ts        # Open-Meteo weather client
    │
    └── utils/                       # Utility helpers & storage
        ├── offlineStorage.ts        # IndexedDB offline database & sync queue
        └── productImages.ts         # Product thumbnail resolvers
```

---

## Section 4: Design System, Styling & UX Tokens

### 4.1 Color Palette & Semantic Meaning
AgroCare AI adopts an **Earthy Harvest** design token architecture grounded in rural field aesthetics, utilizing deep forest greens, warm fertile soil neutrals, rich mandi golds, and high-visibility alert pigments:

| Token Name | Hex Value | Semantic Usage |
|---|---|---|
| `--color-primary` | `#003527` | Deep Emerald Canopy: Core navigation headers, major brand surfaces, primary CTA buttons. |
| `--color-primary-container`| `#064e3b` | Dark green container fill for emphasized cards and success badges. |
| `--color-on-primary-container`| `#80bea6` | Minty sage text and icons when placed on primary container backgrounds. |
| `--color-primary-fixed` | `#b0f0d6` | High-contrast mint highlight for badges, active chips, and verified seals. |
| `--color-secondary` | `#944a23` | Terracotta Earth: Secondary actions, soil diagnostics, organic farming highlights. |
| `--color-secondary-container`| `#fd9e70` | Warm peach container fill for advisory callouts. |
| `--color-tertiary` | `#3c2b00` | Deep Harvest Ochre: Mandi commodity prices, market arbitrage indicators. |
| `--color-tertiary-fixed` | `#ffdf9f` | Gold highlight for high-performing mandi market tickers. |
| `--color-surface` | `#f8f9fa` | Off-white canvas: Clean, non-glare background optimal for outdoor sunlight viewing. |
| `--color-surface-container`| `#edeeef` | Subtle neutral card fills and elevated borders. |
| `--color-on-surface` | `#191c1d` | High-contrast near-black (4.5:1+ WCAG AA compliant) for primary typography. |
| `--color-on-surface-variant`| `#404944` | Muted slate-forest for secondary captions, metadata, and timestamps. |
| `--color-outline` | `#707974` | Subtle borders for form fields, divider rules, and card outlines. |
| `--color-symptom-coral` | `#ef4444` | Alert Coral: Severe fungal/bacterial blight badges and spray hazard warnings. |
| `--color-warning-amber` | `#f59e0b` | Caution Amber: Spray delay warnings, moderate confidence indicators. |

### 4.2 Typography System
- **Display Font (`--font-display`):** `Hanken Grotesk`, `Plus Jakarta Sans`, system-ui. Used for high-impact screen titles, commodity price numbers, and diagnostic headlines.
- **Headline Font (`--font-headline`):** `Hanken Grotesk`, system-ui.
- **Body Font (`--font-body`, `--font-sans`):** `Inter`, ui-sans-serif, system-ui. Selected for maximum legibility in complex multilingual scripts (Devanagari, Kannada, Tamil, Telugu) at low display resolutions.
- **Technical & Metric Font:** `JetBrains Mono`, monospace. Used for NPK chemical ratios, GPS coordinates, latency timestamps, and Android code view.

### 4.3 Motion, Spring Physics & Easing
All animations utilize `motion/react` with custom spring configurations optimized for responsive tactile feedback on low-end mobile devices:
- **Snappy Button Spring:** `stiffness: 450, damping: 32` (Immediate responsiveness without visual oscillation).
- **Sheet / Modal Spring:** `stiffness: 300, damping: 28` (Natural momentum for bottom action sheets).
- **Biometric Reticle Pulse:** Continuous CSS `@keyframes` pulse simulating laser foliage scanning.
- **Marker Drop Bounce:** Custom cubic-bezier (`0.25, 1, 0.5, 1`) simulating realistic drop-physics for map pins.

### 4.4 Mobile-First Touch & Accessibility Guidelines
- **Minimum Touch Target:** 44px x 44px on all interactive icons and button surfaces.
- **Ergonomic Thumb-Zone Docking:** The `FloatingFarmerActionDock` pins critical actions (Audio Voice Readout, Find Dealer, Add to Tasks) at the bottom 80px of the viewport within thumb reach.
- **No-Glare Sunlight Contrast:** Minimum text contrast ratio of 4.5:1 against card backgrounds, avoiding subtle low-contrast gray text.

---

## Section 5: Frontend Components Reference

The application contains **51 components** organized into core views, modal dialogs, and specialized UI widgets.

### 5.1 Core Views & Screen Components

#### 1. `Dashboard.tsx` (Screen: `'home'`)
- **Path:** `src/components/Dashboard.tsx`
- **Purpose:** Primary application control center displayed upon farmer login.
- **Props:**
  ```typescript
  interface DashboardProps {
    onNavigate: (screen: Screen) => void;
    onSelectCrop: (crop: CropPrice) => void;
    tasks: Task[];
    onToggleTask: (taskId: string) => void;
    onOpenDiagnosis: (imageBase64: string) => void;
    selectedLanguage: Language;
    lastDiagnosis?: any;
    onViewDiagnosisDetails?: (diag: any) => void;
  }
  ```
- **Key State:** Quick filter tabs, GPS weather state, live mandi market ticker, pending spray tasks.
- **Child Components:** `WeatherSummary`, `OfflineBanner`, `FloatingFarmerActionDock`, `CropPriceCard`.

#### 2. `Diagnosis.tsx` (Screen: `'diagnosis'`)
- **Path:** `src/components/Diagnosis.tsx`
- **Purpose:** Complete diagnostic workspace coordinating image upload, live camera capture, AI analysis, confidence evaluation, and display of treatment protocols.
- **Props:**
  ```typescript
  interface DiagnosisProps {
    onBack: () => void;
    onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
    language: Language;
    initialResult?: DiagnosisResult | null;
    initialImage?: string | null;
    onFindSuppliers?: (query: string) => void;
    onOpenLiveVoice?: () => void;
  }
  ```
- **Key State:** `image` (base64), `analyzing` (boolean), `result` (`DiagnosisResult`), `multiAgentState` (DAG execution steps), `activeTreatmentTab` (`'organic' | 'chemical'`).
- **Child Components:** `CameraDiagnosis`, `DiagnosticResults`, `MultiAgentPipelineRibbon`, `FoliageBiometricHUD`, `WhatsAppShare`.

#### 3. `DiagnosticResults.tsx`
- **Path:** `src/components/DiagnosticResults.tsx`
- **Purpose:** Renders the comprehensive post-diagnostic report including severity rating, confidence meter, meteorological spray advisories, side-by-side organic vs chemical comparisons, and ICAR ITK remedies.
- **Props:** Receives `DiagnosisResult`, `language`, `onAddTask`, `onFindSuppliers`, `onOpenLiveVoice`.
- **Features:** Integrates `ConfidenceBadge`, `WeatherAdvisoryBanner`, `DeficiencyCard`, `AlternativeDiagnosesCard`, and `TreatmentPlanView`.

#### 4. `Market.tsx` (Screen: `'market'`)
- **Path:** `src/components/Market.tsx`
- **Purpose:** Pan-Indian APMC Mandi commodity market prices explorer.
- **Features:** Category filtering (Grains, Vegetables, Oilseeds, Fruits), sorting (Price High/Low, % Change), real-time search, and launch button for `ArbitrageAnalyzer`.

#### 5. `ArbitrageAnalyzer.tsx`
- **Path:** `src/components/ArbitrageAnalyzer.tsx`
- **Purpose:** Calculates true net profit when transporting crops between regional mandis.
- **Logic:** Computes Haversine distance in kilometers from farmer GPS to target mandi, estimates diesel transport cost (₹22/km), deducts mandi cess (2%), and highlights the highest net margin market.

#### 6. `Suppliers.tsx` (Screen: `'suppliers'`)
- **Path:** `src/components/Suppliers.tsx`
- **Purpose:** Directory of licensed agro-input retailers and fertilizer depots.
- **Features:** GPS distance sorting, verification checkmarks with official license IDs, stock status tags (Bio-fertilizer, Neem Cake, Ridomil), phone dialing, and view toggle between directory list and `GoogleFertilizerMap`.

#### 7. `GoogleFertilizerMap.tsx` / `FertilizerMap.jsx`
- **Path:** `src/components/GoogleFertilizerMap.tsx` / `src/components/FertilizerMap.jsx`
- **Purpose:** Interactive spatial map rendering agricultural input stockists with custom pin markers, category filters, and info-window popups.
- **Fallbacks:** Automatically renders Leaflet (`FertilizerMap.jsx`) if Google Maps JavaScript SDK fails to load or API key is restricted.

#### 8. `GoogleMapsAgent.tsx` (Screen: `'maps-agent'`)
- **Path:** `src/components/GoogleMapsAgent.tsx`
- **Purpose:** Conversational spatial assistant allowing farmers to query nearby facilities in natural language (e.g., *"Find the nearest cold storage on Bangalore highway"*).
- **Backend:** Powered by `/api/gemini/maps-agent` leveraging Gemini Places & Routes grounding.

#### 9. `SoilAnalysis.tsx` (Screen: `'soil-analysis'`)
- **Path:** `src/components/SoilAnalysis.tsx`
- **Purpose:** Interprets Soil Health Cards (SHC). Farmer enters Nitrogen (N), Phosphorus (P), Potassium (K) in kg/ha, pH (4.0 - 9.0), soil texture (Loam, Clay, Sandy, Black Cotton), and moisture percentage.
- **Output:** NPK nutrient deficit radar, fertilizer dosage calculator, crop suitability matrix, and integrated Fertilizer AI Assistant.

#### 10. `SchemeFinder.tsx` (Screen: `'scheme-finder'`)
- **Path:** `src/components/SchemeFinder.tsx`
- **Purpose:** Eligibility matching engine for government agricultural welfare programs (PM-KISAN, PM Fasal Bima Yojana, SMAM Farm Mechanization, Paramparaghat Krishi Vikas Yojana).
- **Filters:** Farmer landholding size (<2ha for Small/Marginal), state selection, category (Insurance, Subsidies, Machinery).

#### 11. `LiveAudioChat.tsx`
- **Path:** `src/components/LiveAudioChat.tsx`
- **Purpose:** Hands-free bidirectional voice consultation with Gemini Live API over WebSockets.
- **Audio Pipeline:** Captures raw microphone audio via `AudioContext` and `ScriptProcessorNode`, downsamples to 16,000 Hz, encodes to 16-bit linear PCM base64 chunks, streams to `/api/live-ws`, and receives 24kHz audio chunks for real-time buffer playback.

#### 12. `AndroidWorkspace.tsx` (Screen: `'android'`)
- **Path:** `src/components/AndroidWorkspace.tsx`
- **Purpose:** Virtual Android developer studio simulating an active Android device alongside live Kotlin Jetpack Compose source code (`MainActivity.kt`, `AndroidManifest.xml`, `build.gradle.kts`).
- **Capabilities:** Live APK compile simulation, terminal build logs, code copy/download, and interactive phone screen emulator.

#### 13. `Calendar.tsx` (Screen: `'calendar'`)
- **Path:** `src/components/Calendar.tsx`
- **Purpose:** Daily and weekly farm task schedule tracking upcoming spray rounds, irrigation cycles, and fertilizer top-dressing.
- **Features:** Weather conflict alerts and voice task dictation.

#### 14. `Community.tsx` (Screen: `'community'`)
- **Path:** `src/components/Community.tsx`
- **Purpose:** Peer-to-peer farmer forum for asking community questions, sharing crop photos, voting on pest solutions, and viewing verified agronomist answers.

#### 15. `Profile.tsx` (Screen: `'profile'`)
- **Path:** `src/components/Profile.tsx`
- **Purpose:** Manages farmer details: Name, district, state, land area (acres), primary crops, irrigation type (Drip, Canal, Rainfed), and preferred interface language.

#### 16. `History.tsx` (Screen: `'history'`)
- **Path:** `src/components/History.tsx`
- **Purpose:** Archive of all previous diagnostic scans saved to Cloud Firestore and local IndexedDB with date filtering, crop tags, and quick re-opening.

### 5.2 Micro-Components & UI Utilities (`src/components/ui/`)
- `ConfidenceBadge.tsx`: Displays diagnostic confidence percentage with color tiers: Green (≥80%), Amber (70-79%), Red (<70% with human escalation notice).
- `WeatherAdvisoryBanner.tsx`: High-visibility notification displaying whether spraying is recommended today, wind speed, and rain washout risk.
- `DeficiencyCard.tsx`: Dedicated card identifying secondary nutrient deficiencies (Zinc, Iron, Magnesium, Boron) with leaf location diagrams.
- `AlternativeDiagnosesCard.tsx`: Displays differential diagnosis probabilities (e.g., Early Blight 85% vs Septoria Leaf Spot 15%) with key visual distinctions.
- `ImageEnhancerTool.tsx`: On-device HTML5 canvas filter tool allowing farmers to adjust brightness, contrast, and leaf sharpening before AI submission.
- `ManualSymptomSelector.tsx`: Interactive multi-select checklist of observed plant symptoms enabling the farmer to guide and refine AI predictions.

---

## Section 6: Backend Architecture & API Route Directory

### 6.1 Server Configuration (`server.ts`)
The server is an Express application written in TypeScript and executed via `tsx` in development or bundled via `esbuild` into CommonJS (`dist/server.cjs`) for production.

```text
Incoming Request -> Port 3000
    ├── CORS Middleware
    ├── JSON Parser (50MB limit for Base64 leaf images)
    ├── /api/live-ws -> WebSocket Upgrade Handler (Gemini Live Voice)
    ├── /api/agrocare/analyze -> Master Multi-Agent DAG Pipeline
    ├── /api/agents/* -> Modular Micro-Agent Sub-routes
    ├── /api/gemini/* -> Direct Gemini AI Proxy Endpoints
    ├── /api/fertilizer/* -> FCO 1985 RAG Search & Calculations
    ├── /api/mandi-prices -> Agmarknet Gov Data Proxy & Cache
    └── Static SPA Fallback -> Serves dist/index.html (in production)
```

### 6.2 WebSocket Streaming Architecture (`/api/live-ws`)
Mounted directly on the Express HTTP server instance using the `ws` library:
- **Client Handshake:** Upgrades `ws://<host>/api/live-ws?crop=Tomato&disease=Late+Blight`.
- **Relay Mechanism:** Connects outbound to Google Gemini Live API (`wss://generativelanguage.googleapis.com/ws/...` using Gemini 2.0 Flash Exp).
- **Audio Protocol:** Transmits bidirectional Linear PCM 16-bit audio frames (client to server at 16kHz; server to client at 24kHz).
- **System Instructions:** Configured with specialized agronomist persona speaking concise, spoken-dialect guidance tailored to rural farmers.

### 6.3 Comprehensive REST API Route Reference

| Method | Route Path | Request Payload / Query Params | Response Schema / Output | Functional Description |
|---|---|---|---|---|
| **POST** | `/api/agrocare/analyze` | `{ crop, symptoms, location: { lat, lng }, farmerProfile, imageBase64 }` | `AgroCareMasterAnalyzeResponse` | **Master DAG Pipeline:** Executes Sentinel -> Context -> Planner -> Safety -> Executor -> Escalation. Returns trace, plan, suppliers, and schemes. |
| **POST** | `/api/agents/sentinel/analyze` | `{ imageBase64, crop, symptoms }` | `{ diagnosis, confidence, severity, imageQuality }` | Evaluates leaf photo clarity and returns initial pathology identification. |
| **POST** | `/api/agents/sentinel/validate-image` | `{ imageBase64 }` | `{ valid: boolean, qualityScore, issues: [] }` | Rejects blurry photos, non-crop objects, or excessively dark captures. |
| **POST** | `/api/context/evaluate` | `{ lat, lng, crop, soilType }` | `ContextEvaluateResponse` | Fuses live weather telemetry (Open-Meteo), regional soil data, and spray window calculations. |
| **GET** | `/api/context/weather` | `?lat=13.34&lng=77.10` | `{ temperatureCelsius, rainExpected, windSpeedKph, treatmentWindow }` | Returns real-time agricultural weather advisory. |
| **POST** | `/api/agents/planner/plan` | `{ diagnosis, context, farmerProfile }` | `PlannerPlanResponse` | Formulates Integrated Pest Management plan; outputs `TAKE_ACTION`, `DELAY_TREATMENT`, or `MONITOR_ONLY`. |
| **POST** | `/api/agents/safety/evaluate` | `{ sentinelOutput, contextOutput, plannerOutput }` | `{ safeDecision, approved, safetyFlags: [] }` | Safety gatekeeper enforcing non-action overrides if weather conflicts or pesticide hazards exist. |
| **POST** | `/api/agents/executor/execute` | `{ plan, location, farmerProfile }` | `{ suppliers: [], schemes: [], followUpTask }` | Locates nearest verified retailers, matches subsidies, and creates a calendar task. |
| **POST** | `/api/agents/escalation/evaluate` | `{ confidence, severity, diagnosis }` | `{ escalate: boolean, reason, ticketId, emergencyContacts }` | Evaluates if diagnostic confidence is below 0.70; creates KVK extension ticket if triggered. |
| **GET** | `/api/cases/:caseId/trace` | Path parameter `:caseId` | `AgroCareCaseTrace` | Returns complete multi-agent execution audit trail with per-step latency in milliseconds. |
| **GET** | `/api/suppliers/nearby` | `?lat=13.34&lng=77.10&radiusKm=25` | `SupplierRecord[]` | Searches geo-indexed verified agrochemical and fertilizer dealers within radius. |
| **POST** | `/api/schemes/match` | `{ state, crop, landSize }` | `GovernmentSchemeRecord[]` | Matches farmer profile against PM-KISAN, PMFBY, SMAM, and state welfare schemes. |
| **POST** | `/api/fertilizer/ask` | `{ question, crop, soilContext, lang }` | `FertilizerAgentResponse` | Natural language agronomic RAG assistant backed by statutory FCO 1985 documents. |
| **GET** | `/api/fertilizer/compatibility` | `?fertilizerA=Urea&fertilizerB=DAP` | `{ compatible: boolean, warningMessage, chemicalReason }` | Evaluates chemical tank-mix compatibility between two fertilizer compounds. |
| **POST** | `/api/gemini/diagnose` | `{ imageBase64, crop, weather, soilType }` | `DiagnosisResult` | Primary multimodal vision diagnostic route using `gemini-2.5-flash`. |
| **POST** | `/api/gemini/chat` | `{ message, history: [], context }` | `{ reply: string }` | Conversational agronomic chat advisor with farming persona and context grounding. |
| **POST** | `/api/gemini/nearby-suppliers` | `{ lat, lng, query }` | `Supplier[]` | Google Maps Places API proxy retrieving verified agricultural vendors. |
| **POST** | `/api/gemini/maps-agent` | `{ message, lat, lng, mode }` | `MapsAgentResult` | Natural language spatial agent querying Google Maps Places and routing. |
| **GET** | `/api/mandi-prices` | `?state=Karnataka&district=Tumkur&limit=50` | `{ records: MandiRecord[], source }` | Proxies Indian Government Agmarknet data with embedded SQLite fallback. |
| **POST** | `/api/gemini/generate-speech` | `{ text, language }` | `{ audioContent: string }` | Generates speech audio (TTS) for illiterate farmers. |
| **POST** | `/api/gemini/analyze-soil` | `{ n, p, k, ph, type, moisture }` | `SoilAnalysisResult` | Generates soil nutrient deficit report and fertilizer application schedule. |
| **GET** | `/api/system/health` | None | `{ status: "ok", timestamp, agentsReady: true }` | Production health check and container readiness probe. |

---

## Section 7: Multi-Agent Orchestration Engine & RAG Pipelines

### 7.1 Directed Acyclic Graph (DAG) Execution Flow
AgroCare AI rejects monolithic prompt execution in favor of an auditable, deterministic multi-agent pipeline:

```text
                          [ Leaf Photo / Sensor Data ]
                                       │
                                       ▼
                            ┌─────────────────────┐
                            │   SENTINEL AGENT    │
                            │  (Image Quality &   │
                            │ Pathogen Detection) │
                            └──────────┬──────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
        ┌───────────────────────┐             ┌───────────────────────┐
        │     CONTEXT AGENT     │             │   ESCALATION AGENT    │
        │   (Weather Telemetry, │             │ (Confidence < 0.70?   │
        │    Soil & Geolocation)│             │  Route to KVK Expert) │
        └──────────┬────────────┘             └───────────────────────┘
                   │
                   ▼
        ┌───────────────────────┐
        │     PLANNER AGENT     │
        │ (Integrated Treatment │
        │      Formulation)     │
        └──────────┬────────────┘
                   │
                   ▼
        ┌───────────────────────┐
        │     SAFETY AGENT      │
        │ (Rain Spray Gate &    │
        │ Chemical Compliance)  │
        └──────────┬────────────┘
                   │
                   ▼
        ┌───────────────────────┐
        │    EXECUTOR AGENT     │
        │ (Supplier Geo-Lookup, │
        │ Schemes & Calendar)   │
        └──────────┬────────────┘
                   │
                   ▼
        [ Master Case Output & Auditable Trace ]
```

### 7.2 Agent Role Specifications

#### 1. Sentinel Agent (`server/agents/sentinelAgent.ts`)
- **Primary Responsibility:** Validates leaf image quality (detects blur, low lighting, or non-crop objects) and performs initial pathogen classification.
- **Model:** `gemini-2.5-flash` with structured JSON output schema.
- **Diagnostic Metrics:** Returns identified disease name (English, Hindi, Kannada), confidence score (0.00 to 1.00), visual severity level (`'Low' | 'Medium' | 'High' | 'Severe'`), and extracted leaf symptoms.
- **Fail-Safe Fallback:** If Gemini API is unreachable or image payload is missing, performs exact symptom-matching against `DISEASE_DATABASE` (`src/lib/diseaseDatabase.ts`).

#### 2. Context Agent (`server/agents/contextAgent.ts`)
- **Primary Responsibility:** Enriches the diagnostic event with meteorological, soil, and geospatial intelligence.
- **Telemetry Sources:** Queries Open-Meteo REST API for current temperature, precipitation probability, humidity, and 10-meter wind speed.
- **Treatment Window Logic (`calculateTreatmentWindow`):**
  - High Rain Probability (>50%) or Rain Volume (>1mm) -> `recommended: false` (Reason: *Rain expected; spray will be washed out*).
  - High Wind Speed (>20 km/h) -> `recommended: false` (Reason: *Wind speed too high; spray drift risk*).
  - Unfavorable Humidity (<30% or >90%) -> `recommended: false` (Reason: *Suboptimal foliar absorption*).
  - Clean Conditions -> `recommended: true` (Optimal 4-hour application window).

#### 3. Planner Agent (`server/agents/plannerAgent.ts`)
- **Primary Responsibility:** Generates an actionable, Integrated Pest Management (IPM) treatment plan.
- **Decision Matrix:**
  - If weather gate is blocked -> Emits decision `DELAY_TREATMENT` with bold action *"DO NOT SPRAY NOW. Postpone application until weather clears."*
  - If disease severity is `'Low'` and weather is dry -> Emits `MONITOR_ONLY` with organic preventative guidance.
  - If disease is active and weather is favorable -> Emits `TAKE_ACTION` with verified chemical and organic bio-input treatment schedules.

#### 4. Safety Agent (`server/agents/safetyAgent.ts`)
- **Primary Responsibility:** Acts as an immutable safety firewall over the Planner's recommendations.
- **Invariants Enforced:**
  - **Weather Override:** If `context.rainExpected === true` and Planner attempted to recommend spraying, Safety intercepts and forces decision to `DELAY_TREATMENT`.
  - **Chemical Toxicity Checks:** Verifies that recommended chemical compounds comply with Central Insecticides Board & Registration Committee (CIBRC) standards and specifies mandatory withholding periods (PHI) before harvest.

#### 5. Executor Agent (`server/agents/executorAgent.ts`)
- **Primary Responsibility:** Translates the treatment plan into real-world operational logistics.
- **Actions:**
  - Searches licensed input dealers via `findNearbySuppliers` using the Haversine formula.
  - Matches applicable agricultural subsidies via `matchEligibleSchemes`.
  - Automatically provisions follow-up monitoring tasks (scheduled 48 hours post-treatment).

#### 6. Escalation Agent (`server/agents/escalationAgent.ts`)
- **Primary Responsibility:** Protects farmers against AI hallucinations or low-confidence edge cases.
- **Threshold Rule:**
  $$\text{Confidence} < 0.70 \implies \text{ESCALATE = TRUE}$$
- **Output:** Issues an automated KVK support ticket ID (`KVK-ESC-xxxx`), flags the diagnosis for human agronomist review, and supplies Kisan Call Center toll-free helpline (`1800-180-1551`).

#### 7. Fertilizer RAG Agent (`server/agent/fertilizer/fertilizerAgent.ts`)
- **Primary Responsibility:** Enforces statutory compliance with the Indian Fertilizer (Control) Order 1985 (FCO).
- **Architecture:** Local Ingestion & Vector Retrieval engine (`retriever.ts`) searching official FCO schedules for Urea, DAP, MOP, SSP, Zinc Sulphate, and Bio-fertilizers.
- **Safety Engine (`safetyEngine.ts`):** Evaluates chemical tank-mix incompatibilities (e.g., *Never mix Calcium Nitrate with Phosphate fertilizers; precipitation of insoluble Calcium Phosphate will occur*).

### 7.3 Tracing & Observability (`server/agents/trace.ts`)
Every invocation of the master pipeline is stamped with a unique Case ID (`AC-2026-XXXX`) and persists an auditable trace:
```typescript
interface AgroCareCaseTrace {
  caseId: string;
  timestamp: string;
  totalLatencyMs: number;
  steps: {
    agentName: 'sentinel' | 'context' | 'planner' | 'safety' | 'executor' | 'escalation';
    status: 'completed' | 'failed' | 'skipped';
    latencyMs: number;
    inputPayloadSummary: string;
    outputPayloadSummary: string;
  }[];
}
```
Traces are accessible via `GET /api/cases/:caseId/trace` for real-time developer debugging.

---

## Section 8: External Integrations, APIs & Grounding Services

### 8.1 Google Gemini API (`@google/genai`)
- **SDK Import:** Always initialized server-side via `new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })`.
- **Primary Models Used:**
  - `gemini-2.5-flash`: Multimodal vision diagnosis, symptom extraction, and general agricultural reasoning.
  - `gemini-2.0-flash-exp`: Real-time bidirectional WebSockets audio streaming (`/api/live-ws`).
- **Grounding Tools:** Uses Gemini Google Search and Google Maps Places tools for real-time fact retrieval.

### 8.2 Google Maps Platform APIs
- **Google Maps JavaScript SDK:** Client-side interactive maps rendered in `GoogleFertilizerMap.tsx`.
- **Places API:** Nearby search and place details for agricultural input shops and APMC markets.
- **Directions & Distance Matrix:** Route calculation and highway driving durations used in Mandi Arbitrage.
- **Maps Grounded Agent (`/api/gemini/maps-agent`):** Leverages Gemini Maps Grounding tool to query spatial points of interest.

### 8.3 Open-Meteo Telemetry API
- **Endpoint:** `https://api.open-meteo.com/v1/forecast`
- **Parameters:** `latitude`, `longitude`, `current=temperature_2m,rain,wind_speed_10m,relative_humidity_2m`, `hourly=precipitation_probability`.
- **Usage:** Free, public, keyless meteorological API providing raw physical measurements to the Context and Safety agents.

### 8.4 Indian Government Open Data (Agmarknet)
- **Data Source:** Department of Agriculture and Farmers Welfare (data.gov.in).
- **Ingestion & Caching:** Queried via `/api/mandi-prices`. Uses `server/data/market_data.json` and SQLite database caching as failover when the external government gateway is slow or offline.

### 8.5 ICAR Indigenous Technical Knowledge (ITK)
- **Repository:** Indian Council of Agricultural Research validated ITK inventory compiled in `src/data/itk-knowledge.ts`.
- **Coverage:** Natural pest repellents (Neemastra, Agniastra, Dashparni Ark, Panchagavya, Jeevamrutha), seed treatments using cow dung and urine, and herbal veterinary remedies for livestock.

---

## Section 9: Data Models, Schemas & TypeScript Types

### 9.1 Core Diagnostic Interfaces (`src/services/gemini.ts`)
```typescript
export interface TreatmentDetails {
  name: string;
  nameHi: string;
  nameKn?: string;
  dosage: string;
  frequency: string;
  precautions: string;
  costEstimate: string;
  brand?: string;
  packagingSize?: string;
  modeOfAction?: string;
  itkSource?: string;
  chemicalComposition?: string;
  fertilizerCategory?: 'Organic Base' | 'Chemical Base' | 'Inorganic Base';
}

export interface WeatherAdvisory {
  canSprayNow: boolean;
  warningLevel: 'safe' | 'caution' | 'danger';
  title: string;
  message: string;
  optimalTiming: string;
}

export interface DiagnosisResult {
  crop: string;
  disease: string;
  diseaseHi: string;
  diseaseKn: string;
  scientificName?: string;
  confidence: number; // 0 - 100 on client; 0.0 - 1.0 on agent backend
  description: string;
  symptoms: string[];
  severity: 'Low' | 'Medium' | 'High' | 'Severe';
  prevention: {
    immediate: string[];
    longTerm: string[];
  };
  treatment: {
    organic: TreatmentDetails;
    chemical: TreatmentDetails;
  };
  weatherAdvisory?: WeatherAdvisory;
  alternativeDiagnoses?: {
    diseaseName: string;
    probability: number;
    keyDistinction: string;
  }[];
}
```

### 9.2 Master Multi-Agent Pipeline Schemas (`server/agents/types.ts`)
```typescript
export interface AgroCareMasterAnalyzeResponse {
  caseId: string;
  timestamp: string;
  status: 'SUCCESS' | 'ESCALATED' | 'FAILED';
  diagnosis: {
    crop: string;
    identifiedCondition: string;
    confidence: number;
    severity: 'Low' | 'Medium' | 'High' | 'Severe';
  };
  context: {
    weatherSafe: boolean;
    weatherReason: string;
    treatmentWindow: {
      recommended: boolean;
      windowStart?: string;
      windowEnd?: string;
    };
  };
  decision: {
    actionRequired: 'TAKE_ACTION' | 'DELAY_TREATMENT' | 'MONITOR_ONLY';
    summary: string;
    safetyOverrideApplied: boolean;
    treatmentPlan: {
      primaryOrganicRemedy?: string;
      primaryChemicalRemedy?: string;
      dosageAndApplication: string[];
      preventionSteps: string[];
    };
  };
  execution: {
    suppliers: Array<{
      id: string;
      name: string;
      distanceKm: number;
      phone?: string;
      verified: boolean;
    }>;
    schemes: Array<{
      id: string;
      name: string;
      benefit: string;
      portalUrl: string;
    }>;
  };
  escalation: {
    isEscalated: boolean;
    reason?: string;
    ticketId?: string;
  };
  trace: Array<{
    agent: string;
    status: string;
    latencyMs: number;
    timestamp: string;
  }>;
  performance: {
    totalLatencyMs: number;
  };
}
```

### 9.3 Firestore Schema (`firebase-blueprint.json`)
- `/users/{userId}`: Document of type `UserProfile` (`uid`, `name`, `email`, `role`).
- `/users/{userId}/diagnoses/{diagnosisId}`: Document of type `DiagnosisRecord` (`userId`, `crop`, `disease`, `confidence`, `severity`, `timestamp`, `imageUrl`, `diagnosis`).

---

## Section 10: State Management, Custom Hooks & Offline Engine

### 10.1 State Architecture Overview
AgroCare AI implements a layered state strategy:
1. **Application Route & View State:** Managed in `src/App.tsx` via standard React hooks (`useState`, `useCallback`).
2. **User Session & Identity:** Managed via React Context (`AuthProvider.tsx`) listening to `onAuthStateChanged` from Firebase Auth.
3. **Task & Action State:** Persisted to `localStorage` under `'agrocare_tasks_state'` with fallback to `INITIAL_TASKS`.
4. **Recent Diagnoses:** Persisted to `localStorage` under `'agrocare_latest_diagnosis'` and synced asynchronously with Cloud Firestore.
5. **Zero-Latency Offline Store:** Managed via IndexedDB (`agrocare_offline_db`) for large datasets and image caches.

### 10.2 Custom Hooks
- **`useGeolocation()` (`src/hooks/useGeolocation.ts`):** Requests HTML5 navigator GPS coordinates. If permission is denied or device is stationary indoors, defaults seamlessly to Karnataka agricultural centroid (`lat: 15.3173, lng: 75.7139`) and flags `isFallback: true`.
- **`useConnectivity()` (`src/services/connectivity.ts`):** Listens to browser `online` and `offline` events and triggers reactive banner updates across the application.

### 10.3 Offline Database Architecture (`src/utils/offlineStorage.ts`)
- **Database:** IndexedDB named `agrocare_offline_db` (Version 1).
- **Stores:**
  - `diagnoses`: Primary key `id`. Stores completed diagnostic objects with offline base64 images and timestamps.
  - `pending_syncs`: Action queue for operations performed offline (saving notes, rating treatments) that sync to Firestore upon reconnection.
- **Pre-Bundled Disease Library (`OFFLINE_DISEASE_LIBRARY`):** Contains fully detailed ICAR treatment profiles for 10 high-impact diseases (e.g., Coconut Bud Rot, Tomato Late Blight, Rice Blast, Cotton Bollworm, Wheat Rust) enabling diagnostic lookups without an active internet connection.

---

## Section 11: Configuration & Environment Variables

### 11.1 Environment Variables Specification
Create a `.env` file at the project root based on `.env.example`:

| Variable Name | Required? | Location | Description & Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | **YES** | Server-side (`process.env`) | Secret API key for Google Gemini models. **Never** expose to client. |
| `VITE_GOOGLE_MAPS_API_KEY` | **YES** | Client-side (`import.meta.env`) | Public Maps JavaScript API key for rendering Google Maps in browser. |
| `AGROCARE_ESCALATION_THRESHOLD` | Optional | Server-side (`process.env`) | Confidence threshold for expert escalation (Defaults to `0.70`). |
| `PORT` | System (3000) | Server-side | Application port. Hardcoded to 3000 by Cloud Run infrastructure. |

### 11.2 Platform Metadata (`metadata.json`)
```json
{
  "name": "AgroCare AI",
  "description": "Multi-agent smart farming ecosystem providing crop diagnostics, spray window weather advisories, mandi market arbitrage, and verified supplier locations.",
  "requestFramePermissions": [
    "camera",
    "microphone",
    "geolocation"
  ],
  "majorCapabilities": [
    "MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"
  ]
}
```

---

## Section 12: Testing, Quality Assurance & Verification Suites

### 12.1 Multi-Agent Test Suite (`scripts/test-agent-suite.ts`)
The project includes a comprehensive end-to-end test suite containing **11 test suites and 41 distinct assertions**:

```bash
# Execute the comprehensive multi-agent test suite
npx tsx scripts/test-agent-suite.ts
```

#### Breakdown of Test Suites
1. **Suite 1: Sentinel Agent & Vision Diagnostics:** Validates healthy leaf identification, pathogen detection, and invalid image rejection.
2. **Suite 2: Context Agent & Weather Spray Window:** Verifies rain washout detection (>50% precipitation probability) and high wind drift spray blocks (>20 km/h).
3. **Suite 3: Planner Agent & Non-Action Decisions:** Tests that rain forecast strictly yields `DELAY_TREATMENT` with `"DO NOT SPRAY NOW"` messaging, while clear weather yields `TAKE_ACTION`.
4. **Suite 4: Safety Layer Gatekeeper:** Verifies that Safety overrides unsafe treatment plans when meteorological conflicts arise.
5. **Suite 5: Escalation Agent Boundary Checks:** Tests edge conditions across confidence boundaries (0.30, 0.49, 0.69 -> `escalate: true`; 0.70, 0.90 -> `escalate: false`).
6. **Suite 6: Supplier & Licensing GeoAdapter:** Verifies Haversine distance calculations and official dealer license validation.
7. **Suite 7: Government Schemes Matching:** Verifies matching logic for PM-KISAN, PMFBY, and SMAM.
8. **Suite 8: Feedback & Follow-up Memory:** Tests SQLite/memory persistence of farmer ratings and 48-hour follow-up scheduling.
9. **Suite 9: End-to-End Master Pipeline (`/api/agrocare/analyze`):** Tests full DAG pipeline execution, case ID generation (`AC-2026-`), and latency measurement.
10. **Suite 10: Case Trace Observability:** Validates audit trail retrieval and millisecond-level step latency logging.
11. **Suite 11: System Health & Readiness:** Validates `/api/system/health` probe response.

### 12.2 TypeScript Static Type Checking
```bash
# Verify static types across the entire codebase
npm run lint
# (Runs tsc --noEmit)
```

---

## Section 13: Production Build System & Cloud Deployment

### 13.1 Build Lifecycle
The application utilizes a single unified build command defined in `package.json`:
```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "lint": "tsc --noEmit"
  }
}
```

### 13.2 Build Execution Phases
1. **Frontend Compilation (`vite build`):** Compiles React TypeScript source files into optimized, tree-shaken static assets inside the `dist/` directory.
2. **Backend Bundling (`esbuild server.ts ...`):** Bundles the Express server and all multi-agent modules into a single CommonJS executable (`dist/server.cjs`). External npm packages are preserved as node external dependencies.
3. **Production Startup (`node dist/server.cjs`):** Boots the Express server on port 3000, mounts static file handlers pointing to `dist/`, and handles single-page app fallbacks via `app.get('*', ...)`.

### 13.3 Cloud Run & Network Constraints
- **Port Ingress:** Port 3000 is hardcoded and strictly enforced by the container reverse proxy. Never bind to other ports (e.g., 5173 or 8080).
- **Host Binding:** Express server must bind to `0.0.0.0` to permit external ingress routing.
- **HMR Behavior:** Hot Module Replacement is disabled in this environment (`DISABLE_HMR=true`). Preview refreshes occur automatically after agent turns.

---

## Section 14: Quick Start & Developer Extension Playbook

### 14.1 Step-by-Step Setup
1. **Clone the repository & install dependencies:**
   ```bash
   git clone <repo-url>
   cd agrocare-ai
   npm install
   ```
2. **Configure environment credentials:**
   ```bash
   cp .env.example .env
   # Edit .env and supply your GEMINI_API_KEY and VITE_GOOGLE_MAPS_API_KEY
   ```
3. **Start local development server:**
   ```bash
   npm run dev
   # Express and Vite will start concurrently at http://localhost:3000
   ```
4. **Execute validation tests:**
   ```bash
   npx tsx scripts/test-agent-suite.ts
   ```

### 14.2 How to Add a New Crop or Pathogen
1. Open `src/lib/diseaseDatabase.ts`.
2. Append a new record adhering to the `DiseaseEntry` interface:
   ```typescript
   {
     id: 'wheat-yellow-rust',
     name: 'Yellow Rust / Stripe Rust',
     nameHi: 'पीला रतुआ (Yellow Rust)',
     nameKn: 'ಹಳದಿ ತುಕ್ಕು ರೋಗ',
     scientificName: 'Puccinia striiformis',
     affectedCrops: ['Wheat', 'Barley'],
     category: 'fungal',
     severity: 'High',
     symptoms: [
       'Linear stripes of bright yellow pustules on foliage',
       'Yellow powdery spore masses dislodged easily upon touch'
     ],
     organicTreatment: {
       name: 'Fermented Sour Buttermilk (Chhachh) + Neem Oil 1500ppm',
       // ... dosage, formulation, withholdingPeriod, costEstimate
     },
     chemicalTreatment: {
       name: 'Propiconazole 25% EC (Tilt)',
       // ... activeIngredient, applicationRate, withholdingPeriod (PHI)
     },
     weatherSensitivity: {
       highHumidityRisk: true,
       rainWashoutRisk: true,
       optimalTempRange: '10-20°C',
       sprayConditions: 'Cool dry mornings with low wind'
     }
   }
   ```
3. Update `src/data/market_data.json` if commodity pricing data is required for the new crop.

### 14.3 How to Add a New Agent to the Multi-Agent Pipeline
1. Create your agent module inside `server/agents/` (e.g., `server/agents/carbonAgent.ts`).
2. Define its input and output interfaces in `server/agents/types.ts`.
3. In `server/agents/orchestrator.ts`:
   - Import your new agent runner function.
   - Insert the execution step into `runAgroCareMasterPipeline` at the appropriate DAG order.
   - Measure latency via `startTrace` and `finalizeTrace`.
   - Append results to `AgroCareMasterAnalyzeResponse`.
4. Add a corresponding test case inside `scripts/test-agent-suite.ts`.

### 14.4 Architectural Rules of Engagement
- **Rule 1: Never Leak Secrets to Browser.** All Gemini API calls and third-party secrets must execute server-side in `server.ts` or `server/agents/`.
- **Rule 2: Lazy Initialize SDKs.** Guard against missing API keys by lazily creating the `GoogleGenAI` instance inside route handlers rather than at module load time.
- **Rule 3: Maintain Port 3000 Invariance.** Do not alter Express listener port from `3000`.
- **Rule 4: Multi-Lingual Consistency.** When generating agricultural recommendations, provide localizations for English, Hindi (`nameHi`), and Kannada (`nameKn`).

---
*Document produced and verified for the AgroCare AI Core Engineering Repository. All rights reserved.*
