PRAGMA foreign_keys = ON;

INSERT INTO User (id, email, passwordHash) VALUES
  ('user_demo', 'demo@itam23.local', '$2a$10$SLa4YvNM1RCEYz8Exz8j6.akMD96QrMD2BB6og50MqFwnGH5C9W0q');

INSERT INTO Shipment (id, userId, blNumber, carrier, originPort, destinationPort, lastRefreshAt)
VALUES ('shipment_demo', 'user_demo', 'BL-789456123', 'COSCO', 'שנגחאי', 'אשדוד', datetime('now', '-1 hour'));

INSERT INTO Container (id, shipmentId, containerNumber, lastStatus, lastStatusAt, etaPort, etaWarehouse, confidence)
VALUES
  ('container_1', 'shipment_demo', 'TGHU1234567', 'הגיע לנמל יעד', datetime('now', '-12 hours'), datetime('now', '+12 hours'), datetime('now', '+4 days'), 'בינוני'),
  ('container_2', 'shipment_demo', 'OOLU7654321', 'נפרק מהאוניה', datetime('now', '-6 hours'), datetime('now', '+6 hours'), datetime('now', '+3 days'), 'גבוה');

INSERT INTO Event (id, containerId, eventType, location, eventTime, rawText, source)
VALUES
  ('event_1', 'container_1', 'DEPARTED', 'שנגחאי', datetime('now', '-18 days'), 'האוניה יצאה לדרך', 'Mock'),
  ('event_2', 'container_1', 'ARRIVED_PORT', 'אשדוד', datetime('now', '-12 hours'), 'הגיעה לנמל יעד', 'Mock'),
  ('event_3', 'container_2', 'DISCHARGED', 'אשדוד', datetime('now', '-6 hours'), 'נפרק מהאוניה', 'Mock');

INSERT INTO Notification (id, userId, shipmentId, channel, target, enabled)
VALUES ('notification_1', 'user_demo', 'shipment_demo', 'email', 'ops@itam23.local', 1);

INSERT INTO DestinationProfile (id, name, averageLandTransportDays, coordinationDays, knownExceptions)
VALUES ('dest_1', 'איתם 23', 2, 1, 'עומסים בנמל עשויים להוסיף יום עד יומיים');

INSERT INTO UserStageHistory (id, userId, stage, averageDays, stdDeviation, samples)
VALUES
  ('history_1', 'user_demo', 'DISCHARGED_TO_AVAILABLE', 4.2, 1.3, 12),
  ('history_2', 'user_demo', 'AVAILABLE_TO_DELIVERED', 1.8, 0.6, 8);
