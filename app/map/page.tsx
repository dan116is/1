import dynamic from "next/dynamic";

const RouteMap = dynamic(() => import("../../components/RouteMap").then((mod) => mod.RouteMap), {
  ssr: false
});

export default function MapPage() {
  return (
    <section className="grid gap-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">מפה חכמה של המסלול</h2>
        <p className="text-sm text-slate-600">
          מיקום נוכחי מוערך לפי נתוני הפלגה ואירועים. צבע כחול מסמן אוניה בים.
        </p>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <RouteMap />
        <p className="mt-4 text-xs text-slate-500">
          מיקום נוכחי מוערך לפי נתוני הפלגה ואירועים.
        </p>
      </div>
    </section>
  );
}
