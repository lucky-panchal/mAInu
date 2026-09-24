// ─── Dashboard Shared Layout ─────────────────────────────────────────────
// Wraps ALL /dashboard/* routes with Sidebar + TopNav + CSS.
// Individual pages only need to render their <main> content.

import './dashboard.css';
import Sidebar from './components/Sidebar';
import TopNav  from './components/TopNav';

export const metadata = {
  title: 'Admin — mAInu',
  description: 'mAInu restaurant admin dashboard',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="db-shell">
      <Sidebar />
      <div className="db-main">
        <TopNav />
        {children}
      </div>
    </div>
  );
}
