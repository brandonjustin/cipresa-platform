export interface PaymentFailureInfo {
  title: string;
  description: string;
  steps: string[];
}

interface FailureRule {
  pattern: RegExp;
  info: PaymentFailureInfo;
}

const RULES: FailureRule[] = [
  {
    pattern: /insuffisant|insufficient|solde/i,
    info: {
      title: 'Solde Mobile Money insuffisant',
      description: "Votre compte Mobile Money ne dispose pas d'assez de fonds pour couvrir ce paiement.",
      steps: [
        'Rechargez votre compte Mobile Money.',
        'Vérifiez votre solde disponible (menu de votre opérateur, ex. *126#).',
        'Revenez ici et cliquez sur « Réessayer le paiement ».',
      ],
    },
  },
  {
    pattern: /format|ne correspond pas|invalide/i,
    info: {
      title: 'Numéro de téléphone incorrect',
      description: "Le numéro fourni ne correspond pas à l'opérateur Mobile Money sélectionné.",
      steps: [
        "Vérifiez que le numéro est bien actif chez l'opérateur choisi (MTN ou Orange).",
        'Saisissez-le au format 6XXXXXXXX (9 chiffres, sans le +237).',
        "Changez d'opérateur si le numéro appartient à l'autre réseau.",
      ],
    },
  },
  {
    pattern: /annul|cancel|refus/i,
    info: {
      title: 'Paiement annulé',
      description: 'La demande de paiement a été annulée ou refusée depuis votre téléphone.',
      steps: [
        'Approuvez la demande de paiement dès sa réception sur votre téléphone.',
        'Vérifiez que votre code PIN Mobile Money est correct.',
        'Cliquez sur « Réessayer le paiement » pour recevoir une nouvelle demande.',
      ],
    },
  },
  {
    pattern: /d[ée]lai|timeout|expir/i,
    info: {
      title: 'Délai de confirmation dépassé',
      description: "Vous n'avez pas confirmé la demande de paiement à temps sur votre téléphone.",
      steps: [
        'Gardez votre téléphone à portée de main avant de relancer le paiement.',
        "Confirmez la demande dès qu'elle apparaît sur votre téléphone.",
        'Cliquez sur « Réessayer le paiement » pour recevoir une nouvelle demande.',
      ],
    },
  },
];

const DEFAULT_INFO: PaymentFailureInfo = {
  title: "Le paiement n'a pas abouti",
  description: "Nous n'avons pas pu confirmer votre paiement. Vous n'avez pas été débité pour cette tentative.",
  steps: [
    'Vérifiez votre connexion et votre solde Mobile Money.',
    'Cliquez sur « Réessayer le paiement » pour recevoir une nouvelle demande.',
    'Si le problème persiste, contactez-nous avec la référence de commande ci-dessous.',
  ],
};

/**
 * Classifies NOKASH's free-text failure reason (statusReason / message) into
 * user-facing guidance. NOKASH's docs don't enumerate the exact strings they
 * send for a FAILED payin (only that statusReason "has a value when status
 * is FAILED") — these patterns are inferred from common CEMAC mobile-money
 * failure wording plus the exact string observed in production ("Le numéro
 * envoyé ne correspond pas au format..."). An unmatched reason falls back to
 * generic-but-still-actionable guidance instead of a dead end.
 */
export function classifyPaymentFailure(rawMessage?: string | null): PaymentFailureInfo {
  if (rawMessage) {
    const rule = RULES.find((r) => r.pattern.test(rawMessage));
    if (rule) return rule.info;
  }
  return DEFAULT_INFO;
}
