'use client';
import React, { useState, useMemo } from 'react';
import { staffData as initialData } from '../data/staffData';

const ROLES = ['Owner', 'Manager', 'Kitchen Staff', 'Waiter'];
const ROLE_PERMISSIONS = {
  Owner: ['View Menu','Edit Menu','View Orders','Edit Orders','View Analytics','Manage Staff','Manage Settings'],
  Manager: ['View Menu','Edit Menu','View Orders','Edit Orders','View Analytics','Manage Staff'],
  'Kitchen Staff': ['View Menu','View Orders','Edit Orders'],
  Waiter: ['View Menu','View Orders'],
};
const ROLE_CLASS = {
  Owner: 'db-role-owner', Manager: 'db-role-manager',
  'Kitchen Staff': 'db-role-kitchen', Waiter: 'db-role-waiter',
};
const ALL_PERMISSIONS = ['View Menu','Edit Menu','View Orders','Edit Orders','View Analytics','Manage Staff','Manage Settings'];

function pwStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '#ddd' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const m = [{label:'Weak',color:'#ef4444'},{label:'Fair',color:'#f59e0b'},{label:'Good',color:'#3b82f6'},{label:'Strong',color:'#22c55e'},{label:'Strong',color:'#22c55e'}];
  return { score: s, ...m[s] };
}
function genPw() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  return Array.from({length:12},()=>c[Math.floor(Math.random()*c.length)]).join('');
}

function StaffModal({ member, onSave, onClose, onDelete }) {
  const isEdit = !!member;
  const [form, setForm] = useState(
    isEdit ? { ...member, password: '', permissions: [...(member.permissions || ROLE_PERMISSIONS[member.role] || [])] }
           : { name:'', email:'', phone:'', role:'Waiter', password:'', status:'Active', permissions:[...ROLE_PERMISSIONS['Waiter']] }
  );
  const [showPw, setShowPw] = useState(false);
  const [genRandom, setGenRandom] = useState(false);
  const [errors, setErrors] = useState({});
  const pwInfo = pwStrength(form.password);

  const set = (k, v) => { setForm(f => ({...f, [k]: v})); setErrors(e => ({...e, [k]: undefined})); };
  const changeRole = r => setForm(f => ({...f, role: r, permissions: [...ROLE_PERMISSIONS[r]]}));
  const togglePerm = p => setForm(f => ({...f, permissions: f.permissions.includes(p) ? f.permissions.filter(x=>x!==p) : [...f.permissions, p]}));
  const handleGen = ch => { setGenRandom(ch); if (ch) set('password', genPw()); else set('password', ''); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim() || !/\S+@\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!isEdit && !form.password) e.password = 'Password required';
    if (!isEdit && form.password && pwInfo.score < 2) e.password = 'Password too weak';
    return e;
  };
  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, id: member?.id || Date.now(), lastActive: 'Just now' });
  };

  return (
    <div className="db-modal-overlay" onClick={onClose}>
      <div className="db-modal" style={{maxWidth:580,width:'100%'}} onClick={e=>e.stopPropagation()}>
        <div className="db-modal-header">
          <span className="db-modal-title">{isEdit ? 'Edit Staff Member' : 'Add New Staff Member'}</span>
          <button className="db-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="db-modal-body" style={{maxHeight:'74vh',overflowY:'auto',padding:'24px 28px'}}>
          <div className="db-form-section-label">Basic Information</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div className="db-form-group">
              <label className="db-form-label">Full Name *</label>
              <input className={`db-input${errors.name?' error':''}`} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Raj Kumar" />
              {errors.name && <span className="db-field-error">{errors.name}</span>}
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Phone *</label>
              <input className={`db-input${errors.phone?' error':''}`} value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+91-XXXXXXXXXX" />
              {errors.phone && <span className="db-field-error">{errors.phone}</span>}
            </div>
          </div>
          <div className="db-form-group" style={{marginBottom:16}}>
            <label className="db-form-label">Email *</label>
            <input className={`db-input${errors.email?' error':''}`} value={form.email} onChange={e=>set('email',e.target.value)} placeholder="staff@example.com" type="email" />
            {errors.email && <span className="db-field-error">{errors.email}</span>}
          </div>
          <div className="db-form-section-label" style={{marginTop:8}}>{isEdit ? 'Change Password (leave blank to keep)' : 'Set Password *'}</div>
          <div className="db-toggle-wrapper" style={{marginBottom:10}}>
            <label className="db-toggle">
              <input type="checkbox" checked={genRandom} onChange={e=>handleGen(e.target.checked)} />
              <span className="db-toggle-slider" />
            </label>
            <span style={{fontSize:13,color:'var(--db-text-2)'}}>Generate random password</span>
          </div>
          <div className="db-form-group" style={{marginBottom:4}}>
            <div style={{position:'relative'}}>
              <input className={`db-input${errors.password?' error':''}`} value={form.password}
                onChange={e=>{setGenRandom(false);set('password',e.target.value);}}
                type={showPw?'text':'password'} placeholder="Min. 8 characters" disabled={genRandom} style={{paddingRight:44}} />
              <button type="button" style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--db-text-3)',fontSize:13}}
                onClick={()=>setShowPw(s=>!s)}>{showPw?'🙈':'👁️'}</button>
            </div>
            {form.password && (
              <div>
                <div className="db-password-strength-bar">
                  <div className="db-password-strength-fill" style={{width:`${(pwInfo.score/4)*100}%`,backgroundColor:pwInfo.color}} />
                </div>
                <span style={{fontSize:11,color:pwInfo.color,fontWeight:600}}>{pwInfo.label}</span>
              </div>
            )}
            {errors.password && <span className="db-field-error">{errors.password}</span>}
          </div>
          <div className="db-form-section-label" style={{marginTop:20}}>Role</div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:16}}>
            {ROLES.map(r => (
              <button key={r} type="button" onClick={()=>changeRole(r)} style={{
                padding:'6px 14px',
                border:`2px solid ${form.role===r?'var(--db-accent)':'var(--db-border)'}`,
                background:form.role===r?'rgba(200,90,50,0.08)':'#fff',
                color:form.role===r?'var(--db-accent)':'var(--db-text-2)',
                fontFamily:'var(--font-mono)',fontSize:12,fontWeight:600,cursor:'pointer',letterSpacing:'0.04em',transition:'all 130ms ease',
              }}>{r}</button>
            ))}
          </div>
          <div className="db-form-section-label">Permissions</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
            {ALL_PERMISSIONS.map(p => (
              <label key={p} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
                <input type="checkbox" checked={form.permissions.includes(p)} onChange={()=>togglePerm(p)} style={{accentColor:'var(--db-accent)'}} />
                <span style={{fontSize:13,color:'var(--db-text-2)'}}>{p}</span>
              </label>
            ))}
          </div>
          <div className="db-form-section-label">Status</div>
          <div style={{display:'flex',gap:16,marginBottom:8}}>
            {['Active','Inactive'].map(s => (
              <label key={s} style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer',fontSize:13}}>
                <input type="radio" name="staff-status" value={s} checked={form.status===s} onChange={()=>set('status',s)} style={{accentColor:'var(--db-accent)'}} />
                {s}
              </label>
            ))}
          </div>
        </div>
        <div className="db-modal-footer">
          {isEdit && <button className="db-btn db-btn-danger" style={{marginRight:'auto'}} onClick={()=>onDelete(member.id)}>Delete</button>}
          <button className="db-btn db-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="db-btn db-btn-primary" onClick={submit}>{isEdit?'Save Changes':'Add Staff Member'}</button>
        </div>
      </div>
    </div>
  );
}

export default function StaffPage() {
  const [staff, setStaff] = useState(initialData);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => staff.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterRole !== 'All' && s.role !== filterRole) return false;
    if (filterStatus !== 'All' && s.status !== filterStatus) return false;
    return true;
  }), [staff, search, filterRole, filterStatus]);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = m => { setEditing(m); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };
  const handleSave = data => {
    if (editing) setStaff(prev => prev.map(s => s.id === data.id ? data : s));
    else setStaff(prev => [...prev, data]);
    closeModal();
  };
  const handleDelete = id => { setStaff(prev => prev.filter(s => s.id !== id)); closeModal(); };
  const online = staff.filter(s => s.status === 'Active').length;

  return (
    <div style={{padding:'28px 32px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:'Google Sans',fontSize:22,fontWeight:700,color:'var(--db-text)',margin:0}}>Staff Management</h1>
          <p style={{margin:'4px 0 0',fontSize:13,color:'var(--db-text-3)'}}>{staff.length} total · {online} active</p>
        </div>
        <button className="db-btn db-btn-primary" onClick={openAdd}>+ Add Staff Member</button>
      </div>
      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        <input className="db-input" style={{width:220}} placeholder="Search name or email…" value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="db-select" value={filterRole} onChange={e=>setFilterRole(e.target.value)}>
          <option value="All">All Roles</option>
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
        <select className="db-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <div className="db-table-wrap">
        <table className="db-table">
          <thead>
            <tr>
              <th style={{width:36}}></th>
              <th>Name</th><th>Role</th><th>Email</th><th>Phone</th>
              <th>Status</th><th>Last Active</th><th style={{width:130}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'var(--db-text-3)'}}>No staff members found</td></tr>
              : filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <div style={{width:32,height:32,borderRadius:'50%',background:'var(--db-accent)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700}}>
                    {s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                </td>
                <td style={{fontWeight:600,color:'var(--db-text)',whiteSpace:'nowrap'}}>{s.name}</td>
                <td><span className={`db-role-badge ${ROLE_CLASS[s.role] || 'db-role-waiter'}`}>{s.role}</span></td>
                <td style={{whiteSpace:'nowrap'}}>{s.email}</td>
                <td style={{whiteSpace:'nowrap'}}>{s.phone}</td>
                <td>
                  <span className={`db-status-badge ${s.status==='Active'?'db-status-available':'db-status-unavailable'}`}>{s.status}</span>
                </td>
                <td style={{fontSize:12,color:'var(--db-text-3)',whiteSpace:'nowrap'}}>{s.lastActive}</td>
                <td>
                  <div style={{display:'flex',gap:6}}>
                    <button className="db-action-btn" onClick={()=>openEdit(s)}>Edit</button>
                    <button className="db-action-btn db-action-btn-danger" onClick={()=>setStaff(prev=>prev.filter(x=>x.id!==s.id))}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && <StaffModal member={editing} onSave={handleSave} onClose={closeModal} onDelete={handleDelete} />}
    </div>
  );
}
