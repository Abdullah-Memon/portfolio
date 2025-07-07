'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  Typography, 
  Button, 
  Select, 
  Option, 
  Input 
} from '@material-tailwind/react';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'react-hot-toast';
import { usePrimaryColor } from '@/hooks/usePrimaryColor';

const colorOptions = [
  { name: 'Blue', value: 'blue' },
  { name: 'Teal', value: 'teal' },
  { name: 'Green', value: 'green' },
  { name: 'Purple', value: 'purple' },
  { name: 'Red', value: 'red' },
  { name: 'Orange', value: 'orange' },
  { name: 'Pink', value: 'pink' },
  { name: 'Indigo', value: 'indigo' },
];

const sessionDurationOptions = [
  { label: '1 Hour', value: 1 },
  { label: '2 Hours', value: 2 },
  { label: '3 Hours', value: 3 },
  { label: '4 Hours', value: 4 },
  { label: '6 Hours', value: 6 },
  { label: '8 Hours', value: 8 },
  { label: '12 Hours', value: 12 },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    primaryColor: 'teal',
    sessionDuration: 1
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { getMaterialTailwindColor, colors } = usePrimaryColor();
  const primaryColor = getMaterialTailwindColor();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('Settings saved successfully!');
        // Optionally trigger a page reload to apply new primary color
        if (window.confirm('Settings saved! Reload the page to apply theme changes?')) {
          window.location.reload();
        }
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (color) => {
    setSettings(prev => ({ ...prev, primaryColor: color }));
  };

  const handleSessionDurationChange = (duration) => {
    setSettings(prev => ({ ...prev, sessionDuration: parseInt(duration) }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <Typography variant="h2" color="blue-gray" className="mb-2">
            Settings
          </Typography>
          <Typography color="gray">
            Customize your admin panel preferences
          </Typography>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Theme Settings */}
          <Card>
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-4">
                Theme Settings
              </Typography>
              
              <div className="mb-6">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Primary Color
                </Typography>
                <Typography color="gray" className="text-sm mb-4">
                  Choose the primary color for your portfolio theme
                </Typography>
                
                <Select
                  value={settings.primaryColor}
                  onChange={handleColorChange}
                  label="Select Primary Color"
                >
                  {colorOptions.map((color) => (
                    <Option key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: 
                            color.value === 'blue' ? '#2563eb' :
                            color.value === 'teal' ? '#0d9488' :
                            color.value === 'green' ? '#059669' :
                            color.value === 'purple' ? '#7c3aed' :
                            color.value === 'red' ? '#dc2626' :
                            color.value === 'orange' ? '#ea580c' :
                            color.value === 'pink' ? '#ec4899' :
                            color.value === 'indigo' ? '#4f46e5' : '#0d9488'
                          }}
                        />
                        {color.name}
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Color Preview */}
              <div className="p-4 rounded-lg border border-gray-200">
                <Typography variant="small" color="gray" className="mb-2">
                  Preview:
                </Typography>
                <div className="flex items-center gap-4">
                  <Button 
                    color={primaryColor}
                    size="sm"
                  >
                    Primary Button
                  </Button>
                  <Button 
                    color={primaryColor}
                    variant="outlined"
                    size="sm"
                  >
                    Outlined Button
                  </Button>
                  <div 
                    className="w-6 h-6 rounded-full bg-primary"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Session Settings */}
          <Card>
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-4">
                Session Settings
              </Typography>
              
              <div className="mb-6">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Session Duration
                </Typography>
                <Typography color="gray" className="text-sm mb-4">
                  How long you want to stay logged in before automatic logout
                </Typography>
                
                <Select
                  value={settings.sessionDuration.toString()}
                  onChange={handleSessionDurationChange}
                  label="Select Session Duration"
                >
                  {sessionDurationOptions.map((option) => (
                    <Option key={option.value} value={option.value.toString()}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className={`p-4 rounded-lg ${primaryColor === 'blue' ? 'bg-blue-50 border border-blue-200' : 'bg-primary-lightest border border-primary-30'}`}>
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Note:
                </Typography>
                <Typography variant="small" color="gray">
                  You&apos;ll receive a warning 5 minutes before session expiry. 
                  Changes to session duration will take effect on your next login.
                </Typography>
              </div>
            </CardBody>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">              <Button
                color={primaryColor}
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
