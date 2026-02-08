import { describe, expect, it } from "vitest";
import { calculateEta } from "../services/etaEngine";

describe("מנוע זמן הגעה משוער", () => {
  it("מחזיר טווח ותסריטים שונים", () => {
    const result = calculateEta({ status: "DEPARTED" });
    expect(result.etaRangeStart.getTime()).toBeLessThan(result.etaRangeEnd.getTime());
    expect(result.optimistic.getTime()).toBeLessThanOrEqual(result.likely.getTime());
    expect(result.likely.getTime()).toBeLessThanOrEqual(result.pessimistic.getTime());
  });

  it("מסמן ביטחון גבוה כאשר הטווח קטן", () => {
    const result = calculateEta({ status: "DELIVERED_WAREHOUSE" });
    expect(result.confidenceLabel).toBe("גבוה");
  });
});
