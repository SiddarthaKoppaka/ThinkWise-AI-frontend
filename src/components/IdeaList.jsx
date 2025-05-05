import React from "react"
import { Link } from "react-router-dom"

export default function IdeaList({ ideas, title }) {
  return (
    <div className="relative h-full p-8">
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="
        relative
        max-w-5xl mx-auto
        bg-white bg-opacity-60
        rounded-3xl p-8 shadow-lg
        space-y-6
      ">
        {title && (
          <h2 className="text-2xl font-semibold text-gray-800">
            {title}
          </h2>
        )}

        <div className="space-y-4">
          {ideas.map(idea => {
            // pull out the fields you want to display
            const { id, title, description, effort, roi, score } = idea
            return (
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
                      EIE: {(effort * 100).toFixed(1)}
                    </span>
                    <span className="
                        bg-primary-100 text-primary-600
                        px-2 py-1 rounded-full text-sm
                      ">
                      ROI: {(roi * 100).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-between h-full">
                  <div className="text-4xl font-bold text-primary-700">
                  {(score * 100).toFixed(1)}
                  </div>
                  <Link
                    to={`/app/ideas/${id}`}
                    state={{ idea }}        // ← pass the full object here
                    className="mt-6 bg-primary-600 text-white px-4 py-2 rounded-full text-sm hover:bg-primary-700 transition"
                  >
                    Know More
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
