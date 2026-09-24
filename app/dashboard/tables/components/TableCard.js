'use client';

import Link from 'next/link';
import { Users, Clock, Edit2, Trash2, CheckCircle2, UserCheck, Utensils } from 'lucide-react';

export default function TableCard({ table, onEdit, onDelete, onToggleOccupancy }) {
  const isOccupied = table.status === 'Occupied';
  const isInactive = table.status === 'Inactive' || table.activeStatus === 'Inactive';
  const isAvailable = table.status === 'Available' && !isInactive;

  const statusDotColor = isInactive ? '#8a8a8a' : isOccupied ? 'var(--db-red)' : 'var(--db-green)';
  const statusLabel = isInactive ? 'Inactive' : isOccupied ? 'Occupied' : 'Available';

  return (
    <div
      className="db-table-grid-card"
      style={{
        background: '#ffffff',
        border: '1px solid var(--db-border)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'border-color 140ms ease, box-shadow 140ms ease',
        borderTop: `3px solid ${statusDotColor}`,
      }}
      id={`table-card-${table.id}`}
    >
      {/* Top Header: Table Name & Status */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <h3 style={{ fontFamily: 'Google Sans', fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--db-text)' }}>
              {table.number}
            </h3>
            {table.location && (
              <span style={{ fontSize: '11.5px', color: 'var(--db-text-3)', fontFamily: 'var(--font-mono)' }}>
                {table.location}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: statusDotColor,
                display: 'inline-block',
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: statusDotColor,
                textTransform: 'uppercase',
              }}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Capacity Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 8px',
              background: '#f4f2ee',
              fontFamily: 'Manrope',
              fontSize: '12px',
              color: 'var(--db-text-2)',
              fontWeight: 500,
            }}
          >
            <Users size={13} />
            <span>Seats: {table.capacity}</span>
          </div>
        </div>

        {/* Current Order Area */}
        {isOccupied && table.currentOrder ? (
          <div
            style={{
              background: 'rgba(200, 90, 50, 0.05)',
              border: '1px solid rgba(200, 90, 50, 0.15)',
              padding: '12px',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <Link
                href={`/dashboard/orders/${table.currentOrder.orderId}`}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--db-accent)',
                  textDecoration: 'none',
                }}
              >
                #{table.currentOrder.orderId}
              </Link>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700 }}>
                ₹{table.currentOrder.total}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '11.5px', color: 'var(--db-text-3)' }}>
              <Clock size={12} />
              <span>Active for {table.currentOrder.elapsed}</span>
            </div>
          </div>
        ) : isInactive ? (
          <div
            style={{
              background: '#f9f8f6',
              border: '1px dashed var(--db-border)',
              padding: '12px',
              marginBottom: 16,
              fontSize: '12px',
              color: 'var(--db-text-3)',
              textAlign: 'center',
            }}
          >
            Temporarily Inactive
          </div>
        ) : (
          <div
            style={{
              background: 'rgba(39, 103, 73, 0.04)',
              border: '1px dashed rgba(39, 103, 73, 0.2)',
              padding: '12px',
              marginBottom: 16,
              fontSize: '12px',
              color: 'var(--db-green)',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <CheckCircle2 size={13} />
            Ready for guests
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          paddingTop: 12,
          borderTop: '1px solid var(--db-border)',
        }}
      >
        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
          {isOccupied ? (
            <>
              {table.currentOrder && (
                <Link
                  href={`/dashboard/orders/${table.currentOrder.orderId}`}
                  className="db-btn db-btn-outline db-btn-sm"
                  style={{ flex: 1, fontSize: '11.5px' }}
                >
                  <Utensils size={12} />
                  View Order
                </Link>
              )}
              <button
                type="button"
                className="db-btn db-btn-outline db-btn-sm"
                onClick={() => onToggleOccupancy(table.id)}
                title="Mark table as available"
                style={{ flex: 1, fontSize: '11.5px' }}
              >
                Free Up
              </button>
            </>
          ) : !isInactive ? (
            <button
              type="button"
              className="db-btn db-btn-secondary db-btn-sm"
              onClick={() => onToggleOccupancy(table.id)}
              style={{ flex: 1, fontSize: '11.5px' }}
            >
              <UserCheck size={13} />
              Occupy
            </button>
          ) : (
            <button
              type="button"
              className="db-btn db-btn-outline db-btn-sm"
              onClick={() => onEdit(table)}
              style={{ flex: 1, fontSize: '11.5px' }}
            >
              Activate
            </button>
          )}
        </div>

        {/* Edit & Delete Buttons */}
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            className="db-btn-icon-only"
            title="Edit Table"
            onClick={() => onEdit(table)}
            style={{ width: 30, height: 30 }}
          >
            <Edit2 size={12} />
          </button>
          <button
            type="button"
            className="db-btn-icon-only db-btn-icon-danger"
            title="Delete Table"
            onClick={() => onDelete(table.id)}
            style={{ width: 30, height: 30 }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
