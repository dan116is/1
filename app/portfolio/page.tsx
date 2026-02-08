import { prisma } from "../../db/prisma";
import { calculateEta } from "../../services/etaEngine";
import { normalizeStatus } from "../../services/statusNormalizer";
import { formatDate } from "../../services/timeUtils";

export default async function PortfolioPage() {
  const containers = await prisma.container.findMany({
    include: { shipment: true }
  });

  const counts = {
    sea: containers.filter((c) => c.lastStatus.includes("דרך") || c.lastStatus.includes("הועמס")).length,
    port: containers.filter((c) => c.lastStatus.includes("נמל") || c.lastStatus.includes("נפרק")).length,
    hold: containers.filter((c) => c.lastStatus.includes("מכס") || c.lastStatus.includes("עיכוב")).length,
    land: containers.filter((c) => c.lastStatus.includes("משיכה") || c.lastStatus.includes("מחסן")).length
  };

  const etaValues = containers
    .map((container) =>
      calculateEta({ status: normalizeStatus(container.lastStatus), lastEventAt: container.lastStatusAt })
    )
    .map((eta) => eta.etaWarehouseDate.getTime());

  const avgEtaMs = etaValues.length
    ? etaValues.reduce((total, value) => total + value, 0) / etaValues.length
    : Date.now();

  const lowConfidenceShipments = containers.filter((container) => container.confidence === "נמוך");

  return (
    <section className="grid gap-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">מצב כלל המשלוחים</h2>
        <p className="text-sm text-slate-600">תמונה ניהולית בזמן אמת על תיק המשלוחים.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-blue-50 p-4 text-blue-700">
          <p className="text-sm">מכולות בים</p>
          <p className="text-2xl font-semibold">{counts.sea}</p>
        </div>
        <div className="rounded-2xl bg-orange-50 p-4 text-orange-700">
          <p className="text-sm">מכולות בנמל</p>
          <p className="text-2xl font-semibold">{counts.port}</p>
        </div>
        <div className="rounded-2xl bg-red-50 p-4 text-red-700">
          <p className="text-sm">מכולות בעיכוב</p>
          <p className="text-2xl font-semibold">{counts.hold}</p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4 text-green-700">
          <p className="text-sm">מכולות בדרך למחסן</p>
          <p className="text-2xl font-semibold">{counts.land}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">מדדי ביצוע</h3>
        <div className="mt-4 grid gap-3 text-sm text-slate-600">
          <p>זמן ממוצע עד הגעה למחסן: {formatDate(new Date(avgEtaMs))}</p>
          <p>משלוחים בסיכון גבוה (ביטחון נמוך): {lowConfidenceShipments.length}</p>
        </div>
      </div>
    </section>
  );
}
