'use client';

import Link from 'next/link';
import { recentOrdersData } from '../data/dashboardData';

function statusClass(status) {
  switch (status.toLowerCase()) {
    case 'completed': return 'completed';
    case 'preparing': return 'preparing';
    case 'pending':   return 'pending';
    default:          return 'issue';
  }
}

export default function RecentOrdersTable() {
  return (
    <div className="db-table-card">
      <div className="db-table-header">
        <span className="db-table-title">Recent Orders</span>
        <Link href="/dashboard/orders" className="db-table-link">
          View all orders
        </Link>
      </div>

      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table className="db-orders-table" aria-label="Recent orders" style={{ minWidth: '560px' }}>
          <thead>
            <tr>
              <th style={{ width: '110px' }}>Order ID</th>
              <th style={{ width: '80px' }}>Table</th>
              <th>Items</th>
              <th style={{ width: '85px' }}>Total</th>
              <th style={{ width: '110px' }}>Status</th>
              <th style={{ width: '80px', textAlign: 'right' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentOrdersData.map((order) => {
              const cls = statusClass(order.status);
              return (
                <tr
                  key={order.id}
                  tabIndex={0}
                  aria-label={`Order ${order.id}, Table ${order.table}, ${order.status}`}
                >
                  <td className="db-cell-id">{order.id}</td>
                  <td className="db-cell-table">{order.table}</td>
                  <td className="db-cell-items" title={order.items}>{order.items}</td>
                  <td className="db-cell-total">{order.total}</td>
                  <td>
                    <span className={`db-status-badge ${cls}`}>
                      <span className="db-status-dot" aria-hidden="true" />
                      {order.status}
                    </span>
                  </td>
                  <td className="db-cell-time" style={{ textAlign: 'right' }}>{order.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

