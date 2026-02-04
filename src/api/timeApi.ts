export type TimeResponse = {
  datetime: string; // ISO string
  timezone: string; // IANA
  unixtime?: number;
};

// List of cities with IANA timezones
export const CITIES = [
  { name: 'Tel Aviv', tz: 'Asia/Jerusalem' },
  { name: 'London', tz: 'Europe/London' },
  { name: 'New York', tz: 'America/New_York' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' },
  { name: 'Paris', tz: 'Europe/Paris' },
  { name: 'Sydney', tz: 'Australia/Sydney' },
  { name: 'Los Angeles', tz: 'America/Los_Angeles' },
  { name: 'Moscow', tz: 'Europe/Moscow' },
  { name: 'Dubai', tz: 'Asia/Dubai' },
  { name: 'São Paulo', tz: 'America/Sao_Paulo' },
];

// Primary fetch function. The project spec mentions "time.now API".
// We'll attempt to call that, but gracefully fallback to worldtimeapi.org for demo.
export async function fetchTimeForTimezone(tz: string): Promise<TimeResponse> {
  // Try official endpoint (spec'd) first
  const primary = `https://time.now/developer/timezone/${encodeURIComponent(tz)}`;
  const fallback = `https://worldtimeapi.org/api/timezone/${encodeURIComponent(tz)}`;

  async function tryFetch(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as TimeResponse;
  }

  try {
    return await tryFetch(primary);
  } catch (err) {
    // Fallback, handle errors with try/catch upstream
    return await tryFetch(fallback);
  }
}
