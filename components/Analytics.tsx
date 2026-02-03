import React, { useMemo, useState } from 'react';
import { UntappdCheckin, TimelineData } from '../types';
import { getTopStyles, getRatingDistribution, getTimelineData, getTopBreweries, getTopFlavors, getTasteProfile } from '../utils';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  CartesianGrid, AreaChart, Area
} from 'recharts';
import CheckinModal from './CheckinModal';
import TasteProfileChart from './TasteProfileChart';

interface AnalyticsProps {
  data: UntappdCheckin[];
  isDarkMode: boolean;
}

const Analytics: React.FC<AnalyticsProps> = ({ data, isDarkMode }) => {
  const topStyles = useMemo(() => getTopStyles(data), [data]);
  const ratingDist = useMemo(() => getRatingDistribution(data), [data]);
  const timeline = useMemo(() => getTimelineData(data), [data]);
  const topBreweries = useMemo(() => getTopBreweries(data), [data]);
  const flavors = useMemo(() => getTopFlavors(data), [data]);
  const tasteProfile = useMemo(() => getTasteProfile(data), [data]);

  const [selectedPeriod, setSelectedPeriod] = useState<{ date: string; checkins: UntappdCheckin[] } | null>(null);

  const COLORS = ['#f59e0b', '#eab308', '#d97706', '#b45309', '#78350f'];
  
  const chartColors = {
    text: isDarkMode ? "#94a3b8" : "#64748b",
    grid: isDarkMode ? "#334155" : "#e2e8f0",
    tooltipBg: isDarkMode ? '#1e293b' : '#ffffff',
    tooltipBorder: isDarkMode ? '#475569' : '#e2e8f0',
    tooltipText: isDarkMode ? '#f1f5f9' : '#0f172a',
    mainColor: '#f59e0b'
  };

  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
        const payload = data.activePayload[0].payload as TimelineData;
        setSelectedPeriod({ date: payload.date, checkins: payload.checkins });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Row 1: Timeline (Full Width) */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Check-in Activity Over Time</h3>
            <span className="text-xs text-slate-500 italic">Click chart points to view details</span>
        </div>
        <div className="h-[300px] w-full cursor-pointer">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} onClick={handleChartClick}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.mainColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={chartColors.mainColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke={chartColors.text} fontSize={12} tickFormatter={(str) => str.substring(2)} />
              <YAxis stroke={chartColors.text} fontSize={12} />
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <Tooltip 
                contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, color: chartColors.tooltipText }}
                itemStyle={{ color: chartColors.mainColor }}
                cursor={{ stroke: chartColors.mainColor, strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="count" stroke={chartColors.mainColor} fillOpacity={1} fill="url(#colorCount)" name="Check-ins" activeDot={{ r: 6, strokeWidth: 0, fill: isDarkMode ? '#fff' : '#000' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Grid for charts. Expanded for wide screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        
        {/* Taste Profile (Hexagon) */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg transition-colors duration-300">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Taste Profile</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Aggregated from style & flavor tags</p>
          <TasteProfileChart data={tasteProfile} isDarkMode={isDarkMode} height={300} />
        </div>

        {/* Ratings */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg transition-colors duration-300">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Rating Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDist}>
                <XAxis dataKey="name" stroke={chartColors.text} fontSize={12} />
                <YAxis stroke={chartColors.text} fontSize={12} />
                <Tooltip 
                  cursor={{fill: isDarkMode ? '#334155' : '#f1f5f9'}}
                  contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, color: chartColors.tooltipText }}
                />
                <Bar dataKey="value" fill={chartColors.mainColor} name="Count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Styles */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg transition-colors duration-300">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Top 10 Styles</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topStyles} margin={{ left: 20 }}>
                <XAxis type="number" stroke={chartColors.text} hide />
                <YAxis dataKey="name" type="category" stroke={chartColors.text} fontSize={11} width={120} />
                <Tooltip 
                  cursor={{fill: isDarkMode ? '#334155' : '#f1f5f9'}}
                  contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, color: chartColors.tooltipText }}
                />
                <Bar dataKey="value" fill="#8b5cf6" name="Check-ins" radius={[0, 4, 4, 0]}>
                  {topStyles.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Breweries */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg transition-colors duration-300">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Top 10 Breweries</h3>
          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topBreweries} margin={{ left: 20 }}>
                <XAxis type="number" stroke={chartColors.text} hide />
                <YAxis dataKey="name" type="category" stroke={chartColors.text} fontSize={11} width={120} />
                <Tooltip 
                  cursor={{fill: isDarkMode ? '#334155' : '#f1f5f9'}}
                  contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, color: chartColors.tooltipText }}
                />
                <Bar dataKey="value" fill="#10b981" name="Check-ins" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Flavors - Spans 2 cols on very large screens if needed, or fits 1 */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg transition-colors duration-300 lg:col-span-2 2xl:col-span-2">
           <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Flavor Profiles</h3>
           <div className="flex flex-wrap gap-2">
              {flavors.map((flavor, index) => (
                <span 
                  key={flavor.name} 
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium border border-slate-200 dark:border-slate-600 transition-colors duration-300"
                  style={{
                    fontSize: `${Math.max(0.75, Math.min(1.5, 0.75 + (flavor.value / 20)))}rem`,
                    opacity: Math.max(0.6, Math.min(1, 0.4 + (flavor.value / 10)))
                  }}
                >
                  {flavor.name} <span className="opacity-50 text-xs ml-1">({flavor.value})</span>
                </span>
              ))}
           </div>
        </div>

      </div>

       {selectedPeriod && (
         <CheckinModal 
           isOpen={!!selectedPeriod} 
           onClose={() => setSelectedPeriod(null)} 
           title={`Check-ins for ${selectedPeriod.date}`}
           checkins={selectedPeriod.checkins}
         />
       )}
    </div>
  );
};

export default Analytics;