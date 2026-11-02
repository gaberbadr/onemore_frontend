import React, { useState, useEffect } from 'react';
import { healthApi } from '../../api/health.api';
import { Activity, ServerCrash } from 'lucide-react';

export const ApiStatusBadge = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'healthy', 'error'
  const [env, setEnv] = useState('');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await healthApi.getHealthCheck();
        // Since we are mocking the success case, we check for 'Healthy' or a 200 OK.
        if (response.data?.status === 'Healthy' || response.status === 200) {
          setStatus('healthy');
          setEnv(response.data?.environment || 'Production');
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    checkHealth();
    
    // Periodically check every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-3 px-4 py-2 w-full rounded-xl bg-neutral-800/50 border border-transparent">
        <div className="w-2 h-2 rounded-full bg-neutral-500 animate-pulse"></div>
        <span className="text-xs font-bold text-neutral-400">Checking Systems...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-3 px-4 py-2 w-full rounded-xl bg-semantic-danger/10 border border-semantic-danger/20" title="API Unreachable">
        <div className="w-2 h-2 rounded-full bg-semantic-danger animate-pulse shadow-[0_0_8px_rgba(217,45,32,0.8)]"></div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-semantic-danger flex items-center gap-1">
            <ServerCrash size={12} /> Systems Offline
          </span>
          <span className="text-[9px] text-semantic-danger/70 font-medium uppercase tracking-wider">Check Connection</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 w-full rounded-xl bg-semantic-success/5 border border-semantic-success/10 hover:bg-semantic-success/10 transition-colors cursor-help" title={`Systems Running smoothly in ${env} environment`}>
      <div className="w-2 h-2 rounded-full bg-semantic-success animate-pulse shadow-[0_0_8px_rgba(34,160,107,0.8)]"></div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-semantic-success flex items-center gap-1">
          <Activity size={12} /> Systems Healthy
        </span>
        <span className="text-[9px] text-semantic-success/70 font-bold uppercase tracking-widest">{env}</span>
      </div>
    </div>
  );
};
