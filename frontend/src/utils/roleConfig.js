// Role-based route access configuration
export const roleAccess = {
  director: ['dashboard', 'invoices', 'reports'],
  operations: ['dashboard', 'invoices', 'reports'],
  biller: ['dashboard', 'invoices'],
  collector: ['dashboard', 'invoices'],
};

// Navigation menu items for each role
export const navigationConfig = {
  director: [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
    },
    {
      title: 'All Invoices',
      path: '/invoices',
      icon: 'list',
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: 'assessment',
    },
  ],
  operations: [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
    },
    {
      title: 'All Invoices',
      path: '/invoices',
      icon: 'list',
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: 'assessment',
    },
  ],
  biller: [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
    },
    {
      title: 'Invoices',
      path: '/invoices',
      icon: 'list',
    },
  ],
  collector: [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
    },
    {
      title: 'Invoices',
      path: '/invoices',
      icon: 'list',
    },
  ],
};

// Check if a user has access to a specific route
export const hasRouteAccess = (role, route) => {
  if (!role || !roleAccess[role]) return false;
  return roleAccess[role].includes(route);
};

// Get navigation items for a specific role
export const getNavigationItems = (role) => {
  return navigationConfig[role] || [];
}; 
