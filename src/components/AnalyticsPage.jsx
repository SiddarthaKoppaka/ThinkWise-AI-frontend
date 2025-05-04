// src/components/AnalyticsPage.jsx
import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
import { useAnalytics } from '../hooks/useAnalytics'

const PRIMARY = '#2563EB'
const SHADES = [
  'rgba(37,99,235,0.1)',
  'rgba(37,99,235,0.2)',
  'rgba(37,99,235,0.3)',
  'rgba(37,99,235,0.4)',
  'rgba(37,99,235,0.5)',
  'rgba(37,99,235,0.6)',
]

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useAnalytics()

  if (isLoading) return <div className="p-8">Loading analytics…</div>
  if (isError || !data) return <div className="p-8">Failed to load analytics.</div>

  // 1) Ideas over time
  const lineData = Object.entries(data.ideasOverTime).map(([month, count]) => ({
    month, count
  }))

  // 2) Score buckets (0–100)
  const barData1 = Object.entries(data.scoreBuckets).map(([bucket, count]) => ({
    bucket, count
  }))

  // 3) Effort distribution (%)
  const barData2 = Object.entries(data.effortDistribution).map(([effortPct, count]) => ({
    effortPct: Number(effortPct), count
  }))

  // 4) ROI distribution (%)
  const areaData = Object.entries(data.roiDistribution).map(([roiPct, count]) => ({
    roiPct: Number(roiPct), count
  }))

  // 5) Category distribution (pie)
  const pieData = Object.entries(data.categoryCount).map(([category, count]) => ({
    category, count
  }))

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-semibold">Idea Analytics</h1>

      <div className="grid grid-cols-3 grid-rows-2 gap-6 auto-rows-[320px]">
        {/* ─── IDEAS OVER TIME ─────────────────────────────────────── */}
        <section className="col-span-2 bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-2">Ideas Over Time</h2>
          <ResponsiveContainer width="100%" height="88%">
            <LineChart data={lineData}>
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
              />
              <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke={PRIMARY}
                strokeWidth={3}
                dot={{ fill: PRIMARY }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* ─── SCORE BUCKETS ───────────────────────────────────────── */}
        <section className="bg-white rounded-xl shadow p-4">
          <h3 className="text-md font-medium mb-2">Score Buckets (%)</h3>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={barData1}>
              <CartesianGrid stroke="#E5E7EB" />
              <XAxis dataKey="bucket" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill={PRIMARY}>
                <LabelList dataKey="count" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* ─── CATEGORY DISTRIBUTION ───────────────────────────────── */}
        <section className="bg-white rounded-xl shadow p-4">
          <h3 className="text-md font-medium mb-2">Category Distribution</h3>
          <ResponsiveContainer width="100%" height="88%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={SHADES[i % SHADES.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </section>

        {/* ─── ROI DISTRIBUTION ────────────────────────────────────── */}
        <section className="bg-white rounded-xl shadow p-4">
          <h3 className="text-md font-medium mb-2">ROI Distribution (%)</h3>
          <ResponsiveContainer width="100%" height="88%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis
                dataKey="roiPct"
                label={{ value: 'ROI (%)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke={PRIMARY}
                fill="url(#roiGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        {/* ─── EFFORT DISTRIBUTION ─────────────────────────────────── */}
        <section className="bg-white rounded-xl shadow p-4">
          <h3 className="text-md font-medium mb-2">Effort Distribution (%)</h3>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={barData2}>
              <CartesianGrid stroke="#E5E7EB" />
              <XAxis
                dataKey="effortPct"
                label={{ value: 'Effort (%)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill={PRIMARY}>
                <LabelList dataKey="count" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  )
}
