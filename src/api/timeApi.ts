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

// Robust fetch with timeout and retries. Use worldtimeapi.org as primary (stable public API),
// fallback to time.now developer endpoint if primary fails.
async function fetchWithTimeout(url: string, timeout = 5000, signal?: AbortSignal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: signal || controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function tryFetchWithRetries(url: string, attempts = 3, timeout = 5000) {
  let lastErr: any = null;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetchWithTimeout(url, timeout);
    } catch (err) {
      lastErr = err;
      const backoff = 200 * Math.pow(2, i);
      // small delay before retry
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  throw lastErr;
}

export async function fetchTimeForTimezone(tz: string): Promise<TimeResponse> {
  // Use relative path which Vite will proxy in development to worldtimeapi.org
  const primary = `/api/timezone/${encodeURIComponent(tz)}`;
  const fallback = `https://time.now/developer/timezone/${encodeURIComponent(tz)}`;

  // First try primary (worldtimeapi), then fallback. Each with retries/timeouts.
  try {
    const data = await tryFetchWithRetries(primary, 2, 4000);
    return data as TimeResponse;
  } catch (primaryErr) {
    console.debug('Primary timezone fetch failed for', tz, primaryErr);
    try {
      const data = await tryFetchWithRetries(fallback, 2, 5000);
      return data as TimeResponse;
    } catch (fallbackErr) {
      console.error('Both timezone fetches failed for', tz, primaryErr, fallbackErr);
      throw fallbackErr || primaryErr;
    }
  }
}

