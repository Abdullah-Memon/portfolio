'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import StatisticsManager from '@/components/admin/StatisticsManager'

export default function StatisticsPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Statistics Management</h1>
          <p className="text-gray-600 mt-2">
            Manage the professional journey statistics displayed on your about page and throughout the site.
          </p>
        </div>
        
        <StatisticsManager />
      </div>
    </AdminLayout>
  )
}
