import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
  Title,
  Filler,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
  Title,
  Filler
);

export default function AnalyticsPage() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await fetch("http://localhost:8000/data");
        const data = await res.json();
        console.log("📦 Raw data from backend:", data);
        if (Array.isArray(data)) {
          setIdeas(data);
        } else {
          console.error("❌ Data is not an array", data);
        }
      } catch (error) {
        console.error("❌ Failed to fetch data:", error);
      }
    };
    fetchIdeas();
  }, []);

  if (!Array.isArray(ideas) || ideas.length === 0) {
    return <div className="text-center text-gray-500 text-lg mt-10">Loading idea insights...</div>;
  }

  // Metrics containers
  const categoryCount = {};
  const roiDistribution = {};
  const effortDistribution = {};
  const effortVsRoi = {};
  const scoreBuckets = { '60-69': 0, '70-79': 0, '80-89': 0, '90-100': 0 };
  const categoryScores = {};
  const ideasOverTime = {};

  // Process all ideas
  ideas.forEach((idea) => {
    const category = idea.category || 'Uncategorized';
    const roi = idea.roi || 'Unknown';
    const effort = idea.effort || 'Unknown';
    const score = Number(idea.score || 0);

    categoryCount[category] = (categoryCount[category] || 0) + 1;
    roiDistribution[roi] = (roiDistribution[roi] || 0) + 1;
    effortDistribution[effort] = (effortDistribution[effort] || 0) + 1;

    const combo = `${effort}-${roi}`;
    effortVsRoi[combo] = (effortVsRoi[combo] || 0) + 1;

    if (score < 70) scoreBuckets['60-69']++;
    else if (score < 80) scoreBuckets['70-79']++;
    else if (score < 90) scoreBuckets['80-89']++;
    else scoreBuckets['90-100']++;

    if (!categoryScores[category]) categoryScores[category] = [];
    categoryScores[category].push(score);

    const month = idea.last_updated
      ? format(new Date(idea.last_updated), 'yyyy-MM')
      : 'Unknown';
    ideasOverTime[month] = (ideasOverTime[month] || 0) + 1;
  });

  // Data for line chart
  const chartIdeasOverTime = {
    labels: Object.keys(ideasOverTime).sort(),
    datasets: [
      {
        label: 'Ideas Submitted per Month',
        data: Object.entries(ideasOverTime)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([_, v]) => v),
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: 'Category' } },
      y: { title: { display: true, text: 'Count' }, beginAtZero: true },
    },
  };

  const scoreBarOptions = {
    ...barOptions,
    scales: {
      x: { title: { display: true, text: 'Score Range' } },
      y: { title: { display: true, text: 'Number of Ideas' }, beginAtZero: true },
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 overflow-y-auto h-full bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-12 tracking-tight drop-shadow">
        📊 Idea Analytics Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Ideas per Category */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Ideas per Category</h3>
          <Bar
            data={{
              labels: Object.keys(categoryCount),
              datasets: [
                {
                  label: 'Ideas per Category',
                  data: Object.values(categoryCount),
                  backgroundColor: 'rgba(99, 102, 241, 0.7)',
                },
              ],
            }}
            options={barOptions}
          />
        </div>

        {/* ROI Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">ROI Distribution</h3>
          <Pie
            data={{
              labels: Object.keys(roiDistribution),
              datasets: [
                {
                  label: 'ROI Distribution',
                  data: Object.values(roiDistribution),
                  backgroundColor: ['#10B981', '#FBBF24', '#EF4444'],
                },
              ],
            }}
          />
        </div>

        {/* Effort Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Effort Distribution</h3>
          <Pie
            data={{
              labels: Object.keys(effortDistribution),
              datasets: [
                {
                  label: 'Effort Distribution',
                  data: Object.values(effortDistribution),
                  backgroundColor: ['#60A5FA', '#FCD34D', '#F87171'],
                },
              ],
            }}
          />
        </div>

        {/* Effort vs ROI */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Effort vs ROI</h3>
          <Bar
            data={{
              labels: Object.keys(effortVsRoi),
              datasets: [
                {
                  label: 'Effort-ROI Pairs',
                  data: Object.values(effortVsRoi),
                  backgroundColor: 'rgba(139, 92, 246, 0.7)',
                },
              ],
            }}
            options={barOptions}
          />
        </div>

        {/* Score Buckets */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Score Buckets</h3>
          <Bar
            data={{
              labels: Object.keys(scoreBuckets),
              datasets: [
                {
                  label: 'Score Distribution',
                  data: Object.values(scoreBuckets),
                  backgroundColor: 'rgba(34, 197, 94, 0.7)',
                },
              ],
            }}
            options={scoreBarOptions}
          />
        </div>

        {/* Avg Score by Category */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Avg Score by Category</h3>
          <Bar
            data={{
              labels: Object.keys(categoryScores),
              datasets: [
                {
                  label: 'Avg Score by Category',
                  data: Object.values(categoryScores).map(
                    (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
                  ),
                  backgroundColor: 'rgba(59, 130, 246, 0.7)',
                },
              ],
            }}
            options={barOptions}
          />
        </div>

        {/* Ideas over Time */}
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">
            Ideas Submitted Over Time (by Month)
          </h3>
          <Line
            data={chartIdeasOverTime}
            options={{
              responsive: true,
              plugins: { legend: { display: true } },
              scales: {
                x: { title: { display: true, text: 'Month' } },
                y: { title: { display: true, text: 'Number of Ideas' }, beginAtZero: true },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
