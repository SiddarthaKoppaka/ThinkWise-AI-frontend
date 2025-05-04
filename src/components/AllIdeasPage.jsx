import React from "react"
import { useAllIdeas } from "../hooks/useIdeas"
import IdeaList from "../components/IdeaList"

export default function AllIdeasPage() {
  const {
    data: ideas = [],       // default to [] so map never fails
    isLoading,
    isError,
    error
  } = useAllIdeas()
  console.log(ideas)
  if (isLoading) return <p className="p-4">Loading ideas…</p>
  if (isError)   return <p className="p-4 text-red-600">Error: {error.message}</p>

  return <IdeaList ideas={ideas} title="All Ideas" />
}
