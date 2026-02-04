import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTimeForTimezone } from '../api/timeApi';

export default function CityDetails() {
  const { tz } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!tz) return;
    setLoading(true);
    try {
      const res = await fetchTimeForTimezone(tz);
      setData(res);
    } catch (err: any) {
      console.error('CityDetails fetch error for', tz, err);
      // fallback: provide estimated current time for the requested timezone
      setData({ datetime: new Date().toISOString(), timezone: tz, _estimated: true });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tz]);

  function fmtTime(dateIso: string, zone: string) {
    try {
      const d = new Date(dateIso);
      return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: undefined, hour12: false, timeZone: zone }).format(d);
    } catch {
      return '—';
    }
  }

  function fmtDate(dateIso: string, zone: string) {
    try {
      const d = new Date(dateIso);
      return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: zone }).format(d);
    } catch {
      return '—';
    }
  }

  return (
    <main>
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>City Details</h2>
      {loading && <p>Loading…</p>}
      {data && (
        <div className="city-details">
          <p>
            <strong>Local time:</strong> {fmtTime(data.datetime, data.timezone || tz || 'UTC')}{' '}
            {data._estimated && <em className="muted">(estimated)</em>}
          </p>
          <p>
            <strong>Date:</strong> {fmtDate(data.datetime, data.timezone || tz || 'UTC')}
          </p>
          <p>
            <strong>Timezone (IANA):</strong> {data.timezone || tz}
          </p>
        </div>
      )}
      <div style={{ marginTop: 12 }}>
        <button onClick={load}>Refresh</button>
      </div>
    </main>
  );
}
