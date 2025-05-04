// src/components/SingleIdeaForm.jsx
import React, { useState } from 'react'
import { IconLoader } from '@tabler/icons-react'
import { useAnalyzeSingle } from '../hooks/useAnalysis'
import { fetchIdeaById } from '../api/ideaService'
import { useNavigate } from 'react-router-dom'

export default function SingleIdeaForm({ roi, eie }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const mutation = useAnalyzeSingle()

  const handleSubmit = () => {
    if (!title || !description) {
      return alert('Title and description are required')
    }

    const payload = { title, author, category, description }
    setLoading(true)

    // 1) send to analyze/single
    mutation.mutate(
      { idea: payload, roiWeight: roi / 100, eieWeight: eie / 100 },
      {
              onSuccess: async ({ id }) => {
                  try {
                    // now id === Mongo’s _id
                    const fullIdea = await fetchIdeaById(id)
                    navigate(`/app/ideas/${id}`, { state: { idea: fullIdea } })
                  } catch (fetchErr) {
                    console.error(fetchErr)
                    alert(`Failed to load analyzed idea: ${fetchErr.message}`)
                  } finally {
                    setLoading(false)
                  } 
        },
        onError: err => {
          console.error(err)
          alert(`Analysis failed: ${err.message}`)
          setLoading(false)
        }
      }
    )
  }

  const isBusy = loading || mutation.isLoading

  return (
    <div className="mt-6 space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        disabled={isBusy}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        className="w-full p-2 border rounded"
        disabled={isBusy}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full p-2 border rounded"
        disabled={isBusy}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full p-2 border rounded h-32"
        disabled={isBusy}
      />
      <button
        onClick={handleSubmit}
        disabled={isBusy}
        className={`
          w-full py-2 rounded font-medium transition
          ${isBusy
            ? 'bg-blue-400 text-white opacity-75 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'}
        `}
      >
        {isBusy ? (
          <>
            <IconLoader className="animate-spin mr-2" />
            Processing…
          </>
        ) : (
          'Analyze Idea'
        )}
      </button>
    </div>
  )
}
