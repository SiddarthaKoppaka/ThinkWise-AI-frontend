// src/pages/TopIdeasPage.jsx
import React from "react"
import { useLocation } from "react-router-dom"
import { IconLoader } from "@tabler/icons-react"
import { useTopByFile } from "../hooks/useIdeas"
import IdeaList from "../components/IdeaList"

export default function TopIdeasPage() {
  const filename = new URLSearchParams(useLocation().search).get("filename")
  const {
    data: ideas = [],
    isLoading,
    isError,
    error,
  } = useTopByFile(filename)

  if (!filename) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-600">No filename provided.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-20">
        <IconLoader className="w-12 h-12 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-600">Analyzing ideas…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-full mt-20">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    )
  }

  if (!ideas.length) {
    return (
      <div className="flex justify-center items-center h-full mt-20">
        <p className="text-gray-600">
          No ideas found for&nbsp;
          <span className="font-medium">"{filename}"</span>.
        </p>
      </div>
    )
  }

  return <IdeaList ideas={ideas} title="Your Top 3 Ideas" />
}