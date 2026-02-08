import { prisma } from "../db/prisma";
import { fetchMockCarrierEvents } from "../adapters/mockCarrierAdapter";
import { normalizeStatus } from "./statusNormalizer";
import { calculateEta } from "./etaEngine";

export async function runRefreshCycle(): Promise<void> {
  const shipments = await prisma.shipment.findMany({
    include: { containers: true }
  });

  for (const shipment of shipments) {
    try {
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

      await prisma.refreshLog.create({
        data: {
          shipmentId: shipment.id,
          success: true,
          message: "רענון בוצע בהצלחה"
        }
      });
    } catch (error) {
      await prisma.refreshLog.create({
        data: {
          shipmentId: shipment.id,
          success: false,
          message: error instanceof Error ? error.message : "שגיאה לא ידועה"
        }
      });
    }
  }
}
