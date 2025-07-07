'use client';

import { signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import {
  List,
  ListItem,
  ListItemPrefix,
  Typography,
  Button,
} from '@material-tailwind/react';
import {
  ChartBarIcon,
  DocumentTextIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  CogIcon,
  StarIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
  { name: 'Posts', href: '/admin/posts', icon: DocumentTextIcon },
  { name: 'Projects', href: '/admin/projects', icon: BriefcaseIcon },
  { name: 'Testimonials', href: '/admin/testimonials', icon: StarIcon },
  { name: 'Statistics', href: '/admin/statistics', icon: PresentationChartBarIcon },
  { name: 'Profile', href: '/admin/profile', icon: UserIcon },
  { name: 'Messages', href: '/admin/messages', icon: ChatBubbleLeftIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
];

export default function AdminSidebar({ isOpen, onToggle, isMobile }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <div
      className={`
        ${isMobile ? 'fixed' : 'relative'} inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-gray-200 transform transition-transform duration-300 ease-in-out h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <Typography variant="h5" color="blue-gray">
            Admin Panel
          </Typography>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <List className="p-0">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <ListItem
                  key={item.name}
                  className={`
                    rounded-lg transition-all duration-200
                    px-4 py-2 hover:bg-teal-50 focus:bg-teal-50 
                    ${isActive ? 'bg-teal-50 border-r-4 border-teal-500' : ''}
                  `}
                  onClick={() => {
                    router.push(item.href);
                    if (isMobile) onToggle();
                  }}
                >
                  <ListItemPrefix>
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-teal-500' : 'text-gray-500'}`} />
                  </ListItemPrefix>
                  <Typography
                    color={isActive ? 'teal' : 'blue-gray'}
                    className="font-medium"
                  >
                    {item.name}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        </nav>

        {/* Sign Out Button */}
        <div className="p-6 border-t border-gray-200">
          <Button
            variant="outlined"
            color="red"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleSignOut}
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
