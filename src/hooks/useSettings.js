'use client';

import { useState, useEffect } from 'react';

export function useSettings() {
  const [settings, setSettings] = useState({
    primaryColor: 'teal',
    sessionDuration: 1
  });
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const getColorValues = (color) => {
    const colorMap = {
      blue: {
        primary: '#2563eb',
        light: '#3b82f6',
        lighter: '#60a5fa',
        lightest: '#93c5fd'
      },
      teal: {
        primary: '#0d9488',
        light: '#14b8a6',
        lighter: '#2dd4bf',
        lightest: '#5eead4'
      },
      green: {
        primary: '#059669',
        light: '#10b981',
        lighter: '#34d399',
        lightest: '#6ee7b7'
      },
      purple: {
        primary: '#7c3aed',
        light: '#8b5cf6',
        lighter: '#a78bfa',
        lightest: '#c4b5fd'
      },
      red: {
        primary: '#dc2626',
        light: '#ef4444',
        lighter: '#f87171',
        lightest: '#fca5a5'
      },
      orange: {
        primary: '#ea580c',
        light: '#f97316',
        lighter: '#fb923c',
        lightest: '#fdba74'
      }
    };

    return colorMap[color] || colorMap.teal;
  };

  return {
    settings,
    loading,
    refetch: fetchSettings,
    colors: getColorValues(settings.primaryColor)
  };
}
