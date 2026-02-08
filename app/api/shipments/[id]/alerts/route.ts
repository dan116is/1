import { NextResponse } from "next/server";
import { prisma } from "../../../../../db/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const channel = body.channel?.toString() ?? "email";
  const target = body.target?.toString();

  if (!target) {
    return NextResponse.json({ message: "חסר יעד התראה" }, { status: 400 });
  }

  const shipment = await prisma.shipment.findUnique({ where: { id: params.id } });
  if (!shipment) {
    return NextResponse.json({ message: "משלוח לא נמצא" }, { status: 404 });
  }

  const notification = await prisma.notification.create({
    data: {
      userId: shipment.userId,
      shipmentId: shipment.id,
      channel,
      target
    }
  });

  return NextResponse.json({ notification });
}
