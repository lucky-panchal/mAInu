'use client';

import { useState } from 'react';
import {
  Printer, Download, RefreshCw, QrCode, CheckCircle2,
  ExternalLink, X, HelpCircle
} from 'lucide-react';
import { initialTablesData } from '../data/tablesData';
import QRCodeCard from './components/QRCodeCard';

export default function QRCodesPage() {
  const [tables, setTables] = useState(initialTablesData);
  const [toastMessage, setToastMessage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePrintAll = () => {
    showToast('Generating printable table tent cards...');
    window.print();
  };

  const handleDownloadAll = () => {
    showToast('Packaging QR codes into ZIP archive...');
    setTimeout(() => {
      showToast('Downloaded mainu-table-qrcodes.zip');
    }, 1200);
  };

  const handleRegenerateAll = () => {
    if (window.confirm('Are you sure you want to regenerate all QR codes? Existing printed QR codes will be invalidated.')) {
      setTables((prev) => [...prev]);
      showToast('All 15 table QR codes refreshed with new encryption tokens.');
    }
  };

  const handlePrintSingle = (table) => {
    showToast(`Sending tent card for ${table.number} to printer...`);
    window.print();
  };

  const handleDownloadSingle = (table, qrUrl) => {
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `qr-${table.id}.png`;
    a.target = '_blank';
    a.click();
    showToast(`Downloaded QR for ${table.number}`);
  };

  const handleRegenerateSingle = (table) => {
    showToast(`Regenerated security token for ${table.number}`);
  };

  const handlePreviewLink = (url) => {
    setPreviewUrl(url);
  };

  return (
    <main className="db-content" id="db-qrcodes-page">
      {/* Toast Alert */}
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
          <h1 className="db-page-title">QR Code Management</h1>
          <p className="db-page-subtitle">
            Generate, print, and configure contactless digital dining QR codes for each table
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="db-btn db-btn-outline"
            onClick={handleRegenerateAll}
            title="Refresh security tokens across all tables"
          >
            <RefreshCw size={14} />
            Regenerate All
          </button>

          <button
            type="button"
            className="db-btn db-btn-secondary"
            onClick={handleDownloadAll}
            title="Download batch archive"
          >
            <Download size={14} />
            Download ZIP
          </button>

          <button
            type="button"
            className="db-btn db-btn-primary"
            onClick={handlePrintAll}
            title="Print tent cards for all tables"
          >
            <Printer size={15} />
            Print All QR Codes
          </button>
        </div>
      </div>

      {/* Top Section Info Box */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--db-border)',
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          borderLeft: '3px solid var(--db-accent)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: 'var(--db-accent-dim)',
              color: 'var(--db-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QrCode size={20} />
          </div>
          <div>
            <span style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--db-text)' }}>
              Each table has a unique encrypted QR code.
            </span>
            <p style={{ fontSize: '12px', color: 'var(--db-text-3)', margin: 0 }}>
              Guests scan with their phone camera to instantly view the menu, place orders, and pay with UPI or card without waiting for waitstaff.
            </p>
          </div>
        </div>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--db-text-2)' }}>
          {tables.length} Total QR Codes Active
        </span>
      </div>

      {/* 4-Column Responsive QR Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}
      >
        {tables.map((table) => (
          <QRCodeCard
            key={table.id}
            table={table}
            onPrint={handlePrintSingle}
            onDownload={handleDownloadSingle}
            onRegenerate={handleRegenerateSingle}
            onPreview={handlePreviewLink}
          />
        ))}
      </div>

      {/* Customer Preview Modal */}
      {previewUrl && (
        <div className="db-modal-backdrop" onClick={() => setPreviewUrl(null)}>
          <div
            className="db-modal-card"
            style={{ maxWidth: '420px', width: '100%', padding: 0, overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="db-modal-header" style={{ padding: '14px 18px', background: '#141414', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#27c93f', display: 'inline-block' }} />
                <h2 style={{ fontSize: '14px', fontFamily: 'Google Sans', margin: 0, color: '#fff' }}>
                  Live Diner Mobile Preview
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="db-btn db-btn-sm"
                  style={{ background: 'var(--db-accent)', color: '#fff', fontSize: '11px', textDecoration: 'none' }}
                >
                  <ExternalLink size={12} />
                  Open in Tab
                </a>
                <button
                  className="db-btn-icon-only"
                  style={{ color: '#fff' }}
                  onClick={() => setPreviewUrl(null)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div style={{ height: '580px', background: '#FAF7F0' }}>
              <iframe
                src={previewUrl}
                title="Diner Mobile Experience"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
