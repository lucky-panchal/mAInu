'use client';

import Link from 'next/link';
import { Eye, Printer, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function OrdersTable({
  orders,
  onReprintBill,
  onCancelOrder,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalOrdersCount,
}) {
  if (!orders || orders.length === 0) {
    return (
      <div className="db-table-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--db-text-3)', fontSize: '14px', marginBottom: '8px' }}>
          No orders found matching your filters.
        </p>
        <span style={{ fontSize: '12px', color: 'var(--db-text-3)' }}>
          Try clearing search filters or selecting &quot;All&quot; statuses.
        </span>
      </div>
    );
  }

  const totalPages = Math.ceil(totalOrdersCount / pageSize) || 1;

  const getStatusClass = (st) => {
    switch (st) {
      case 'Pending':
        return 'db-status-pending';
      case 'Preparing':
        return 'db-status-preparing';
      case 'Ready':
        return 'db-status-ready';
      case 'Served':
        return 'db-status-served';
      case 'Cancelled':
        return 'db-status-cancelled';
      default:
        return 'db-status-unavailable';
    }
  };

  return (
    <div className="db-table-card">
      <div className="db-table-container">
        <table className="db-data-table" id="orders-list-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table</th>
              <th>Items Preview</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Time</th>
              <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              // Items preview
              const itemsCount = order.items.length;
              const previewText = order.items
                .slice(0, 2)
                .map((i) => `${i.name} ×${i.qty}`)
                .join(', ');
              const remainingCount = itemsCount > 2 ? ` +${itemsCount - 2} more` : '';

              return (
                <tr key={order.id} id={`order-row-${order.id}`}>
                  {/* Order ID */}
                  <td>
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        color: 'var(--db-accent)',
                        textDecoration: 'none',
                        fontSize: '13px',
                      }}
                      title="View order details"
                    >
                      #{order.id}
                    </Link>
                  </td>

                  {/* Table # */}
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        background: '#e8e5de',
                        padding: '3px 7px',
                        color: 'var(--db-text)',
                      }}
                    >
                      {order.table}
                    </span>
                  </td>

                  {/* Items Preview */}
                  <td>
                    <div style={{ maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span style={{ fontSize: '12.5px', color: 'var(--db-text)' }}>
                        {previewText}
                      </span>
                      {remainingCount && (
                        <span style={{ fontSize: '11px', color: 'var(--db-text-3)', fontWeight: 500 }}>
                          {remainingCount}
                        </span>
                      )}
                      {order.customer?.name && (
                        <div style={{ fontSize: '11px', color: 'var(--db-text-3)', marginTop: 2 }}>
                          Guest: {order.customer.name}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '14px' }}>
                      ₹{order.total}
                    </span>
                  </td>

                  {/* Order Status */}
                  <td>
                    <span className={`db-status-badge ${getStatusClass(order.status)}`}>
                      <span className="db-status-dot" />
                      {order.status}
                    </span>
                  </td>

                  {/* Payment */}
                  <td>
                    <span
                      className={`db-payment-badge ${
                        order.paymentStatus === 'Paid' ? 'db-payment-paid' : 'db-payment-unpaid'
                      }`}
                    >
                      {order.paymentStatus}
                      {order.paymentMethod ? ` (${order.paymentMethod})` : ''}
                    </span>
                  </td>

                  {/* Time */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        {order.time}
                      </span>
                      {order.duration && (
                        <span style={{ fontSize: '11px', color: 'var(--db-text-3)' }}>
                          {order.duration} ago
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '6px',
                        paddingRight: '4px',
                      }}
                    >
                      {/* View Details */}
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="db-btn-icon-only"
                        title="View Order Details"
                        aria-label={`View order ${order.id}`}
                      >
                        <Eye size={13} />
                      </Link>

                      {/* Reprint Bill */}
                      <button
                        type="button"
                        className="db-btn-icon-only"
                        title="Reprint Bill"
                        onClick={() => onReprintBill(order)}
                        aria-label={`Reprint bill for ${order.id}`}
                      >
                        <Printer size={13} />
                      </button>

                      {/* Cancel Order */}
                      {order.status !== 'Cancelled' && (
                        <button
                          type="button"
                          className="db-btn-icon-only db-btn-icon-danger"
                          title="Cancel Order"
                          onClick={() => onCancelOrder(order.id)}
                          aria-label={`Cancel order ${order.id}`}
                        >
                          <XCircle size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="db-pagination">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, totalOrdersCount)} of {totalOrdersCount} orders
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)' }}>
              Rows:
            </span>
            <select
              className="db-filter-select"
              style={{ height: '28px', padding: '0 24px 0 8px', fontSize: '11.5px' }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="db-pagination-nav">
          <button
            type="button"
            className="db-page-btn"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                type="button"
                className={`db-page-btn${currentPage === p ? ' active' : ''}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            className="db-page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
