'use client';
import React, { useState } from 'react';

const TABS = ['Restaurant', 'Business Hours', 'Notifications', 'Receipt & Tax', 'Integrations', 'Security'];

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const initHours = DAYS.map(d => ({ day: d, open: true, from: '09:00', to: '22:00' }));

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Restaurant');
  const [restaurant, setRestaurant] = useState({
    name: "mAInu Restaurant", phone: "+91-9876543210", email: "owner@mainu.in",
    address: "123, MG Road, Bangalore", gst: "29ABCDE1234F1Z5",
    currency: "INR", timezone: "Asia/Kolkata",
  });
  const [hours, setHours] = useState(initHours);
  const [notifs, setNotifs] = useState({
    newOrder: true, orderReady: true, lowStock: false, dailyReport: true, sms: false,
  });
  const [receipt, setReceipt] = useState({
    taxRate: '5', serviceCharge: '0', footer: 'Thank you for dining with us! Visit again.',
    showGst: true, showLogo: true,
  });
  const [saved, setSaved] = useState(false);

  const setR = (k,v) => setRestaurant(r=>({...r,[k]:v}));
  const setH = (i,k,v) => setHours(h => h.map((row,j) => j===i?{...row,[k]:v}:row));
  const setN = (k,v) => setNotifs(n=>({...n,[k]:v}));
  const setRec = (k,v) => setReceipt(r=>({...r,[k]:v}));

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };

  const Toggle = ({checked, onChange}) => (
    <label className="db-toggle">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      <span className="db-toggle-slider" />
    </label>
  );

  const renderTab = () => {
    switch(activeTab) {
      case 'Restaurant': return (
        <div className="db-settings-section">
          <div className="db-settings-section-title">Restaurant Profile</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            {[['name','Restaurant Name'],['phone','Phone'],['email','Email'],['address','Address'],['gst','GST Number']].map(([k,label])=>(
              <div key={k} className="db-form-group" style={k==='address'?{gridColumn:'1/-1'}:{}}>
                <label className="db-form-label">{label}</label>
                <input className="db-input" value={restaurant[k]} onChange={e=>setR(k,e.target.value)} />
              </div>
            ))}
            <div className="db-form-group">
              <label className="db-form-label">Currency</label>
              <select className="db-select" value={restaurant.currency} onChange={e=>setR('currency',e.target.value)}>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Timezone</label>
              <select className="db-select" value={restaurant.timezone} onChange={e=>setR('timezone',e.target.value)}>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              </select>
            </div>
          </div>
        </div>
      );
      case 'Business Hours': return (
        <div className="db-settings-section">
          <div className="db-settings-section-title">Business Hours</div>
          <div className="db-hours-grid">
            {hours.map((h,i)=>(
              <div key={h.day} className="db-hours-row">
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <Toggle checked={h.open} onChange={v=>setH(i,'open',v)} />
                  <span className="db-hours-day">{h.day}</span>
                </div>
                {h.open ? (
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <input className="db-input" type="time" value={h.from} onChange={e=>setH(i,'from',e.target.value)} style={{width:110}} />
                    <span style={{fontSize:13,color:'var(--db-text-3)'}}>to</span>
                    <input className="db-input" type="time" value={h.to} onChange={e=>setH(i,'to',e.target.value)} style={{width:110}} />
                  </div>
                ) : <span style={{fontSize:13,color:'var(--db-text-3)'}}>Closed</span>}
              </div>
            ))}
          </div>
        </div>
      );
      case 'Notifications': return (
        <div className="db-settings-section">
          <div className="db-settings-section-title">Notification Preferences</div>
          {[
            ['newOrder',     'New Order Alert',    'Play sound when a new order arrives'],
            ['orderReady',   'Order Ready Alert',  'Notify when kitchen marks order ready'],
            ['lowStock',     'Low Stock Warning',  'Alert when item stock runs low'],
            ['dailyReport',  'Daily Summary Email','Send end-of-day report to email'],
            ['sms',          'SMS Alerts',         'Send SMS for new orders (extra cost)'],
          ].map(([k,label,desc])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:'1px solid var(--db-border)'}}>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:'var(--db-text)'}}>{label}</div>
                <div style={{fontSize:12,color:'var(--db-text-3)'}}>{desc}</div>
              </div>
              <Toggle checked={notifs[k]} onChange={v=>setN(k,v)} />
            </div>
          ))}
        </div>
      );
      case 'Receipt & Tax': return (
        <div className="db-settings-section">
          <div className="db-settings-section-title">Receipt & Tax Settings</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div className="db-form-group">
              <label className="db-form-label">Tax Rate (%)</label>
              <input className="db-input" value={receipt.taxRate} type="number" onChange={e=>setRec('taxRate',e.target.value)} />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Service Charge (%)</label>
              <input className="db-input" value={receipt.serviceCharge} type="number" onChange={e=>setRec('serviceCharge',e.target.value)} />
            </div>
          </div>
          <div className="db-form-group" style={{marginBottom:16}}>
            <label className="db-form-label">Receipt Footer Message</label>
            <textarea className="db-input db-textarea" value={receipt.footer} onChange={e=>setRec('footer',e.target.value)} rows={3} />
          </div>
          {[['showGst','Show GST Number on receipt'],['showLogo','Show restaurant logo on receipt']].map(([k,label])=>(
            <div key={k} className="db-toggle-wrapper" style={{marginBottom:12}}>
              <Toggle checked={receipt[k]} onChange={v=>setRec(k,v)} />
              <span style={{fontSize:13,color:'var(--db-text-2)'}}>{label}</span>
            </div>
          ))}
        </div>
      );
      case 'Integrations': return (
        <div className="db-settings-section">
          <div className="db-settings-section-title">Integrations</div>
          {[
            { name:'Swiggy', desc:'Sync orders from Swiggy', icon:'🟠', connected:false },
            { name:'Zomato', desc:'Sync orders from Zomato', icon:'🔴', connected:false },
            { name:'Razorpay', desc:'Online payment gateway', icon:'💳', connected:true },
            { name:'WhatsApp Business', desc:'Send order updates via WhatsApp', icon:'💬', connected:false },
          ].map((int,i) => (
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:'1px solid var(--db-border)'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:24}}>{int.icon}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:'var(--db-text)'}}>{int.name}</div>
                  <div style={{fontSize:12,color:'var(--db-text-3)'}}>{int.desc}</div>
                </div>
              </div>
              <button className={`db-btn ${int.connected?'db-btn-secondary':'db-btn-primary'}`} style={{fontSize:12,padding:'6px 14px'}}>
                {int.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      );
      case 'Security': return (
        <div className="db-settings-section">
          <div className="db-settings-section-title">Security Settings</div>
          <div className="db-form-group" style={{marginBottom:16}}>
            <label className="db-form-label">Current Password</label>
            <input className="db-input" type="password" placeholder="••••••••" />
          </div>
          <div className="db-form-group" style={{marginBottom:16}}>
            <label className="db-form-label">New Password</label>
            <input className="db-input" type="password" placeholder="Min. 8 characters" />
          </div>
          <div className="db-form-group" style={{marginBottom:24}}>
            <label className="db-form-label">Confirm New Password</label>
            <input className="db-input" type="password" placeholder="Repeat new password" />
          </div>
          <div style={{padding:'16px',background:'rgba(200,90,50,0.04)',border:'1px solid rgba(200,90,50,0.2)',marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,color:'var(--db-accent)',marginBottom:4}}>⚠ Danger Zone</div>
            <div style={{fontSize:12,color:'var(--db-text-2)',marginBottom:12}}>These actions are irreversible. Proceed with caution.</div>
            <button className="db-btn db-btn-danger" style={{fontSize:12}}>Delete Account & All Data</button>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div style={{padding:'28px 32px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:'Google Sans',fontSize:22,fontWeight:700,color:'var(--db-text)',margin:0}}>Settings</h1>
          <p style={{margin:'4px 0 0',fontSize:13,color:'var(--db-text-3)'}}>Manage your restaurant configuration</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {saved && <span style={{fontSize:13,color:'var(--db-green)',fontWeight:600}}>✓ Saved</span>}
          <button className="db-btn db-btn-primary" onClick={save}>Save Changes</button>
        </div>
      </div>
      <div className="db-settings-tabs" style={{marginBottom:24}}>
        {TABS.map(t => (
          <button key={t} className={`db-settings-tab${activeTab===t?' active':''}`} onClick={()=>setActiveTab(t)}>{t}</button>
        ))}
      </div>
      {renderTab()}
    </div>
  );
}
