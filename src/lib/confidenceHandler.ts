export type ConfidenceTier = 'high' | 'medium' | 'low' | 'uncertain' | 'healthy';

export interface ConfidenceAssessment {
  rawScore: number;
  normalizedPercentage: number;
  tier: ConfidenceTier;
  colorClass: {
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    barColor: string;
    glowClass: string;
    iconColor: string;
  };
  label: string;
  subLabel: string;
  actionPrompt: string;
  requiresRetake: boolean;
  showAlternatives: boolean;
  allowManualOverride: boolean;
}

export function calculateConfidenceAssessment(
  rawScore: number,
  healthStatus?: 'HEALTHY' | 'DISEASED' | 'CANNOT_DIAGNOSE' | 'NUTRIENT_DEFICIENCY' | string
): ConfidenceAssessment {
  let normalized = rawScore;
  if (normalized > 0 && normalized <= 1.0) {
    normalized = Math.round(normalized * 100);
  }
  normalized = Math.max(0, Math.min(100, Math.round(normalized)));

  if (healthStatus === 'HEALTHY') {
    return {
      rawScore,
      normalizedPercentage: Math.max(normalized, 90),
      tier: 'healthy',
      colorClass: {
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
        badgeText: 'text-emerald-700 dark:text-emerald-300',
        badgeBorder: 'border-emerald-300 dark:border-emerald-800',
        barColor: 'bg-emerald-500',
        glowClass: 'shadow-emerald-500/20',
        iconColor: 'text-emerald-600'
      },
      label: 'Healthy Foliage',
      subLabel: 'No pathological or insect symptoms detected with high confidence',
      actionPrompt: 'Maintain regular agronomic schedule and routine field monitoring.',
      requiresRetake: false,
      showAlternatives: false,
      allowManualOverride: false
    };
  }

  if (healthStatus === 'CANNOT_DIAGNOSE' || normalized < 60) {
    return {
      rawScore,
      normalizedPercentage: normalized,
      tier: 'uncertain',
      colorClass: {
        badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
        badgeText: 'text-rose-700 dark:text-rose-300',
        badgeBorder: 'border-rose-300 dark:border-rose-800',
        barColor: 'bg-rose-500',
        glowClass: 'shadow-rose-500/20',
        iconColor: 'text-rose-600'
      },
      label: 'Low Image Confidence (<60%)',
      subLabel: 'Image is blurry, shadowed, or leaf symptoms are ambiguous',
      actionPrompt: 'Please retake a clear, well-lit photo of a single leaf, or select symptoms manually below.',
      requiresRetake: true,
      showAlternatives: true,
      allowManualOverride: true
    };
  }

  if (normalized >= 85) {
    return {
      rawScore,
      normalizedPercentage: normalized,
      tier: 'high',
      colorClass: {
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
        badgeText: 'text-emerald-800 dark:text-emerald-200',
        badgeBorder: 'border-emerald-400 dark:border-emerald-700',
        barColor: 'bg-emerald-600',
        glowClass: 'shadow-emerald-500/20',
        iconColor: 'text-emerald-600'
      },
      label: 'High Confidence Match (≥85%)',
      subLabel: 'Symptoms closely match certified ICAR reference pathology database',
      actionPrompt: 'Proceed with prioritized organic or targeted chemical treatment plan.',
      requiresRetake: false,
      showAlternatives: false,
      allowManualOverride: false
    };
  }

  if (normalized >= 70) {
    return {
      rawScore,
      normalizedPercentage: normalized,
      tier: 'medium',
      colorClass: {
        badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
        badgeText: 'text-amber-800 dark:text-amber-200',
        badgeBorder: 'border-amber-400 dark:border-amber-700',
        barColor: 'bg-amber-500',
        glowClass: 'shadow-amber-500/20',
        iconColor: 'text-amber-600'
      },
      label: 'Medium Confidence (70-84%)',
      subLabel: 'Diagnosis probable; verify checklist of symptoms on leaf before spraying',
      actionPrompt: 'Verify visual symptoms on your crop against the differential guide below.',
      requiresRetake: false,
      showAlternatives: true,
      allowManualOverride: true
    };
  }

  // 60 - 69%
  return {
    rawScore,
    normalizedPercentage: normalized,
    tier: 'low',
    colorClass: {
      badgeBg: 'bg-orange-50 dark:bg-orange-950/40',
      badgeText: 'text-orange-800 dark:text-orange-200',
      badgeBorder: 'border-orange-400 dark:border-orange-700',
      barColor: 'bg-orange-500',
      glowClass: 'shadow-orange-500/20',
      iconColor: 'text-orange-600'
    },
    label: 'Low Confidence (60-69%)',
    subLabel: 'Multiple diseases share similar visual appearance; inspect differential options',
    actionPrompt: 'Review top 3 possible differential diseases or capture an image at a closer angle.',
    requiresRetake: false,
    showAlternatives: true,
    allowManualOverride: true
  };
}
