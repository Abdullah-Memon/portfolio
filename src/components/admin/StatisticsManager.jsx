'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Input, Switch, Typography, Alert } from '@material-tailwind/react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function StatisticsManager() {
  const [statistics, setStatistics] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingStat, setEditingStat] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' })

  const [formData, setFormData] = useState({
    label: '',
    value: '',
    suffix: '',
    icon: '',
    order: 0,
    active: true
  })

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics')
      if (response.ok) {
        const data = await response.json()
        setStatistics(data.statistics || [])
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
      showAlert('Failed to fetch statistics', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type })
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingStat ? `/api/statistics/${editingStat.id}` : '/api/statistics'
      const method = editingStat ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        showAlert(data.message)
        resetForm()
        fetchStatistics()
      } else {
        const error = await response.json()
        showAlert(error.error || 'Operation failed', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      showAlert('An error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (stat) => {
    setEditingStat(stat)
    setFormData({
      label: stat.label,
      value: stat.value.toString(),
      suffix: stat.suffix || '',
      icon: stat.icon || '',
      order: stat.order,
      active: stat.active
    })
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this statistic?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/statistics/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        showAlert(data.message)
        fetchStatistics()
      } else {
        const error = await response.json()
        showAlert(error.error || 'Delete failed', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      showAlert('An error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      label: '',
      value: '',
      suffix: '',
      icon: '',
      order: 0,
      active: true
    })
    setIsEditing(false)
    setEditingStat(null)
  }

  if (loading && statistics.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {alert.show && (
        <Alert
          color={alert.type === 'error' ? 'red' : 'green'}
          className="mb-4"
          onClose={() => setAlert({ show: false, message: '', type: 'success' })}
        >
          {alert.message}
        </Alert>
      )}

      <Card className="p-6">
        <Typography variant="h5" className="mb-4">
          {isEditing ? 'Edit Statistic' : 'Add New Statistic'}
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              required
              placeholder="e.g., Years Experience"
            />
            <Input
              label="Value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              required
              placeholder="e.g., 5"
            />
            <Input
              label="Suffix (Optional)"
              value={formData.suffix}
              onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
              placeholder="e.g., +, %, K+"
            />
            <Input
              label="Icon (Optional)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g., 🏆, ⭐, 💼"
            />
            <Input
              label="Display Order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                label="Active"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="bg-primary-dynamic">
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </Button>
            {isEditing && (
              <Button variant="outlined" onClick={resetForm} className="text-primary-dynamic">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5">Statistics</Typography>
          <Button
            size="sm"
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2 bg-primary-dynamic"
          >
            <PlusIcon className="h-4 w-4" />
            Add New
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Order</th>
                <th className="text-left p-2">Label</th>
                <th className="text-left p-2">Value</th>
                <th className="text-left p-2">Suffix</th>
                <th className="text-left p-2">Icon</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((stat) => (
                <tr key={stat.id} className="border-b">
                  <td className="p-2">{stat.order}</td>
                  <td className="p-2">{stat.label}</td>
                  <td className="p-2">{stat.value}</td>
                  <td className="p-2">{stat.suffix || '-'}</td>
                  <td className="p-2">{stat.icon || '-'}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      stat.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {stat.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="text"
                        onClick={() => handleEdit(stat)}
                        className="p-1"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="text"
                        color="red"
                        onClick={() => handleDelete(stat.id)}
                        className="p-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {statistics.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No statistics found. Create your first one!
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
