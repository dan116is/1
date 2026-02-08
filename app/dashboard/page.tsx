import { prisma } from "../../db/prisma";
import { formatDate } from "../../services/timeUtils";
import { StatusBadge } from "../../components/StatusBadge";
import { detectAnomaly } from "../../services/anomalyService";
import { calculateEta } from "../../services/etaEngine";
import { normalizeStatus } from "../../services/statusNormalizer";

export default async function DashboardPage() {
  const shipments = await prisma.shipment.findMany({
    include: { containers: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="grid gap-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">המשלוחים שלי</h2>
        <p className="text-sm text-slate-600">כל המשלוחים במקום אחד, עם סיכונים והמלצות.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            placeholder="חיפוש לפי מספר שטר מטען, מכולה או סטטוס"
          />
          <select className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm md:w-56">
            <option>כל הסטטוסים</option>
            <option>בדרך למחסן</option>
            <option>בנמל</option>
            <option>עיכוב</option>
          </select>
        </div>

        <div className="mt-6 grid gap-4">
          {shipments.map((shipment) => {
            const container = shipment.containers[0];
            const eta = container
              ? calculateEta({ status: normalizeStatus(container.lastStatus), lastEventAt: container.lastStatusAt })
              : null;
            const anomaly = detectAnomaly({
              lastStatusChangeAt: container?.lastStatusAt,
              etaShiftDays: 4
            });

            return (
              <a
                key={shipment.id}
                href={`/shipments/${shipment.id}`}
                className="grid gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-brand-500"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-slate-500">שטר מטען</p>
                    <p className="text-lg font-semibold">{shipment.blNumber}</p>
                  </div>
                  <div className="text-sm text-slate-600">חברת ספנות: {shipment.carrier}</div>
                  {anomaly.isAnomaly && (
                    <span className="text-sm font-semibold text-red-600">⚠️ {anomaly.message}</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <StatusBadge label={container?.lastStatus ?? "לא עודכן"} />
                  <span>מכולות: {shipment.containers.length}</span>
                  <span>זמן הגעה משוער למחסן איתם 23: {formatDate(eta?.etaWarehouseDate)}</span>
                  <span>
                    טווח: {formatDate(eta?.etaRangeStart)} - {formatDate(eta?.etaRangeEnd)}
                  </span>
                  <span>ביטחון: {eta?.confidenceLabel ?? "נמוך"}</span>
                  <span>עדכון אחרון: {formatDate(shipment.lastRefreshAt)}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
