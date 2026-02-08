import { prisma } from "../db/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const passwordHash = await bcrypt.hash("itam23", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@itam23.local" },
    update: {},
    create: {
      email: "demo@itam23.local",
      passwordHash
    }
  });

  const shipment = await prisma.shipment.create({
    data: {
      userId: user.id,
      blNumber: "BL-789456123",
      carrier: "COSCO",
      originPort: "שנגחאי",
      destinationPort: "אשדוד",
      containers: {
        create: [
          {
            containerNumber: "TGHU1234567",
            lastStatus: "הגיע לנמל יעד",
            lastStatusAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
            etaPort: new Date(Date.now() + 1000 * 60 * 60 * 12),
            etaWarehouse: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
            confidence: "בינוני",
            events: {
              create: [
                {
                  eventType: "DEPARTED",
                  location: "שנגחאי",
                  eventTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18),
                  rawText: "האוניה יצאה לדרך",
                  source: "Mock"
                },
                {
                  eventType: "ARRIVED_PORT",
                  location: "אשדוד",
                  eventTime: new Date(Date.now() - 1000 * 60 * 60 * 12),
                  rawText: "הגיעה לנמל יעד",
                  source: "Mock"
                }
              ]
            }
          },
          {
            containerNumber: "OOLU7654321",
            lastStatus: "נפרק מהאוניה",
            lastStatusAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
            etaPort: new Date(Date.now() + 1000 * 60 * 60 * 6),
            etaWarehouse: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
            confidence: "גבוה",
            events: {
              create: [
                {
                  eventType: "DISCHARGED",
                  location: "אשדוד",
                  eventTime: new Date(Date.now() - 1000 * 60 * 60 * 6),
                  rawText: "נפרק מהאוניה",
                  source: "Mock"
                }
              ]
            }
          }
        ]
      }
    }
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      shipmentId: shipment.id,
      channel: "email",
      target: "ops@itam23.local",
      enabled: true
    }
  });

  await prisma.destinationProfile.create({
    data: {
      name: "איתם 23",
      averageLandTransportDays: 2,
      coordinationDays: 1,
      knownExceptions: "עומסים בנמל עשויים להוסיף יום עד יומיים"
    }
  });

  await prisma.userStageHistory.createMany({
    data: [
      {
        userId: user.id,
        stage: "DISCHARGED_TO_AVAILABLE",
        averageDays: 4.2,
        stdDeviation: 1.3,
        samples: 12
      },
      {
        userId: user.id,
        stage: "AVAILABLE_TO_DELIVERED",
        averageDays: 1.8,
        stdDeviation: 0.6,
        samples: 8
      }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
