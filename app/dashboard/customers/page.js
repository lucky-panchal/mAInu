'use client';
import React, { useState, useMemo } from 'react';
import { customersData } from '../data/customersData';

function Stars({ n }) {
  return (
    <span className="db-star-rating">
      {[1,2,3,4,5].map(i => <span key={i} className="db-star">{i<=n?'★':'☆'}</span>)}
    </span>
  );
}

function CustomerDrawer({ customer, onClose }) {
  if (!customer) return null;
  return (
    <div className="db-modal-overlay" onClick={onClose}>
      <div style={{position:'fixed',top:0,right:0,width:420,height:'100vh',background:'#fff',boxShadow:'-4px 0 24px rgba(0,0,0,0.12)',zIndex:1001,overflowY:'auto',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{padding:'20px 24px',borderBottom:'1px solid var(--db-border)',display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:48,height:48,borderRadius:'50%',background:'var(--db-accent)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700,flexShrink:0}}>
            {customer.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:'Google Sans',fontSize:17,fontWeight:700,color:'var(--db-text)'}}>{customer.name}</div>
            <div style={{fontSize:12,color:'var(--db-text-3)'}}>{customer.email}</div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'var(--db-text-3)',fontSize:18}}>✕</button>
        </div>
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:1,background:'var(--db-border)'}}>
          {[
            { label: 'Total Orders', value: customer.totalOrders },
            { label: 'Total Spent',  value: `₹${customer.totalSpent.toLocaleString('en-IN')}` },
            { label: 'Avg Rating',   value: customer.avgRating },
          ].map((s,i) => (
            <div key={i} style={{background:'#fff',padding:'14px 16px',textAlign:'center'}}>
              <div style={{fontFamily:'Google Sans',fontSize:20,fontWeight:700,color:'var(--db-accent)'}}>{s.value}</div>
              <div style={{fontSize:11,color:'var(--db-text-3)'}}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Details */}
        <div style={{padding:'20px 24px',flex:1}}>
          <div style={{marginBottom:20}}>
            <div className="db-form-section-label">Contact</div>
            <div style={{fontSize:13,color:'var(--db-text-2)',marginBottom:4}}>📞 {customer.phone}</div>
            <div style={{fontSize:13,color:'var(--db-text-2)',marginBottom:4}}>📧 {customer.email}</div>
            <div style={{fontSize:13,color:'var(--db-text-2)'}}>📍 {customer.address || 'Not provided'}</div>
          </div>
          <div style={{marginBottom:20}}>
            <div className="db-form-section-label">Preferences</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {(customer.preferences || []).map((p,i) => (
                <span key={i} style={{padding:'3px 10px',background:'rgba(200,90,50,0.08)',color:'var(--db-accent)',fontSize:12,fontWeight:600}}>{p}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="db-form-section-label">Recent Orders</div>
            {(customer.recentOrders || []).map((o,i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--db-border)'}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--db-text)'}}>{o.id}</div>
                  <div style={{fontSize:11,color:'var(--db-text-3)'}}>{o.date} · {o.items} items</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--db-accent)'}}>₹{o.total}</div>
                  <Stars n={o.rating} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('totalSpent');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = [...customersData];
    if (search) list = list.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );
    list.sort((a,b) => (b[sortBy]||0) - (a[sortBy]||0));
    return list;
  }, [search, sortBy]);

  const totalSpent = customersData.reduce((s,c)=>s+c.totalSpent, 0);

  return (
    <div style={{padding:'28px 32px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:'Google Sans',fontSize:22,fontWeight:700,color:'var(--db-text)',margin:0}}>Customers</h1>
          <p style={{margin:'4px 0 0',fontSize:13,color:'var(--db-text-3)'}}>{customersData.length} customers · ₹{totalSpent.toLocaleString('en-IN')} lifetime revenue</p>
        </div>
      </div>
      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        <input className="db-input" style={{width:260}} placeholder="Search name, email, phone…" value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="db-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="totalSpent">Sort by Spent</option>
          <option value="totalOrders">Sort by Orders</option>
          <option value="avgRating">Sort by Rating</option>
        </select>
      </div>
      <div className="db-table-wrap">
        <table className="db-table">
          <thead>
            <tr>
              <th style={{width:36}}></th>
              <th>Name</th><th>Phone</th><th>Total Orders</th><th>Total Spent</th>
              <th>Avg Rating</th><th>Last Order</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'var(--db-text-3)'}}>No customers found</td></tr>
              : filtered.map(c => (
              <tr key={c.id} style={{cursor:'pointer'}} onClick={()=>setSelected(c)}>
                <td onClick={e=>e.stopPropagation()}>
                  <div style={{width:32,height:32,borderRadius:'50%',background:'#e0d8cf',color:'var(--db-text)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700}}>
                    {c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                </td>
                <td style={{fontWeight:600,color:'var(--db-text)',whiteSpace:'nowrap'}}>{c.name}</td>
                <td style={{whiteSpace:'nowrap',color:'var(--db-text-2)'}}>{c.phone}</td>
                <td style={{fontWeight:600}}>{c.totalOrders}</td>
                <td style={{fontWeight:700,color:'var(--db-accent)'}}>₹{c.totalSpent.toLocaleString('en-IN')}</td>
                <td><Stars n={Math.round(c.avgRating)} /></td>
                <td style={{fontSize:12,color:'var(--db-text-3)',whiteSpace:'nowrap'}}>{c.lastOrder}</td>
                <td onClick={e=>e.stopPropagation()}>
                  <button className="db-action-btn" onClick={()=>setSelected(c)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && <CustomerDrawer customer={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}
