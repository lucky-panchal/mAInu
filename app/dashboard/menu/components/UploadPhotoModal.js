'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Sparkles, Check, Trash2, FileText, ArrowRight } from 'lucide-react';
import { menuCategories } from '../../data/menuData';

const SAMPLE_EXTRACTED_ITEMS = [
  { id: 'ext-1', name: 'Crispy Corn Salt & Pepper', category: 'Appetizers', price: 210, cost: 70 },
  { id: 'ext-2', name: 'Mutton Rogan Josh', category: 'Mains', price: 390, cost: 170 },
  { id: 'ext-3', name: 'Garlic Naan', category: 'Sides', price: 60, cost: 15 },
  { id: 'ext-4', name: 'Kesar Pista Kulfi', category: 'Desserts', price: 150, cost: 40 },
];

export default function UploadPhotoModal({ isOpen, onClose, onImport }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('Initializing AI OCR engine...');
  const [extractedItems, setExtractedItems] = useState(SAMPLE_EXTRACTED_ITEMS);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFile(null);
      setProgress(0);
      setExtractedItems(SAMPLE_EXTRACTED_ITEMS);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (step === 2) {
      setProgress(10);
      setProgressText('Reading menu layout and text coordinates...');

      const step1 = setTimeout(() => {
        setProgress(45);
        setProgressText('Extracting item names, descriptions & prices...');
      }, 700);

      const step2 = setTimeout(() => {
        setProgress(85);
        setProgressText('Categorizing dishes and estimating margins...');
      }, 1400);

      const step3 = setTimeout(() => {
        setProgress(100);
        setProgressText('Extraction complete!');
      }, 2000);

      const step4 = setTimeout(() => {
        setStep(3);
      }, 2400);

      return () => {
        clearTimeout(step1);
        clearTimeout(step2);
        clearTimeout(step3);
        clearTimeout(step4);
      };
    }
  }, [step]);

  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setStep(2);
    }
  };

  const handleStartSimulatedScan = () => {
    setFile({ name: 'menu_photograph_scan.jpg', size: 1024 * 720 });
    setStep(2);
  };

  const handleUpdateItem = (idx, field, value) => {
    setExtractedItems((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleRemoveItem = (idx) => {
    setExtractedItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleConfirmImport = () => {
    onImport(extractedItems);
    onClose();
  };

  return (
    <div className="db-modal-backdrop" onClick={onClose}>
      <div
        className="db-modal-card"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
      >
        {/* Header */}
        <div className="db-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="var(--db-accent)" />
            <h2 id="upload-modal-title">AI Menu Photo Extraction</h2>
          </div>
          <button className="db-btn-icon-only" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="db-modal-body">
            <p style={{ fontSize: '13px', color: 'var(--db-text-2)', lineHeight: 1.5 }}>
              Upload an image or PDF scan of your physical paper menu. Our AI will automatically detect
              and extract all dishes, categories, and prices into editable items.
            </p>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              style={{
                border: '2px dashed var(--db-border-strong)',
                background: '#faf8f5',
                padding: '40px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('menu-photo-input').click()}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: 'var(--db-accent-dim)',
                  color: 'var(--db-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Upload size={24} />
              </div>
              <div>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--db-text)' }}>
                  Drag &amp; drop menu photo here
                </span>
                <p style={{ fontSize: '12px', color: 'var(--db-text-3)', marginTop: 4 }}>
                  or click to browse from device (JPG, PNG, PDF up to 10MB)
                </p>
              </div>
              <input
                id="menu-photo-input"
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileDrop}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
              <button
                type="button"
                className="db-btn db-btn-secondary db-btn-sm"
                onClick={handleStartSimulatedScan}
              >
                <Sparkles size={13} />
                Try Sample Menu Scan
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Processing View */}
        {step === 2 && (
          <div className="db-modal-body" style={{ textAlign: 'center', padding: '50px 24px' }}>
            <div
              style={{
                width: 60,
                height: 60,
                background: 'var(--db-accent-dim)',
                color: 'var(--db-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                animation: 'spin 3s linear infinite',
              }}
            >
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontFamily: 'Google Sans', fontSize: '18px', fontWeight: 700, marginBottom: 8 }}>
              Analyzing Menu Document
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--db-text-2)', marginBottom: 24 }}>
              {progressText}
            </p>

            {/* Progress bar */}
            <div
              style={{
                width: '100%',
                maxWidth: '400px',
                height: 8,
                background: '#e6e3dc',
                margin: '0 auto 12px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'var(--db-accent)',
                  transition: 'width 300ms ease-out',
                }}
              />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--db-text-3)' }}>
              {progress}% complete
            </span>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <>
            <div className="db-modal-body">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--db-green-bg)',
                  color: 'var(--db-green)',
                  padding: '10px 14px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                }}
              >
                <Check size={16} />
                <span>Extracted {extractedItems.length} items from photo. Review and edit before saving:</span>
              </div>

              <div className="db-table-card">
                <table className="db-data-table">
                  <thead>
                    <tr>
                      <th>Dish Name</th>
                      <th>Category</th>
                      <th style={{ width: '100px' }}>Price (₹)</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedItems.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td>
                          <input
                            type="text"
                            className="db-form-input"
                            style={{ padding: '6px 8px', fontSize: '12.5px' }}
                            value={item.name}
                            onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                          />
                        </td>
                        <td>
                          <select
                            className="db-filter-select"
                            style={{ height: '32px', fontSize: '12px' }}
                            value={item.category}
                            onChange={(e) => handleUpdateItem(idx, 'category', e.target.value)}
                          >
                            {menuCategories.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            className="db-form-input"
                            style={{ padding: '6px 8px', fontSize: '12.5px', fontFamily: 'var(--font-mono)' }}
                            value={item.price}
                            onChange={(e) => handleUpdateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td>
                          <button
                            className="db-btn-icon-only db-btn-icon-danger"
                            onClick={() => handleRemoveItem(idx)}
                            title="Remove extracted item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="db-modal-footer">
              <button type="button" className="db-btn db-btn-outline" onClick={() => setStep(1)}>
                Back to Upload
              </button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="db-btn db-btn-outline" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="db-btn db-btn-primary"
                  onClick={handleConfirmImport}
                  disabled={extractedItems.length === 0}
                >
                  <Check size={14} />
                  Confirm &amp; Add ({extractedItems.length}) Items
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
