// ─── Staff Management Dummy Data ──────────────────────────────────────────
// Replace these exports with API calls when backend is ready.

export const staffRoles = ['Owner', 'Manager', 'Kitchen Staff', 'Waiter'];

export const defaultPermissionsByRole = {
  Owner: ['View Menu', 'Edit Menu', 'View Orders', 'View Analytics', 'Manage Staff', 'Billing & Settings'],
  Manager: ['View Menu', 'Edit Menu', 'View Orders', 'View Analytics', 'Manage Staff'],
  'Kitchen Staff': ['View Orders', 'Kitchen Display'],
  Waiter: ['View Menu', 'View Orders', 'Print Bills', 'View Tables'],
};

export const allPermissionsList = [
  'View Menu',
  'Edit Menu',
  'View Orders',
  'View Analytics',
  'Manage Staff',
  'Billing & Settings',
  'Kitchen Display',
  'Print Bills',
  'View Tables',
];

export const initialStaffData = [
  {
    id: 'staff-001',
    name: 'Arjun Mehta',
    role: 'Owner',
    email: 'arjun@spiceroute.in',
    phone: '+91-98765-43210',
    status: 'Active',
    lastActive: 'Just now',
    online: true,
    permissions: defaultPermissionsByRole.Owner,
  },
  {
    id: 'staff-002',
    name: 'Raj Kumar',
    role: 'Manager',
    email: 'raj.kumar@spiceroute.in',
    phone: '+91-98111-22334',
    status: 'Active',
    lastActive: '2 mins ago',
    online: true,
    permissions: defaultPermissionsByRole.Manager,
  },
  {
    id: 'staff-003',
    name: 'Chef Anand V.',
    role: 'Kitchen Staff',
    email: 'anand.chef@spiceroute.in',
    phone: '+91-98222-33445',
    status: 'Active',
    lastActive: '5 mins ago',
    online: true,
    permissions: defaultPermissionsByRole['Kitchen Staff'],
  },
  {
    id: 'staff-004',
    name: 'Priya Sharma',
    role: 'Waiter',
    email: 'priya.s@spiceroute.in',
    phone: '+91-98333-44556',
    status: 'Active',
    lastActive: '18 mins ago',
    online: false,
    permissions: defaultPermissionsByRole.Waiter,
  },
  {
    id: 'staff-005',
    name: 'Vikram Rao',
    role: 'Waiter',
    email: 'vikram.r@spiceroute.in',
    phone: '+91-98444-55667',
    status: 'Inactive',
    lastActive: '3 days ago',
    online: false,
    permissions: defaultPermissionsByRole.Waiter,
  },
];

// Alias for convenience
export const staffData = initialStaffData;
