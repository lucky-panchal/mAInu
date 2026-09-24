'use client';

import { topItemsData } from '../data/dashboardData';

export default function TopItemsCard() {
  const max = topItemsData[0].count;

  return (
    <div className="db-card">
      <div className="db-card-inner">
        <div className="db-card-label">Most Ordered Items</div>

        <div className="db-top-items">
          {topItemsData.map((item) => (
            <div key={item.rank} className="db-top-item">
              <div className="db-top-item-row">
                <span className="db-top-item-rank">#{item.rank}</span>
                <span className="db-top-item-name">{item.name}</span>
                <span className="db-top-item-count">{item.count}x</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 24 }}>
                <div className="db-top-item-bar-bg" style={{ flex: 1 }}>
                  <div
                    className="db-top-item-bar-fill"
                    style={{ width: `${(item.count / max) * 100}%` }}
                    role="progressbar"
                    aria-valuenow={item.count}
                    aria-valuemax={max}
                    aria-label={`${item.name}: ${item.count} orders`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
