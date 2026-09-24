// ─── mAInu Dashboard Dummy Data ────────────────────────────────────────────
// All data is isolated here. When backend is ready, replace these exports
// with API fetching logic — no component changes required.

export const restaurantInfo = {
  name: 'Spice Route',
  plan: 'Pro',
  owner: 'Arjun Mehta',
  role: 'Owner',
};

export const revenueData = {
  today: 12840,
  yesterday: 12210,
  change: 5.1,
  changeDirection: 'up',
  // 7-day sparkline values (oldest to newest)
  sparkline: [8200, 9700, 7400, 11200, 10800, 12210, 12840],
  sparklineLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
};

export const ordersData = {
  total: 45,
  completed: 40,
  preparing: 3,
  pending: 2,
};

export const aovData = {
  today: 340,
  lastWeek: 312,
  change: 8.97,
  changeDirection: 'up',
};

export const occupancyData = {
  occupied: 12,
  total: 15,
  percentage: 80,
};

export const topItemsData = [
  { rank: 1, name: 'Butter Chicken', count: 28 },
  { rank: 2, name: 'Paneer Tikka', count: 22 },
  { rank: 3, name: 'Dal Makhani', count: 18 },
];

export const peakHoursData = [
  { hour: '10', label: '10A', orders: 3 },
  { hour: '11', label: '11A', orders: 5 },
  { hour: '12', label: '12P', orders: 8 },
  { hour: '13', label: '1P',  orders: 15 },
  { hour: '14', label: '2P',  orders: 12 },
  { hour: '15', label: '3P',  orders: 6 },
  { hour: '16', label: '4P',  orders: 4 },
  { hour: '17', label: '5P',  orders: 7 },
  { hour: '18', label: '6P',  orders: 11 },
  { hour: '19', label: '7P',  orders: 14 },
  { hour: '20', label: '8P',  orders: 18 },
  { hour: '21', label: '9P',  orders: 10 },
  { hour: '22', label: '10P', orders: 6 },
];

export const satisfactionData = {
  rating: 4.5,
  total: 128,
  breakdown: { five: 74, four: 32, three: 14, two: 5, one: 3 },
  feedback: [
    { author: 'Rohan S.', text: 'Food was absolutely delicious. The butter chicken was rich and perfectly spiced.' },
    { author: 'Priya K.', text: 'Quick service and great ambiance. Will definitely visit again soon.' },
    { author: 'Amit V.', text: 'Best paneer tikka in the city, hands down. Loved everything.' },
  ],
};

export const recentOrdersData = [
  {
    id: '#ORD-0045',
    table: 'T-03',
    items: 'Butter Chicken, Naan x2',
    total: '₹580',
    status: 'Completed',
    time: '2:14 PM',
  },
  {
    id: '#ORD-0044',
    table: 'T-07',
    items: 'Dal Makhani, Rice, Lassi',
    total: '₹440',
    status: 'Preparing',
    time: '2:10 PM',
  },
  {
    id: '#ORD-0043',
    table: 'T-01',
    items: 'Paneer Tikka, Jeera Rice',
    total: '₹520',
    status: 'Preparing',
    time: '2:06 PM',
  },
  {
    id: '#ORD-0042',
    table: 'T-11',
    items: 'Veg Thali',
    total: '₹280',
    status: 'Completed',
    time: '1:58 PM',
  },
  {
    id: '#ORD-0041',
    table: 'T-05',
    items: 'Chicken Biryani, Raita',
    total: '₹620',
    status: 'Pending',
    time: '1:55 PM',
  },
];
