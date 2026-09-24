'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Printer, MessageCircle, RefreshCw, Edit3, XCircle,
  CheckCircle2, Clock, CreditCard, User, Utensils
} from 'lucide-react';
import { ordersData, orderStatuses } from '../../data/ordersData';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id;

  const foundOrder = useMemo(() => {
    return ordersData.find((o) => o.id === orderId) || ordersData[0];
  }, [orderId]);

  const [order, setOrder] = useState(foundOrder);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = (newStatus) => {
    setOrder((prev) => ({ ...prev, status: newStatus }));
    showToast(`Order status updated to "${newStatus}"`);
  };

  const handleCancelOrder = () => {
    if (window.confirm(`Are you sure you want to cancel order #${order.id}?`)) {
      setOrder((prev) => ({ ...prev, status: 'Cancelled' }));
      showToast(`Order #${order.id} has been cancelled.`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    showToast(`Receipt link sent via WhatsApp to ${order.customer?.phone || 'customer'}`);
  };

  const getStatusClass = (st) => {
    switch (st) {
      case 'Pending':
        return 'db-status-pending';
      case 'Preparing':
        return 'db-status-preparing';
      case 'Ready':
        return 'db-status-ready';
      case 'Served':
        return 'db-status-served';
      case 'Cancelled':
        return 'db-status-cancelled';
      default:
        return 'db-status-unavailable';
    }
  };

  // Tax calculations
  const subtotal = order.subtotal || order.items.reduce((s, i) => s + i.subtotal, 0);
  const cgst = Math.round(subtotal * 0.025);
  const sgst = Math.round(subtotal * 0.025);
  const totalTax = cgst + sgst;
  const discount = order.discount || 0;
  const serviceCharge = order.serviceCharge || 0;
  const grandTotal = subtotal + totalTax - discount + serviceCharge;

  return (
    <main className="db-content" id="db-order-detail-page">
      {/* 80mm ESC/POS Thermal Receipt - Visible ONLY in Print */}
      <div className="db-thermal-receipt-print">
        <div className="thermal-header">
          <div className="thermal-brand">THE SPICE ROUTE</div>
          <div className="thermal-sub">100ft Road, Indiranagar, Bangalore - 560038</div>
          <div className="thermal-meta">GSTIN: 29ABCDE1234F1Z5 &bull; FSSAI: 11224333000841</div>
          <div className="thermal-meta">Ph: +91-80-4123-9876</div>
        </div>

        <div className="thermal-divider" />

        <div className="thermal-row">
          <span>TAX INVOICE / KOT</span>
          <span>#{order.id}</span>
        </div>
        <div className="thermal-row">
          <span>Date: {order.date}</span>
          <span>Time: {order.time}</span>
        </div>
        <div className="thermal-row">
          <span>Table: {order.table}</span>
          <span>Server: Vikram S.</span>
        </div>
        {order.customer?.name && (
          <div className="thermal-row">
            <span>Guest: {order.customer.name}</span>
            <span>{order.customer.phone || ''}</span>
          </div>
        )}

        <div className="thermal-divider" />

        <table className="thermal-items-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>ITEM</th>
              <th style={{ textAlign: 'center', width: '32px' }}>QTY</th>
              <th style={{ textAlign: 'right', width: '55px' }}>RATE</th>
              <th style={{ textAlign: 'right', width: '60px' }}>AMT</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it, idx) => (
              <tr key={idx}>
                <td>
                  <div>{it.name}</div>
                  {it.specialRequest && <div className="thermal-item-note">* {it.specialRequest}</div>}
                </td>
                <td style={{ textAlign: 'center' }}>{it.qty}</td>
                <td style={{ textAlign: 'right' }}>{it.unitPrice}</td>
                <td style={{ textAlign: 'right' }}>{it.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="thermal-divider" />

        <div className="thermal-row">
          <span>Item Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="thermal-row">
          <span>CGST (2.5%):</span>
          <span>₹{cgst.toFixed(2)}</span>
        </div>
        <div className="thermal-row">
          <span>SGST (2.5%):</span>
          <span>₹{sgst.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="thermal-row">
            <span>Discount:</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="thermal-divider" />
        <div className="thermal-row thermal-total">
          <span>GRAND TOTAL:</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
        <div className="thermal-divider" />

        <div className="thermal-row">
          <span>Payment Status:</span>
          <span>{order.paymentStatus} ({order.paymentMethod || 'Pay at Counter'})</span>
        </div>

        <div className="thermal-qr-section">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=mainu@icici&pn=The%20Spice%20Route&am=${grandTotal}&cu=INR`}
            alt="UPI QR"
            width={95}
            height={95}
            style={{ display: 'block', margin: '0 auto' }}
          />
          <div className="thermal-qr-text">Scan via any UPI App to Pay</div>
        </div>

        <div className="thermal-footer">
          <div>Thank you for dining with us!</div>
          <div>For feedback: feedback@spiceroute.in</div>
          <div style={{ marginTop: 4 }}>*** End of Receipt ***</div>
        </div>
      </div>

      {/* Screen Interactive Container */}
      <div className="db-order-detail-screen">
        {/* Toast alert */}
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

      {/* Back button & Breadcrumb */}
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/dashboard/orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--db-text-2)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={15} />
          Back to Orders List
        </Link>
      </div>

      {/* Header section */}
      <div
        className="db-page-header"
        style={{
          background: '#ffffff',
          border: '1px solid var(--db-border)',
          padding: '20px 24px',
          marginBottom: '24px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <h1 style={{ fontFamily: 'Google Sans', fontSize: '22px', fontWeight: 700, margin: 0 }}>
              Order #{order.id}
            </h1>
            <span className={`db-status-badge ${getStatusClass(order.status)}`}>
              <span className="db-status-dot" />
              {order.status}
            </span>
          </div>

          <p className="db-page-subtitle" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={14} color="var(--db-text-3)" />
            Placed at {order.time}, {order.date} &bull; {order.duration || '15 mins'} active
          </p>
        </div>

        {/* Change status selector & Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--db-text-3)' }}>
              CHANGE STATUS:
            </span>
            <select
              className="db-filter-select"
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              aria-label="Change order status"
            >
              {orderStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="db-btn db-btn-outline"
            onClick={handlePrint}
            title="Print thermal bill"
          >
            <Printer size={15} />
            Print Bill
          </button>

          <button
            type="button"
            className="db-btn db-btn-secondary"
            onClick={handleSendWhatsApp}
            title="Send receipt to customer via WhatsApp"
          >
            <MessageCircle size={15} />
            Send Receipt
          </button>

          {order.status !== 'Cancelled' && (
            <button
              type="button"
              className="db-btn db-btn-danger"
              onClick={handleCancelOrder}
              title="Cancel this order"
            >
              <XCircle size={15} />
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Main 2-column Grid */}
      <div className="db-order-detail-grid">
        {/* Left Column: Items Table */}
        <div>
          <div className="db-table-card" style={{ marginBottom: 24 }}>
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--db-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Utensils size={16} color="var(--db-accent)" />
                <h2 style={{ fontFamily: 'Google Sans', fontSize: '16px', fontWeight: 700, margin: 0 }}>
                  Ordered Items ({order.items.length})
                </h2>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--db-text-3)' }}>
                Table {order.table}
              </span>
            </div>

            <table className="db-data-table">
              <thead>
                <tr>
                  <th>Item Name &amp; Instructions</th>
                  <th style={{ textAlign: 'center', width: '70px' }}>Qty</th>
                  <th style={{ textAlign: 'right', width: '100px' }}>Unit Price</th>
                  <th style={{ textAlign: 'right', width: '110px' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--db-text)' }}>{item.name}</span>
                        {item.specialRequest && (
                          <div
                            style={{
                              marginTop: 4,
                              fontSize: '11.5px',
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--db-accent)',
                              background: 'var(--db-accent-dim2)',
                              padding: '2px 6px',
                              display: 'inline-block',
                            }}
                          >
                            Note: {item.specialRequest}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      ×{item.qty}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                      ₹{item.unitPrice}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      ₹{item.subtotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Billing Summary & Customer Details */}
        <div>
          {/* Billing Summary Card */}
          <div className="db-detail-card">
            <h3 className="db-detail-card-title">Billing Summary</h3>

            <div className="db-receipt-line">
              <span>Items Subtotal</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>₹{subtotal}</span>
            </div>

            <div className="db-receipt-line">
              <span>CGST (2.5%)</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>₹{cgst}</span>
            </div>

            <div className="db-receipt-line">
              <span>SGST (2.5%)</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>₹{sgst}</span>
            </div>

            {discount > 0 && (
              <div className="db-receipt-line" style={{ color: 'var(--db-green)' }}>
                <span>Discount</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>-₹{discount}</span>
              </div>
            )}

            {serviceCharge > 0 && (
              <div className="db-receipt-line">
                <span>Service Charge</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>₹{serviceCharge}</span>
              </div>
            )}

            <div className="db-receipt-line db-receipt-total">
              <span>Final Total</span>
              <span style={{ color: 'var(--db-accent)', fontFamily: 'var(--font-mono)', fontSize: '18px' }}>
                ₹{grandTotal}
              </span>
            </div>
          </div>

          {/* Customer & Table Info Card */}
          <div className="db-detail-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <User size={16} color="var(--db-accent)" />
              <h3 className="db-detail-card-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                Guest &amp; Table Info
              </h3>
            </div>

            <div className="db-receipt-line">
              <span>Table Assignment</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{order.table}</span>
            </div>

            <div className="db-receipt-line">
              <span>Order Type</span>
              <span>Dine-In (QR Self-Order)</span>
            </div>

            <div className="db-receipt-line">
              <span>Customer Name</span>
              <span>{order.customer?.name || 'Walk-in Guest'}</span>
            </div>

            <div className="db-receipt-line">
              <span>Phone</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {order.customer?.phone || 'Not provided'}
              </span>
            </div>

            <div className="db-receipt-line">
              <span>Email</span>
              <span style={{ fontSize: '12px' }}>
                {order.customer?.email || 'Not provided'}
              </span>
            </div>
          </div>

          {/* Payment Information Card */}
          <div className="db-detail-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <CreditCard size={16} color="var(--db-accent)" />
              <h3 className="db-detail-card-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                Payment Status
              </h3>
            </div>

            <div className="db-receipt-line">
              <span>Status</span>
              <span
                className={`db-payment-badge ${
                  order.paymentStatus === 'Paid' ? 'db-payment-paid' : 'db-payment-unpaid'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>

            <div className="db-receipt-line">
              <span>Method</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {order.paymentMethod || 'Pay at Counter / Cash'}
              </span>
            </div>

            {order.transactionId && (
              <div className="db-receipt-line">
                <span>Transaction Ref</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  {order.transactionId}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </main>
);
}
