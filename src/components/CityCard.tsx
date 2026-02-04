import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  name: string;
  tz: string;
  datetime?: string;
  loading?: boolean;
  error?: string | null;
};

function dayOrNight(iso?: string) {
  if (!iso) return '❓';
  try {
    const d = new Date(iso);
    const h = d.getHours();
    return h >= 6 && h < 18 ? '☀️' : '🌙';
  } catch {
    return '❓';
  }
}

export default function CityCard({ name, tz, datetime, loading, error }: Props) {
  return (
    <article className="city-card">
      <h3>{name}</h3>
      <div className="city-time">
        {loading ? (
          <span className="muted">Loading…</span>
        ) : error ? (
          <span className="error">Error</span>
        ) : (
          <>
            <div className="time">{datetime ? new Date(datetime).toLocaleTimeString() : '—'}</div>
            <div className="tz">{tz}</div>
          </>
        )}
      </div>
      <div className="day-night">{dayOrNight(datetime)}</div>
      <Link to={`/city/${encodeURIComponent(tz)}`} className="details-link">Details</Link>
    </article>
  );
}
