'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminStats from '@/components/admin/AdminStats';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <Typography variant="h2" color="blue-gray" className="mb-2">
            Admin Dashboard
          </Typography>
          <Typography color="gray">
            Welcome back! Here&apos;s an overview of your site.
          </Typography>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="shadow-sm animate-pulse">
                <CardBody className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          stats && <AdminStats stats={stats} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-4">
                Recent Activity
              </Typography>
              <Typography color="gray">
                Recent posts, messages, and site activity will appear here.
              </Typography>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-4">
                Quick Actions
              </Typography>
              <div className="space-y-2">
                <Typography color="gray" className="text-sm">
                  • Create new blog post
                </Typography>
                <Typography color="gray" className="text-sm">
                  • Update profile information
                </Typography>
                <Typography color="gray" className="text-sm">
                  • Review contact messages
                </Typography>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
