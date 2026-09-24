'use client';

import { useState, useMemo } from 'react';
import { Plus, Camera, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { menuItems as initialMenuItems } from '../data/menuData';
import MenuFilters from './components/MenuFilters';
import MenuTable from './components/MenuTable';
import AddEditModal from './components/AddEditModal';
import UploadPhotoModal from './components/UploadPhotoModal';

export default function MenuManagementPage() {
  const [items, setItems] = useState(initialMenuItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

  // Modals
  const [editModal, setEditModal] = useState({ isOpen: false, item: null });
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter & Sort
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          if (!matchName && !matchCat) return false;
        }
        // Category
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }
        // Status
        if (selectedStatus !== 'All' && item.status !== selectedStatus) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'recent') {
          return (b.addedAt || '').localeCompare(a.addedAt || '');
        }
        return 0;
      });
  }, [items, searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Handlers
  const handleOpenAdd = () => {
    setEditModal({ isOpen: true, item: null });
  };

  const handleOpenEdit = (item) => {
    setEditModal({ isOpen: true, item });
  };

  const handleCloseModal = () => {
    setEditModal({ isOpen: false, item: null });
  };

  const handleSaveItem = (itemData) => {
    if (itemData.id) {
      // Edit
      setItems((prev) => prev.map((it) => (it.id === itemData.id ? { ...it, ...itemData } : it)));
      showToast(`Updated “${itemData.name}”`);
    } else {
      // Add
      const newItem = {
        ...itemData,
        id: `item-${Date.now().toString().slice(-4)}`,
        addedAt: new Date().toISOString().split('T')[0],
      };
      setItems((prev) => [newItem, ...prev]);
      showToast(`Added “${newItem.name}” to menu`);
    }
    handleCloseModal();
  };

  const handleDeleteItem = (id) => {
    const target = items.find((i) => i.id === id);
    if (window.confirm(`Are you sure you want to delete "${target?.name}"?`)) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      handleCloseModal();
      showToast(`Deleted “${target?.name}”`);
    }
  };

  const handleToggleAvailability = (id) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const nextStatus = it.status === 'Available' ? 'Unavailable' : 'Available';
          showToast(`“${it.name}” marked as ${nextStatus}`);
          return { ...it, status: nextStatus };
        }
        return it;
      })
    );
  };

  const handleImportPhotoItems = (extractedItems) => {
    const formatted = extractedItems.map((ext, idx) => ({
      id: `item-ai-${Date.now()}-${idx}`,
      name: ext.name,
      category: ext.category,
      price: ext.price,
      cost: ext.cost || Math.round(ext.price * 0.35),
      status: 'Available',
      image: null,
      description: `Chef special ${ext.name}`,
      dietary: [],
      allergens: [],
      addedAt: new Date().toISOString().split('T')[0],
    }));

    setItems((prev) => [...formatted, ...prev]);
    showToast(`Successfully imported ${formatted.length} items from photo`);
  };

  const handleBulkCsv = () => {
    const csvRows = [
      'id,name,category,price,cost,status',
      ...items.map((i) => `${i.id},"${i.name}",${i.category},${i.price},${i.cost || 0},${i.status}`),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mainu-menu-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Exported menu to CSV');
  };

  return (
    <main className="db-content" id="db-menu-page">
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
          <h1 className="db-page-title">Menu Management</h1>
          <p className="db-page-subtitle">
            {items.length} total dishes &bull; {items.filter((i) => i.status === 'Available').length} active on live QR
          </p>
        </div>

        {/* Action Buttons Top Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="db-btn db-btn-outline"
            onClick={handleBulkCsv}
            id="btn-bulk-import"
            title="Download menu data as CSV"
          >
            <FileSpreadsheet size={15} />
            Export CSV
          </button>

          <button
            type="button"
            className="db-btn db-btn-secondary"
            onClick={() => setIsUploadOpen(true)}
            id="btn-upload-photo"
          >
            <Camera size={15} />
            Upload Menu Photo
          </button>

          <button
            type="button"
            className="db-btn db-btn-primary"
            onClick={handleOpenAdd}
            id="btn-add-item"
          >
            <Plus size={16} />
            Add New Item
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <MenuFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Menu Table */}
      <MenuTable
        items={filteredItems}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteItem}
        onToggleAvailability={handleToggleAvailability}
      />

      {/* Add / Edit Drawer */}
      <AddEditModal
        isOpen={editModal.isOpen}
        onClose={handleCloseModal}
        item={editModal.item}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
      />

      {/* Upload Photo Modal */}
      <UploadPhotoModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onImport={handleImportPhotoItems}
      />
    </main>
  );
}
