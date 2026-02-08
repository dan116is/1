import { NextResponse } from "next/server";
import { prisma } from "../../../db/prisma";
import { getCurrentUser } from "../../../lib/session";
import { calculateEta } from "../../../services/etaEngine";
import { normalizeStatus } from "../../../services/statusNormalizer";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "אין משתמש מחובר" }, { status: 401 });
  }

  const shipments = await prisma.shipment.findMany({
    where: { userId: user.id },
    include: {
      containers: true
    },
    orderBy: { createdAt: "desc" }
  });

  const data = shipments.map((shipment) => {
    const container = shipment.containers[0];
    const eta = container
      ? calculateEta({
          status: normalizeStatus(container.lastStatus),
          lastEventAt: container.lastStatusAt
        })
      : null;
    return {
      id: shipment.id,
      blNumber: shipment.blNumber,
      carrier: shipment.carrier,
      containersCount: shipment.containers.length,
      lastStatus: container?.lastStatus ?? "לא עודכן",
      etaWarehouse: eta?.etaWarehouseDate,
      etaRangeStart: eta?.etaRangeStart,
      etaRangeEnd: eta?.etaRangeEnd,
      confidence: eta?.confidenceLabel ?? "נמוך",
      lastRefreshAt: shipment.lastRefreshAt
    };
  });

  return NextResponse.json({ shipments: data });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "אין משתמש מחובר" }, { status: 401 });
  }

  const body = await request.json();
  const blNumber = body.blNumber?.toString().trim();
  const containerNumber = body.containerNumber?.toString().trim();

  if (!blNumber && !containerNumber) {
    return NextResponse.json({ message: "חסר מספר שטר מטען או מספר מכולה" }, { status: 400 });
  }

  const shipment = await prisma.shipment.create({
    data: {
      userId: user.id,
      blNumber: blNumber ?? `BL-${Date.now()}`,
      carrier: body.carrier?.toString() ?? "אחר",
      originPort: body.originPort?.toString() ?? null,
      destinationPort: body.destinationPort?.toString() ?? null,
      containers: containerNumber
        ? {
            create: {
              containerNumber,
              lastStatus: "הוזמן",
              confidence: "נמוך"
            }
          }
        : undefined
    }
  });

  return NextResponse.json({ shipment });
}
