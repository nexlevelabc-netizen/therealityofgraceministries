import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { events } from "./schema";

function nextWeekday(day: number, hour: number, minute: number, weekOffset = 0): Date {
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const d = new Date(todayUtc);
  const diff = (day - d.getUTCDay() + 7) % 7 || 7;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + diff + weekOffset * 7, hour, minute));
}

async function main() {
  const db = drizzle(process.env.DATABASE_URL!, { mode: "planetscale" });
  await db.insert(events).values([
    {
      title: "Sunday Celebration Service",
      description: "Worship, the word and communion, with live translation on screen.",
      startsAt: nextWeekday(0, 10, 0),
      location: "In person and online",
      streamUrl: "https://www.youtube.com/channel/UCg-gQu4cBrhltJlGHaLmHKw",
    },
    {
      title: "Word and Prayer Evening",
      description: "Midweek teaching and intercession. Doors open thirty minutes early.",
      startsAt: nextWeekday(3, 19, 0),
      location: "In person",
    },
    {
      title: "Grace Groups",
      description: "Smaller circles meeting in homes across the city. Ask us for your nearest group.",
      startsAt: nextWeekday(5, 19, 30),
      location: "Homes across the city",
    },
    {
      title: "Sunday Celebration Service",
      description: "Worship, the word and communion, with live translation on screen.",
      startsAt: nextWeekday(0, 10, 0, 1),
      location: "In person and online",
      streamUrl: "https://www.youtube.com/channel/UCg-gQu4cBrhltJlGHaLmHKw",
    },
  ]);
  console.log("seeded events");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
