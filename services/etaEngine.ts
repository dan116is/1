import { addDays } from "../services/timeUtils";
import { EtaConfidenceResult, getConfidenceLabel } from "./etaConfidenceService";

export type ShipmentStatus =
  | "BOOKED"
  | "GATE_IN"
  | "LOADED_ON_VESSEL"
  | "DEPARTED"
  | "ARRIVED_PORT"
  | "DISCHARGED"
  | "CUSTOMS_HOLD"
  | "AVAILABLE_FOR_PICKUP"
  | "DELIVERED_WAREHOUSE";

export type EtaScenario = {
  etaWarehouseDate: Date;
  etaRangeStart: Date;
  etaRangeEnd: Date;
  confidence: "גבוה" | "בינוני" | "נמוך";
  explanation: string;
  optimistic: Date;
  likely: Date;
  pessimistic: Date;
  confidenceScore: number;
  confidenceLabel: EtaConfidenceResult["confidenceLabel"];
};

export type EtaInputs = {
  status: ShipmentStatus;
  officialEtaPort?: Date | null;
  lastEventAt?: Date | null;
  hasCustomsHold?: boolean;
  historyAverageDays?: number | null;
  historyStdDev?: number | null;
  seasonalFactor?: number;
  hasTransshipment?: boolean;
};

const DEFAULT_RANGES: Record<ShipmentStatus, { min: number; max: number }> = {
  BOOKED: { min: 5, max: 10 },
  GATE_IN: { min: 4, max: 9 },
  LOADED_ON_VESSEL: { min: 18, max: 28 },
  DEPARTED: { min: 18, max: 28 },
  ARRIVED_PORT: { min: 0, max: 3 },
  DISCHARGED: { min: 2, max: 7 },
  CUSTOMS_HOLD: { min: 5, max: 14 },
  AVAILABLE_FOR_PICKUP: { min: 0, max: 2 },
  DELIVERED_WAREHOUSE: { min: 0, max: 0 }
};

export function calculateEta(inputs: EtaInputs): EtaScenario {
  const now = new Date();
  const baseRange = DEFAULT_RANGES[inputs.status];
  const seasonal = inputs.seasonalFactor ?? 1;
  const transshipmentPenalty = inputs.hasTransshipment ? 1.2 : 1;
  const historyAverage = inputs.historyAverageDays ?? (baseRange.min + baseRange.max) / 2;
  const historyStd = inputs.historyStdDev ?? (baseRange.max - baseRange.min) / 2;

  let minDays = baseRange.min;
  let maxDays = baseRange.max;
  let explanation = "ההערכה מבוססת על נתוני ברירת מחדל והיסטוריה זמינה.";

  if (inputs.status === "DEPARTED" || inputs.status === "LOADED_ON_VESSEL") {
    if (inputs.officialEtaPort) {
      const daysToPort = Math.max(
        0,
        Math.ceil((inputs.officialEtaPort.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      );
      minDays = daysToPort + 2;
      maxDays = daysToPort + 7;
      explanation = "ההערכה נשענת על זמן הגעה רשמי לנמל ועל זמני שחרור ידועים.";
    } else {
      explanation = "ההערכה נשענת על ממוצע הפלגה מסין לישראל והיסטוריית משלוחים.";
    }
  }

  if (inputs.status === "CUSTOMS_HOLD") {
    minDays = 5;
    maxDays = 14;
    explanation = "זוהה עיכוב מכס ולכן הטווח הורחב.";
  }

  if (inputs.status === "DELIVERED_WAREHOUSE") {
    explanation = "המשלוח כבר הגיע למחסן ולכן זמן ההגעה הוא היום בפועל.";
  }

  const adjustedMin = minDays * seasonal * transshipmentPenalty;
  const adjustedMax = maxDays * seasonal * transshipmentPenalty;

  const likelyDays = Math.round((historyAverage + (adjustedMin + adjustedMax) / 2) / 2);
  const optimisticDays = Math.max(0, Math.round(likelyDays - historyStd));
  const pessimisticDays = Math.round(likelyDays + historyStd + 2);

  const etaLikely = addDays(now, likelyDays);
  const etaOptimistic = addDays(now, optimisticDays);
  const etaPessimistic = addDays(now, pessimisticDays);

  const confidenceScore = Math.max(10, Math.min(100, 100 - (adjustedMax - adjustedMin) * 6));
  const confidenceLabel = getConfidenceLabel(confidenceScore);

  return {
    etaWarehouseDate: etaLikely,
    etaRangeStart: addDays(now, Math.round(adjustedMin)),
    etaRangeEnd: addDays(now, Math.round(adjustedMax)),
    confidence: confidenceLabel === "גבוה" ? "גבוה" : confidenceLabel === "בינוני" ? "בינוני" : "נמוך",
    explanation,
    optimistic: etaOptimistic,
    likely: etaLikely,
    pessimistic: etaPessimistic,
    confidenceScore,
    confidenceLabel
  };
}
