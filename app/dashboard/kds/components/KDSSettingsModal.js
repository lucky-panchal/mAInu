'use client';

import { X, Volume2, VolumeX, Printer, Monitor, CheckCircle2 } from 'lucide-react';

export default function KDSSettingsModal({
  isOpen,
  onClose,
  soundEnabled,
  setSoundEnabled,
  displayMode,
  setDisplayMode,
  onTestPrint,
  onPlayChime,
}) {
  if (!isOpen) return null;

  return (
    <div className="db-modal-backdrop" onClick={onClose}>
      <div
        className="db-modal-card"
        style={{ maxWidth: '500px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kds-settings-title"
      >
        <div className="db-modal-header">
          <h2 id="kds-settings-title">Kitchen Display Settings</h2>
          <button className="db-btn-icon-only" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <div className="db-modal-body">
          {/* Display Mode */}
          <div className="db-form-group">
            <label className="db-form-label">Display Mode</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 4 }}>
              {['Columns', 'List', 'Fullscreen'].map((mode) => {
                const isSelected = displayMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    className={`db-btn ${isSelected ? 'db-btn-secondary' : 'db-btn-outline'} db-btn-sm`}
                    onClick={() => setDisplayMode(mode)}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Alerts */}
          <div className="db-form-group" style={{ marginTop: 12 }}>
            <label className="db-form-label">Audio Alerts (New Orders)</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <button
                type="button"
                className={`db-btn ${soundEnabled ? 'db-btn-primary' : 'db-btn-outline'} db-btn-sm`}
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (!soundEnabled) onPlayChime();
                }}
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>Sound Alerts: {soundEnabled ? 'Enabled' : 'Muted'}</span>
              </button>

              <button
                type="button"
                className="db-btn db-btn-outline db-btn-sm"
                onClick={onPlayChime}
              >
                Test Sound Chime
              </button>
            </div>
          </div>

          {/* Printer Integration */}
          <div className="db-form-group" style={{ marginTop: 12 }}>
            <label className="db-form-label">Kitchen Ticket Printer</label>
            <div
              style={{
                border: '1px solid var(--db-border)',
                padding: '12px 16px',
                background: '#faf8f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Printer size={16} color="var(--db-green)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Epson TM-T88VI Thermal</div>
                  <span style={{ fontSize: '11px', color: 'var(--db-green)', fontFamily: 'var(--font-mono)' }}>
                    ● Online &amp; Ready
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="db-btn db-btn-secondary db-btn-sm"
                onClick={onTestPrint}
              >
                Test Print
              </button>
            </div>
          </div>
        </div>

        <div className="db-modal-footer" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="db-btn db-btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
