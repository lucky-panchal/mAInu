'use client';

import { useEffect, useRef } from 'react';
import { occupancyData } from '../data/dashboardData';

// Custom SVG animated donut arc
function DonutChart({ percentage, size = 88, strokeW = 9 }) {
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      style={{ display: 'block', transform: 'rotate(-90deg)' }}
    >
      {/* Track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="rgba(0,0,0,0.07)"
        strokeWidth={strokeW}
      />
      {/* Fill */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#C85A32"
        strokeWidth={strokeW}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="butt"
        style={{
          transition: 'stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </svg>
  );
}

export default function OccupancyCard() {
  const { occupied, total, percentage } = occupancyData;

  return (
    <div className="db-card">
      <div className="db-card-inner">
        <div className="db-card-label">Table Occupancy</div>

        <div className="db-occ-layout">
          <div className="db-occ-donut">
            <DonutChart percentage={percentage} />
          </div>
          <div className="db-occ-info">
            <div className="db-occ-fraction">{occupied}/{total}</div>
            <div className="db-occ-pct">{percentage}% occupied</div>
            <div className="db-occ-sub">{total - occupied} tables free</div>
          </div>
        </div>
      </div>
    </div>
  );
}
