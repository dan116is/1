import { differenceInHours, differenceInDays } from "./dateMath";

export type AnomalyResult = {
  isAnomaly: boolean;
  message: string | null;
};

export function detectAnomaly(params: {
  lastMovementAt?: Date | null;
  etaShiftDays?: number;
  lastStatusChangeAt?: Date | null;
  historicalAverageDays?: number;
}): AnomalyResult {
  const now = new Date();
  if (params.lastMovementAt) {
    const hours = differenceInHours(now, params.lastMovementAt);
    if (hours > 36) {
      return {
        isAnomaly: true,
        message: "זוהתה חריגה בזמני התנועה – האוניה לא זזה מעל 36 שעות"
      };
    }
  }

  if (params.etaShiftDays && params.etaShiftDays > 3) {
    return {
      isAnomaly: true,
      message: "זוהתה חריגה בזמני ההגעה – מומלץ לבדוק מול סוכן השילוח"
    };
  }

  if (params.lastStatusChangeAt) {
    const days = differenceInDays(now, params.lastStatusChangeAt);
    if (days > 5) {
      return {
        isAnomaly: true,
        message: "זוהתה חריגה: הסטטוס לא התקדם יותר מ-5 ימים"
      };
    }
  }

  if (params.historicalAverageDays && params.historicalAverageDays > 30) {
    return {
      isAnomaly: true,
      message: "המשלוח חורג משמעותית מהממוצע ההיסטורי"
    };
  }

  return { isAnomaly: false, message: null };
}
