import { normalizeStatus, statusLabels } from "../services/statusNormalizer";

export type AdapterEvent = {
  status: string;
  location: string;
  eventTime: Date;
  rawText: string;
  source: string;
};

export type AdapterResult = {
  containerNumber: string;
  events: AdapterEvent[];
  vessel?: {
    name: string;
    voyage: string;
    imo?: string;
    mmsi?: string;
  };
};

export async function fetchMockCarrierEvents(containerNumber: string): Promise<AdapterResult> {
  const now = new Date();
  const events: AdapterEvent[] = [
    {
      status: statusLabels[normalizeStatus("DEPARTED")],
      location: "שנגחאי",
      eventTime: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 18),
      rawText: "האוניה יצאה לדרך",
      source: "Mock"
    },
    {
      status: statusLabels[normalizeStatus("ARRIVED_PORT")],
      location: "אשדוד",
      eventTime: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
      rawText: "הגיעה לנמל יעד",
      source: "Mock"
    }
  ];

  return {
    containerNumber,
    events,
    vessel: {
      name: "Eitam Star",
      voyage: "ETM23-2024",
      imo: "1234567",
      mmsi: "987654321"
    }
  };
}
