'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Clock, Flame, CheckCircle2, AlertTriangle, Maximize2, Minimize2,
  Volume2, VolumeX, Settings, Utensils, RefreshCw, Check, ArrowRight
} from 'lucide-react';
import KDSSettingsModal from './components/KDSSettingsModal';

// Initial KDS active orders
const initialKDSOrders = [
  {
    id: 'ORD-001244',
    orderNumber: '#1244',
    table: 'Table 7',
    timeReceived: '2:10 PM',
    minutesAgo: 8,
    isUrgent: false,
    status: 'NEW',
    items: [
      { name: 'Dal Makhani', qty: 1, note: '' },
      { name: 'Steamed Rice', qty: 1, note: '' },
      { name: 'Mango Lassi', qty: 1, note: 'No sugar' },
    ],
  },
  {
    id: 'ORD-001242',
    orderNumber: '#1242',
    table: 'Table 11',
    timeReceived: '1:58 PM',
    minutesAgo: 20,
    isUrgent: true,
    status: 'NEW',
    items: [
      { name: 'Veg Thali Special', qty: 1, note: 'Extra papad, mild spice' },
    ],
  },
  {
    id: 'ORD-001241',
    orderNumber: '#1241',
    table: 'Table 5',
    timeReceived: '2:04 PM',
    minutesAgo: 14,
    isUrgent: false,
    status: 'PREPARING',
    items: [
      { name: 'Chicken Biryani', qty: 1, note: 'Spicy' },
      { name: 'Raita', qty: 1, note: '' },
      { name: 'Butter Chicken', qty: 1, note: 'Less butter' },
    ],
  },
  {
    id: 'ORD-001240',
    orderNumber: '#1240',
    table: 'Table 8',
    timeReceived: '1:48 PM',
    minutesAgo: 30,
    isUrgent: true,
    status: 'PREPARING',
    items: [
      { name: 'Paneer Tikka', qty: 2, note: 'Extra mint chutney' },
      { name: 'Tandoori Roti', qty: 4, note: 'Crispy' },
      { name: 'Dal Makhani', qty: 1, note: '' },
    ],
  },
  {
    id: 'ORD-001245',
    orderNumber: '#1245',
    table: 'Table 3',
    timeReceived: '2:14 PM',
    minutesAgo: 4,
    isUrgent: false,
    status: 'READY',
    items: [
      { name: 'Butter Chicken', qty: 1, note: 'Less spicy' },
      { name: 'Tandoori Roti', qty: 3, note: '' },
      { name: 'Mango Lassi', qty: 2, note: '' },
    ],
  },
];

export default function KDSPage() {
  const [orders, setOrders] = useState(initialKDSOrders);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [displayMode, setDisplayMode] = useState('Columns');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [syncPulse, setSyncPulse] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Web Audio chime generator
  const playChime = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15); // E6
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } catch (e) {
      // Audio autoplay policy
    }
  }, []);

  // Clock tick every 1s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2s simulated WebSocket heartbeat
  useEffect(() => {
    const syncTimer = setInterval(() => {
      setSyncPulse(true);
      setTimeout(() => setSyncPulse(false), 400);
    }, 2000);
    return () => clearInterval(syncTimer);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Status handlers
  const handleStartPreparing = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'PREPARING' } : o))
    );
    showToast(`Order ${id} moved to PREPARING`);
  };

  const handleMarkReady = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'READY' } : o))
    );
    if (soundEnabled) playChime();
    showToast(`Order ${id} is READY for pickup`);
  };

  const handleRemoveOrder = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    showToast(`Order ${id} completed & cleared from kitchen feed`);
  };

  const newOrders = orders.filter((o) => o.status === 'NEW');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <main
      className="db-content"
      id="db-kds-page"
      style={{
        background: '#111111',
        minHeight: 'calc(100vh - var(--db-topnav-h))',
        color: '#ffffff',
        padding: '20px 24px 40px',
      }}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#ffffff',
            color: '#141414',
            padding: '12px 20px',
            fontSize: '13px',
            fontFamily: 'Manrope',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 3000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            borderLeft: '4px solid var(--db-accent)',
          }}
        >
          <CheckCircle2 size={16} color="var(--db-accent)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KDS Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          paddingBottom: 16,
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 38,
              height: 38,
              background: 'var(--db-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Flame size={22} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Google Sans', fontSize: '22px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              Kitchen Display System
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Showing {orders.length} active orders
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: syncPulse ? 'var(--db-accent)' : '#4ade80',
                  transition: 'color 200ms ease',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: syncPulse ? 'var(--db-accent)' : '#4ade80',
                  }}
                />
                Live 2s Sync
              </span>
            </div>
          </div>
        </div>

        {/* Large Clock & Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Large Live Clock */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#ffffff',
              background: 'rgba(255,255,255,0.06)',
              padding: '6px 16px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {formattedTime}
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            className="db-btn db-btn-sm"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: soundEnabled ? '#ffffff' : 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Alerts' : 'Unmute Alerts'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Settings button */}
          <button
            type="button"
            className="db-btn db-btn-sm"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
            onClick={() => setIsSettingsOpen(true)}
            title="KDS Settings"
          >
            <Settings size={15} />
            Settings
          </button>

          {/* Fullscreen button */}
          <button
            type="button"
            className="db-btn db-btn-primary db-btn-sm"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen Mode"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* 3-Column Kanban Board Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* Column 1: NEW ORDERS */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderTop: '4px solid #ef4444',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            minHeight: '75vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Column Header */}
          <div
            style={{
              padding: '14px 16px',
              background: 'rgba(239, 68, 68, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(239, 68, 68, 0.25)',
            }}
          >
            <span style={{ fontFamily: 'Google Sans', fontSize: '15px', fontWeight: 700, color: '#f87171', letterSpacing: '0.05em' }}>
              NEW ORDERS
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                background: '#ef4444',
                color: '#ffffff',
                padding: '2px 8px',
              }}
            >
              {newOrders.length}
            </span>
          </div>

          {/* Cards Container */}
          <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
            {newOrders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  background: '#1f1f1f',
                  border: ord.isUrgent ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.14)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Card Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontFamily: 'Google Sans', fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
                      {ord.table}
                    </span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--db-accent)', fontWeight: 600 }}>
                      {ord.orderNumber}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {ord.isUrgent && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          background: '#ef4444',
                          color: '#fff',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          marginBottom: 4,
                        }}
                      >
                        <AlertTriangle size={11} />
                        URGENT
                      </span>
                    )}
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      {ord.timeReceived} ({ord.minutesAgo}m ago)
                    </div>
                  </div>
                </div>

                {/* Items List (Large font readable from 2m) */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10 }}>
                  {ord.items.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                        {item.qty}× {item.name}
                      </div>
                      {item.note && (
                        <div
                          style={{
                            fontSize: '12.5px',
                            color: '#fbbf24',
                            fontFamily: 'var(--font-mono)',
                            marginTop: 2,
                          }}
                        >
                          ↳ {item.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  className="db-btn db-btn-primary"
                  style={{ width: '100%', height: 42, fontSize: '14px', fontWeight: 700 }}
                  onClick={() => handleStartPreparing(ord.id)}
                >
                  <Flame size={16} />
                  Start Preparing
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: PREPARING */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderTop: '4px solid #eab308',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            minHeight: '75vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Column Header */}
          <div
            style={{
              padding: '14px 16px',
              background: 'rgba(234, 179, 8, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(234, 179, 8, 0.25)',
            }}
          >
            <span style={{ fontFamily: 'Google Sans', fontSize: '15px', fontWeight: 700, color: '#facc15', letterSpacing: '0.05em' }}>
              PREPARING
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                background: '#eab308',
                color: '#141414',
                padding: '2px 8px',
              }}
            >
              {preparingOrders.length}
            </span>
          </div>

          {/* Cards Container */}
          <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
            {preparingOrders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  background: '#1f1f1f',
                  border: ord.isUrgent ? '2px solid #eab308' : '1px solid rgba(255,255,255,0.14)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Card Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontFamily: 'Google Sans', fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
                      {ord.table}
                    </span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#facc15', fontWeight: 600 }}>
                      {ord.orderNumber}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {ord.isUrgent && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          background: '#eab308',
                          color: '#141414',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          marginBottom: 4,
                        }}
                      >
                        <AlertTriangle size={11} />
                        URGENT
                      </span>
                    )}
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      {ord.timeReceived} ({ord.minutesAgo}m ago)
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10 }}>
                  {ord.items.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                        {item.qty}× {item.name}
                      </div>
                      {item.note && (
                        <div
                          style={{
                            fontSize: '12.5px',
                            color: '#fbbf24',
                            fontFamily: 'var(--font-mono)',
                            marginTop: 2,
                          }}
                        >
                          ↳ {item.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  className="db-btn"
                  style={{
                    width: '100%',
                    height: 42,
                    fontSize: '14px',
                    fontWeight: 700,
                    background: '#eab308',
                    color: '#141414',
                  }}
                  onClick={() => handleMarkReady(ord.id)}
                >
                  <Check size={16} />
                  Mark Ready
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: READY FOR PICKUP */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderTop: '4px solid #22c55e',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            minHeight: '75vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Column Header */}
          <div
            style={{
              padding: '14px 16px',
              background: 'rgba(34, 197, 94, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(34, 197, 94, 0.25)',
            }}
          >
            <span style={{ fontFamily: 'Google Sans', fontSize: '15px', fontWeight: 700, color: '#4ade80', letterSpacing: '0.05em' }}>
              READY FOR PICKUP
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                background: '#22c55e',
                color: '#ffffff',
                padding: '2px 8px',
              }}
            >
              {readyOrders.length}
            </span>
          </div>

          {/* Cards Container */}
          <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
            {readyOrders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  background: '#1f1f1f',
                  border: '1px solid #22c55e',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Card Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontFamily: 'Google Sans', fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
                      {ord.table}
                    </span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#4ade80', fontWeight: 600 }}>
                      {ord.orderNumber}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#4ade80',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        display: 'inline-block',
                        marginBottom: 4,
                      }}
                    >
                      READY TO SERVE
                    </span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      {ord.timeReceived} ({ord.minutesAgo}m ago)
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10 }}>
                  {ord.items.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                        {item.qty}× {item.name}
                      </div>
                      {item.note && (
                        <div
                          style={{
                            fontSize: '12.5px',
                            color: '#fbbf24',
                            fontFamily: 'var(--font-mono)',
                            marginTop: 2,
                          }}
                        >
                          ↳ {item.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  className="db-btn"
                  style={{
                    width: '100%',
                    height: 42,
                    fontSize: '14px',
                    fontWeight: 700,
                    background: '#22c55e',
                    color: '#ffffff',
                  }}
                  onClick={() => handleRemoveOrder(ord.id)}
                >
                  <CheckCircle2 size={16} />
                  Serve &amp; Clear
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <KDSSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        onTestPrint={() => showToast('Test ticket printed successfully to Epson kitchen thermal printer')}
        onPlayChime={playChime}
      />
    </main>
  );
}
