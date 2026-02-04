import React, { useEffect, useState } from 'react';
import CityCard from '../components/CityCard';
import { CITIES, fetchTimeForTimezone } from '../api/timeApi';

type CityState = {
  tz: string;
  name: string;
  datetime?: string;
  loading: boolean;
  error: string | null;
};

export default function Home() {
  const [cities, setCities] = useState<CityState[]>(
    CITIES.map((c) => ({ name: c.name, tz: c.tz, loading: true, error: null }))
  );

  async function loadAll() {
    setCities((s) => s.map((c) => ({ ...c, loading: true, error: null })));
    await Promise.all(
      cities.map(async (c) => {
        try {
          const data = await fetchTimeForTimezone(c.tz);
          setCities((prev) => prev.map((p) => (p.tz === c.tz ? { ...p, datetime: data.datetime, loading: false } : p)));
        } catch (err: any) {
          setCities((prev) => prev.map((p) => (p.tz === c.tz ? { ...p, loading: false, error: String(err) } : p)));
        }
      })
    );
  }

  useEffect(() => {
    // initial load
    loadAll();
    // refresh every 60s
    const id = setInterval(loadAll, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      <h1>World Time</h1>
      <section className="grid">
        {cities.map((c) => (
          <CityCard key={c.tz} name={c.name} tz={c.tz} datetime={c.datetime} loading={c.loading} error={c.error} />
        ))}
      </section>
    </main>
  );
}
