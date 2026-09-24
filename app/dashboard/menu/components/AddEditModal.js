'use client';

import { useState, useEffect } from 'react';
import { X, Upload, AlertCircle, Trash2 } from 'lucide-react';
import { menuCategories, dietaryOptions, allergenOptions } from '../../data/menuData';

export default function AddEditModal({ isOpen, onClose, item, onSave, onDelete }) {
  const isEditing = Boolean(item && item.id);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Mains',
    newCategory: '',
    price: '',
    cost: '',
    description: '',
    dietary: [],
    allergens: [],
    ingredients: '',
    status: 'Available',
    image: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (item && item.id) {
        setFormData({
          name: item.name || '',
          category: item.category || 'Mains',
          newCategory: '',
          price: item.price !== undefined ? String(item.price) : '',
          cost: item.cost !== undefined ? String(item.cost) : '',
          description: item.description || '',
          dietary: item.dietary || [],
          allergens: item.allergens || [],
          ingredients: Array.isArray(item.ingredients) ? item.ingredients.join(', ') : item.ingredients || '',
          status: item.status || 'Available',
          image: item.image || null,
        });
      } else {
        setFormData({
          name: '',
          category: 'Mains',
          newCategory: '',
          price: '',
          cost: '',
          description: '',
          dietary: [],
          allergens: [],
          ingredients: '',
          status: 'Available',
          image: null,
        });
      }
      setErrors({});
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleDietaryToggle = (opt) => {
    setFormData((prev) => {
      const exists = prev.dietary.includes(opt);
      return {
        ...prev,
        dietary: exists ? prev.dietary.filter((d) => d !== opt) : [...prev.dietary, opt],
      };
    });
  };

  const handleAllergenToggle = (alg) => {
    setFormData((prev) => {
      const exists = prev.allergens.includes(alg);
      return {
        ...prev,
        allergens: exists ? prev.allergens.filter((a) => a !== alg) : [...prev.allergens, alg],
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name || formData.name.trim().length < 3) {
      errs.name = 'Item name must be at least 3 characters.';
    } else if (formData.name.trim().length > 100) {
      errs.name = 'Item name cannot exceed 100 characters.';
    }

    const numericPrice = parseFloat(formData.price);
    if (!formData.price || isNaN(numericPrice) || numericPrice <= 0) {
      errs.price = 'Please enter a valid price greater than 0.';
    }

    const numericCost = parseFloat(formData.cost);
    if (formData.cost && !isNaN(numericCost) && !isNaN(numericPrice) && numericCost > numericPrice) {
      errs.costWarning = 'Warning: Cost is higher than selling price (negative profit margin).';
    }

    if (formData.category === '__custom' && !formData.newCategory.trim()) {
      errs.category = 'Please enter a custom category name.';
    }

    setErrors(errs);
    return Object.keys(errs).filter((k) => k !== 'costWarning').length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalCategory = formData.category === '__custom' ? formData.newCategory.trim() : formData.category;
    const ingredientsArr = formData.ingredients
      ? formData.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    onSave({
      id: item?.id,
      name: formData.name.trim(),
      category: finalCategory,
      price: parseFloat(formData.price),
      cost: formData.cost ? parseFloat(formData.cost) : 0,
      description: formData.description.trim(),
      dietary: formData.dietary,
      allergens: formData.allergens,
      ingredients: ingredientsArr,
      status: formData.status,
      image: formData.image,
    });
  };

  const numericPrice = parseFloat(formData.price) || 0;
  const numericCost = parseFloat(formData.cost) || 0;
  const calculatedMargin = numericPrice > 0 && numericCost > 0
    ? Math.round(((numericPrice - numericCost) / numericPrice) * 100)
    : null;

  return (
    <div className="db-drawer-backdrop" onClick={onClose}>
      <div
        className="db-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="db-modal-header">
          <h2 id="drawer-title">{isEditing ? `Edit “${item.name}”` : 'Add New Menu Item'}</h2>
          <button
            className="db-btn-icon-only"
            onClick={onClose}
            aria-label="Close panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form id="menu-item-form" onSubmit={handleSubmit} className="db-modal-body">
          {/* Name */}
          <div className="db-form-group">
            <label className="db-form-label" htmlFor="item-name">
              <span>Item Name <span className="required">*</span></span>
              <span className="db-char-counter">{formData.name.length}/100</span>
            </label>
            <input
              id="item-name"
              className="db-form-input"
              type="text"
              placeholder="e.g. Paneer Butter Masala"
              maxLength={100}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && (
              <span style={{ color: 'var(--db-red)', fontSize: '11.5px', marginTop: 2 }}>
                {errors.name}
              </span>
            )}
          </div>

          {/* Category */}
          <div className="db-form-group">
            <label className="db-form-label" htmlFor="item-category">
              <span>Category <span className="required">*</span></span>
            </label>
            <select
              id="item-category"
              className="db-filter-select"
              style={{ width: '100%' }}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {menuCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__custom">+ Create New Category...</option>
            </select>
            {formData.category === '__custom' && (
              <input
                id="item-new-category"
                type="text"
                placeholder="Enter new category name..."
                className="db-form-input"
                style={{ marginTop: 8 }}
                value={formData.newCategory}
                onChange={(e) => setFormData({ ...formData, newCategory: e.target.value })}
              />
            )}
            {errors.category && (
              <span style={{ color: 'var(--db-red)', fontSize: '11.5px', marginTop: 2 }}>
                {errors.category}
              </span>
            )}
          </div>

          {/* Price & Cost Row */}
          <div className="db-form-row">
            <div className="db-form-group">
              <label className="db-form-label" htmlFor="item-price">
                <span>Price (₹) <span className="required">*</span></span>
              </label>
              <input
                id="item-price"
                className="db-form-input"
                type="number"
                min="0"
                step="1"
                placeholder="250"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              {errors.price && (
                <span style={{ color: 'var(--db-red)', fontSize: '11.5px', marginTop: 2 }}>
                  {errors.price}
                </span>
              )}
            </div>

            <div className="db-form-group">
              <label className="db-form-label" htmlFor="item-cost">
                <span>Cost to Restaurant (₹)</span>
                {calculatedMargin !== null && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--db-accent)' }}>
                    {calculatedMargin}% margin
                  </span>
                )}
              </label>
              <input
                id="item-cost"
                className="db-form-input"
                type="number"
                min="0"
                step="1"
                placeholder="90"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>
          </div>

          {errors.costWarning && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                background: 'var(--db-yellow-bg)',
                color: 'var(--db-yellow)',
                fontSize: '12px',
              }}
            >
              <AlertCircle size={14} />
              <span>{errors.costWarning}</span>
            </div>
          )}

          {/* Description */}
          <div className="db-form-group">
            <label className="db-form-label" htmlFor="item-description">
              <span>Description</span>
              <span className="db-char-counter">{formData.description.length}/500</span>
            </label>
            <textarea
              id="item-description"
              className="db-form-textarea"
              placeholder="Brief description of the dish, preparation style, and presentation..."
              maxLength={500}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Image Upload */}
          <div className="db-form-group">
            <label className="db-form-label">
              <span>Item Photo</span>
              <span style={{ fontSize: '11px', color: 'var(--db-text-3)' }}>Max 5MB (JPG, PNG, WEBP)</span>
            </label>
            <div
              style={{
                border: '1px dashed var(--db-border-strong)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                background: '#faf8f5',
              }}
            >
              {formData.image ? (
                <div
                  style={{
                    width: 50,
                    height: 50,
                    backgroundImage: `url(${formData.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid var(--db-border)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 50,
                    height: 50,
                    background: '#edeae4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--db-text-3)',
                  }}
                >
                  <Upload size={20} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  id="item-image-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  style={{ fontSize: '12px' }}
                />
              </div>
            </div>
          </div>

          {/* Dietary Tags */}
          <div className="db-form-group">
            <label className="db-form-label">Dietary Tags</label>
            <div className="db-chips-container">
              {dietaryOptions.map((opt) => {
                const selected = formData.dietary.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    className={`db-chip${selected ? ' selected' : ''}`}
                    onClick={() => handleDietaryToggle(opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergens */}
          <div className="db-form-group">
            <label className="db-form-label">Allergens</label>
            <div className="db-chips-container">
              {allergenOptions.map((alg) => {
                const selected = formData.allergens.includes(alg);
                return (
                  <button
                    type="button"
                    key={alg}
                    className={`db-chip${selected ? ' selected' : ''}`}
                    onClick={() => handleAllergenToggle(alg)}
                  >
                    {alg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ingredients */}
          <div className="db-form-group">
            <label className="db-form-label" htmlFor="item-ingredients">
              <span>Ingredients (comma separated)</span>
            </label>
            <input
              id="item-ingredients"
              type="text"
              className="db-form-input"
              placeholder="e.g. Paneer, Cream, Tomato, Cashew, Garam Masala"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
            />
          </div>

          {/* Availability Status */}
          <div className="db-form-group">
            <label className="db-form-label">Availability Status</label>
            <div style={{ display: 'flex', gap: '16px', marginTop: 4 }}>
              {['Available', 'Unavailable', 'Hidden'].map((st) => (
                <label
                  key={st}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="item-status"
                    value={st}
                    checked={formData.status === st}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  />
                  <span>{st}</span>
                </label>
              ))}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="db-modal-footer">
          <div>
            {isEditing && (
              <button
                type="button"
                className="db-btn db-btn-danger db-btn-sm"
                onClick={() => onDelete(item.id)}
                id="btn-delete-item"
              >
                <Trash2 size={13} />
                Delete Item
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="db-btn db-btn-outline"
              onClick={onClose}
              id="btn-cancel-item"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="menu-item-form"
              className="db-btn db-btn-primary"
              id="btn-save-item"
            >
              {isEditing ? 'Update Item' : 'Save Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
