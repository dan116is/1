export function differenceInHours(dateLeft: Date, dateRight: Date): number {
  return Math.round((dateLeft.getTime() - dateRight.getTime()) / (1000 * 60 * 60));
}

export function differenceInDays(dateLeft: Date, dateRight: Date): number {
  return Math.round((dateLeft.getTime() - dateRight.getTime()) / (1000 * 60 * 60 * 24));
}
