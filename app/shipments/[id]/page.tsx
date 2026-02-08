import { prisma } from "../../../db/prisma";
import { StatusBadge } from "../../../components/StatusBadge";
import { formatDate } from "../../../services/timeUtils";
import { calculateEta } from "../../../services/etaEngine";
import { normalizeStatus, statusLabels } from "../../../services/statusNormalizer";
import { buildAlertMessage } from "../../../services/alertService";

const futureStages = [
  { label: "שחרור ממכס – משוער", avgDays: 4, std: 1.2 },
  { label: "הובלה יבשתית – משוער", avgDays: 2, std: 0.5 }
];

export default async function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const shipment = await prisma.shipment.findUnique({
    where: { id: params.id },
    include: {
      containers: { include: { events: true } },
      refreshLogs: { orderBy: { ranAt: "desc" }, take: 1 }
    }
  });

  if (!shipment) {
    return <div className="rounded-2xl bg-white p-6">משלוח לא נמצא</div>;
  }

  const primaryContainer = shipment.containers[0];
  const eta = primaryContainer
    ? calculateEta({
        status: normalizeStatus(primaryContainer.lastStatus),
        lastEventAt: primaryContainer.lastStatusAt
      })
    : null;

  const alertMessage = buildAlertMessage({
    status: primaryContainer?.lastStatus ?? "לא עודכן",
    etaRange: eta ? `${formatDate(eta.etaRangeStart)} - ${formatDate(eta.etaRangeEnd)}` : undefined,
    hasCustomsRisk: primaryContainer?.lastStatus === statusLabels.CUSTOMS_HOLD
  });

  return (
    <section className="grid gap-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">שטר מטען</p>
            <h2 className="text-xl font-semibold">{shipment.blNumber}</h2>
          </div>
          <div className="flex gap-3">
            <form action={`/api/shipments/${shipment.id}/refresh`} method="post">
              <button className="rounded-xl border border-brand-700 px-4 py-2 text-sm text-brand-700">
                רענן עכשיו
              </button>
            </form>
            <form action={`/api/shipments/${shipment.id}/alerts`} method="post">
              <input type="hidden" name="channel" value="email" />
              <input type="hidden" name="target" value="ops@itam23.local" />
              <button className="rounded-xl bg-brand-700 px-4 py-2 text-sm text-white">הגדר התראות</button>
            </form>
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-sm text-slate-600">
          <StatusBadge label={primaryContainer?.lastStatus ?? "לא עודכן"} />
          <p>
            זמן הגעה משוער למחסן איתם 23: <strong>{formatDate(eta?.etaWarehouseDate)}</strong>
          </p>
          <p>
            טווח משוער: {formatDate(eta?.etaRangeStart)} - {formatDate(eta?.etaRangeEnd)} | ביטחון:
            {" "}
            {eta?.confidenceLabel ?? "נמוך"}
          </p>
          <p>תרחיש אופטימי: {formatDate(eta?.optimistic)} | תרחיש פסימי: {formatDate(eta?.pessimistic)}</p>
          <p className="text-xs text-slate-500">{eta?.explanation}</p>
          <div className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">{alertMessage}</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">רשימת מכולות</h3>
          <div className="mt-4 grid gap-4">
            {shipment.containers.map((container) => (
              <div key={container.id} className="rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">מספר מכולה</p>
                <p className="text-lg font-semibold">{container.containerNumber}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
                  <StatusBadge label={container.lastStatus} />
                  <span>זמן הגעה למחסן: {formatDate(container.etaWarehouse)}</span>
                  <span>ביטחון: {container.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">ציר זמן חכם</h3>
          <div className="mt-4 grid gap-3">
            {shipment.containers.flatMap((container) =>
              container.events.map((event) => (
                <div key={event.id} className="rounded-xl border border-slate-100 p-3">
                  <p className="text-sm font-semibold">{event.rawText}</p>
                  <p className="text-xs text-slate-500">
                    {formatDate(event.eventTime)} · {event.location ?? "ללא מיקום"}
                  </p>
                </div>
              ))
            )}
            {futureStages.map((stage) => (
              <div key={stage.label} className="rounded-xl border border-dashed border-slate-200 p-3 text-slate-400">
                <p className="text-sm font-semibold">{stage.label}</p>
                <p className="text-xs">משך ממוצע: {stage.avgDays} ימים | סטיית תקן: {stage.std}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">פרטי אוניה</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <p>שם אוניה: Eitam Star</p>
            <p>מסע: ETM23-2024</p>
            <p>IMO: 1234567 | MMSI: 987654321</p>
            <p>זמן הגעה לנמל: {formatDate(primaryContainer?.etaPort)}</p>
            <p className="text-xs text-slate-500">נתוני AIS זמינים רק לשיפור זמן ההגעה, ללא תלות ב-GPS של מכולה.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">מצב סימולציה</h3>
          <p className="text-sm text-slate-600">
            הזז את הסליידרים כדי לראות איך עיכובים משפיעים על זמן ההגעה. מצב קריאה בלבד.
          </p>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2 text-sm">
              אם המכס מתעכב בעוד X ימים
              <input type="range" min="0" max="10" defaultValue="2" />
            </label>
            <label className="grid gap-2 text-sm">
              אם ההובלה נדחית ביום
              <input type="range" min="0" max="3" defaultValue="1" />
            </label>
            <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600">
              שינוי משוער בזמן ההגעה: +3 ימים (דוגמה)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
