'use client';

import { useState, useMemo, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search, Bell, ShoppingBag, Plus, Minus, X, Check,
  Clock, Sparkles, AlertCircle, ChevronRight, ArrowLeft,
  UtensilsCrossed, PhoneCall, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { menuItems as initialItems, menuCategories } from '../../dashboard/data/menuData';
import styles from './menu.module.css';

// Indian FSSAI dietary indicator component
function DietaryBadge({ type }) {
  const isVeg = type === 'veg' || type === 'Vegetarian';
  return (
    <span
      className={isVeg ? styles.badgeVeg : styles.badgeNonVeg}
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      <span className={isVeg ? styles.dotVeg : styles.dotNonVeg} />
    </span>
  );
}

export default function DinerMenuPage({ params }) {
  // Unwrap params using React.use for Next.js 15+ compatibility
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || 'spice-route';
  const searchParams = useSearchParams();
  const tableParam = searchParams.get('table') || 'Table 04';

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeItemModal, setActiveItemModal] = useState(null);
  const [modalPortion, setModalPortion] = useState('full');
  const [modalSpice, setModalSpice] = useState('Medium Desi');
  const [modalNote, setModalNote] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [waiterToast, setWaiterToast] = useState(null);

  const restaurantName = slug === 'spice-route' ? 'The Spice Route' : slug.replace('-', ' ').toUpperCase();

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      if (item.status === 'Hidden') return false;

      // Category
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false;
      }

      // Dietary
      const isItemVeg = item.dietary?.includes('Vegetarian');
      if (dietaryFilter === 'veg' && !isItemVeg) return false;
      if (dietaryFilter === 'non-veg' && isItemVeg) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = (item.description || '').toLowerCase().includes(q);
        const matchIng = (item.ingredients || []).some((ing) => ing.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchIng) return false;
      }

      return true;
    });
  }, [activeCategory, dietaryFilter, searchQuery]);

  // Cart operations
  const addToCart = (item, portion = 'full', spice = 'Medium Desi', note = '') => {
    const key = `${item.id}-${portion}-${spice}-${note}`;
    const price = portion === 'half' ? Math.round(item.price * 0.65) : item.price;

    setCart((prev) => {
      const existing = prev[key];
      if (existing) {
        return {
          ...prev,
          [key]: { ...existing, qty: existing.qty + 1 },
        };
      }
      return {
        ...prev,
        [key]: {
          key,
          item,
          qty: 1,
          price,
          portion,
          spice,
          note,
        },
      };
    });
  };

  const updateCartQty = (key, delta) => {
    setCart((prev) => {
      const existing = prev[key];
      if (!existing) return prev;
      const newQty = existing.qty + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return {
        ...prev,
        [key]: { ...existing, qty: newQty },
      };
    });
  };

  const totalCartItems = Object.values(cart).reduce((sum, i) => sum + i.qty, 0);
  const subtotal = Object.values(cart).reduce((sum, i) => sum + i.price * i.qty, 0);
  const cgst = Math.round(subtotal * 0.025);
  const sgst = Math.round(subtotal * 0.025);
  const grandTotal = subtotal + cgst + sgst;

  const handleOpenCustomize = (item) => {
    setActiveItemModal(item);
    setModalPortion('full');
    setModalSpice('Medium Desi');
    setModalNote('');
  };

  const handleConfirmCustomize = () => {
    if (activeItemModal) {
      addToCart(activeItemModal, modalPortion, modalSpice, modalNote);
      setActiveItemModal(null);
    }
  };

  const handleSendOrder = () => {
    if (totalCartItems === 0) return;
    const newOrder = {
      orderId: `KOT-${Math.floor(1000 + Math.random() * 9000)}`,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      items: Object.values(cart),
      subtotal,
      cgst,
      sgst,
      grandTotal,
      table: tableParam,
    };
    setOrderPlaced(newOrder);
    setCart({});
    setIsCartOpen(false);
  };

  const handleCallWaiter = () => {
    setWaiterToast(`Service team notified for ${tableParam}. Steward arriving shortly.`);
    setTimeout(() => setWaiterToast(null), 4000);
  };

  return (
    <div className={styles.dinerShell}>
      {/* Toast alert */}
      {waiterToast && (
        <div className={styles.waiterToast}>
          <PhoneCall size={16} />
          <span>{waiterToast}</span>
        </div>
      )}

      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <div className={styles.brandRow}>
              <span className={styles.brandLogo}>m</span>
              <h1 className={styles.restaurantTitle}>{restaurantName}</h1>
            </div>
            <p className={styles.locationSubtitle}>100ft Road, Indiranagar • Dine-In Live</p>
          </div>

          <div className={styles.tablePill}>
            <span className={styles.tableDot} />
            <span>{tableParam}</span>
          </div>
        </div>

        {/* Action bar: Call steward + Search */}
        <div className={styles.searchBarRow}>
          <div className={styles.searchInputWrap}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search dishes, ingredients (e.g. Biryani, Paneer)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            className={styles.callWaiterBtn}
            onClick={handleCallWaiter}
            title="Call steward to table"
          >
            <Bell size={14} />
            <span>Call Steward</span>
          </button>
        </div>

        {/* Dietary toggle chips */}
        <div className={styles.dietaryFilters}>
          <button
            type="button"
            className={`${styles.filterChip} ${dietaryFilter === 'all' ? styles.filterChipActive : ''}`}
            onClick={() => setDietaryFilter('all')}
          >
            All Items
          </button>
          <button
            type="button"
            className={`${styles.filterChip} ${dietaryFilter === 'veg' ? styles.filterChipActive : ''}`}
            onClick={() => setDietaryFilter('veg')}
          >
            <span className={styles.inlineVegDot} />
            Pure Veg
          </button>
          <button
            type="button"
            className={`${styles.filterChip} ${dietaryFilter === 'non-veg' ? styles.filterChipActive : ''}`}
            onClick={() => setDietaryFilter('non-veg')}
          >
            <span className={styles.inlineNonVegDot} />
            Non-Veg
          </button>
        </div>

        {/* Category Horizontal Scroll */}
        <nav className={styles.categoryNav}>
          <button
            type="button"
            className={`${styles.catNavBtn} ${activeCategory === 'All' ? styles.catNavActive : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            All Dishes
          </button>
          {menuCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${styles.catNavBtn} ${activeCategory === cat ? styles.catNavActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Active Order Tracker if order was placed */}
        {orderPlaced && (
          <div className={styles.activeOrderCard}>
            <div className={styles.orderCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={18} color="#276749" />
                <span className={styles.orderKdsNum}>{orderPlaced.orderId} SENT TO KITCHEN</span>
              </div>
              <span className={styles.orderTime}>{orderPlaced.time}</span>
            </div>

            <p className={styles.orderStatusNotice}>
              Your steward &amp; kitchen team have received this ticket for <strong>{orderPlaced.table}</strong>.
              Estimated prep time is 12–15 mins.
            </p>

            <div className={styles.orderItemsSummary}>
              {orderPlaced.items.map((it, idx) => (
                <div key={idx} className={styles.orderSummaryRow}>
                  <span>{it.qty}× {it.item.name} ({it.portion})</span>
                  <span style={{ fontFamily: 'monospace' }}>₹{it.price * it.qty}</span>
                </div>
              ))}
              <div className={styles.orderSummaryTotal}>
                <span>Bill Total (incl. GST)</span>
                <span>₹{orderPlaced.grandTotal}</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.addMoreBtn}
              onClick={() => setOrderPlaced(null)}
            >
              + Order More Dishes
            </button>
          </div>
        )}

        {/* Menu Items Count & Section Label */}
        <div className={styles.sectionHeaderRow}>
          <span className={styles.sectionTitle}>
            {activeCategory === 'All' ? 'Full Menu' : activeCategory} ({filteredItems.length})
          </span>
          <span className={styles.fssaiLabel}>
            <ShieldCheck size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            FSSAI Reg: 11224333000841
          </span>
        </div>

        {/* Menu Items Grid */}
        <div className={styles.menuGrid}>
          {filteredItems.map((item) => {
            const isVeg = item.dietary?.includes('Vegetarian');
            return (
              <div key={item.id} className={styles.dishCard}>
                <div className={styles.dishCardBody}>
                  <div className={styles.dishHeader}>
                    <DietaryBadge type={isVeg ? 'veg' : 'non-veg'} />
                    <h3 className={styles.dishTitle}>{item.name}</h3>
                  </div>

                  <div className={styles.dishPriceRow}>
                    <span className={styles.dishPrice}>₹{item.price}</span>
                    {item.dietary?.includes('Spicy') && (
                      <span className={styles.spicyBadge}>🌶️ Chef Spiced</span>
                    )}
                  </div>

                  <p className={styles.dishDesc}>{item.description}</p>

                  {item.allergens && item.allergens.length > 0 && (
                    <div className={styles.allergenRow}>
                      Contains: {item.allergens.join(', ')}
                    </div>
                  )}
                </div>

                <div className={styles.dishActionArea}>
                  <button
                    type="button"
                    className={styles.customizeBtn}
                    onClick={() => handleOpenCustomize(item)}
                  >
                    Customise
                  </button>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => addToCart(item)}
                  >
                    Add +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className={styles.emptyState}>
            <UtensilsCrossed size={36} color="#8a8a8a" />
            <p>No dishes found matching your current filter.</p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setDietaryFilter('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Item Customization Modal */}
      {activeItemModal && (
        <div className={styles.modalBackdrop} onClick={() => setActiveItemModal(null)}>
          <div className={styles.customModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.customModalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DietaryBadge
                  type={activeItemModal.dietary?.includes('Vegetarian') ? 'veg' : 'non-veg'}
                />
                <h3 className={styles.customModalTitle}>{activeItemModal.name}</h3>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setActiveItemModal(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.customModalBody}>
              {/* Portion selector */}
              <div className={styles.optionSection}>
                <span className={styles.optionTitle}>Select Portion Size</span>
                <div className={styles.portionOptions}>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="portion"
                      checked={modalPortion === 'full'}
                      onChange={() => setModalPortion('full')}
                    />
                    <span>Full Portion</span>
                    <span className={styles.radioPrice}>₹{activeItemModal.price}</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="portion"
                      checked={modalPortion === 'half'}
                      onChange={() => setModalPortion('half')}
                    />
                    <span>Half Portion</span>
                    <span className={styles.radioPrice}>
                      ₹{Math.round(activeItemModal.price * 0.65)}
                    </span>
                  </label>
                </div>
              </div>

              {/* Spice Level */}
              <div className={styles.optionSection}>
                <span className={styles.optionTitle}>Spice Level</span>
                <div className={styles.spiceButtons}>
                  {['Mild', 'Medium Desi', 'Extra Spicy'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      className={`${styles.spiceBtn} ${modalSpice === lvl ? styles.spiceBtnActive : ''}`}
                      onClick={() => setModalSpice(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kitchen Instructions */}
              <div className={styles.optionSection}>
                <span className={styles.optionTitle}>Cooking Instructions (Optional)</span>
                <input
                  type="text"
                  className={styles.noteInput}
                  placeholder="e.g. Jain / Less oil / Extra lime"
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  maxLength={80}
                />
              </div>
            </div>

            <div className={styles.customModalFooter}>
              <div className={styles.modalTotalCol}>
                <span className={styles.modalTotalLabel}>Item Total</span>
                <span className={styles.modalTotalVal}>
                  ₹{modalPortion === 'half' ? Math.round(activeItemModal.price * 0.65) : activeItemModal.price}
                </span>
              </div>
              <button
                type="button"
                className={styles.confirmAddBtn}
                onClick={handleConfirmCustomize}
              >
                Add Item To Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Order Bar */}
      {totalCartItems > 0 && !isCartOpen && (
        <div className={styles.floatingOrderBar}>
          <div>
            <div className={styles.floatingItemsCount}>
              {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'} in order
            </div>
            <div className={styles.floatingSubtotal}>₹{subtotal} (excl. GST)</div>
          </div>

          <button
            type="button"
            className={styles.viewCartBtn}
            onClick={() => setIsCartOpen(true)}
          >
            <span>Review Order &amp; KOT</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Cart & Bill Review Drawer */}
      {isCartOpen && (
        <div className={styles.cartOverlay} onClick={() => setIsCartOpen(false)}>
          <div className={styles.cartDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cartHeader}>
              <div>
                <h2 className={styles.cartTitle}>Your Dine-In Order</h2>
                <span className={styles.cartSubtitle}>Assigned to {tableParam}</span>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsCartOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.cartBody}>
              {Object.values(cart).map((item) => (
                <div key={item.key} className={styles.cartItemRow}>
                  <div className={styles.cartItemInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <DietaryBadge
                        type={item.item.dietary?.includes('Vegetarian') ? 'veg' : 'non-veg'}
                      />
                      <span className={styles.cartItemName}>{item.item.name}</span>
                    </div>
                    <div className={styles.cartItemMeta}>
                      {item.portion} &bull; {item.spice}
                      {item.note && ` &bull; Note: ${item.note}`}
                    </div>
                    <span className={styles.cartItemPrice}>₹{item.price * item.qty}</span>
                  </div>

                  <div className={styles.qtyControl}>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => updateCartQty(item.key, -1)}
                    >
                      <Minus size={12} />
                    </button>
                    <span className={styles.qtyValue}>{item.qty}</span>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => updateCartQty(item.key, 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Bill Breakdown */}
              <div className={styles.billCard}>
                <div className={styles.billRow}>
                  <span>Items Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className={styles.billRow}>
                  <span>CGST (2.5%)</span>
                  <span>₹{cgst}</span>
                </div>
                <div className={styles.billRow}>
                  <span>SGST (2.5%)</span>
                  <span>₹{sgst}</span>
                </div>
                <div className={styles.billRow}>
                  <span>Service Charge</span>
                  <span>₹0 (Waived)</span>
                </div>
                <div className={styles.billTotalRow}>
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <div className={styles.kotNotice}>
                <Clock size={14} color="var(--color-terracotta)" />
                <span>
                  Tapping below will dispatch an official KOT directly to the kitchen display screen.
                </span>
              </div>
            </div>

            <div className={styles.cartFooter}>
              <button
                type="button"
                className={styles.sendKotBtn}
                onClick={handleSendOrder}
              >
                Send KOT to Kitchen • ₹{grandTotal}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
