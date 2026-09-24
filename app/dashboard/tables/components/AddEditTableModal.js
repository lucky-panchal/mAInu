'use client';

import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

export default function AddEditTableModal({ isOpen, onClose, table, onSave, onDelete }) {
  const isEditing = Boolean(table && table.id);

  const [formData, setFormData] = useState({
    number: '',
    capacity: '4',
    location: '',
    activeStatus: 'Active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (table && table.id) {
        setFormData({
          number: table.number || '',
          capacity: table.capacity !== undefined ? String(table.capacity) : '4',
          location: table.location || '',
          activeStatus: table.activeStatus || (table.status === 'Inactive' ? 'Inactive' : 'Active'),
        });
      } else {
        setFormData({
          number: '',
          capacity: '4',
          location: '',
          activeStatus: 'Active',
        });
      }
      setErrors({});
    }
  }, [isOpen, table]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.number.trim()) {
      errs.number = 'Table number/name is required.';
    }

    const cap = parseInt(formData.capacity, 10);
    if (isNaN(cap) || cap < 1 || cap > 20) {
      errs.capacity = 'Capacity must be between 1 and 20 seats.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let formattedNumber = formData.number.trim();
    if (!isNaN(parseInt(formattedNumber, 10)) && !formattedNumber.toLowerCase().startsWith('table')) {
      formattedNumber = `Table ${formattedNumber}`;
    }

    const newStatus = formData.activeStatus === 'Inactive' ? 'Inactive' : (table?.status === 'Occupied' ? 'Occupied' : 'Available');

    onSave({
      id: table?.id,
      number: formattedNumber,
      capacity: parseInt(formData.capacity, 10),
      location: formData.location.trim(),
      activeStatus: formData.activeStatus,
      status: newStatus,
    });
  };

  return (
    <div className="db-modal-backdrop" onClick={onClose}>
      <div
        className="db-modal-card"
        style={{ maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="table-modal-title"
      >
        <div className="db-modal-header">
          <h2 id="table-modal-title">{isEditing ? `Edit ${table.number}` : 'Add New Table'}</h2>
          <button className="db-btn-icon-only" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <form id="table-form" onSubmit={handleSubmit} className="db-modal-body">
          {/* Table Number */}
          <div className="db-form-group">
            <label className="db-form-label" htmlFor="input-table-number">
              <span>Table Identifier <span className="required">*</span></span>
            </label>
            <input
              id="input-table-number"
              type="text"
              className="db-form-input"
              placeholder="e.g. Table 16 or 16"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            />
            {errors.number && (
              <span style={{ color: 'var(--db-red)', fontSize: '11.5px', marginTop: 2 }}>
                {errors.number}
              </span>
            )}
          </div>

          {/* Capacity */}
          <div className="db-form-group">
            <label className="db-form-label" htmlFor="input-table-capacity">
              <span>Seating Capacity (1-20) <span className="required">*</span></span>
            </label>
            <input
              id="input-table-capacity"
              type="number"
              min="1"
              max="20"
              className="db-form-input"
              placeholder="4"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
            {errors.capacity && (
              <span style={{ color: 'var(--db-red)', fontSize: '11.5px', marginTop: 2 }}>
                {errors.capacity}
              </span>
            )}
          </div>

          {/* Location / Section */}
          <div className="db-form-group">
            <label className="db-form-label" htmlFor="input-table-location">
              <span>Section / Location (Optional)</span>
            </label>
            <input
              id="input-table-location"
              type="text"
              className="db-form-input"
              placeholder="e.g. Near Window, Patio, Main Hall, Rooftop"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Status Radio Buttons */}
          <div className="db-form-group">
            <label className="db-form-label">Operating Status</label>
            <div style={{ display: 'flex', gap: '24px', marginTop: 6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="table-active-status"
                  value="Active"
                  checked={formData.activeStatus === 'Active'}
                  onChange={(e) => setFormData({ ...formData, activeStatus: e.target.value })}
                />
                <span>Active (In service)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="table-active-status"
                  value="Inactive"
                  checked={formData.activeStatus === 'Inactive'}
                  onChange={(e) => setFormData({ ...formData, activeStatus: e.target.value })}
                />
                <span>Inactive (Temporarily blocked)</span>
              </label>
            </div>
          </div>
        </form>

        <div className="db-modal-footer">
          <div>
            {isEditing && (
              <button
                type="button"
                className="db-btn db-btn-danger db-btn-sm"
                onClick={() => onDelete(table.id)}
              >
                <Trash2 size={13} />
                Delete
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="db-btn db-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" form="table-form" className="db-btn db-btn-primary">
              {isEditing ? 'Save Changes' : 'Create Table'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
