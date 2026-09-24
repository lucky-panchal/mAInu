'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag, Grid2X2,
  QrCode, Flame, Users, BarChart2, Tag, Settings, CreditCard,
  LogOut
} from 'lucide-react';
import { restaurantInfo } from '../data/dashboardData';

const NAV_ITEMS = [
  { label: 'Dashboard',        icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Menu Management',  icon: UtensilsCrossed,  href: '/dashboard/menu' },
  { label: 'Orders',           icon: ShoppingBag,      href: '/dashboard/orders' },
  { label: 'Tables',           icon: Grid2X2,          href: '/dashboard/tables' },
  { label: 'QR Codes',         icon: QrCode,           href: '/dashboard/qr-codes' },
  { label: 'Kitchen Display',  icon: Flame,            href: '/dashboard/kds' },
  { label: 'Staff',            icon: Users,            href: '/dashboard/staff' },
  { label: 'Customers',        icon: Users,            href: '/dashboard/customers' },
  { label: 'Analytics',        icon: BarChart2,        href: '/dashboard/analytics' },
  { label: 'Promotions',       icon: Tag,              href: '/dashboard/promotions' },
  { label: 'Settings',         icon: Settings,         href: '/dashboard/settings' },
  { label: 'Subscription',     icon: CreditCard,       href: '/dashboard/subscription' },
];

export default function Sidebar() {
  const pathname = usePathname() || '/dashboard';

  const isItemActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside className="db-sidebar">
      {/* Logo */}
      <Link className="db-sidebar-logo" href="/">
        <div className="db-sidebar-logo-mark">
          <span>m</span>
        </div>
        <span className="db-sidebar-logo-name">mAInu</span>
      </Link>

      {/* Nav */}
      <nav className="db-sidebar-nav">
        <div className="db-nav-section-label">Main Menu</div>
        {NAV_ITEMS.slice(0, 6).map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`db-nav-item${active ? ' active' : ''}`}
            >
              <Icon size={16} className="db-nav-icon" strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </Link>
          );
        })}

        <div className="db-nav-section-label">Management</div>
        {NAV_ITEMS.slice(6).map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`db-nav-item${active ? ' active' : ''}`}
            >
              <Icon size={16} className="db-nav-icon" strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="db-sidebar-footer">
        <div className="db-sidebar-restaurant">{restaurantInfo.name}</div>
        <span className="db-sidebar-plan">{restaurantInfo.plan}</span>
      </div>
    </aside>
  );
}

