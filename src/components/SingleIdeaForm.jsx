import React, { useState } from 'react'
import { IconLoader }     from '@tabler/icons-react'
import { useAnalyzeSingle } from '../hooks/useAnalysis'
import { useNavigate }      from 'react-router-dom'
import {lookupIdeaByIdAndFilename} from '../api/ideaService'

export default function SingleIdeaForm({ roi, eie }) {
  const [title, setTitle]         = useState('')
  const [author, setAuthor]       = useState('')
  const [category, setCategory]   = useState('')
  const [description, setDescription] = useState('')

  const navigate = useNavigate()
  const mutation = useAnalyzeSingle()

const handleSubmit = () => {
  if (!title || !description) {
    return alert('Title and description are required')
  }

  const idea = { title, author, category, description }
  mutation.mutate(
    { idea, roiWeight: roi/100, eieWeight: eie/100 },
    {
      onSuccess: async ({ idea_id }) => {
        try {
          const filename = 'Single' // Or whatever your backend assigns
          const result = await lookupIdeaByIdAndFilename(idea_id, filename)
          const mongoId = result.idea._id

          navigate(`/app/ideas/${mongoId}`, {
            state: {
              idea: {
                ...result.idea,
                roi: Math.round(roi),
                eie: Math.round(eie),
              }
            }
          })
        } catch (err) {
          console.error(err)
          alert("Failed to lookup idea by idea_id and filename")
        }
      },
      onError: err => {
        console.error(err)
        alert(`Analysis failed: ${err.response?.data?.detail || err.message}`)
      }
    }
  )
}

  const loading = mutation.isLoading

  return (
    <div className="mt-6 space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        disabled={loading}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        className="w-full p-2 border rounded"
        disabled={loading}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full p-2 border rounded"
        disabled={loading}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full p-2 border rounded h-32"
        disabled={loading}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`
          w-full py-2 rounded font-medium transition
          ${loading
            ? 'bg-blue-400 text-white opacity-75 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'}
        `}
      >
        {loading
          ? <>
              <IconLoader className="animate-spin mr-2" />
              Analyzing…
            </>
          : 'Analyze Idea'}
      </button>
    </div>
  )
}
