import UserManager from '@/components/admin/UserManager';

export default function UsersPage() {
  return <UserManager />;
}

export const metadata = {
  title: 'User Management - Admin Panel',
  description: 'Manage admin users and their permissions',
};
