'use client';

import { useState, useMemo } from 'react';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { ordersData as initialOrdersData } from '../data/ordersData';
import OrdersFilters from './components/OrdersFilters';
import OrdersTable from './components/OrdersTable';

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState(initialOrdersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState('All');
  const [dateFilter, setDateFilter] = useState('today');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = order.id.toLowerCase().includes(q);
        const matchTable = order.table.toLowerCase().includes(q);
        const matchCustomer = order.customer?.name?.toLowerCase().includes(q);
        if (!matchId && !matchTable && !matchCustomer) return false;
      }

      // Status
      if (selectedStatus !== 'All' && order.status !== selectedStatus) {
        return false;
      }

      // Payment
      if (selectedPayment !== 'All' && order.paymentStatus !== selectedPayment) {
        return false;
      }

      return true;
    });
  }, [orders, searchQuery, selectedStatus, selectedPayment]);

  // Paginated slice
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Actions
  const handleReprintBill = (order) => {
    showToast(`Sending bill #${order.id} to thermal printer...`);
  };

  const handleCancelOrder = (id) => {
    if (window.confirm(`Are you sure you want to cancel order #${id}?`)) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: 'Cancelled' } : o))
      );
      showToast(`Order #${id} has been cancelled.`);
    }
  };

  const handleExportCsv = () => {
    const header = 'Order ID,Table,Customer,Items Count,Total,Status,Payment,Time,Date';
    const rows = filteredOrders.map(
      (o) =>
        `"${o.id}","${o.table}","${o.customer?.name || ''}",${o.items.length},${o.total},"${o.status}","${o.paymentStatus}","${o.time}","${o.date}"`
    );
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Exported orders to CSV');
  };

  const activeCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready'
  ).length;

  return (
    <main className="db-content" id="db-orders-page">
      {/* Toast alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#141414',
            color: '#fff',
            padding: '12px 18px',
            fontSize: '13px',
            fontFamily: 'Manrope',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 2000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            borderLeft: '4px solid var(--db-accent)',
          }}
        >
          <CheckCircle2 size={16} color="var(--db-accent)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="db-page-header">
        <div>
          <h1 className="db-page-title">Orders Management</h1>
          <p className="db-page-subtitle">
            {orders.length} total orders recorded &bull; {activeCount} live in kitchen
          </p>
        </div>

        <div className="db-live-badge" aria-live="polite">
          <span className="db-live-dot" aria-hidden="true" />
          {activeCount} Active Orders
        </div>
      </div>

      {/* Filters Toolbar */}
      <OrdersFilters
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        setSelectedStatus={(s) => {
          setSelectedStatus(s);
          setCurrentPage(1);
        }}
        selectedPayment={selectedPayment}
        setSelectedPayment={(p) => {
          setSelectedPayment(p);
          setCurrentPage(1);
        }}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onExportCsv={handleExportCsv}
      />

      {/* Orders Table */}
      <OrdersTable
        orders={paginatedOrders}
        onReprintBill={handleReprintBill}
        onCancelOrder={handleCancelOrder}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalOrdersCount={filteredOrders.length}
      />
    </main>
  );
}
