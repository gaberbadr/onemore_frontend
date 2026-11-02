import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { settingsApi } from '../../api/settings.api';
import { AlertCircle } from 'lucide-react';

export const CustomerLayout = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await settingsApi.getSettings();
        const data = res.data?.data || res.data;
        setSettings(data);
      } catch (err) {
        if (err.response?.status === 404) {
          console.log('No settings configured yet.');
        } else {
          console.error("Failed to load restaurant settings", err);
        }
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-brand-lightBg font-sans">
      {!loading && settings?.restaurantOpen === false && (
        <div className="bg-semantic-danger text-white px-4 py-3 text-center text-sm font-bold flex items-center justify-center gap-2 shadow-md z-[60] relative">
          <AlertCircle size={18} />
          إحنا قافلين دلوقتي ومش بنستقبل طلبات جديدة. بس تقدر تتفرج على المنيو براحتك!
        </div>
      )}
      
      <Navbar settings={settings} />
      
      <main className="flex-grow flex flex-col w-full">
        <Outlet context={{ settings }} />
      </main>
      
      <Footer settings={settings} />
    </div>
  );
};
