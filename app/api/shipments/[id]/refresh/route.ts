import { NextResponse } from "next/server";
import { prisma } from "../../../../../db/prisma";
import { fetchMockCarrierEvents } from "../../../../../adapters/mockCarrierAdapter";
import { calculateEta } from "../../../../../services/etaEngine";
import { normalizeStatus } from "../../../../../services/statusNormalizer";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const shipment = await prisma.shipment.findUnique({
    where: { id: params.id },
    include: { containers: true }
  });

  if (!shipment) {
    return NextResponse.json({ message: "משלוח לא נמצא" }, { status: 404 });
  }

  for (const container of shipment.containers) {
    const adapterResult = await fetchMockCarrierEvents(container.containerNumber);
    const lastEvent = adapterResult.events.at(-1);
    if (!lastEvent) continue;

    const normalized = normalizeStatus(lastEvent.status);
    const eta = calculateEta({
      status: normalized,
      lastEventAt: lastEvent.eventTime,
      hasCustomsHold: normalized === "CUSTOMS_HOLD"
    });

    await prisma.container.update({
      where: { id: container.id },
      data: {
        lastStatus: lastEvent.status,
        lastStatusAt: lastEvent.eventTime,
        etaWarehouse: eta.etaWarehouseDate,
        confidence: eta.confidenceLabel
      }
    });
  }

  await prisma.shipment.update({
    where: { id: shipment.id },
    data: { lastRefreshAt: new Date() }
  });

  return NextResponse.json({ message: "רענון הושלם" });
}
