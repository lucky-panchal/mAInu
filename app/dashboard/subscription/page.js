'use client';
import React, { useState } from 'react';

const PLANS = [
  {
    id: 'starter', name: 'Starter', price: 999, period: 'mo',
    desc: 'Perfect for small cafes and food stalls',
    features: ['Up to 10 menu items','5 tables','Basic analytics','Email support','QR code ordering'],
    notIncluded: ['Staff management','Promotions','KDS','Priority support'],
  },
  {
    id: 'growth', name: 'Growth', price: 2499, period: 'mo',
    desc: 'Ideal for growing restaurants', popular: true,
    features: ['Unlimited menu items','25 tables','Advanced analytics','Staff management','Promotions & coupons','KDS display','Priority email support','QR code ordering'],
    notIncluded: ['White-label','API access'],
  },
  {
    id: 'pro', name: 'Pro', price: 4999, period: 'mo',
    desc: 'For multi-outlet and high-volume restaurants',
    features: ['Everything in Growth','Multi-outlet support','White-label branding','API access','Dedicated account manager','Custom integrations','24/7 phone support'],
    notIncluded: [],
  },
];

const INVOICES = [
  { id:'INV-2026-09', date:'01 Sep 2026', amount:'₹2,499', status:'Paid' },
  { id:'INV-2026-08', date:'01 Aug 2026', amount:'₹2,499', status:'Paid' },
  { id:'INV-2026-07', date:'01 Jul 2026', amount:'₹2,499', status:'Paid' },
  { id:'INV-2026-06', date:'01 Jun 2026', amount:'₹2,499', status:'Paid' },
];

export default function SubscriptionPage() {
  const [current, setCurrent] = useState('growth');
  const [billing, setBilling] = useState('monthly');

  const getPrice = plan => billing==='annual'
    ? Math.round(plan.price * 0.8)
    : plan.price;

  return (
    <div style={{padding:'28px 32px'}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontFamily:'Google Sans',fontSize:22,fontWeight:700,color:'var(--db-text)',margin:0}}>Subscription & Billing</h1>
        <p style={{margin:'4px 0 0',fontSize:13,color:'var(--db-text-3)'}}>Manage your plan and invoices</p>
      </div>

      {/* Current Plan Banner */}
      <div style={{background:'linear-gradient(135deg,#c85a32,#a04020)',color:'#fff',padding:'24px 28px',marginBottom:28,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:12,opacity:0.75,marginBottom:4,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:'var(--font-mono)'}}>Current Plan</div>
          <div style={{fontFamily:'Google Sans',fontSize:28,fontWeight:800}}>Growth <span className="db-plan-badge" style={{background:'rgba(255,255,255,0.2)',fontSize:12}}>Active</span></div>
          <div style={{fontSize:13,opacity:0.8,marginTop:4}}>Renews on 01 Oct 2026 · ₹2,499/mo</div>
        </div>
        <button style={{padding:'10px 20px',background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',color:'#fff',cursor:'pointer',fontSize:13,fontWeight:600}}>
          Manage Billing
        </button>
      </div>

      {/* Billing Toggle */}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24,justifyContent:'center'}}>
        <span style={{fontSize:13,fontWeight:600,color:billing==='monthly'?'var(--db-text)':'var(--db-text-3)'}}>Monthly</span>
        <label className="db-toggle">
          <input type="checkbox" checked={billing==='annual'} onChange={e=>setBilling(e.target.checked?'annual':'monthly')} />
          <span className="db-toggle-slider" />
        </label>
        <span style={{fontSize:13,fontWeight:600,color:billing==='annual'?'var(--db-text)':'var(--db-text-3)'}}>
          Annual <span style={{fontSize:11,background:'var(--db-green-bg)',color:'var(--db-green)',padding:'1px 6px',fontWeight:700}}>Save 20%</span>
        </span>
      </div>

      {/* Plan Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:32}}>
        {PLANS.map(plan => (
          <div key={plan.id} style={{
            border:`2px solid ${current===plan.id?'var(--db-accent)':plan.popular?'rgba(200,90,50,0.3)':'var(--db-border)'}`,
            background:current===plan.id?'rgba(200,90,50,0.03)':'#fff',
            padding:'24px',
            position:'relative',
          }}>
            {plan.popular && (
              <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'var(--db-accent)',color:'#fff',padding:'3px 14px',fontSize:11,fontWeight:700,letterSpacing:'0.05em',whiteSpace:'nowrap'}}>
                MOST POPULAR
              </div>
            )}
            {current===plan.id && (
              <div style={{position:'absolute',top:12,right:12,background:'var(--db-accent)',color:'#fff',padding:'2px 8px',fontSize:10,fontWeight:700}}>CURRENT</div>
            )}
            <div style={{fontFamily:'Google Sans',fontSize:20,fontWeight:800,color:'var(--db-text)',marginBottom:4}}>{plan.name}</div>
            <div style={{fontSize:12,color:'var(--db-text-3)',marginBottom:16}}>{plan.desc}</div>
            <div style={{fontFamily:'Google Sans',fontSize:32,fontWeight:800,color:'var(--db-accent)',marginBottom:4}}>
              ₹{getPrice(plan).toLocaleString('en-IN')}
              <span style={{fontSize:13,color:'var(--db-text-3)',fontWeight:400}}>/{billing==='annual'?'mo*':'mo'}</span>
            </div>
            {billing==='annual'&&<div style={{fontSize:11,color:'var(--db-text-3)',marginBottom:16}}>*billed ₹{(getPrice(plan)*12).toLocaleString('en-IN')}/yr</div>}
            <button
              className={`db-btn ${current===plan.id?'db-btn-secondary':'db-btn-primary'}`}
              style={{width:'100%',justifyContent:'center',marginBottom:20,marginTop:billing!=='annual'?16:0}}
              onClick={()=>setCurrent(plan.id)}
            >
              {current===plan.id?'Current Plan':'Upgrade'}
            </button>
            <div style={{fontSize:12,color:'var(--db-text-2)'}}>
              {plan.features.map((f,i)=>(
                <div key={i} style={{display:'flex',gap:6,marginBottom:6}}>
                  <span style={{color:'var(--db-green)',fontWeight:700}}>✓</span> {f}
                </div>
              ))}
              {plan.notIncluded.map((f,i)=>(
                <div key={i} style={{display:'flex',gap:6,marginBottom:6,opacity:0.4}}>
                  <span style={{fontWeight:700}}>✕</span> {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Invoices */}
      <div style={{background:'#fff',border:'1px solid var(--db-border)',padding:'24px'}}>
        <div style={{fontFamily:'Google Sans',fontSize:16,fontWeight:700,color:'var(--db-text)',marginBottom:16}}>Billing History</div>
        <div className="db-table-wrap">
          <table className="db-table">
            <thead><tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {INVOICES.map(inv=>(
                <tr key={inv.id}>
                  <td style={{fontFamily:'var(--font-mono)',fontSize:13,fontWeight:700}}>{inv.id}</td>
                  <td style={{fontSize:13,color:'var(--db-text-2)'}}>{inv.date}</td>
                  <td style={{fontWeight:700,color:'var(--db-accent)'}}>{inv.amount}</td>
                  <td><span className="db-status-badge db-status-available">{inv.status}</span></td>
                  <td><button className="db-action-btn">Download PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
