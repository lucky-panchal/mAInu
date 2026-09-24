'use client';

import { useState } from 'react';
import { Copy, Check, Printer, Download, RefreshCw, ExternalLink } from 'lucide-react';

export default function QRCodeCard({ table, onPrint, onDownload, onRegenerate, onPreview }) {
  const [copied, setCopied] = useState(false);

  const tableSlug = table.id;
  const internalRoute = `/menu/spice-route?table=${encodeURIComponent(table.number)}`;
  const targetUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${internalRoute}`
    : `https://mainu.app${internalRoute}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    targetUrl
  )}&bgcolor=ffffff&color=141414&margin=1`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="db-qr-card"
      style={{
        background: '#ffffff',
        border: '1px solid var(--db-border)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
      }}
      id={`qr-card-${table.id}`}
    >
      {/* Header */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontFamily: 'Google Sans', fontSize: '17px', fontWeight: 700, color: 'var(--db-text)' }}>
          {table.number}
        </span>
        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 6px',
            background: '#f4f2ee',
            color: 'var(--db-text-2)',
          }}
        >
          {table.location || 'Dine-In'}
        </span>
      </div>

      {/* QR Code Container (200x200px) */}
      <div
        style={{
          width: 200,
          height: 200,
          border: '1px solid var(--db-border)',
          background: '#ffffff',
          padding: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: 14,
        }}
      >
        <img
          src={qrImageUrl}
          alt={`QR Code for ${table.number}`}
          width={184}
          height={184}
          style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
          loading="lazy"
        />
        {/* Center brand mark */}
        <div
          style={{
            position: 'absolute',
            width: 32,
            height: 32,
            background: '#ffffff',
            border: '2px solid var(--db-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '13px',
            color: 'var(--db-accent)',
            fontFamily: 'Google Sans',
          }}
        >
          m
        </div>
      </div>

      {/* Copyable URL Pill */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#faf8f5',
          border: '1px solid var(--db-border)',
          padding: '6px 10px',
          marginBottom: 16,
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--db-text-2)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'left',
          }}
          title={targetUrl}
        >
          {targetUrl.replace('https://', '')}
        </span>
        <button
          type="button"
          onClick={handleCopyLink}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: copied ? 'var(--db-green)' : 'var(--db-text-3)',
            display: 'inline-flex',
            alignItems: 'center',
            padding: 2,
          }}
          title="Copy menu link"
          aria-label="Copy menu link"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
          paddingTop: 12,
          borderTop: '1px solid var(--db-border)',
        }}
      >
        <button
          type="button"
          className="db-btn db-btn-outline db-btn-sm"
          onClick={() => onPrint(table)}
          title="Print table tent card"
        >
          <Printer size={12} />
          Print
        </button>

        <button
          type="button"
          className="db-btn db-btn-outline db-btn-sm"
          onClick={() => onDownload(table, qrImageUrl)}
          title="Download QR code image"
        >
          <Download size={12} />
          Download
        </button>

        <button
          type="button"
          className="db-btn db-btn-outline db-btn-sm"
          onClick={() => onRegenerate(table)}
          title="Regenerate security token"
        >
          <RefreshCw size={12} />
          Regenerate
        </button>

        <button
          type="button"
          className="db-btn db-btn-secondary db-btn-sm"
          onClick={() => onPreview(internalRoute)}
          title="Preview customer menu"
        >
          <ExternalLink size={12} />
          Preview
        </button>
      </div>
    </div>
  );
}
