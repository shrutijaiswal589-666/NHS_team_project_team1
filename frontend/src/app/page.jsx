"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getGPKpis, getGPRegions } from "../lib/api";

function DashboardContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q") || "";
  
  const [timeFilter, setTimeFilter] = useState(12);
  const [kpis, setKpis] = useState(null);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    async function loadData() {
      const kpiData = await getGPKpis(timeFilter);
      setKpis(kpiData);

      const regionData = await getGPRegions(timeFilter, search);
      setRegions(regionData || []);
    }
    loadData();
  }, [timeFilter, search]);

  const renderTrend = (value, inverse = false) => {
    if (value === undefined || value === null) return null;
    
    // If it's the DNA rate, a negative number is actually Good (Green)
    const isGood = inverse ? value <= 0 : value >= 0;
    const arrow = value >= 0 ? "trending_up" : "trending_down";
    const colorClass = isGood ? "text-success" : "text-error";
    const inlineColor = isGood ? "#10b981" : "#ef4444";
    
    return (
      <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm">
        <span className="material-symbols-outlined text-sm" style={{ color: inlineColor }}>{arrow}</span>
        <span>{value > 0 ? "+" : ""}{value}% vs prev. period</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-gutter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-background mb-1">NHS Capacity Dashboard</h1>
          <p className="font-body-lg text-body-lg text-secondary">Live GP Appointments &amp; Hospital RTT Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-label-sm text-label-sm text-secondary sr-only" htmlFor="date-filter">Filter by Date</label>
          <select 
            className="bg-surface border border-outline-variant rounded-md py-2 pl-3 pr-8 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
            id="date-filter"
            value={timeFilter}
            onChange={(e) => setTimeFilter(Number(e.target.value))}
          >
            <option value={12}>Last 12 Months</option>
            <option value={6}>Last 6 Months</option>
            <option value={3}>Last 3 Months</option>
            <option value={1}>Last Month</option>
          </select>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
        {/* KPI 1: Total Appointments */}
        <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface-variant">Total Appointments</h3>
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-sm">event</span>
            </div>
          </div>
          <div className="font-data-display text-data-display text-on-background mb-2 tracking-tight">
             {kpis ? kpis.total_appointments.toLocaleString() : "..."}
          </div>
          {kpis && renderTrend(kpis.trend_total, false)}
        </div>

        {/* KPI 2: DNA Rate */}
        <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border-l-4 border-l-error border-y border-r border-outline-variant flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-error-container rounded-bl-full opacity-20"></div>
          <div className="flex justify-between items-start mb-sm relative z-10">
            <h3 className="font-headline-sm text-headline-sm text-on-surface-variant">DNA Rate <span className="font-body-sm text-secondary">(Did Not Attend)</span></h3>
            <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-sm">person_off</span>
            </div>
          </div>
          <div className="font-data-display text-data-display text-error mb-2 tracking-tight">
             {kpis ? `${kpis.dna_rate_percent}%` : "..."}
          </div>
          {kpis && renderTrend(kpis.trend_dna, true)}
        </div>

        {/* KPI 3: Face-to-Face Rate */}
        <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border-l-4 border-success border-y border-r border-outline-variant flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-success-container rounded-bl-full opacity-20" style={{ backgroundColor: '#d1fae5' }}></div>
          <div className="flex justify-between items-start mb-sm relative z-10">
            <h3 className="font-headline-sm text-headline-sm text-on-surface-variant">Face-to-Face Rate</h3>
            <div className="w-8 h-8 rounded-full bg-success-container flex items-center justify-center text-on-success-container" style={{ backgroundColor: '#d1fae5', color: '#064e3b' }}>
              <span className="material-symbols-outlined text-sm">personal_injury</span>
            </div>
          </div>
          <div className="font-data-display text-data-display text-on-success-container mb-2 tracking-tight" style={{ color: '#064e3b' }}>
             {kpis ? `${kpis.f2f_rate_percent}%` : "..."}
          </div>
          {kpis && renderTrend(kpis.trend_f2f, false)}
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-xl">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant flex items-center justify-center min-h-[300px]">
           <p className="text-secondary">Bar Chart Placeholder (Ready for Recharts)</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant flex items-center justify-center min-h-[300px]">
           <p className="text-secondary">Line Chart Placeholder (Ready for Recharts)</p>
        </div>
      </div>

      {}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden mb-xl">
        <div className="p-md border-b border-surface-dim flex justify-between items-center bg-surface-container-low">
          <h3 className="font-headline-sm text-headline-sm text-on-background">Regional Breakdown</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-outline-variant rounded-md text-secondary hover:bg-surface-variant transition-colors font-label-sm text-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">filter_list</span> Filter
            </button>
            <button className="px-3 py-1.5 bg-primary-container text-on-primary-container rounded-md hover:bg-primary hover:text-on-primary transition-colors font-label-sm text-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">download</span> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant font-label-md text-label-md text-on-surface-variant">
                <th className="p-sm md:p-md font-semibold whitespace-nowrap">Region Name</th>
                <th className="p-sm md:p-md font-semibold text-right whitespace-nowrap">Total Appointments</th>
                <th className="p-sm md:p-md font-semibold text-right whitespace-nowrap">DNA Rate</th>
                <th className="p-sm md:p-md font-semibold text-center whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-background divide-y divide-surface-dim">
              {regions.map((region, index) => (
                <tr key={index} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td className="p-sm md:p-md font-medium text-primary">{region.region_name}</td>
                  <td className="p-sm md:p-md text-right tabular-nums">{region.total_appointments.toLocaleString()}</td>
                  <td className={`p-sm md:p-md text-right tabular-nums font-medium ${region.dna_rate > 5 ? 'text-error' : 'text-secondary'}`}>
                    {region.dna_rate}%
                  </td>
                  <td className="p-sm md:p-md text-center">
                    <span 
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: region.status_color === 'red' ? '#fee2e2' : region.status_color === 'yellow' ? '#fef3c7' : '#d1fae5',
                        color: region.status_color === 'red' ? '#991b1b' : region.status_color === 'yellow' ? '#92400e' : '#064e3b'
                      }}
                    >
                      {region.status_label}
                    </span>
                  </td>
                </tr>
              ))}
              {regions.length === 0 && (
                 <tr>
                   <td colSpan="4" className="text-center p-8 text-secondary">
                     No regions found matching your search.
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}