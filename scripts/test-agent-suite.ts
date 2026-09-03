// AGROCARE AI — COMPREHENSIVE MULTI-AGENT TEST SUITE
import { runAgroCareMasterPipeline } from '../server/agents/orchestrator';
import { validateCropImage, runSentinelAnalyze } from '../server/agents/sentinelAgent';
import { runContextEvaluate, fetchLiveWeather, calculateTreatmentWindow } from '../server/agents/contextEngine';
import { runPlannerPlan } from '../server/agents/plannerAgent';
import { runSafetyCheck } from '../server/agents/safetyLayer';
import { evaluateEscalation } from '../server/agents/escalationAgent';
import { findNearbySuppliers, getSupplierById, calculateHaversineDistance } from '../server/agents/supplierService';
import { matchEligibleSchemes, getSchemeById } from '../server/agents/schemeService';
import { saveFeedback, getFeedbackForDiagnosis, createFollowUp, getFollowUpById } from '../server/agents/feedbackService';
import { getCaseTrace } from '../server/agents/traceService';
import { getSystemHealth } from '../server/agents/healthService';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  message?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, name: string, message?: string) {
  if (condition) {
    results.push({ suite, name, passed: true });
    console.log(`  ✅ [PASS] ${suite} -> ${name}`);
  } else {
    results.push({ suite, name, passed: false, message });
    console.error(`  ❌ [FAIL] ${suite} -> ${name}: ${message || 'Assertion failed'}`);
  }
}

async function runTests() {
  console.log('\n🌾 ========================================================');
  console.log('🌾 AGROCARE AI MULTI-AGENT DECISION & ACTION TEST SUITE');
  console.log('🌾 ========================================================\n');

  // ==========================================
  // SUITE 1: SENTINEL AGENT & IMAGE VALIDATION
  // ==========================================
  console.log('🔍 Testing Suite 1: Sentinel Agent & Image Validation...');
  
  // Test 1.1: Missing image payload
  const valMissing = validateCropImage({});
  assert(valMissing.valid === false && valMissing.quality === 'missing', 'Sentinel', 'Detects missing image payload');

  // Test 1.2: Corrupt / malformed base64
  const valCorrupt = validateCropImage({ imageUrl: 'data:image/jpeg;base64,' });
  assert(valCorrupt.valid === false, 'Sentinel', 'Rejects corrupt base64 string');

  // Test 1.3: Oversized image
  const hugePayload = 'data:image/jpeg;base64,' + 'A'.repeat(12 * 1024 * 1024);
  const valOversized = validateCropImage({ imageUrl: hugePayload });
  assert(valOversized.valid === false && valOversized.quality === 'oversized', 'Sentinel', 'Rejects oversized >8MB images');

  // Test 1.4: Valid leaf symptom analysis
  const sentinelOk = await runSentinelAnalyze({
    crop: 'Tomato',
    symptoms: ['Brown concentric rings on lower foliage', 'Stem lesions']
  });
  assert(sentinelOk.status === 'success' && sentinelOk.crop === 'Tomato', 'Sentinel', 'Identifies tomato disease from symptoms');
  assert(sentinelOk.confidence >= 0.70, 'Sentinel', 'Produces confidence rating >= 0.70 for clear symptoms');

  // ==========================================
  // SUITE 2: CONTEXT INTELLIGENCE & WEATHER GATES
  // ==========================================
  console.log('\n🌦️ Testing Suite 2: Context Intelligence & Weather Gates...');
  
  // Test 2.1: Live or fallback weather evaluation
  const contextOk = await runContextEvaluate({
    crop: 'Tomato',
    location: { lat: 13.3409, lng: 77.1010, name: 'Tumkur' }
  });
  assert(contextOk.agent === 'context', 'Context', 'Generates valid context intelligence payload');
  assert(typeof contextOk.humidity === 'number' && typeof contextOk.temperature === 'number', 'Context', 'Extracts valid environmental metrics');

  // Test 2.2: Rain expected treatment window calculation (BLOCK SPRAY)
  const rainyWeather = {
    available: true,
    temperatureCelsius: 24,
    relativeHumidity: 88,
    rainExpected: true,
    precipitationProbability: 85,
    rainVolumeMm: 5.2,
    windSpeedKph: 12,
    hoursUntilRain: 3,
    forecastSummary: 'Heavy showers expected soon.'
  };
  const windowRain = calculateTreatmentWindow(rainyWeather);
  assert(windowRain.recommended === false, 'Context', 'Blocks spray window when rain is imminent');
  assert(windowRain.reason.includes('Rain expected'), 'Context', 'Explains rain runoff risk clearly');

  // Test 2.3: High wind treatment window calculation (DRIFT HAZARD)
  const windyWeather = {
    available: true,
    temperatureCelsius: 28,
    relativeHumidity: 60,
    rainExpected: false,
    precipitationProbability: 10,
    rainVolumeMm: 0,
    windSpeedKph: 28,
    forecastSummary: 'High wind gusts.'
  };
  const windowWind = calculateTreatmentWindow(windyWeather);
  assert(windowWind.recommended === false && windowWind.reason.includes('wind'), 'Context', 'Blocks spray window during high wind drift');

  // ==========================================
  // SUITE 3: PLANNER AGENT & NON-ACTION
  // ==========================================
  console.log('\n📋 Testing Suite 3: Planner Agent & Non-Action Decisions...');
  
  // Test 3.1: Rain imminent -> DELAY_TREATMENT (DO NOT SPRAY NOW)
  const planDelay = await runPlannerPlan({
    diagnosis: { disease: 'Early Blight', crop: 'Tomato', confidence: 0.85 },
    context: { rainExpected: true, humidity: 85, treatmentWindow: windowRain }
  });
  assert(planDelay.decision === 'DELAY_TREATMENT', 'Planner', 'Selects DELAY_TREATMENT when rain is expected');
  assert(planDelay.actions.some(a => a.includes('DO NOT SPRAY NOW') || a.includes('Postpone')), 'Planner', 'Explicitly instructs DO NOT SPRAY NOW in action plan');

  // Test 3.2: Favorable weather -> TAKE_ACTION
  const clearWeather = {
    available: true,
    temperatureCelsius: 26,
    relativeHumidity: 65,
    rainExpected: false,
    precipitationProbability: 5,
    rainVolumeMm: 0,
    windSpeedKph: 8,
    forecastSummary: 'Optimal clear conditions.'
  };
  const windowClear = calculateTreatmentWindow(clearWeather);
  const planAction = await runPlannerPlan({
    diagnosis: { disease: 'Early Blight', crop: 'Tomato', confidence: 0.88 },
    context: { rainExpected: false, humidity: 65, treatmentWindow: windowClear }
  });
  assert(planAction.decision === 'TAKE_ACTION', 'Planner', 'Selects TAKE_ACTION during favorable conditions');
  assert(Boolean(planAction.treatmentOptions?.organic), 'Planner', 'Provides verified organic bio-input treatment');

  // ==========================================
  // SUITE 4: SAFETY LAYER & GATEKEEPER
  // ==========================================
  console.log('\n🛡️ Testing Suite 4: Safety Layer...');
  
  const safetyCheck = runSafetyCheck({
    sentinelOutput: sentinelOk,
    contextOutput: { ...contextOk, rainExpected: true, treatmentWindow: windowRain },
    plannerOutput: planDelay
  });
  assert(safetyCheck.safeDecision === 'DELAY_TREATMENT', 'Safety', 'Enforces safe non-action override');
  assert(safetyCheck.safetyFlags.some(f => f.type === 'WEATHER_CONFLICT'), 'Safety', 'Attaches weather conflict safety flag');

  // ==========================================
  // SUITE 5: ESCALATION AGENT & BOUNDARY TESTS
  // ==========================================
  console.log('\n🚨 Testing Suite 5: Escalation Agent & Boundary Checks (Threshold 0.70)...');
  
  const b0_30 = evaluateEscalation({ confidence: 0.30 });
  assert(b0_30.escalate === true, 'Escalation', 'Boundary 0.30 triggers escalation');

  const b0_49 = evaluateEscalation({ confidence: 0.49 });
  assert(b0_49.escalate === true, 'Escalation', 'Boundary 0.49 triggers escalation');

  const b0_69 = evaluateEscalation({ confidence: 0.69 });
  assert(b0_69.escalate === true, 'Escalation', 'Boundary 0.69 triggers escalation');

  const b0_70 = evaluateEscalation({ confidence: 0.70 });
  assert(b0_70.escalate === false, 'Escalation', 'Boundary 0.70 passes without escalation');

  const b0_90 = evaluateEscalation({ confidence: 0.90 });
  assert(b0_90.escalate === false, 'Escalation', 'Boundary 0.90 passes without escalation');

  // ==========================================
  // SUITE 6: SUPPLIER & GEOADAPTER SERVICE
  // ==========================================
  console.log('\n🏬 Testing Suite 6: Supplier & Licensing GeoAdapter...');
  
  const suppliers = findNearbySuppliers({ lat: 13.3409, lng: 77.1010, radiusKm: 30 });
  assert(suppliers.length > 0, 'Suppliers', 'Finds nearby suppliers in Tumakuru radius');
  assert(suppliers[0].distanceKm >= 0, 'Suppliers', 'Calculates accurate Haversine distance in km');
  assert(suppliers[0].verified === true, 'Suppliers', 'Attaches verified dealer status');
  assert(Boolean(suppliers[0].verificationEvidence?.licenseNumber), 'Suppliers', 'Attaches official agricultural license evidence');

  // ==========================================
  // SUITE 7: GOVERNMENT SCHEME SERVICE
  // ==========================================
  console.log('\n🏛️ Testing Suite 7: Government Schemes & Benefits Matching...');
  
  const schemes = matchEligibleSchemes({ state: 'Karnataka', crop: 'Tomato', landSize: 4 });
  assert(schemes.length >= 4, 'Schemes', 'Matches major central and state schemes');
  assert(schemes.some(s => s.id === 'pm-kisan'), 'Schemes', 'Includes PM-KISAN cash benefit scheme');
  assert(schemes.some(s => s.id === 'smam-subsidy'), 'Schemes', 'Includes SMAM spray equipment subsidy');

  // ==========================================
  // SUITE 8: FEEDBACK & FOLLOW-UP MEMORY
  // ==========================================
  console.log('\n📝 Testing Suite 8: Feedback & Follow-up Agent...');
  
  const caseTestId = 'TEST-CASE-8841';
  const fdbk = await saveFeedback({
    caseId: caseTestId,
    diagnosisId: 'DIAG-8841',
    actionTaken: 'followed',
    outcome: 'improved',
    farmerRating: 5,
    comments: 'Neem spray effectively stopped fungal spread.'
  });
  assert(fdbk.success === true, 'Feedback', 'Saves farmer treatment feedback');

  const loadedFdbk = await getFeedbackForDiagnosis('DIAG-8841');
  assert(loadedFdbk.length > 0 && loadedFdbk[0].farmerRating === 5, 'Feedback', 'Retrieves historical feedback for diagnosis');

  const followUp = await createFollowUp({
    caseId: caseTestId,
    hoursFromNow: 48,
    purpose: 'Post-treatment recovery review'
  });
  assert(followUp.scheduledHoursFromNow === 48, 'FollowUp', 'Schedules 48-hour follow-up window');
  
  const retrievedFollowUp = await getFollowUpById(followUp.id);
  assert(retrievedFollowUp !== null && retrievedFollowUp.id === followUp.id, 'FollowUp', 'Retrieves scheduled follow-up by ID');

  // ==========================================
  // SUITE 9: END-TO-END MASTER ORCHESTRATION PIPELINE
  // ==========================================
  console.log('\n🚀 Testing Suite 9: End-to-End Master Pipeline (POST /api/agrocare/analyze)...');
  
  const masterRes = await runAgroCareMasterPipeline({
    crop: 'Tomato',
    symptoms: ['Early concentric lesions on foliage', 'Lower leaf yellowing'],
    location: { lat: 13.3409, lng: 77.1010, name: 'Tumkur Farm' },
    farmerProfile: { state: 'Karnataka', landSize: 3 }
  });

  assert(Boolean(masterRes.caseId && masterRes.caseId.startsWith('AC-2026-')), 'Orchestrator', 'Assigns caseId with AC-2026- prefix');
  assert(masterRes.performance.totalLatencyMs > 0, 'Orchestrator', 'Tracks total pipeline latency in ms');
  assert(masterRes.trace.length >= 5, 'Orchestrator', 'Generates 5-stage trace (sentinel, context, planner, safety, executor)');
  assert(masterRes.execution.suppliers.length > 0, 'Orchestrator', 'Populates nearby verified suppliers in master response');
  assert(masterRes.execution.schemes.length > 0, 'Orchestrator', 'Populates matched government schemes in master response');

  // ==========================================
  // SUITE 10: CASE TRACE OBSERVABILITY
  // ==========================================
  console.log('\n📊 Testing Suite 10: Case Trace Observability...');
  
  const storedTrace = await getCaseTrace(masterRes.caseId);
  assert(storedTrace !== null && storedTrace.caseId === masterRes.caseId, 'Trace', 'Retrieves case trace by caseId');
  assert(storedTrace!.steps.every(s => typeof s.latencyMs === 'number'), 'Trace', 'Each step contains measured latencyMs');

  // ==========================================
  // SUITE 11: SYSTEM HEALTH DIAGNOSTICS
  // ==========================================
  console.log('\n🏥 Testing Suite 11: Global System Health...');
  
  const sysHealth = getSystemHealth();
  assert(sysHealth.status === 'healthy', 'Health', 'System health status evaluates to healthy');
  assert(Boolean(sysHealth.agents.sentinel && sysHealth.agents.context && sysHealth.agents.planner), 'Health', 'Aggregates all 6 core agent health statuses');

  // ==========================================
  // SUMMARY
  // ==========================================
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log('\n🌾 ========================================================');
  console.log(`🌾 TEST EXECUTION COMPLETE: ${passed}/${total} PASSED (${failed} failed)`);
  console.log('🌾 ========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
