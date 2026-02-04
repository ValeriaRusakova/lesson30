import React, { useEffect, useState } from 'react';
import CityCard from '../components/CityCard';
import { CITIES, fetchTimeForTimezone } from '../api/timeApi';

type CityState = {
  tz: string;
  name: string;
  datetime?: string;
  loading: boolean;
};

export default function Home() {
  const [cities, setCities] = useState<CityState[]>(
    CITIES.map((c) => ({ name: c.name, tz: c.tz, loading: true }))
  );

  async function loadAll() {
    setCities((s) => s.map((c) => ({ ...c, loading: true })));
    await Promise.all(
      CITIES.map(async (c) => {
        try {
          const data = await fetchTimeForTimezone(c.tz);
          setCities((prev) => prev.map((p) => (p.tz === c.tz ? { ...p, datetime: data.datetime, loading: false } : p)));
        } catch (err: any) {
          console.error('Error fetching timezone for', c.tz, err);
          setCities((prev) => prev.map((p) => (p.tz === c.tz ? { ...p, loading: false } : p)));
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
