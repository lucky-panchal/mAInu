'use client';

import { Search, Download, Calendar } from 'lucide-react';
import { orderStatuses } from '../../data/ordersData';

const DATE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'This Month' },
];

const PAYMENT_OPTIONS = ['All', 'Paid', 'Unpaid'];

export default function OrdersFilters({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedPayment,
  setSelectedPayment,
  dateFilter,
  setDateFilter,
  onExportCsv,
}) {
  const allStatuses = ['All', ...orderStatuses];

  return (
    <div className="db-toolbar" id="orders-filters-toolbar">
      {/* Top row: Search + Date Filter + Payment Filter + Export */}
      <div className="db-toolbar-row">
        {/* Search */}
        <div className="db-search-box">
          <Search size={15} className="db-search-icon" />
          <input
            id="orders-search-input"
            type="search"
            placeholder="Search by Order ID, Table #, Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search orders"
          />
        </div>

        {/* Filter dropdowns & Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Date Picker Range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)', textTransform: 'uppercase' }}>
              Date:
            </span>
            <select
              id="orders-date-filter"
              className="db-filter-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              aria-label="Filter by date range"
            >
              {DATE_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)', textTransform: 'uppercase' }}>
              Payment:
            </span>
            <select
              id="orders-payment-filter"
              className="db-filter-select"
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              aria-label="Filter by payment status"
            >
              {PAYMENT_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p === 'All' ? 'All Payments' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Export CSV button */}
          <button
            type="button"
            className="db-btn db-btn-outline db-btn-sm"
            onClick={onExportCsv}
            id="btn-export-orders-csv"
            title="Export orders as CSV"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="db-pill-tabs" role="tablist" aria-label="Order status tabs">
        {allStatuses.map((st) => {
          const isActive = selectedStatus === st;
          return (
            <button
              key={st}
              role="tab"
              aria-selected={isActive}
              id={`tab-order-status-${st.toLowerCase()}`}
              className={`db-pill-tab${isActive ? ' active' : ''}`}
              onClick={() => setSelectedStatus(st)}
            >
              {st}
            </button>
          );
        })}
      </div>
    </div>
  );
}
