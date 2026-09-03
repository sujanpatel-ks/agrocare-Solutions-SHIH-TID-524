// AGENT 5: EXECUTOR AGENT — Execution of Safety-Approved Actions
import { ExecutorExecuteRequest, ExecutorExecuteResponse, SupplierItem, SchemeMatchItem, FollowUpItem } from './types';
import { findNearbySuppliers } from './supplierService';
import { matchEligibleSchemes } from './schemeService';
import { createFollowUp } from './feedbackService';

/**
 * Executes safety-approved downstream tasks.
 */
export async function runExecutorExecute(req: ExecutorExecuteRequest): Promise<ExecutorExecuteResponse> {
  const executedActions: string[] = [];
  const errors: string[] = [];
  let suppliers: SupplierItem[] | undefined = undefined;
  let schemes: SchemeMatchItem[] | undefined = undefined;
  let followUp: FollowUpItem | undefined = undefined;

  const lat = req.location?.lat ?? 13.3409;
  const lng = req.location?.lng ?? 77.1010;
  const caseId = req.caseId || `CASE-${Date.now().toString(36).toUpperCase()}`;

  // 1. If decision is non-action / delay / escalate, do not run dangerous chemical purchases
  const isSafeAction = req.approvedDecision === 'TAKE_ACTION' || req.approvedDecision === 'DELAY_TREATMENT';

  try {
    // 2. Fetch nearby verified suppliers for the required crop & biological inputs
    suppliers = findNearbySuppliers({
      lat,
      lng,
      crop: req.crop || 'Tomato',
      radiusKm: 25
    });
    executedActions.push(`Located ${suppliers.length} nearby verified agricultural input centers`);
  } catch (err: any) {
    errors.push(`Supplier search failed: ${err.message}`);
  }

  try {
    // 3. Match eligible government subsidies/schemes
    schemes = matchEligibleSchemes({
      crop: req.crop || 'Tomato',
      state: req.farmer?.state || 'Karnataka',
      landSize: req.farmer?.landSize || 3
    });
    executedActions.push(`Identified ${schemes.filter(s => s.eligibility).length} eligible government subsidies and insurance schemes`);
  } catch (err: any) {
    errors.push(`Scheme matching failed: ${err.message}`);
  }

  try {
    // 4. Automatically schedule follow-up
    const followUpHours = req.approvedDecision === 'DELAY_TREATMENT' ? 48 : 72;
    followUp = await createFollowUp({
      caseId,
      hoursFromNow: followUpHours,
      purpose: req.approvedDecision === 'DELAY_TREATMENT' 
        ? `Post-rain crop health check & application advisory reminder (${followUpHours}h)`
        : `Treatment outcome evaluation & leaf recovery assessment (${followUpHours}h)`
    });
    executedActions.push(`Scheduled automated ${followUpHours}-hour farmer follow-up alert`);
  } catch (err: any) {
    errors.push(`Follow-up scheduling failed: ${err.message}`);
  }

  return {
    agent: 'executor',
    status: errors.length === 0 ? 'completed' : 'partial',
    executedActions,
    results: {
      suppliers: suppliers?.slice(0, 5),
      schemes: schemes?.slice(0, 4),
      followUp,
      advisory: req.actions
    },
    errors: errors.length > 0 ? errors : undefined
  };
}
