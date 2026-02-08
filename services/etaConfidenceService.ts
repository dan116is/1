export type EtaConfidenceResult = {
  confidenceScore: number;
  confidenceLabel: "גבוה" | "בינוני" | "נמוך";
};

export function getConfidenceLabel(score: number): EtaConfidenceResult["confidenceLabel"] {
  if (score >= 80) return "גבוה";
  if (score >= 50) return "בינוני";
  return "נמוך";
}

export function calculateConfidenceScore(rangeDays: number, samples: number): EtaConfidenceResult {
  const base = Math.max(20, 100 - rangeDays * 5);
  const bonus = Math.min(20, Math.floor(samples / 5) * 4);
  const confidenceScore = Math.min(100, base + bonus);
  return {
    confidenceScore,
    confidenceLabel: getConfidenceLabel(confidenceScore)
  };
}
