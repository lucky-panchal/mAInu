'use client';

import RevenueCard      from './components/RevenueCard';
import OrdersCard       from './components/OrdersCard';
import AOVCard          from './components/AOVCard';
import OccupancyCard    from './components/OccupancyCard';
import TopItemsCard     from './components/TopItemsCard';
import PeakHoursCard    from './components/PeakHoursCard';
import SatisfactionCard from './components/SatisfactionCard';
import RecentOrdersTable from './components/RecentOrdersTable';
import QuickActions     from './components/QuickActions';

export default function DashboardPage() {
  return (
    <main className="db-content" id="db-main-content">
      {/* Page header */}
      <div className="db-page-header">
        <div>
          <h1 className="db-page-title">Overview</h1>
          <p className="db-page-subtitle">Saturday, 19 September 2026 — Spice Route</p>
        </div>
        <div className="db-live-badge" aria-live="polite">
          <span className="db-live-dot" aria-hidden="true" />
          Live data
        </div>
      </div>

      {/* Row 1 — Today's Summary */}
      <div className="db-row-label">Today&apos;s Summary</div>
      <div className="db-kpi-row db-kpi-row-1">
        <RevenueCard />
        <OrdersCard />
        <AOVCard />
        <OccupancyCard />
      </div>

      {/* Row 2 — Performance */}
      <div className="db-row-label">Performance Metrics</div>
      <div className="db-kpi-row db-kpi-row-2">
        <TopItemsCard />
        <PeakHoursCard />
        <SatisfactionCard />
      </div>

      {/* Row 3 — Activity + Quick Actions */}
      <div className="db-row-label">Activity &amp; Actions</div>
      <div className="db-kpi-row db-kpi-row-3">
        <RecentOrdersTable />
        <QuickActions />
      </div>
    </main>
  );
}

