'use client';

import { ordersData } from '../data/dashboardData';

export default function OrdersCard() {
  const { total, completed, preparing, pending } = ordersData;

  const completedPct = (completed / total) * 100;
  const preparingPct = (preparing / total) * 100;
  const pendingPct   = (pending   / total) * 100;

  return (
    <div className="db-card">
      <div className="db-card-inner">
        <div className="db-card-label">Total Orders Today</div>
        <div className="db-card-metric">{total}</div>
        <div className="db-card-sub">orders received</div>

        <div className="db-order-chips">
          <div className="db-chip">
            <span className="db-chip-dot completed" aria-hidden="true" />
            Completed {completed}
          </div>
          <div className="db-chip">
            <span className="db-chip-dot preparing" aria-hidden="true" />
            Preparing {preparing}
          </div>
          <div className="db-chip">
            <span className="db-chip-dot pending" aria-hidden="true" />
            Pending {pending}
          </div>
        </div>

        {/* Proportional status bar */}
        <div
          className="db-order-bar"
          role="img"
          aria-label={`Orders: ${completed} completed, ${preparing} preparing, ${pending} pending`}
        >
          <div
            className="db-order-bar-seg completed"
            style={{ width: `${completedPct}%` }}
          />
          <div
            className="db-order-bar-seg preparing"
            style={{ width: `${preparingPct}%` }}
          />
          <div
            className="db-order-bar-seg pending"
            style={{ width: `${pendingPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
