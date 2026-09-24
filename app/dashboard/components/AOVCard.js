'use client';

import { aovData } from '../data/dashboardData';

function DeltaArrow({ direction }) {
  return direction === 'up' ? (
    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
      <path d="M4 1 L7 7 L1 7 Z" fill="currentColor" />
    </svg>
  ) : (
    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
      <path d="M4 7 L7 1 L1 1 Z" fill="currentColor" />
    </svg>
  );
}

export default function AOVCard() {
  const { today, lastWeek, change, changeDirection } = aovData;

  return (
    <div className="db-card">
      <div className="db-card-inner">
        <div className="db-card-label">Avg Order Value</div>
        <div className="db-card-metric-mono">
          &#8377;{today}
        </div>
        <div className="db-card-sub">per order</div>

        <div
          className={`db-delta db-delta-${changeDirection}`}
          aria-label={`${change}% ${changeDirection} vs last week`}
        >
          <DeltaArrow direction={changeDirection} />
          {change}% vs last week
        </div>

        <div style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px solid var(--db-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 11.5,
            color: 'var(--db-text-3)',
            fontWeight: 500,
          }}>Last week avg</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--db-text-2)',
            fontWeight: 500,
          }}>&#8377;{lastWeek}</span>
        </div>
      </div>
    </div>
  );
}
