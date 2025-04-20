import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ideaData = {
  1: {
    title: "Automated Customer Support Bot",
    description: "An AI bot to resolve user issues quickly...",
    roi: "High",
    effort: "Medium",
    score: 87,
    reason: "High demand + Medium effort → quick ROI"
  },
  2: {
    title: "Smart Inventory Alert System",
    description: "Monitors stock levels and sends alerts...",
    roi: "Medium",
    effort: "Low",
    score: 82,
    reason: "Simple to build + solves a real ops pain"
  },
  3: {
    title: "AI-based Resume Matcher",
    description: "Matches resumes with job descriptions...",
    roi: "High",
    effort: "High",
    score: 78,
    reason: "High impact but complex to implement"
  },
};

export default function IdeaDetails() {
  const { id } = useParams();
  const idea = ideaData[id];
  const navigate = useNavigate();

  if (!idea) return <div className="p-10">Idea not found</div>;

  return (
    <div className="p-10">
      <button
        onClick={() => navigate("/app")}
        className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        ⬅ Back to Ideas
      </button>

      <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
      <p className="text-gray-700 mb-4">{idea.description}</p>
      <p><strong>ROI:</strong> {idea.roi}</p>
      <p><strong>Effort:</strong> {idea.effort}</p>
      <p><strong>Score:</strong> {idea.score}</p>
      <p className="mt-4 italic text-indigo-600">Why it's ranked here: {idea.reason}</p>
    </div>
  );
}