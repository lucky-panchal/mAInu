'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus, LayoutGrid, List, Search, Users, CheckCircle2, Clock,
  Edit2, Trash2, UserCheck, Utensils
} from 'lucide-react';
import { initialTablesData } from '../data/tablesData';
import TableCard from './components/TableCard';
import AddEditTableModal from './components/AddEditTableModal';

export default function TablesPage() {
  const [tables, setTables] = useState(initialTablesData);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [modalState, setModalState] = useState({ isOpen: false, table: null });
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Stats
  const totalTables = tables.length;
  const occupiedCount = tables.filter((t) => t.status === 'Occupied').length;
  const availableCount = tables.filter((t) => t.status === 'Available').length;
  const inactiveCount = tables.filter((t) => t.status === 'Inactive' || t.activeStatus === 'Inactive').length;

  // Locations list
  const locations = useMemo(() => {
    const locs = new Set(tables.map((t) => t.location).filter(Boolean));
    return ['All', ...Array.from(locs)];
  }, [tables]);

  // Filtered tables
  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = t.number.toLowerCase().includes(q);
        const matchLoc = (t.location || '').toLowerCase().includes(q);
        const matchOrder = t.currentOrder?.orderId.toLowerCase().includes(q);
        if (!matchNum && !matchLoc && !matchOrder) return false;
      }

      if (selectedLocation !== 'All' && t.location !== selectedLocation) {
        return false;
      }

      return true;
    });
  }, [tables, searchQuery, selectedLocation]);

  // Handlers
  const handleOpenAdd = () => {
    setModalState({ isOpen: true, table: null });
  };

  const handleOpenEdit = (table) => {
    setModalState({ isOpen: true, table });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, table: null });
  };

  const handleSaveTable = (tableData) => {
    if (tableData.id) {
      setTables((prev) => prev.map((t) => (t.id === tableData.id ? { ...t, ...tableData } : t)));
      showToast(`Updated ${tableData.number}`);
    } else {
      const newId = `t-${Date.now().toString().slice(-4)}`;
      const newTable = {
        ...tableData,
        id: newId,
        currentOrder: null,
      };
      setTables((prev) => [...prev, newTable]);
      showToast(`Created ${newTable.number}`);
    }
    handleCloseModal();
  };

  const handleDeleteTable = (id) => {
    const target = tables.find((t) => t.id === id);
    if (window.confirm(`Are you sure you want to delete ${target?.number}?`)) {
      setTables((prev) => prev.filter((t) => t.id !== id));
      showToast(`Deleted ${target?.number}`);
      handleCloseModal();
    }
  };

  const handleToggleOccupancy = (id) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (t.status === 'Occupied') {
            showToast(`${t.number} marked as Available`);
            return { ...t, status: 'Available', currentOrder: null };
          } else {
            showToast(`${t.number} marked as Occupied`);
            return {
              ...t,
              status: 'Occupied',
              currentOrder: {
                orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                elapsed: '1 min',
                itemsCount: 1,
                total: 350,
              },
            };
          }
        }
        return t;
      })
    );
  };

  return (
    <main className="db-content" id="db-tables-page">
      {/* Toast Alert */}
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
          <h1 className="db-page-title">Table Management</h1>
          <p className="db-page-subtitle">
            Manage floor layout, seating capacities, and real-time dining table occupancy
          </p>
        </div>

        <button
          type="button"
          className="db-btn db-btn-primary"
          onClick={handleOpenAdd}
          id="btn-add-table"
        >
          <Plus size={16} />
          Add Table
        </button>
      </div>

      {/* Summary Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ background: '#ffffff', border: '1px solid var(--db-border)', padding: '16px 20px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)', textTransform: 'uppercase' }}>
            Total Tables
          </span>
          <div style={{ fontFamily: 'Google Sans', fontSize: '24px', fontWeight: 700, marginTop: 4 }}>
            {totalTables}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--db-border)', padding: '16px 20px', borderLeft: '3px solid var(--db-red)' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)', textTransform: 'uppercase' }}>
            Occupied
          </span>
          <div style={{ fontFamily: 'Google Sans', fontSize: '24px', fontWeight: 700, color: 'var(--db-red)', marginTop: 4 }}>
            {occupiedCount}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--db-border)', padding: '16px 20px', borderLeft: '3px solid var(--db-green)' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)', textTransform: 'uppercase' }}>
            Available
          </span>
          <div style={{ fontFamily: 'Google Sans', fontSize: '24px', fontWeight: 700, color: 'var(--db-green)', marginTop: 4 }}>
            {availableCount}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--db-border)', padding: '16px 20px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)', textTransform: 'uppercase' }}>
            Inactive
          </span>
          <div style={{ fontFamily: 'Google Sans', fontSize: '24px', fontWeight: 700, color: 'var(--db-text-3)', marginTop: 4 }}>
            {inactiveCount}
          </div>
        </div>
      </div>

      {/* Toolbar: Search + Location pills + Grid/List View switcher */}
      <div className="db-toolbar" style={{ marginBottom: 24 }}>
        <div className="db-toolbar-row">
          <div className="db-search-box">
            <Search size={15} className="db-search-icon" />
            <input
              id="tables-search-input"
              type="search"
              placeholder="Search table # or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search tables"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* View Mode Toggle Buttons */}
            <div style={{ display: 'flex', border: '1px solid var(--db-border)' }}>
              <button
                type="button"
                className={`db-btn-icon-only${viewMode === 'grid' ? ' active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View (3 Columns)"
                aria-label="Grid view"
                style={{
                  background: viewMode === 'grid' ? '#141414' : '#ffffff',
                  color: viewMode === 'grid' ? '#ffffff' : 'var(--db-text)',
                  border: 'none',
                }}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                className={`db-btn-icon-only${viewMode === 'list' ? ' active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
                aria-label="List view"
                style={{
                  background: viewMode === 'list' ? '#141414' : '#ffffff',
                  color: viewMode === 'list' ? '#ffffff' : 'var(--db-text)',
                  border: 'none',
                }}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Location Filter Pills */}
        <div className="db-pill-tabs" role="tablist">
          {locations.map((loc) => {
            const isActive = selectedLocation === loc;
            return (
              <button
                key={loc}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`db-pill-tab${isActive ? ' active' : ''}`}
                onClick={() => setSelectedLocation(loc)}
              >
                {loc === 'All' ? 'All Sections' : loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid View Mode (Default: 3 Columns) */}
      {viewMode === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}
        >
          {filteredTables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteTable}
              onToggleOccupancy={handleToggleOccupancy}
            />
          ))}
        </div>
      ) : (
        /* List View Mode */
        <div className="db-table-card">
          <table className="db-data-table">
            <thead>
              <tr>
                <th>Table #</th>
                <th>Capacity</th>
                <th>Section</th>
                <th>Status</th>
                <th>Current Order</th>
                <th>Duration</th>
                <th style={{ textAlign: 'right', paddingRight: 20 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTables.map((table) => {
                const isOccupied = table.status === 'Occupied';
                const isInactive = table.status === 'Inactive' || table.activeStatus === 'Inactive';
                const statusDotColor = isInactive ? '#8a8a8a' : isOccupied ? 'var(--db-red)' : 'var(--db-green)';

                return (
                  <tr key={table.id}>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--db-text)' }}>
                        {table.number}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        {table.capacity} seats
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12.5px', color: 'var(--db-text-2)' }}>
                        {table.location || '—'}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '11.5px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color: statusDotColor,
                        }}
                      >
                        <span
                          style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: statusDotColor }}
                        />
                        {table.status}
                      </span>
                    </td>
                    <td>
                      {table.currentOrder ? (
                        <Link
                          href={`/dashboard/orders/${table.currentOrder.orderId}`}
                          style={{
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--db-accent)',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          #{table.currentOrder.orderId} (₹{table.currentOrder.total})
                        </Link>
                      ) : (
                        <span style={{ color: 'var(--db-text-3)', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--db-text-3)' }}>
                        {table.currentOrder ? table.currentOrder.elapsed : '—'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        <button
                          type="button"
                          className="db-btn db-btn-outline db-btn-sm"
                          onClick={() => handleToggleOccupancy(table.id)}
                          style={{ fontSize: '11px', height: 28 }}
                        >
                          {isOccupied ? 'Free Up' : 'Occupy'}
                        </button>
                        <button
                          type="button"
                          className="db-btn-icon-only"
                          title="Edit"
                          onClick={() => handleOpenEdit(table)}
                          style={{ width: 28, height: 28 }}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          type="button"
                          className="db-btn-icon-only db-btn-icon-danger"
                          title="Delete"
                          onClick={() => handleDeleteTable(table.id)}
                          style={{ width: 28, height: 28 }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddEditTableModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        table={modalState.table}
        onSave={handleSaveTable}
        onDelete={handleDeleteTable}
      />
    </main>
  );
}
