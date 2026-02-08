export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDate(date?: Date | string | null): string {
  if (!date) return "לא זמין";
  const parsed = typeof date === "string" ? new Date(date) : date;
  return parsed.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
