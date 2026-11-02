import React, { useState, useEffect } from 'react';
import { statisticsApi } from '../../api/statistics.api';
import { Loader2, TrendingUp, ShoppingCart, Ban, CheckCircle, Package, Calendar } from 'lucide-react';

export const StatisticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // By default, no filters (all time). But let's allow basic date filtering.
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await statisticsApi.getStatistics(startDate, endDate);
      setStats(res.data?.data || null);
    } catch (err) {
      console.error(err);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchStats();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-black flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-brand-black text-white rounded-xl shadow-md">
              <TrendingUp size={24} />
            </div>
            Statistics & Overview
          </h1>
          <p className="text-neutral-500 mt-2 font-medium">Get insights into your business performance.</p>
        </div>

        <form onSubmit={handleFilter} className="flex flex-col sm:flex-row items-end gap-3 bg-white p-3 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-xs font-bold text-neutral-400 mb-1 ml-1 uppercase">Start Date</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary transition-all text-sm font-bold text-brand-black"
            />
          </div>
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-xs font-bold text-neutral-400 mb-1 ml-1 uppercase">End Date</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-primary transition-all text-sm font-bold text-brand-black"
            />
          </div>
          <button 
            type="submit" 
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] shrink-0 h-[42px]"
          >
            Apply Filter
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-semantic-danger/10 text-semantic-danger font-bold border border-semantic-danger/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Sales */}
          <div className="bg-gradient-to-br from-primary to-[#ff8c3a] p-6 rounded-3xl text-white shadow-[0_8px_25px_rgba(255,106,0,0.3)] relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-white/80 font-bold uppercase tracking-wider text-sm mb-1">Total Sales</p>
                <h3 className="text-4xl font-black">{stats.totalSales?.toFixed(2) || '0.00'}</h3>
                <p className="text-white/90 text-sm mt-1 font-medium">EGP Revenue</p>
              </div>
              <div className="p-3 bg-white/20 rounded-2xl ">
                <TrendingUp size={28} className="text-white" />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-neutral-400 font-bold uppercase tracking-wider text-sm mb-1">Total Orders</p>
                <h3 className="text-4xl font-black text-brand-black">{stats.totalOrders || 0}</h3>
                <p className="text-neutral-500 text-sm mt-1 font-medium">Orders Placed</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                <ShoppingCart size={28} />
              </div>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-semantic-success/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-neutral-400 font-bold uppercase tracking-wider text-sm mb-1">Completed</p>
                <h3 className="text-4xl font-black text-brand-black">{stats.completedOrders || 0}</h3>
                <p className="text-neutral-500 text-sm mt-1 font-medium">Successfully Delivered</p>
              </div>
              <div className="p-3 bg-semantic-success/10 text-semantic-success rounded-2xl">
                <CheckCircle size={28} />
              </div>
            </div>
          </div>

          {/* Cancelled Orders */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-semantic-danger/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-neutral-400 font-bold uppercase tracking-wider text-sm mb-1">Cancelled</p>
                <h3 className="text-4xl font-black text-brand-black">{stats.cancelledOrders || 0}</h3>
                <p className="text-neutral-500 text-sm mt-1 font-medium">Orders Dropped</p>
              </div>
              <div className="p-3 bg-semantic-danger/10 text-semantic-danger rounded-2xl">
                <Ban size={28} />
              </div>
            </div>
          </div>

          {/* Most Ordered Product */}
          <div className="md:col-span-2 lg:col-span-4 bg-brand-black p-8 rounded-3xl text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl mt-4">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex items-center gap-6 text-left">
              <div className="w-16 h-16 bg-white/10 rounded-2xl  flex items-center justify-center border border-white/10 shrink-0">
                <Package size={32} className="text-primary" />
              </div>
              <div>
                <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Most Popular Item</h4>
                <p className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {stats.mostOrderedProduct || "No data available"}
                </p>
                <p className="text-neutral-400 font-medium mt-1">Based on highest sales volume.</p>
              </div>
            </div>
            
            <div className="relative z-10 shrink-0 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl  self-stretch sm:self-auto flex items-center justify-center text-center">
               <div className="flex items-center gap-3 text-neutral-300 font-bold">
                 <TrendingUp className="text-primary" size={24} />
                 Top Performing Product
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-neutral-500 font-bold">
          No statistics available.
        </div>
      )}
    </div>
  );
};
