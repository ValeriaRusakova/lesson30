import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  name: string;
  tz: string;
  datetime?: string;
  loading?: boolean;
};

function formatTimeForTZ(iso: string | undefined, tz: string) {
  try {
    const d = iso ? new Date(iso) : new Date();
    return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(d);
  } catch {
    return '—';
  }
}

function dayOrNight(iso: string | undefined, tz: string) {
  try {
    const d = iso ? new Date(iso) : new Date();
    const hourStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', timeZone: tz }).format(d);
    const h = parseInt(String(hourStr), 10);
    if (Number.isNaN(h)) return '❓';
    return h >= 6 && h < 18 ? '☀️' : '🌙';
  } catch {
    return '❓';
  }
}

export default function CityCard({ name, tz, datetime, loading }: Props) {
  return (
    <article className="city-card">
      <h3>{name}</h3>
      <div className="city-time">
        {loading && !datetime ? (
          <span className="muted">Loading…</span>
        ) : (
          <>
            <div className="time">{formatTimeForTZ(datetime, tz)}</div>
            <div className="tz">{tz}</div>
            {/* errors are logged to console only; do not show to users */}
          </>
        )}
      </div>
      <div className="day-night">{dayOrNight(datetime, tz)}</div>
      <Link to={`/city/${encodeURIComponent(tz)}`} className="details-link">Details</Link>
    </article>
  );
}
