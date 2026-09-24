'use client';
import React, { useState } from 'react';
import { analyticsData } from '../data/analyticsData';

/* Simple SVG bar chart */
function BarChart({ data, label, color = '#c85a32' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 540, H = 120, BAR_W = Math.floor((W - 40) / data.length) - 6;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 30}`} style={{display:'block'}}>
      {data.map((d, i) => {
        const barH = Math.max(4, (d.value / max) * H);
        const x = 20 + i * (BAR_W + 6);
        const y = H - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={BAR_W} height={barH} fill={color} opacity={0.85} rx={2} />
            <text x={x + BAR_W / 2} y={H + 16} textAnchor="middle" fontSize={10} fill="#999">{d.label}</text>
            <text x={x + BAR_W / 2} y={y - 4} textAnchor="middle" fontSize={10} fill={color} fontWeight="700">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* Simple SVG line chart */
function LineChart({ data, color = '#c85a32' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 540, H = 100;
  const pts = data.map((d, i) => {
    const x = 20 + (i / (data.length - 1)) * (W - 40);
    const y = H - (d.value / max) * (H - 10);
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const area = `M${pts[0]} ${pts.map(p=>`L${p}`).join(' ')} L${pts[pts.length-1].split(',')[0]},${H} L${pts[0].split(',')[0]},${H} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 30}`} style={{display:'block'}}>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lg)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = 20 + (i / (data.length - 1)) * (W - 40);
        const y = H - (d.value / max) * (H - 10);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={3.5} fill={color} />
            <text x={x} y={H + 16} textAnchor="middle" fontSize={10} fill="#999">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* Donut chart */
function DonutChart({ segments }) {
  const total = segments.reduce((s, d) => s + d.value, 0);
  let cumAngle = -90;
  const R = 56, cx = 70, cy = 70;
  const slices = segments.map(seg => {
    const angle = (seg.value / total) * 360;
    const start = cumAngle;
    cumAngle += angle;
    const r1 = (start * Math.PI) / 180, r2 = ((start + angle) * Math.PI) / 180;
    const x1 = cx + R * Math.cos(r1), y1 = cy + R * Math.sin(r1);
    const x2 = cx + R * Math.cos(r2), y2 = cy + R * Math.sin(r2);
    const large = angle > 180 ? 1 : 0;
    return { ...seg, d: `M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} Z`, angle };
  });
  return (
    <div style={{display:'flex',alignItems:'center',gap:24}}>
      <svg width={140} height={140}>
        <circle cx={cx} cy={cy} r={R} fill="#f3ede6" />
        {slices.map((s, i) => <path key={i} d={s.d} fill={s.color} />)}
        <circle cx={cx} cy={cy} r={36} fill="#fff" />
        <text x={cx} y={cy-4} textAnchor="middle" fontSize={14} fontWeight="700" fill="#333">{total}</text>
        <text x={cx} y={cy+14} textAnchor="middle" fontSize={10} fill="#999">orders</text>
      </svg>
      <div>
        {segments.map((s, i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            <span style={{width:10,height:10,borderRadius:'50%',background:s.color,flexShrink:0,display:'inline-block'}} />
            <span style={{fontSize:12,color:'var(--db-text-2)'}}>{s.label}</span>
            <span style={{fontSize:12,fontWeight:700,color:'var(--db-text)',marginLeft:'auto',paddingLeft:8}}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const RANGES = ['7 Days', '30 Days', '90 Days'];

export default function AnalyticsPage() {
  const [range, setRange] = useState('7 Days');
  const d = analyticsData[range] || analyticsData['7 Days'];

  const kpis = [
    { label: 'Total Revenue', value: `₹${d.totalRevenue.toLocaleString('en-IN')}`, change: d.revenueChange, icon: '💰' },
    { label: 'Total Orders',  value: d.totalOrders,  change: d.ordersChange,  icon: '🛍️' },
    { label: 'Avg Order Value', value: `₹${d.avgOrderValue}`, change: d.aovChange, icon: '📊' },
    { label: 'New Customers', value: d.newCustomers, change: d.customersChange, icon: '👤' },
  ];

  return (
    <div style={{padding:'28px 32px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:'Google Sans',fontSize:22,fontWeight:700,color:'var(--db-text)',margin:0}}>Analytics</h1>
          <p style={{margin:'4px 0 0',fontSize:13,color:'var(--db-text-3)'}}>Business performance overview</p>
        </div>
        <div style={{display:'flex',gap:4,border:'1px solid var(--db-border)',background:'#fff',padding:3}}>
          {RANGES.map(r => (
            <button key={r} onClick={()=>setRange(r)} style={{
              padding:'5px 14px',border:'none',cursor:'pointer',fontSize:12,fontWeight:600,
              background:range===r?'var(--db-accent)':'transparent',
              color:range===r?'#fff':'var(--db-text-2)',
              transition:'all 130ms ease',
            }}>{r}</button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {kpis.map((k,i) => (
          <div key={i} style={{background:'#fff',border:'1px solid var(--db-border)',padding:'20px 20px 16px'}}>
            <div style={{fontSize:22,marginBottom:6}}>{k.icon}</div>
            <div style={{fontFamily:'Google Sans',fontSize:24,fontWeight:700,color:'var(--db-text)'}}>{k.value}</div>
            <div style={{fontSize:12,color:'var(--db-text-3)',marginBottom:4}}>{k.label}</div>
            <span style={{fontSize:11,fontWeight:600,color:k.change>=0?'var(--db-green)':'var(--db-red)'}}>
              {k.change>=0?'▲':'▼'} {Math.abs(k.change)}% vs prev period
            </span>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
        <div className="db-chart-container">
          <div className="db-chart-title">Daily Revenue</div>
          <div className="db-chart-subtitle">₹ over {range.toLowerCase()}</div>
          <BarChart data={d.revenueByDay} color="var(--db-accent)" />
        </div>
        <div className="db-chart-container">
          <div className="db-chart-title">Orders Trend</div>
          <div className="db-chart-subtitle">Order count over {range.toLowerCase()}</div>
          <LineChart data={d.ordersByDay} color="#2563eb" />
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
        <div className="db-chart-container">
          <div className="db-chart-title">Orders by Type</div>
          <div className="db-chart-subtitle">Dine-in vs Takeaway vs Delivery</div>
          <DonutChart segments={d.ordersByType} />
        </div>
        <div className="db-chart-container">
          <div className="db-chart-title">Top Selling Items</div>
          <div className="db-chart-subtitle">By number of orders</div>
          <BarChart data={d.topItems} color="#16a34a" />
        </div>
      </div>

      {/* Top Items Table */}
      <div className="db-chart-container">
        <div className="db-chart-title" style={{marginBottom:16}}>Revenue by Category</div>
        <div className="db-table-wrap">
          <table className="db-table">
            <thead><tr><th>Category</th><th>Orders</th><th>Revenue</th><th>Avg Order</th><th>Share</th></tr></thead>
            <tbody>
              {d.categoryBreakdown.map((c, i) => (
                <tr key={i}>
                  <td style={{fontWeight:600}}>{c.category}</td>
                  <td>{c.orders}</td>
                  <td style={{fontWeight:600,color:'var(--db-accent)'}}>₹{c.revenue.toLocaleString('en-IN')}</td>
                  <td>₹{Math.round(c.revenue/c.orders)}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:80,height:6,background:'var(--db-border)',overflow:'hidden'}}>
                        <div style={{width:`${c.share}%`,height:'100%',background:'var(--db-accent)'}} />
                      </div>
                      <span style={{fontSize:12,fontWeight:600}}>{c.share}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
