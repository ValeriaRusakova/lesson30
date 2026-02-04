import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTimeForTimezone } from '../api/timeApi';

export default function CityDetails() {
  const { tz } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!tz) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTimeForTimezone(tz);
      setData(res);
    } catch (err: any) {
      setError(String(err));
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

  return (
    <main>
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>City Details</h2>
      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {data && (
        <div className="city-details">
          <p>
            <strong>Local time:</strong> {new Date(data.datetime).toLocaleTimeString()}
          </p>
          <p>
            <strong>Date:</strong> {new Date(data.datetime).toLocaleDateString()}
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
