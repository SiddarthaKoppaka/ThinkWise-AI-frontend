// src/components/IdeaStore.jsx
import React from 'react'
import { Link } from 'react-router-dom'
export default function IdeaStore() {
    const ideas = [
        {
          id: 1,
          title: "Automated Chatbot",
          description:
            "An AI-powered assistant that handles customer questions 24/7, learning from each interaction.",
          eie: 45,
          roi: 80,
          score: 75,
        },
        {
          id: 2,
          title: "Smart Inventory Optimizer",
          description:
            "Predicts stock needs using real-time sales data to minimize waste and maximize turnover.",
          eie: 60,
          roi: 90,
          score: 82,
        },
        {
          id: 3,
          title: "Sentiment-Driven Marketing",
          description:
            "Analyzes social media sentiment to tailor marketing campaigns on the fly.",
          eie: 50,
          roi: 85,
          score: 78,
        },
      ]

  return (
    <div className="relative h-full p-8">
      <div className="absolute inset-0 bg-grid-pattern"></div>

      <div className="
        relative
        max-w-5xl mx-auto            /* made wider */
        bg-white bg-opacity-60
        rounded-3xl p-8 shadow-lg
        space-y-6
      ">
        <h2 className="text-2xl font-semibold text-gray-800">
          Your Idea Store
        </h2>

        <div className="space-y-4">
          {ideas.map(({ id, title, description, eie, roi, score }) => (
            <div
              key={id}
              className="
                bg-white
                rounded-xl
                shadow-xl
                p-6
                flex justify-between items-start
              "
            >
              {/* Left: title, desc, tags */}
              <div className="max-w-[65%]">
                <h3 className="text-lg font-semibold text-gray-800">
                  {title}
                </h3>
                <p className="mt-2 text-gray-600">{description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="
                      bg-primary-100 text-primary-600
                      px-2 py-1 rounded-full text-sm
                    ">
                    EIE: {eie}
                  </span>
                  <span className="
                      bg-primary-100 text-primary-600
                      px-2 py-1 rounded-full text-sm
                    ">
                    ROI: {roi}
                  </span>
                </div>
              </div>

              {/* Right: score + button */}
              <div className="flex flex-col items-center justify-between h-full">
                <div className="text-4xl font-bold text-primary-700">
                  {score}
                </div>
                <Link
                 to={`/ideas/${id}`}
                className="mt-6 bg-primary-600 text-white px-4 py-2 rounded-full text-sm hover:bg-primary-700 transition"
               >
                 Know More
               </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
