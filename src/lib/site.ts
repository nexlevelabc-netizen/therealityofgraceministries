export const SITE = {
  name: "The Reality of Grace Ministries",
  suffix: "Int'l",
  fullName: "The Reality of Grace Ministries Int'l",
  tagline: "Grace is a reality for real life",
  phoneDisplay: "07908 407744",
  phoneHref: "tel:+447908407744",
  email: "info@therealityofgraceministries.com",
  socials: [
    { label: "YouTube", href: "https://www.youtube.com/channel/UCg-gQu4cBrhltJlGHaLmHKw" },
    { label: "Facebook", href: "https://www.facebook.com/TRGMI/" },
    { label: "Instagram", href: "https://www.instagram.com/therealityofgraceministries/" },
    { label: "TikTok", href: "https://www.tiktok.com/@therealityofgraceministries" },
  ],
  youtubeChannelId: "UCg-gQu4cBrhltJlGHaLmHKw",
};

export const NAV_LINKS = [
  { to: "/about", label: "About" },
  { to: "/visit", label: "First Visit" },
  { to: "/gatherings", label: "Gatherings" },
  { to: "/live", label: "Watch Live" },
  { to: "/believe", label: "Believe" },
  { to: "/prayer", label: "Prayer" },
  { to: "/contact", label: "Contact" },
];

export const GATHERING_RHYTHM = [
  { day: "Sunday", name: "Celebration Service", time: "10:00 in the morning", note: "Worship, the word and communion, with translation on screen" },
  { day: "Wednesday", name: "Word and Prayer", time: "19:00 in the evening", note: "Teaching, intercession and quiet ministry" },
  { day: "Friday", name: "Grace Groups", time: "19:30 in the evening", note: "Smaller circles in homes across the city" },
];

export const LANGUAGES = [
  { code: "en", label: "English", cc: "en" },
  { code: "es", label: "Español", cc: "es" },
  { code: "it", label: "Italiano", cc: "it" },
  { code: "pt", label: "Português", cc: "pt" },
  { code: "ar", label: "العربية", cc: "ar" },
  { code: "zh", label: "中文", cc: "zh-Hans" },
  { code: "fr", label: "Français", cc: "fr" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const GIVE_FUNDS = [
  { id: "tithes", label: "Tithes", blurb: "The first tenth, honouring God with our substance" },
  { id: "offerings", label: "Offerings", blurb: "Voluntary worship given over and above" },
  { id: "kingdom", label: "Kingdom Projects", blurb: "Building, media and mission work across nations" },
  { id: "compassion", label: "Compassion", blurb: "Food, shelter and practical help for our neighbours" },
] as const;

/* The needs the teaching library is organised around. Labels live in the
   i18n files under library.topics. */
export const MESSAGE_TOPICS = [
  "faith",
  "healing",
  "family",
  "finances",
  "prayer",
  "purpose",
  "grace",
  "identity",
] as const;

export type MessageTopic = (typeof MESSAGE_TOPICS)[number];

/* Pulls a YouTube video id out of any common YouTube link shape, or accepts
   a bare eleven character id pasted directly. */
export function parseYouTubeId(raw: string): string | null {
  const s = raw.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtube\.com\/(?:watch\?[^#]*v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m?.[1] ?? null;
}
