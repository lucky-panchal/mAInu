'use client';

import { useEffect, useState } from 'react';
import { peakHoursData } from '../data/dashboardData';

export default function PeakHoursCard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const max = Math.max(...peakHoursData.map((d) => d.orders));
  const peakHour = peakHoursData.find((d) => d.orders === max);

  return (
    <div className="db-card">
      <div className="db-card-inner">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="db-card-label" style={{ marginBottom: 0 }}>Peak Hours</div>
          <div style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--db-accent)',
            background: 'var(--db-accent-dim)',
            padding: '2px 7px',
            border: '1px solid rgba(200,90,50,0.2)',
          }}>
            Peak: {peakHour?.label}
          </div>
        </div>

        <div className="db-peak-chart">
          <div className="db-peak-bars">
            {peakHoursData.map((d) => {
              const isPeak = d.orders === max;
              const heightPct = mounted ? (d.orders / max) * 100 : 0;
              return (
                <div key={d.hour} className="db-peak-bar-wrap">
                  <div className="db-peak-bar-track">
                    <div
                      className={`db-peak-bar-fill${isPeak ? ' peak' : ''}`}
                      style={{
                        height: `${heightPct}%`,
                        transition: `height 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${Number(d.hour) * 15}ms`,
                      }}
                      role="img"
                      aria-label={`${d.label}: ${d.orders} orders`}
                    />
                  </div>
                  <span className={`db-peak-label${isPeak ? ' peak' : ''}`}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="db-peak-legend">
            <span className="db-peak-legend-dot" aria-hidden="true" />
            Peak hour — most orders in an hour
          </div>
        </div>
      </div>
    </div>
  );
}
