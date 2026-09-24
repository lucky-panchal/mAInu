'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, Bell, HelpCircle, LogOut, ChevronDown, Check,
  Utensils, ShoppingBag, User, AlertCircle, Volume2, VolumeX, X
} from 'lucide-react';
import { restaurantInfo } from '../data/dashboardData';
import { menuItems } from '../data/menuData';
import { ordersData } from '../data/ordersData';
import { customersData } from '../data/customersData';

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const initialNotifications = [
  { id: 1, type: 'order', title: 'New Order #ORD-001245', desc: 'Table 3 &bull; ₹714 (Butter Chicken, Naan)', time: '2m ago', unread: true },
  { id: 2, type: 'alert', title: 'Table 7 Assistance', desc: 'Guest requested water & bill at Table 7', time: '5m ago', unread: true },
  { id: 3, type: 'order', title: 'Order #ORD-001242 Ready', desc: 'Kitchen marked Veg Thali ready for Table 11', time: '9m ago', unread: true },
  { id: 4, type: 'alert', title: 'Payment Received', desc: '₹441 received via UPI from Table 7', time: '14m ago', unread: false },
];

export default function TopNav() {
  const now = useLiveClock();
  const pathname = usePathname() || '/dashboard';
  const router = useRouter();

  // Notifications State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notifFilter, setNotifFilter] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let pageTitle = 'Dashboard';
  if (pathname.startsWith('/dashboard/menu')) pageTitle = 'Menu Management';
  else if (pathname.match(/\/dashboard\/orders\/.+/)) pageTitle = 'Order Details';
  else if (pathname.startsWith('/dashboard/orders')) pageTitle = 'Orders';
  else if (pathname.startsWith('/dashboard/tables')) pageTitle = 'Tables';
  else if (pathname.startsWith('/dashboard/qr-codes')) pageTitle = 'QR Codes';
  else if (pathname.startsWith('/dashboard/kds')) pageTitle = 'Kitchen Display';
  else if (pathname.startsWith('/dashboard/staff')) pageTitle = 'Staff Management';
  else if (pathname.startsWith('/dashboard/customers')) pageTitle = 'Customer Management';
  else if (pathname.startsWith('/dashboard/analytics')) pageTitle = 'Analytics & Reports';
  else if (pathname.startsWith('/dashboard/promotions')) pageTitle = 'Promotions & Discounts';
  else if (pathname.startsWith('/dashboard/settings')) pageTitle = 'Settings';
  else if (pathname.startsWith('/dashboard/subscription')) pageTitle = 'Subscription & Billing';

  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const initials = restaurantInfo.owner
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Unread count
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const filteredNotifs = notifications.filter((n) => {
    if (notifFilter === 'orders') return n.type === 'order';
    if (notifFilter === 'alerts') return n.type === 'alert';
    return true;
  });

  // Global Search Filter
  const searchResults = searchQuery.trim().length > 1 ? {
    items: menuItems.filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
    orders: ordersData.filter((o) => o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.table.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
    customers: customersData.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)).slice(0, 3),
  } : null;

  return (
    <header className="db-topnav">
      {/* Title */}
      <span className="db-topnav-title">{pageTitle}</span>
      <span className="db-topnav-divider" />

      {/* Global Search */}
      <div className="db-search" ref={searchRef}>
        <Search size={13} className="db-search-icon" strokeWidth={2} />
        <input
          id="db-global-search"
          type="search"
          className="db-search-input"
          placeholder="Search orders, items, customers..."
          aria-label="Global search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
        />
           
        {/* Live Search Results Dropdown */}
        {isSearchOpen && searchResults && (
          <div
            className="db-search-dropdown"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              width: '420px',
              background: '#ffffff',
              border: '1px solid var(--db-border-strong)',
              boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
              zIndex: 1500,
              maxHeight: '440px',
              overflowY: 'auto',
            }}
          >
            {/* Menu Items */}
            {searchResults.items.length > 0 && (
              <div style={{ padding: '8px 0', borderBottom: '1px solid var(--db-border)' }}>
                <div style={{ padding: '4px 14px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)', textTransform: 'uppercase' }}>
                  Menu Dishes
                </div>
                {searchResults.items.map((it) => (
                  <Link
                    key={it.id}
                    href="/dashboard/menu"
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 14px',
                      textDecoration: 'none',
                      color: 'var(--db-text)',
                      fontSize: '13px',
                    }}
                    className="db-search-item"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Utensils size={14} color="var(--db-accent)" />
                      <span>{it.name}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>₹{it.price}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Orders */}
            {searchResults.orders.length > 0 && (
              <div style={{ padding: '8px 0', borderBottom: '1px solid var(--db-border)' }}>
                <div style={{ padding: '4px 14px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)', textTransform: 'uppercase' }}>
                  Orders
                </div>
                {searchResults.orders.map((ord) => (
                  <Link
                    key={ord.id}
                    href={`/dashboard/orders/${ord.id}`}
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 14px',
                      textDecoration: 'none',
                      color: 'var(--db-text)',
                      fontSize: '13px',
                    }}
                    className="db-search-item"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ShoppingBag size={14} color="var(--db-green)" />
                      <span>#{ord.id} &bull; {ord.table}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>₹{ord.total}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Customers */}
            {searchResults.customers.length > 0 && (
              <div style={{ padding: '8px 0' }}>
                <div style={{ padding: '4px 14px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)', textTransform: 'uppercase' }}>
                  Customers
                </div>
                {searchResults.customers.map((c) => (
                  <Link
                    key={c.id}
                    href="/dashboard/customers"
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 14px',
                      textDecoration: 'none',
                      color: 'var(--db-text)',
                      fontSize: '13px',
                    }}
                    className="db-search-item"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <User size={14} color="var(--db-text-2)" />
                      <span>{c.name}</span>
                    </div>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)' }}>{c.phone}</span>
                  </Link>
                ))}
              </div>
            )}

            {searchResults.items.length === 0 && searchResults.orders.length === 0 && searchResults.customers.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--db-text-3)', fontSize: '12.5px' }}>
                No records match &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="db-topnav-right">
        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="db-topnav-btn"
            id="db-notifications-btn"
            aria-label="Notifications"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <Bell size={17} strokeWidth={1.8} />
            {unreadCount > 0 && <span className="db-notif-dot" aria-hidden="true" />}
          </button>

          {isNotifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '360px',
                background: '#ffffff',
                border: '1px solid var(--db-border-strong)',
                boxShadow: '0 16px 36px rgba(0,0,0,0.15)',
                zIndex: 2000,
              }}
            >
              {/* Popover Header */}
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--db-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#faf8f5',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'Google Sans', fontSize: '14px', fontWeight: 700 }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        background: 'var(--db-accent)',
                        color: '#fff',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 5px',
                        fontWeight: 700,
                      }}
                    >
                      {unreadCount} NEW
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--db-accent)',
                      fontSize: '11px',
                      fontFamily: 'Manrope',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div
                style={{
                  display: 'flex',
                  borderBottom: '1px solid var(--db-border)',
                  background: '#ffffff',
                }}
              >
                {['all', 'orders', 'alerts'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setNotifFilter(tab)}
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      border: 'none',
                      background: 'none',
                      fontFamily: 'Manrope',
                      fontSize: '11.5px',
                      fontWeight: notifFilter === tab ? 700 : 500,
                      color: notifFilter === tab ? 'var(--db-text)' : 'var(--db-text-3)',
                      borderBottom: notifFilter === tab ? '2px solid var(--db-accent)' : '2px solid transparent',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Notifications List */}
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {filteredNotifs.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid rgba(0,0,0,0.05)',
                      background: n.unread ? 'rgba(200, 90, 50, 0.03)' : '#ffffff',
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: n.unread ? 'var(--db-accent)' : '#ccc',
                        marginTop: 5,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--db-text)' }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)' }}>
                          {n.time}
                        </span>
                      </div>
                      <p
                        style={{ fontSize: '11.5px', color: 'var(--db-text-2)', margin: '2px 0 0' }}
                        dangerouslySetInnerHTML={{ __html: n.desc }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer with Audio Toggle */}
              <div
                style={{
                  padding: '8px 14px',
                  borderTop: '1px solid var(--db-border)',
                  background: '#faf8f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: 'var(--db-text-2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {soundEnabled ? <Volume2 size={13} color="var(--db-green)" /> : <VolumeX size={13} />}
                  <span>Alert Chimes: {soundEnabled ? 'On' : 'Muted'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--db-accent)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '11px',
                  }}
                >
                  {soundEnabled ? 'Mute' : 'Unmute'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <Link
          href="/dashboard/settings"
          className="db-topnav-btn"
          id="db-help-btn"
          aria-label="Help and documentation"
          title="Help & Support"
        >
          <HelpCircle size={17} strokeWidth={1.8} />
        </Link>

        {/* Clock */}
        <div className="db-topnav-clock" aria-live="polite" aria-label="Current time">
          <span className="db-clock-time">{timeStr}</span>
          <span className="db-clock-date">{dateStr}</span>
        </div>

        {/* User Profile */}
        <button className="db-user-btn" id="db-user-menu-btn" aria-label="User menu">
          <div className="db-user-avatar">
            <span>{initials}</span>
          </div>
          <span className="db-user-name">{restaurantInfo.owner}</span>
          <ChevronDown size={13} strokeWidth={2} style={{ color: 'var(--db-text-3)', marginLeft: 2 }} />
        </button>

        {/* Logout */}
        <Link href="/login" className="db-logout-btn" id="db-logout-btn" aria-label="Logout">
          <LogOut size={13} strokeWidth={2} />
          Logout
        </Link>
      </div>
    </header>
  );
}
