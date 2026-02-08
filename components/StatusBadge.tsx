import clsx from "clsx";

const statusColors: Record<string, string> = {
  "בדרך למחסן": "bg-green-100 text-green-700",
  "הגיע לנמל יעד": "bg-orange-100 text-orange-700",
  "נפרק מהאוניה": "bg-orange-100 text-orange-700",
  "עיכוב מכס": "bg-red-100 text-red-700",
  "זמין לשחרור/משיכה": "bg-green-100 text-green-700",
  "נמסר/הגיע למחסן": "bg-green-100 text-green-700"
};

export function StatusBadge({ label }: { label: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        statusColors[label] ?? "bg-slate-100 text-slate-700"
      )}
    >
      {label}
    </span>
  );
}
