import {
  LayoutGrid,
  LucideIcon,
  Package,
  Inbox,
  SquareUser,
  MapPinned,
  Truck,
  Users,
  TicketPercent,
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(
  pathname: string,
  role: 'ADMIN' | 'AGENT' | 'CLIENT' | undefined,
): Group[] {
  const adminMenus: Group[] = [
    {
      groupLabel: '',
      menus: [
        {
          href: '/overview',
          label: 'Dashboard',
          active: pathname === '/overview',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Packages',
      menus: [
        {
          href: '',
          label: 'Packages',
          active: pathname.includes('/packages'),
          icon: Package,
          submenus: [
            {
              href: '/packages',
              label: 'All Packages',
              active: pathname === '/packages',
            },
            {
              href: '/packages/package-deletion',
              label: 'Deletion Requests',
              active: pathname === '/packages/package-deletion',
            },
            {
              href: '/packages/package-scan',
              label: 'Package Scan',
              active: pathname === '/packages/package-scan',
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Users',
      menus: [
        {
          href: '',
          label: 'Users',
          active: pathname.includes('/users'),
          icon: Users,
          submenus: [
            {
              href: '/users',
              label: 'Users List',
              active: pathname === '/users',
            },
            {
              href: '/users/admins',
              label: 'Admin List',
              active: pathname === '/users/admins',
            },
            {
              href: '/users/agents',
              label: 'Agent List',
              active: pathname === '/users/agents',
            },
            {
              href: '/users/clients',
              label: 'Client List',
              active: pathname === '/users/clients',
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/hubs',
          label: 'Hub List',
          active: pathname.includes('/hubs'),
          icon: MapPinned,
          submenus: [],
        },
        {
          href: '/cargo',
          label: 'Cargo Items',
          active: pathname.includes('/cargo'),
          icon: Inbox,
          submenus: [],
        },
        {
          href: '/promo',
          label: 'Promo Codes',
          active: pathname.includes('/promo'),
          icon: TicketPercent,
          submenus: [],
        },

        {
          href: '/delivery',
          label: 'Delivery',
          active: pathname.includes('/delivery'),
          icon: Truck,
          submenus: [],
        },
        {
          href: '/account',
          label: 'Account',
          active: pathname.includes('/account'),
          icon: SquareUser,
          submenus: [],
        },
      ],
    },
  ];

  const agentMenus: Group[] = [
    {
      groupLabel: '',
      menus: [
        {
          href: '/',
          label: 'Dashboard',
          active: pathname === '/',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Packages',
      menus: [
        {
          href: '',
          label: 'Packages',
          active: pathname.includes('/packages'),
          icon: Package,
          submenus: [
            {
              href: '/packages',
              label: 'All Packages',
              active: pathname === '/packages',
            },
            {
              href: '/packages/package-scan',
              label: 'Package Scan',
              active: pathname === '/packages/package-scan',
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Users',
      menus: [
        {
          href: '',
          label: 'Users',
          active: pathname.includes('/users'),
          icon: Users,
          submenus: [
            {
              href: '/users/clients',
              label: 'Client List',
              active: pathname === '/users/clients',
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/account',
          label: 'Account',
          active: pathname.includes('/account'),
          icon: SquareUser,
          submenus: [],
        },
      ],
    },
  ];

  switch (role) {
    case 'ADMIN':
      return adminMenus;
    case 'AGENT':
      return agentMenus;
    default:
      return [];
  }
}
