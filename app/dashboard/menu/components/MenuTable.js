'use client';

import { Edit2, Trash2, Power, Eye, EyeOff } from 'lucide-react';
import { categoryColors } from '../../data/menuData';

export default function MenuTable({ items, onEdit, onDelete, onToggleAvailability }) {
  if (!items || items.length === 0) {
    return (
      <div className="db-table-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--db-text-3)', fontSize: '14px', marginBottom: '8px' }}>
          No menu items found matching your filters.
        </p>
        <span style={{ fontSize: '12px', color: 'var(--db-text-3)' }}>
          Try clearing your search query or selecting &quot;All&quot; categories.
        </span>
      </div>
    );
  }

  return (
    <div className="db-table-card">
      <div className="db-table-container">
        <table className="db-data-table" id="menu-items-table">
          <thead>
            <tr>
              <th style={{ width: '64px' }}>Item</th>
              <th>Name &amp; Details</th>
              <th>Category</th>
              <th>Price</th>
              <th>Cost &amp; Margin</th>
              <th>Status</th>
              <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const catColor = categoryColors[item.category] || { bg: '#f4f2ee', text: '#333' };
              const margin = item.cost > 0
                ? Math.round(((item.price - item.cost) / item.price) * 100)
                : null;

              const statusClass =
                item.status === 'Available'
                  ? 'db-status-available'
                  : item.status === 'Hidden'
                  ? 'db-status-hidden'
                  : 'db-status-unavailable';

              return (
                <tr key={item.id} id={`menu-row-${item.id}`}>
                  {/* Thumbnail */}
                  <td>
                    <div
                      className="db-thumb-box"
                      style={{
                        backgroundColor: catColor.bg,
                        color: catColor.text,
                        backgroundImage: item.image ? `url(${item.image})` : 'none',
                      }}
                      title={item.name}
                    >
                      {!item.image && item.name.slice(0, 1).toUpperCase()}
                    </div>
                  </td>

                  {/* Name & Dietary */}
                  <td>
                    <div className="db-item-info">
                      <span
                        className="db-item-name"
                        onClick={() => onEdit(item)}
                        role="button"
                        tabIndex={0}
                        title="Click to edit item"
                        id={`item-edit-trigger-${item.id}`}
                      >
                        {item.name}
                      </span>
                      {item.dietary && item.dietary.length > 0 && (
                        <div className="db-item-dietary-row">
                          {item.dietary.map((d) => (
                            <span key={d} className="db-tag-dietary">
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        backgroundColor: catColor.bg,
                        color: catColor.text,
                        fontWeight: 600,
                      }}
                    >
                      {item.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '14px' }}>
                      ₹{item.price}
                    </span>
                  </td>

                  {/* Cost & Margin */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--db-text-2)' }}>
                        {item.cost ? `₹${item.cost}` : '—'}
                      </span>
                      {margin !== null && (
                        <span
                          className={`db-margin-pill ${
                            margin >= 50
                              ? 'db-margin-high'
                              : margin >= 30
                              ? 'db-margin-mid'
                              : 'db-margin-low'
                          }`}
                        >
                          {margin}% margin
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span className={`db-status-badge ${statusClass}`}>
                      <span className="db-status-dot" />
                      {item.status}
                    </span>
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
                      {/* Toggle Availability */}
                      <button
                        className="db-btn-icon-only"
                        title={item.status === 'Available' ? 'Make Unavailable' : 'Make Available'}
                        onClick={() => onToggleAvailability(item.id)}
                        aria-label={`Toggle availability for ${item.name}`}
                      >
                        <Power
                          size={14}
                          color={item.status === 'Available' ? 'var(--db-green)' : 'var(--db-text-3)'}
                        />
                      </button>

                      {/* Edit */}
                      <button
                        className="db-btn-icon-only"
                        title="Edit Item"
                        onClick={() => onEdit(item)}
                        aria-label={`Edit ${item.name}`}
                      >
                        <Edit2 size={13} />
                      </button>

                      {/* Delete */}
                      <button
                        className="db-btn-icon-only db-btn-icon-danger"
                        title="Delete Item"
                        onClick={() => onDelete(item.id)}
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
