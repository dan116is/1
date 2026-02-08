import { ShipmentStatus } from "./etaEngine";

const mapping: Record<string, ShipmentStatus> = {
  BOOKED: "BOOKED",
  GATE_IN: "GATE_IN",
  LOADED_ON_VESSEL: "LOADED_ON_VESSEL",
  DEPARTED: "DEPARTED",
  ARRIVED_PORT: "ARRIVED_PORT",
  DISCHARGED: "DISCHARGED",
  CUSTOMS_HOLD: "CUSTOMS_HOLD",
  AVAILABLE_FOR_PICKUP: "AVAILABLE_FOR_PICKUP",
  DELIVERED_WAREHOUSE: "DELIVERED_WAREHOUSE"
};

export const statusLabels: Record<ShipmentStatus, string> = {
  BOOKED: "הוזמן",
  GATE_IN: "נכנס למסוף יציאה",
  LOADED_ON_VESSEL: "הועמס לאוניה",
  DEPARTED: "יצא לדרך",
  ARRIVED_PORT: "הגיע לנמל יעד",
  DISCHARGED: "נפרק מהאוניה",
  CUSTOMS_HOLD: "עיכוב מכס",
  AVAILABLE_FOR_PICKUP: "זמין לשחרור/משיכה",
  DELIVERED_WAREHOUSE: "נמסר/הגיע למחסן"
};

export function normalizeStatus(rawStatus: string): ShipmentStatus {
  const cleaned = rawStatus.trim().toUpperCase();
  return mapping[cleaned] ?? "BOOKED";
}
