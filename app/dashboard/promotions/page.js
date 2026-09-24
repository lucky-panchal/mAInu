'use client';
import React, { useState, useMemo } from 'react';
import { promotionsData as initialData } from '../data/promotionsData';

const PROMO_TYPES = [
  { id: 'percentage', icon: '%', label: 'Percentage Off', desc: 'e.g. 20% off total bill' },
  { id: 'flat',       icon: '₹', label: 'Flat Discount',  desc: 'e.g. ₹50 off on orders above ₹300' },
  { id: 'bogo',       icon: '2', label: 'Buy 1 Get 1',    desc: 'Buy one item, get one free' },
  { id: 'freeitem',   icon: '🎁', label: 'Free Item',      desc: 'Free item on minimum order' },
];

function PromoModal({ promo, onSave, onClose, onDelete }) {
  const isEdit = !!promo;
  const [form, setForm] = useState(promo ? { ...promo } : {
    code: '', title: '', type: 'percentage', value: '', minOrder: '',
    maxDiscount: '', startDate: '', endDate: '', usageLimit: '', status: 'Active',
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(f => ({...f, [k]: v})); setErrors(e => ({...e, [k]: undefined})); };
  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'Required';
    if (!form.title.trim()) e.title = 'Required';
    if (!form.value) e.value = 'Required';
    return e;
  };
  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, id: promo?.id || Date.now(), usageCount: promo?.usageCount || 0 });
  };

  return (
    <div className="db-modal-overlay" onClick={onClose}>
      <div className="db-modal" style={{maxWidth:600,width:'100%'}} onClick={e=>e.stopPropagation()}>
        <div className="db-modal-header">
          <span className="db-modal-title">{isEdit ? 'Edit Promotion' : 'Create Promotion'}</span>
          <button className="db-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="db-modal-body" style={{maxHeight:'74vh',overflowY:'auto',padding:'24px 28px'}}>
          {/* Type Selector */}
          <div className="db-form-section-label">Promotion Type</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
            {PROMO_TYPES.map(t => (
              <div key={t.id} className={`db-promo-type-card${form.type===t.id?' selected':''}`} onClick={()=>set('type',t.id)}>
                <span style={{fontSize:20,flexShrink:0}}>{t.icon}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--db-text)'}}>{t.label}</div>
                  <div style={{fontSize:11,color:'var(--db-text-3)'}}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Basic Details */}
          <div className="db-form-section-label">Details</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div className="db-form-group">
              <label className="db-form-label">Promo Code *</label>
              <input className={`db-input${errors.code?' error':''}`} value={form.code}
                onChange={e=>set('code',e.target.value.toUpperCase())} placeholder="e.g. SAVE20" style={{fontFamily:'var(--font-mono)',fontWeight:700}} />
              {errors.code && <span className="db-field-error">{errors.code}</span>}
            </div>
            <div className="db-form-group">
              <label className="db-form-label">
                {form.type==='percentage'?'Discount %':form.type==='flat'?'Discount ₹':'Value'} *
              </label>
              <input className={`db-input${errors.value?' error':''}`} value={form.value} type="number"
                onChange={e=>set('value',e.target.value)} placeholder="e.g. 20" />
              {errors.value && <span className="db-field-error">{errors.value}</span>}
            </div>
          </div>
          <div className="db-form-group" style={{marginBottom:16}}>
            <label className="db-form-label">Title / Description *</label>
            <input className={`db-input${errors.title?' error':''}`} value={form.title}
              onChange={e=>set('title',e.target.value)} placeholder="e.g. Weekend Special 20% Off" />
            {errors.title && <span className="db-field-error">{errors.title}</span>}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div className="db-form-group">
              <label className="db-form-label">Min. Order (₹)</label>
              <input className="db-input" value={form.minOrder} type="number" onChange={e=>set('minOrder',e.target.value)} placeholder="0" />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Max Discount (₹)</label>
              <input className="db-input" value={form.maxDiscount} type="number" onChange={e=>set('maxDiscount',e.target.value)} placeholder="No limit" />
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16,marginBottom:16}}>
            <div className="db-form-group">
              <label className="db-form-label">Start Date</label>
              <input className="db-input" value={form.startDate} type="date" onChange={e=>set('startDate',e.target.value)} />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">End Date</label>
              <input className="db-input" value={form.endDate} type="date" onChange={e=>set('endDate',e.target.value)} />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Usage Limit</label>
              <input className="db-input" value={form.usageLimit} type="number" onChange={e=>set('usageLimit',e.target.value)} placeholder="Unlimited" />
            </div>
          </div>
          <div className="db-form-section-label">Status</div>
          <div style={{display:'flex',gap:16}}>
            {['Active','Paused'].map(s => (
              <label key={s} style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer',fontSize:13}}>
                <input type="radio" name="promo-status" value={s} checked={form.status===s} onChange={()=>set('status',s)} style={{accentColor:'var(--db-accent)'}} />
                {s}
              </label>
            ))}
          </div>
        </div>
        <div className="db-modal-footer">
          {isEdit && <button className="db-btn db-btn-danger" style={{marginRight:'auto'}} onClick={()=>onDelete(promo.id)}>Delete</button>}
          <button className="db-btn db-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="db-btn db-btn-primary" onClick={submit}>{isEdit?'Save Changes':'Create Promotion'}</button>
        </div>
      </div>
    </div>
  );
}

export default function PromotionsPage() {
  const [promos, setPromos] = useState(initialData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => promos.filter(p => {
    if (search && !p.code.toLowerCase().includes(search.toLowerCase()) && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== 'All' && p.status !== filterStatus) return false;
    return true;
  }), [promos, search, filterStatus]);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = p => { setEditing(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };
  const handleSave = data => {
    if (editing) setPromos(prev => prev.map(p => p.id === data.id ? data : p));
    else setPromos(prev => [...prev, data]);
    closeModal();
  };
  const handleDelete = id => { setPromos(prev => prev.filter(p => p.id !== id)); closeModal(); };
  const toggleStatus = id => setPromos(prev => prev.map(p => p.id === id ? {...p, status: p.status==='Active'?'Paused':'Active'} : p));

  const typeLabel = t => PROMO_TYPES.find(x=>x.id===t)?.label || t;
  const active = promos.filter(p=>p.status==='Active').length;

  return (
    <div style={{padding:'28px 32px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:'Google Sans',fontSize:22,fontWeight:700,color:'var(--db-text)',margin:0}}>Promotions</h1>
          <p style={{margin:'4px 0 0',fontSize:13,color:'var(--db-text-3)'}}>{promos.length} total · {active} active</p>
        </div>
        <button className="db-btn db-btn-primary" onClick={openAdd}>+ Create Promotion</button>
      </div>
      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        <input className="db-input" style={{width:220}} placeholder="Search code or title…" value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="db-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option>Active</option><option>Paused</option>
        </select>
      </div>
      <div className="db-table-wrap">
        <table className="db-table">
          <thead>
            <tr>
              <th>Code</th><th>Title</th><th>Type</th><th>Value</th>
              <th>Min. Order</th><th>Usage</th><th>Expiry</th><th>Status</th><th style={{width:120}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={9} style={{textAlign:'center',padding:40,color:'var(--db-text-3)'}}>No promotions found</td></tr>
              : filtered.map(p => (
              <tr key={p.id}>
                <td><span style={{fontFamily:'var(--font-mono)',fontWeight:700,fontSize:13,color:'var(--db-accent)'}}>{p.code}</span></td>
                <td style={{maxWidth:180,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.title}</td>
                <td style={{fontSize:12,color:'var(--db-text-2)',whiteSpace:'nowrap'}}>{typeLabel(p.type)}</td>
                <td style={{fontWeight:600}}>
                  {p.type==='percentage'?`${p.value}%`:p.type==='flat'?`₹${p.value}`:p.value}
                </td>
                <td>{p.minOrder ? `₹${p.minOrder}` : '—'}</td>
                <td style={{fontSize:12}}>{p.usageCount}{p.usageLimit?`/${p.usageLimit}`:''}</td>
                <td style={{fontSize:12,color:'var(--db-text-3)',whiteSpace:'nowrap'}}>{p.endDate || '—'}</td>
                <td>
                  <span className={`db-status-badge ${p.status==='Active'?'db-promo-active':'db-promo-paused'}`}>{p.status}</span>
                </td>
                <td>
                  <div style={{display:'flex',gap:6}}>
                    <button className="db-action-btn" onClick={()=>openEdit(p)}>Edit</button>
                    <button className="db-action-btn" onClick={()=>toggleStatus(p.id)} title={p.status==='Active'?'Pause':'Activate'}>
                      {p.status==='Active'?'⏸':'▶'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && <PromoModal promo={editing} onSave={handleSave} onClose={closeModal} onDelete={handleDelete} />}
    </div>
  );
}
