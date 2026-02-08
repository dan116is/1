import { describe, expect, it } from "vitest";
import { normalizeStatus, statusLabels } from "../services/statusNormalizer";

describe("נרמול סטטוסים", () => {
  it("מזהה סטטוס תקין", () => {
    expect(normalizeStatus("departed")).toBe("DEPARTED");
  });

  it("מחזיר ברירת מחדל כאשר ערך לא מוכר", () => {
    expect(normalizeStatus("UNKNOWN_STATUS")).toBe("BOOKED");
  });

  it("מספק תווית בעברית", () => {
    expect(statusLabels.DELIVERED_WAREHOUSE).toBe("נמסר/הגיע למחסן");
  });
});
