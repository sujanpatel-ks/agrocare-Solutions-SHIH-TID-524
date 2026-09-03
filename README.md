# 🌾 AgroCare AI

### Context-Aware Multimodal Agricultural Decision & Action Assistant

> **From detecting a crop problem to deciding what to do next — AgroCare AI connects diagnosis, weather, soil, markets, local knowledge, and farmer action in one intelligent workflow.**

[![Build](https://img.shields.io/badge/Build-Verified-success?style=for-the-badge)](#-validation--testing)
[![React](https://img.shields.io/badge/React-18%2F19-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-First-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Google-Gemini-orange?style=for-the-badge)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Integrated-FFCA28?style=for-the-badge\&logo=firebase\&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🚀 Why AgroCare AI?

Traditional agricultural applications often solve **one problem at a time**:

* Disease detection
* Weather forecasting
* Market prices
* Soil analysis
* Government schemes
* Input supplier discovery

But farming decisions are **connected decisions**.

A disease diagnosis without weather context can lead to bad spraying decisions.

A market price without transportation cost does not tell the farmer where to sell.

A fertilizer recommendation without soil information can result in unnecessary input usage.

### AgroCare AI connects these decision layers.

```text
                         🌾 FARMER
                             │
                             ▼
                  ┌─────────────────────┐
                  │   AGROCARE AI       │
                  │ Decision Intelligence│
                  └──────────┬──────────┘
                             │
       ┌─────────────┬───────┼────────┬─────────────┐
       ▼             ▼       ▼        ▼             ▼
   📷 Vision      🌦️ Weather 🧪 Soil  📈 Market    📚 ITK
       │             │       │        │             │
       └─────────────┴───────┼────────┴─────────────┘
                             ▼
                  🧠 CONTEXT-AWARE REASONING
                             │
                             ▼
                    ⚙️ ACTION PLANNING
                             │
                             ▼
                 👨‍🌾 FARMER-READY ADVICE
```

**The core idea: AgroCare does not stop at “What is wrong?” — it helps answer “What should I do next?”**

---

# 🎯 The Problem

Smallholder farmers frequently make decisions with incomplete information.

### 01 — Diagnostic Delay 🔍

Crop disease identification may happen only after visible symptoms become severe or after expert consultation.

### 02 — Fragmented Information 📱

Farmers need to move between different sources for:

* Crop diagnosis
* Weather
* Soil
* Market prices
* Suppliers
* Government schemes
* Agricultural practices

### 03 — Context-Blind Recommendations ⚠️

The same treatment is not necessarily appropriate under every:

* Weather condition
* Crop stage
* Soil condition
* Disease severity
* Geographic location

### 04 — Language & Accessibility Barrier 🗣️

Agricultural technology is often heavily text-driven, creating barriers for users with limited digital or English literacy.

### 05 — Connectivity Constraints 📡

Agricultural users may operate in locations where reliable connectivity cannot always be assumed.

---

# 💡 Our Solution

**AgroCare AI is a multimodal, context-aware agricultural intelligence platform.**

Instead of providing isolated tools, it creates a connected decision workflow:

```text
OBSERVE
   ↓
UNDERSTAND
   ↓
FUSE CONTEXT
   ↓
REASON
   ↓
PLAN ACTION
   ↓
EXPLAIN
   ↓
FARMER ACTS
```

### AgroCare combines:

| Input           | Intelligence           | Outcome                      |
| --------------- | ---------------------- | ---------------------------- |
| 📷 Crop Image   | Multimodal Vision      | Disease / symptom assessment |
| 🌦️ Weather     | Weather intelligence   | Weather-aware action         |
| 🧪 Soil Data    | Soil reasoning         | Fertilizer guidance          |
| 📈 Mandi Prices | Market intelligence    | Selling opportunity          |
| 📍 Location     | Geo intelligence       | Nearby suppliers / markets   |
| 📚 ITK          | Agricultural knowledge | Indigenous practices         |
| 🎙️ Voice       | Conversational AI      | Hands-free interaction       |
| 🌐 Connectivity | Model routing          | Cloud / local fallback       |

---

# 🧠 What Makes AgroCare Different?

## 1. Multimodal Agricultural Intelligence

AgroCare accepts more than text.

```text
📷 Images
🎙️ Voice
📍 Location
🌦️ Weather
🧪 Soil Parameters
📈 Market Data
📚 Agricultural Knowledge
```

These inputs can be combined to produce a more contextual recommendation.

---

## 2. Diagnosis → Decision → Action

Most crop-diagnosis systems stop at:

> **“This crop may have Disease X.”**

AgroCare aims to continue the workflow:

```text
Crop Image
    ↓
Image Quality Check
    ↓
Disease / Symptom Analysis
    ↓
Confidence Assessment
    ↓
Context Collection
    ├── Weather
    ├── Crop / Soil
    ├── Location
    └── Agricultural Knowledge
    ↓
Treatment / Management Options
    ↓
Weather & Context Safety Check
    ↓
Action Recommendation
```

This transforms AI from a **diagnostic chatbot** into a **decision-support system**.

---

# 🤖 AI & Agentic Architecture

AgroCare is designed around specialized decision capabilities rather than one monolithic AI response.

```text
                         👨‍🌾 FARMER
                              │
                    Image / Voice / Text
                              │
                              ▼
                  ┌──────────────────────┐
                  │   CONTEXT ENGINE     │
                  └──────────┬───────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
   📷 Evidence          🌦️ Context          📚 Knowledge
   Collector            Fusion              Retrieval
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
                    🧠 DECISION ENGINE
                             │
                             ▼
                       🛡️ SAFETY GATE
                             │
                             ▼
                     ⚙️ ACTION PLANNER
                             │
                             ▼
                       👨‍🌾 ADVISORY
```

### Core intelligence layers

**Evidence Collection**

Collects observations from images, farmer inputs and connected data sources.

**Evidence Fusion**

Combines multiple evidence sources instead of relying on a single signal.

**Context Engine**

Adds environmental and operational context such as location, weather, crop stage and soil conditions.

**Decision Engine**

Produces a structured decision from available evidence and context.

**Safety Gate**

Checks whether an action recommendation should be allowed, modified or escalated.

**Action Planner**

Converts the decision into practical farmer-oriented steps.

**Decision Trace**

Maintains the reasoning path behind a recommendation for transparency and debugging.

> **Design principle:** Every recommendation should be explainable as a chain of evidence → context → decision → action.

---

# 🔍 Core Features

## 01 — 📷 AI Crop Disease Scanner

Upload or capture a crop image and receive structured AI analysis.

### Pipeline

```text
Camera / Upload
      ↓
Image Quality Validation
      ↓
Multimodal Vision
      ↓
Symptom Analysis
      ↓
Confidence Assessment
      ↓
Structured Diagnosis
      ↓
Treatment Options
```

The interface can present:

* Disease / condition
* Confidence
* Visible symptoms
* Affected region
* Organic management options
* Chemical management options
* Dosage guidance where available
* Recovery / monitoring advice

---

## 02 — 🌦️ Context-Aware Weather Advisory

Weather is not displayed merely as a forecast.

AgroCare attempts to convert weather information into **agricultural action**.

Example:

```text
Rain expected soon
        ↓
Spraying may be ineffective
        ↓
Recommendation
        ↓
Delay application
        ↓
Reassess after suitable weather
```

This makes weather data operational rather than informational.

---

## 03 — 📈 Mandi Price & Arbitrage Intelligence

AgroCare integrates government market-price information and combines it with geographic calculations.

```text
Crop
 ↓
Current Market Prices
 ↓
Nearby Mandis
 ↓
Distance Calculation
 ↓
Estimated Transport Cost
 ↓
Price Difference
 ↓
Potential Selling Advantage
```

Instead of simply saying:

> “Mandi A: ₹X/kg”

the system aims to answer:

> **“Considering location and distance, which market may provide the better selling opportunity?”**

---

## 04 — 🧪 Soil Health Analysis

Farmers can provide:

* Nitrogen
* Phosphorus
* Potassium
* pH
* Moisture
* Soil type

AgroCare converts these values into understandable recommendations including:

* Soil condition
* Nutrient interpretation
* Fertilizer guidance
* Application considerations
* Crop suitability

---

## 05 — 📍 Nearby Agricultural Suppliers

Using location intelligence, AgroCare can help discover nearby:

* Seed suppliers
* Fertilizer stores
* Agricultural input dealers
* Other relevant agricultural businesses

This reduces the gap between:

**Recommendation → Procurement**

---

## 06 — 📚 ITK-First Agricultural Knowledge

AgroCare incorporates Indigenous Technical Knowledge as a knowledge layer.

Instead of automatically treating synthetic intervention as the first option, the system can surface relevant traditional / indigenous agricultural practices where applicable.

```text
Farmer Problem
      ↓
Evidence
      ↓
ITK Knowledge
      ↓
Context Validation
      ↓
Recommended Practice
```

This creates a bridge between:

**Traditional agricultural knowledge + modern AI**

---

## 07 — 🎙️ Voice-First Farmer Interaction

Farmers can interact through voice rather than relying entirely on typing.

### Voice pipeline

```text
🎙️ Farmer Speech
       ↓
   Live Audio
       ↓
  Gemini Live
       ↓
Agricultural Context
       ↓
 Spoken Response
```

The platform supports multilingual interaction including:

* 🇬🇧 English
* 🇮🇳 Hindi
* 🇮🇳 Kannada

The objective is simple:

> **Technology should adapt to the farmer — not the farmer to the technology.**

---

## 08 — 📡 Resilient / Local-First Architecture

Connectivity should not become a single point of failure.

AgroCare includes connectivity-aware model routing and local fallback capabilities.

```text
             Request
                │
                ▼
       ┌─────────────────┐
       │ Connectivity OK?│
       └───────┬─────────┘
          YES  │  NO
           ▼  │   ▼
       Cloud AI   Local
           │     Fallback
           └──┬──────┘
              ▼
          Response
```

This architecture is designed around **graceful degradation** rather than simply failing when the network disappears.

---

# 🏪 From Farm Diagnosis to Farm Economics

AgroCare does not treat agriculture as only a disease-detection problem.

It connects:

```text
              🌱 FARM PRODUCTION
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
    Disease        Soil         Weather
       │             │             │
       └─────────────┼─────────────┘
                     ▼
               FARM DECISION
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     🧴 INPUTS              📈 OUTPUT
          │                     │
          ▼                     ▼
     Suppliers               Mandis
          │                     │
          └──────────┬──────────┘
                     ▼
               FARMER VALUE
```

This creates a broader **farm-to-action intelligence loop**.

---

# 🏗️ System Architecture

```text
                         👨‍🌾 FARMER
                             │
                  ┌──────────┼──────────┐
                  │          │          │
                Image       Voice      Text
                  │          │          │
                  └──────────┼──────────┘
                             ▼
                  ┌─────────────────────┐
                  │   React Frontend    │
                  │ TypeScript + Vite   │
                  └──────────┬──────────┘
                             │
                       HTTPS / WebSocket
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Express Backend   │
                  │    API Gateway      │
                  └──────────┬──────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
   ┌────────────┐     ┌────────────┐     ┌────────────┐
   │ Gemini AI  │     │ Firebase   │     │ Government │
   │ Services   │     │ Services   │     │ Data APIs  │
   └─────┬──────┘     └────────────┘     └────────────┘
         │
   ┌─────┼──────────────┬──────────────┐
   ▼     ▼              ▼              ▼
 Vision Voice       Search Grounding   Maps
   │     │              │              │
   └─────┴──────────────┴──────────────┘
                    │
                    ▼
          🧠 Decision Intelligence
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Safety     Action    Explanation
        Gate      Planner     / Trace
          │         │         │
          └─────────┼─────────┘
                    ▼
              👨‍🌾 FARMER ACTION
```

---

# 🔄 End-to-End Example

### Scenario: Farmer detects suspicious spots on a crop

```text
STEP 1
Farmer captures crop image
        ↓
STEP 2
AgroCare validates image quality
        ↓
STEP 3
Multimodal AI analyzes symptoms
        ↓
STEP 4
System evaluates confidence
        ↓
STEP 5
Weather + location + crop context added
        ↓
STEP 6
Relevant agricultural knowledge retrieved
        ↓
STEP 7
Safety checks applied
        ↓
STEP 8
Action plan generated
        ↓
STEP 9
Farmer receives explanation
        ↓
STEP 10
Farmer can continue through voice,
supplier discovery or market tools
```

### The important part:

**The diagnosis becomes the beginning of the workflow, not the end.**

---

# 📊 Validation & Testing

AgroCare is being developed with a verification-first approach.

### Current automated validation

* ✅ TypeScript compilation
* ✅ End-to-end agent orchestration test suite
* ✅ Structured API response validation
* ✅ Diagnostic workflow testing
* ✅ Connectivity / fallback testing
* ✅ Core feature integration testing

### Current project verification

> **41/41 end-to-end agent-suite verification cases passing** according to the current project test suite.

Run:

```bash
npx tsx scripts/test-agent-suite.ts
```

For additional TypeScript validation:

```bash
npx tsc --noEmit
```

> Keep these numbers synchronized with the actual repository before every hackathon submission.

---

# 🧪 Engineering Principles

AgroCare is built around five engineering principles:

### 1. Context Before Recommendation

Do not make a recommendation using one isolated signal when additional context is available.

### 2. Evidence Before Confidence

AI output should be tied to observable evidence.

### 3. Safety Before Action

Potentially risky actions should pass through explicit safety checks.

### 4. Graceful Degradation

Cloud failure or connectivity loss should not unnecessarily terminate the entire user workflow.

### 5. Explainability

A farmer should be able to understand **why** an action was recommended.

---

# 🌍 Social & Economic Impact

AgroCare targets multiple layers of agricultural decision-making.

| Challenge                      | AgroCare Response                |
| ------------------------------ | -------------------------------- |
| Delayed disease identification | Multimodal crop analysis         |
| Poor weather decisions         | Weather-aware advisories         |
| Fertilizer uncertainty         | Soil-based recommendations       |
| Market information asymmetry   | Mandi price intelligence         |
| Input discovery                | Geo-based suppliers              |
| Language barriers              | Multilingual + voice interaction |
| Connectivity limitations       | Local / fallback architecture    |
| Knowledge loss                 | ITK knowledge integration        |
| Fragmented information         | Unified farmer workflow          |

### Long-term vision

> **Build an agricultural intelligence layer that helps farmers move from reactive problem-solving to proactive decision-making.**

---

# 🏆 Why This Can Scale

AgroCare is designed as a modular platform.

### Today

```text
Crop Diagnosis
Weather
Soil
Market
Suppliers
ITK
Voice
Schemes
```

### Next

```text
        AgroCare Intelligence Layer
                  │
     ┌────────────┼────────────┐
     ▼            ▼            ▼
    IoT          Drone        Satellite
     │            │            │
     └────────────┼────────────┘
                  ▼
          Precision Agriculture
```

Future integrations can include:

* IoT soil sensors
* Drone imagery
* Satellite observations
* Crop growth monitoring
* Automated field alerts
* PWA offline capabilities
* On-device inference
* Farm-level historical analytics

---

# 🗺️ Roadmap

### Phase 1 — Intelligent Advisory

* [x] Multimodal crop analysis
* [x] Weather intelligence
* [x] Market intelligence
* [x] Soil analysis
* [x] Supplier discovery
* [x] Voice interaction
* [x] Multilingual interface
* [x] ITK knowledge layer
* [x] Firebase integration
* [x] Connectivity-aware architecture

### Phase 2 — Edge & Offline

* [ ] Browser-based local inference
* [ ] PWA offline mode
* [ ] Expanded local knowledge cache
* [ ] Offline-first diagnosis history

### Phase 3 — Connected Agriculture

* [ ] Bluetooth soil sensors
* [ ] IoT telemetry
* [ ] Drone imagery
* [ ] Field-level monitoring
* [ ] Automated anomaly detection

### Phase 4 — Autonomous Farm Intelligence

* [ ] Continuous field monitoring
* [ ] Multi-agent farm planning
* [ ] Predictive crop-risk alerts
* [ ] Input optimization
* [ ] Market timing intelligence
* [ ] Farm-level decision memory

---

# 🛠️ Technology Stack

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| Frontend       | React, TypeScript, Vite           |
| UI             | Tailwind CSS                      |
| Animation      | Framer Motion                     |
| Backend        | Node.js, Express                  |
| Real-time      | WebSockets                        |
| AI             | Google Gemini / Google Gen AI SDK |
| Voice          | Gemini Live + Web Audio           |
| Authentication | Firebase Authentication           |
| Database       | Cloud Firestore                   |
| Local Storage  | SQLite / local fallback           |
| Market Data    | Government market APIs            |
| Location       | Geolocation + Google Maps         |
| Knowledge      | ITK knowledge base                |
| Deployment     | Cloud-based deployment            |

---

# 📂 Project Structure

```text
agrocare-ai/
│
├── server.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
├── firestore.rules
│
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts
│   ├── constants.ts
│   ├── i18n.ts
│   │
│   ├── components/
│   │   ├── CameraDiagnosis.tsx
│   │   ├── LiveAudioChat.tsx
│   │   ├── ArbitrageAnalyzer.tsx
│   │   ├── Market.tsx
│   │   ├── WeatherForecast.tsx
│   │   ├── SoilAnalysis.tsx
│   │   ├── SchemeFinder.tsx
│   │   └── Community.tsx
│   │
│   ├── services/
│   │   ├── connectivity.ts
│   │   ├── gemini.ts
│   │   ├── gemma.ts
│   │   ├── marketApi.ts
│   │   └── weatherService.ts
│   │
│   ├── data/
│   │   ├── itk-knowledge.ts
│   │   ├── mandi-data.json
│   │   └── market_data.json
│   │
│   └── locales/
│       ├── en/
│       ├── hi/
│       └── kn/
│
└── scripts/
    └── test-agent-suite.ts
```

---

# 🚀 Run Locally

## Prerequisites

* Node.js 18+
* npm
* Google Gemini API key
* Firebase project credentials
* Required external API credentials

## Installation

```bash
git clone https://github.com/sujanpatel-ks/agrocare-Solutions-SHIH-TID-524.git

cd agrocare-Solutions-SHIH-TID-524

npm install
```

## Environment Variables

Create `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key

VITE_DATA_GOV_IN_API_KEY=your_data_gov_api_key

VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

```bash
npm run start
```

---

# 🎥 Demo

### 🌐 Live Application

**[Add your final verified live deployment link here]**

### 🎬 Demo Video

**[Add 2–3 minute demo video here]**

### 📊 Architecture

**[Add architecture diagram image here]**

### 📸 Product Screenshots

Recommended showcase:

| Dashboard      | AI Diagnosis   |
| -------------- | -------------- |
| Add screenshot | Add screenshot |

| Market Intelligence | Voice Assistant |
| ------------------- | --------------- |
| Add screenshot      | Add screenshot  |

| Soil Analysis  | Weather Advisory |
| -------------- | ---------------- |
| Add screenshot | Add screenshot   |

---

# ⚡ Judge's 60-Second Journey

If you are evaluating AgroCare for the first time:

### 01

Open the live application.

### 02

Upload a crop image.

### 03

Observe the AI diagnostic workflow.

### 04

Open the weather context.

### 05

Check the market intelligence.

### 06

Try the voice assistant.

### 07

Switch the language.

### 08

Explore the soil / supplier / agricultural knowledge modules.

### 09

Run the automated validation suite.

```bash
npx tsx scripts/test-agent-suite.ts
```

### 10

Ask the final question:

> **“How does AgroCare turn an agricultural observation into an actionable decision?”**

That is the core of the project.

---

# 🔐 Security & Responsible AI

AgroCare follows a safety-oriented approach to agricultural AI.

### API Security

Sensitive API credentials should remain server-side wherever possible.

### Structured AI Output

AI services are expected to return structured data for predictable UI rendering.

### Input Validation

Images and user inputs should be validated before processing.

### Safety Gate

Recommendations involving potentially consequential agricultural actions should be subjected to explicit safety checks.

### Human Decision Authority

AgroCare is a **decision-support system**, not a replacement for qualified agricultural experts or government advisories.

---

# 🤝 Responsible Agricultural Intelligence

AI should not blindly replace agricultural knowledge.

AgroCare follows a hybrid philosophy:

```text
        AI
        +
 Government Data
        +
 Agricultural Knowledge
        +
 Local / Indigenous Practices
        +
 Environmental Context
        +
 Human Judgment
        ↓
 Responsible Decision Support
```

The goal is not:

> **“AI knows everything.”**

The goal is:

> **“AI helps the farmer make a better-informed decision.”**

---

# 🌱 Vision

### From a farming assistant → to an agricultural intelligence infrastructure.

We envision AgroCare evolving from an application into a continuously learning decision layer connecting:

```text
Farmers
   ↕
AI
   ↕
IoT
   ↕
Weather
   ↕
Markets
   ↕
Agricultural Knowledge
   ↕
Government Ecosystem
```

The long-term objective is to make agricultural intelligence:

**Accessible. Context-aware. Explainable. Resilient. Actionable.**

---

# 👥 Team

### Team AgroCare

**Sujan Technologies**

Building technology for practical agricultural decision support.

📧 [spacecraftech1@gmail.com](mailto:spacecraftech1@gmail.com)

💻 GitHub: [@spacecraftech1](https://github.com/spacecraftech1)

---

# 🙏 Acknowledgements

We acknowledge the technologies and public resources that make this project possible, including:

* Google Gemini / Google AI
* Google Maps and location services
* Firebase
* Government agricultural data services
* Indian Council of Agricultural Research (ICAR)
* Indigenous Technical Knowledge resources
* Open-source software community

---

# 📄 License

This project is licensed under the MIT License.

See [LICENSE](LICENSE) for details.

---

<div align="center">

# 🌾 AgroCare AI

### **Observe → Understand → Decide → Act**

**Building the intelligence layer for the next generation of agriculture.**

⭐ Star the repository if you believe technology can make farming more informed, accessible and resilient.

</div>
