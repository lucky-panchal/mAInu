'use client';

import { Search } from 'lucide-react';
import { menuCategories } from '../../data/menuData';

const STATUS_OPTIONS = ['All', 'Available', 'Unavailable', 'Hidden'];
const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A to Z)' },
  { value: 'name-desc', label: 'Name (Z to A)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'recent', label: 'Recently Added' },
];

export default function MenuFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
}) {
  const allCategories = ['All', ...menuCategories];

  return (
    <div className="db-toolbar" id="menu-filters-toolbar">
      {/* Top row: Search input + Status Filter + Sort dropdown */}
      <div className="db-toolbar-row">
        {/* Search */}
        <div className="db-search-box">
          <Search size={15} className="db-search-icon" />
          <input
            id="menu-search-input"
            type="search"
            placeholder="Search by item name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search menu items"
          />
        </div>

        {/* Filters and sorting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Status filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)', textTransform: 'uppercase' }}>
              Status:
            </span>
            <select
              id="menu-status-filter"
              className="db-filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by item status"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All Statuses' : st}
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)', textTransform: 'uppercase' }}>
              Sort:
            </span>
            <select
              id="menu-sort-filter"
              className="db-filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort menu items"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Tab Row */}
      <div className="db-pill-tabs" role="tablist" aria-label="Menu categories">
        {allCategories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              id={`tab-cat-${cat.toLowerCase()}`}
              className={`db-pill-tab${isActive ? ' active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
