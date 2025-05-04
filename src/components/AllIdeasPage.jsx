// src/pages/AllIdeasPage.jsx
import React from "react"
import { IconLoader } from "@tabler/icons-react"
import { useAllIdeas } from "../hooks/useIdeas"
import IdeaList from "../components/IdeaList"

export default function AllIdeasPage() {
  const {
    data: ideas = [],       // default to [] so map never fails
    isLoading,
    isError,
    error
  } = useAllIdeas()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-20">
        <IconLoader className="w-12 h-12 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-600">Loading ideas…</p>
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
        <p className="text-gray-600">No ideas have been evaluated yet.</p>
      </div>
    )
  }

  return <IdeaList ideas={ideas} title="All Ideas" />
}
