'use client';

import { Tag, ImagePlus, Monitor, QrCode } from 'lucide-react';

const ACTIONS = [
  {
    id: 'create-promotion',
    label: 'Create Promotion',
    sub: 'Launch a new offer or discount',
    icon: Tag,
    href: '/dashboard/promotions/new',
  },
  {
    id: 'upload-menu-photo',
    label: 'Upload Menu Photo',
    sub: 'Add or update menu images',
    icon: ImagePlus,
    href: '/dashboard/menu/upload',
  },
  {
    id: 'kitchen-display',
    label: 'Kitchen Display',
    sub: 'Open the live KDS view',
    icon: Monitor,
    href: '/dashboard/kds',
  },
  {
    id: 'generate-qr',
    label: 'Generate QR Codes',
    sub: 'Create table QR codes',
    icon: QrCode,
    href: '/dashboard/qr-codes/generate',
  },
];

export default function QuickActions() {
  return (
    <div className="db-qa-card">
      <div className="db-qa-header">
        <div className="db-qa-title">Quick Actions</div>
      </div>
      <div className="db-qa-grid">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <a
              key={action.id}
              id={`qa-${action.id}`}
              href={action.href}
              className="db-qa-btn"
              onClick={(e) => e.preventDefault()}
              aria-label={action.label}
            >
              <Icon size={18} strokeWidth={1.8} className="db-qa-icon" />
              <span className="db-qa-btn-label">{action.label}</span>
              <span className="db-qa-btn-sub">{action.sub}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
