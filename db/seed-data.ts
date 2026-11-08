import { events } from "./schema";

type EventSeed = typeof events.$inferInsert;

function nextWeekday(day: number, hour: number, minute: number, weekOffset = 0): Date {
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const d = new Date(todayUtc);
  const diff = (day - d.getUTCDay() + 7) % 7 || 7;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + diff + weekOffset * 7, hour, minute));
}

function nextMonthWeekday(day: number, week: number, hour: number, minute: number): Date {
  const now = new Date();
  for (let offset = 0; offset < 3; offset++) {
    const y = now.getUTCFullYear();
    const m = (now.getUTCMonth() + offset) % 12;
    const year = y + Math.floor((now.getUTCMonth() + offset) / 12);
    const first = new Date(Date.UTC(year, m, 1));
    const firstDay = (day - first.getUTCDay() + 7) % 7;
    const date = new Date(Date.UTC(year, m, 1 + firstDay + (week - 1) * 7, hour, minute));
    if (date.getTime() > now.getTime()) return date;
  }
  return new Date();
}

function tomorrowAt(hour: number, minute: number): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, hour, minute));
}

const CHANNEL = "https://www.youtube.com/channel/UCg-gQu4cBrhltJlGHaLmHKw";

// Dates are computed at call time so the calendar always shows upcoming events.
export function buildEventSeeds(): EventSeed[] {
  return [
    {
      title: "Morning Altar",
      description: "Thirty minutes of prayer and a short word to start the day, every morning online.",
      startsAt: tomorrowAt(6, 30),
      frequency: "daily",
      cadence: "Every morning · 06:30",
      location: "Online",
      streamUrl: CHANNEL,
    },
    {
      title: "Sunday Celebration Service",
      description: "Worship, the word and communion, with live translation on screen.",
      startsAt: nextWeekday(0, 10, 0),
      frequency: "weekly",
      cadence: "Every Sunday · 10:00",
      location: "In person and online",
      streamUrl: CHANNEL,
    },
    {
      title: "Word and Prayer Evening",
      description: "Midweek teaching and intercession. Doors open thirty minutes early.",
      startsAt: nextWeekday(3, 19, 0),
      frequency: "weekly",
      cadence: "Every Wednesday · 19:00",
      location: "In person",
    },
    {
      title: "Grace Groups",
      description: "Smaller circles meeting in homes across the city. Ask us for your nearest group.",
      startsAt: nextWeekday(5, 19, 30),
      frequency: "weekly",
      cadence: "Every Friday · 19:30",
      location: "Homes across the city",
    },
    {
      title: "Community Outreach",
      description: "Food parcels, visits and practical help for our neighbours. Volunteers welcome.",
      startsAt: nextWeekday(6, 11, 0),
      frequency: "weekly",
      cadence: "Every Saturday · 11:00",
      location: "Meet at the church",
    },
    {
      title: "Communion and Thanksgiving Sunday",
      description: "A longer table, testimonies and thanksgiving for what God has done in the month.",
      startsAt: nextMonthWeekday(0, 1, 10, 0),
      frequency: "monthly",
      cadence: "First Sunday of the month · 10:00",
      location: "In person and online",
      streamUrl: CHANNEL,
    },
    {
      title: "Night of Grace",
      description: "A monthly evening vigil of worship and prayer that runs late into the night.",
      startsAt: nextMonthWeekday(5, 4, 21, 0),
      frequency: "monthly",
      cadence: "Last Friday of the month · 21:00",
      location: "In person and online",
      streamUrl: CHANNEL,
    },
    {
      title: "Leaders and Workers Meeting",
      description: "Training and communion for everyone who serves in any team.",
      startsAt: nextMonthWeekday(6, 2, 17, 0),
      frequency: "monthly",
      cadence: "Second Saturday of the month · 17:00",
      location: "In person",
    },
  ];
}
