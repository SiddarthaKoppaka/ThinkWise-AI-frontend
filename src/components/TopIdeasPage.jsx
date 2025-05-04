import React from "react"
import { useLocation } from "react-router-dom"
import { useTopByFile }   from "../hooks/useIdeas"
import IdeaList          from "../components/IdeaList"

export default function TopIdeasPage() {
  const filename = new URLSearchParams(useLocation().search).get("filename")
  const {
    data: ideas = [],
    isLoading,
    isError,
    error
  } = useTopByFile(filename)

  if (!filename)  return <p>No filename provided.</p>
  if (isLoading)  return <p>Loading top ideas…</p>
  if (isError)    return <p className="text-red-600">Error: {error.message}</p>

  return <IdeaList ideas={ideas} title="Your Top 3 Ideas" />
}
