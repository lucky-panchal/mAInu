'use client';

import { revenueData } from '../data/dashboardData';

// Custom SVG sparkline — bezier area chart, no library
function Sparkline({ data, width = 220, height = 52 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padY = 4;
  const usableH = height - padY * 2;
  const stepX = width / (data.length - 1);

  const points = data.map((v, i) => ({
    x: i * stepX,
    y: padY + usableH - ((v - min) / range) * usableH,
  }));

  // Smooth bezier path
  const linePath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `${acc} C ${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x},${height} L 0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      style={{ display: 'block', width: '100%' }}
    >
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C85A32" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#C85A32" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkGrad)" />
      <path d={linePath} stroke="#C85A32" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Terminal dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="3"
        fill="#C85A32"
      />
    </svg>
  );
}

// SVG triangle for delta direction
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

export default function RevenueCard() {
  const { today, change, changeDirection, sparkline } = revenueData;

  return (
    <div className="db-card">
      <div className="db-card-inner">
        <div className="db-card-label">Today&apos;s Revenue</div>
        <div className="db-card-metric-mono">
          &#8377;{today.toLocaleString('en-IN')}
        </div>
        <div
          className={`db-delta db-delta-${changeDirection}`}
          aria-label={`${change}% ${changeDirection === 'up' ? 'increase' : 'decrease'} vs yesterday`}
        >
          <DeltaArrow direction={changeDirection} />
          {change}% vs yesterday
        </div>
        <div className="db-sparkline">
          <Sparkline data={sparkline} />
        </div>
        <div className="db-card-sub" style={{ marginTop: 6 }}>7-day revenue trend</div>
      </div>
    </div>
  );
}
