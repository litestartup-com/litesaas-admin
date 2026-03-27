import { create } from 'zustand'

export type MenuItem = {
  id: string
  label: string
  icon?: string
  path?: string
  children?: MenuItem[]
}

interface NavigationState {
  activeMenuItem: string
  setActiveMenuItem: (id: string) => void
  menuItems: MenuItem[]
}

export const useNavigation = create<NavigationState>((set) => ({
  activeMenuItem: 'dashboard',
  setActiveMenuItem: (id) => set({ activeMenuItem: id }),
  menuItems: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/dashboard',
    },
    {
      id: 'admin',
      label: 'ADMIN',
      icon: undefined,
      children: [
        {
          id: 'users',
          label: 'Users',
          icon: 'Users',
          path: '/admin/users',
        },
      ],
    },
    {
      id: 'settings',
      label: 'SETTINGS',
      icon: undefined,
      children: [
        {
          id: 'profile',
          label: 'Profile',
          icon: 'User',
          path: '/settings/profile',
        },
        {
          id: 'billing',
          label: 'Billing',
          icon: 'CreditCard',
          path: '/settings/billing',
        },
        {
          id: 'credits',
          label: 'Credits',
          icon: 'DollarSign',
          path: '/settings/credits',
        },
        {
          id: 'security',
          label: 'Security',
          icon: 'Shield',
          path: '/settings/security',
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: 'Bell',
          path: '/settings/notifications',
        },
      ],
    },
  ],
}))
