export type AlertContext = {
  status: string;
  etaRange?: string;
  hasCustomsRisk?: boolean;
};

export function buildAlertMessage(context: AlertContext): string {
  if (context.status === "נפרק מהאוניה") {
    return "המכולה נפרקה – סביר שתהיה זמינה לשחרור בעוד 2–4 ימים";
  }
  if (context.hasCustomsRisk) {
    return "עיכוב צפוי: לפי היסטוריה, משלוחים דומים התעכבו במכס";
  }
  if (context.status === "זמין לשחרור/משיכה") {
    return "כדאי להתחיל תיאום הובלה למחסן איתם 23";
  }
  return `סטטוס עודכן: ${context.status}${context.etaRange ? `, טווח זמן הגעה חדש: ${context.etaRange}` : ""}`;
}
