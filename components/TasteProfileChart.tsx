import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TasteData } from '../types';

interface TasteProfileChartProps {
  data: TasteData[];
  isDarkMode: boolean;
  height?: number;
  compact?: boolean;
}

const TasteProfileChart: React.FC<TasteProfileChartProps> = ({ data, isDarkMode, height = 300, compact = false }) => {
  const chartColors = {
    text: isDarkMode ? "#94a3b8" : "#64748b",
    grid: isDarkMode ? "#334155" : "#e2e8f0",
    fill: "#f59e0b",
    stroke: "#d97706",
    bg: isDarkMode ? "#1e293b" : "#ffffff"
  };

  return (
    <div className={`w-full ${compact ? '' : 'h-full'}`} style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius={compact ? "70%" : "80%"} data={data}>
          <PolarGrid stroke={chartColors.grid} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: chartColors.text, fontSize: compact ? 10 : 12 }} 
          />
          {!compact && <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />}
          <Radar
            name="Taste Profile"
            dataKey="A"
            stroke={chartColors.stroke}
            fill={chartColors.fill}
            fillOpacity={0.6}
          />
          {!compact && (
            <Tooltip 
                contentStyle={{ backgroundColor: chartColors.bg, borderColor: chartColors.grid, color: isDarkMode ? '#f1f5f9' : '#0f172a' }}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TasteProfileChart;