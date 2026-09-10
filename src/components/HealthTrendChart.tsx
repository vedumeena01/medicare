'use client';

import React, { useState } from 'react';
import { sampleHealthTrends } from '@/lib/sampleData';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

type MetricKey = 'bloodSugar' | 'cholesterol' | 'hemoglobin' | 'weight' | 'bmi';

export default function HealthTrendChart() {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('bloodSugar');

  const metricsConfig: Record<
    MetricKey,
    { label: string; unit: string; color: string; normal: string }
  > = {
    bloodSugar: {
      label: 'Blood Sugar (F)',
      unit: 'mg/dL',
      color: '#2563eb',
      normal: '70-110 mg/dL'
    },
    cholesterol: {
      label: 'Cholesterol',
      unit: 'mg/dL',
      color: '#059669',
      normal: '< 200 mg/dL'
    },
    hemoglobin: {
      label: 'Hemoglobin',
      unit: 'g/dL',
      color: '#dc2626',
      normal: '12-16 g/dL'
    },
    weight: {
      label: 'Weight',
      unit: 'kg',
      color: '#7c3aed',
      normal: 'Healthy Range'
    },
    bmi: {
      label: 'BMI',
      unit: 'kg/m²',
      color: '#ea580c',
      normal: '18.5 - 24.9'
    }
  };

  const values = sampleHealthTrends.map(item => item[activeMetric]);
  const minVal = Math.min(...values) * 0.9;
  const maxVal = Math.max(...values) * 1.1;

  // Chart width 500, height 180
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const points = sampleHealthTrends.map((d, i) => {
    const x = paddingX + (i * (width - 2 * paddingX)) / (sampleHealthTrends.length - 1);
    const y = height - paddingY - ((d[activeMetric] - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
    return { x, y, val: d[activeMetric], month: d.month };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const firstVal = values[0];
  const lastVal = values[values.length - 1];
  const isUp = lastVal > firstVal;
  const changePercent = Math.abs(((lastVal - firstVal) / firstVal) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Health Trends</span>
          </h3>
          <p className="text-xs text-slate-500">
            Track your vital health metrics over consecutive testing cycles
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
          {(Object.keys(metricsConfig) as MetricKey[]).map(key => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeMetric === key
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {metricsConfig[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Quick Stats */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {lastVal} {metricsConfig[activeMetric].unit}
          </span>
          <span className="text-xs text-slate-500">Latest (June)</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
          <span>Target: {metricsConfig[activeMetric].normal}</span>
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              isUp ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {changePercent}% (6 mo)
          </span>
        </div>
      </div>

      {/* SVG Responsive Line Chart */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          {/* Subtle Gridlines */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="#f1f5f9"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Area Gradient */}
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={metricsConfig[activeMetric].color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={metricsConfig[activeMetric].color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Shaded Area */}
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${
              height - paddingY
            } Z`}
            fill="url(#trendGrad)"
          />

          {/* Main Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke={metricsConfig[activeMetric].color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Labels */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#ffffff"
                stroke={metricsConfig[activeMetric].color}
                strokeWidth="2.5"
                className="hover:r-6 transition-all"
              />
              {/* Value floating text */}
              <text
                x={p.x}
                y={p.y - 8}
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-700"
              >
                {p.val}
              </text>
              {/* Month label */}
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                className="text-[11px] font-semibold fill-slate-400"
              >
                {p.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
