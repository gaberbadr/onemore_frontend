import React, { useState, useEffect } from 'react';
import { deliveryAreasApi } from '../../api/deliveryAreas.api';
import { MapPin, Loader2, ChevronDown } from 'lucide-react';

export const DeliveryAreaSelect = ({ selectedAreaId, onChange, error }) => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await deliveryAreasApi.getDeliveryAreas(1, 100);
        const paginationObj = response.data?.data || response.data;
        setAreas(Array.isArray(paginationObj?.data) ? paginationObj.data : Array.isArray(paginationObj) ? paginationObj : []);
      } catch (error) {
        console.error("Failed to fetch delivery areas for checkout:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAreas();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-14 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-center animate-pulse">
        <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400">
        <MapPin size={20} />
      </div>
      
      <select
        value={selectedAreaId || ''}
        onChange={(e) => {
          const areaId = parseInt(e.target.value);
          const area = areas.find(a => a.id === areaId);
          onChange(area || null);
        }}
        className={`w-full pl-12 pr-10 py-4 bg-white border rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all font-bold text-brand-black shadow-sm ${
          error 
            ? 'border-semantic-danger focus:ring-semantic-danger/20' 
            : 'border-neutral-200 focus:border-primary focus:ring-primary/20 hover:border-neutral-300'
        }`}
      >
        <option value="" disabled className="text-neutral-400">Select your delivery area...</option>
        {areas.map((area) => (
          <option key={area.id} value={area.id} className="font-medium text-brand-black">
            {area.cityName} — {area.deliveryFee.toFixed(2)} EGP
          </option>
        ))}
      </select>

      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-400">
        <ChevronDown size={20} />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-semantic-danger font-bold">{error}</p>
      )}
    </div>
  );
};
