import cron from "node-cron";
import { runRefreshCycle } from "../services/refreshService";

const interval = process.env.REFRESH_CRON ?? "0 */6 * * *";

console.log(`מתזמן רענון הופעל לפי: ${interval}`);

cron.schedule(interval, async () => {
  console.log("מתחיל רענון משלוחים...");
  await runRefreshCycle();
  console.log("רענון הסתיים");
});
