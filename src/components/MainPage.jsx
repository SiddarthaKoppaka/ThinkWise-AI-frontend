// src/components/MainPage.jsx
import React, { useState, useMemo, useCallback } from 'react'
import { IconMenu2, IconLoader } from '@tabler/icons-react'
import { useAnalyzeCsv } from '../hooks/useAnalysis'
import { useCurrentUser, useLogout } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import SingleIdeaForm from '../components/SingleIdeaForm'
import { useAnalyzeSingle } from '../hooks/useAnalysis'

export default function MainPage({ toggleSidebar }) {
  // — AUTH & LOGOUT —
  const { data: user } = useCurrentUser()
  const { mutate: logout } = useLogout()
  const firstName = user?.first_name ?? 'User'

  // — GREETING —
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 18 ? 'Good afternoon' :
    'Good evening'
  const today = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    []
  )

  // — FORM STATE —
  const [mode, setMode] = useState(null)      // 'bunch' | 'single'
  const [file, setFile] = useState(null)
  const [eie,  setEie]  = useState(50)
  const [roi,  setRoi]  = useState(50)

  const navigate = useNavigate()
  const analyzeMutation = useAnalyzeCsv()

  const handleAnalyze = () => {
    if (!file) {
      return alert('Please select a CSV file.')
    }
    analyzeMutation.mutate(
      { file, roiWeight: roi/100, eieWeight: eie/100 },
      {
        onSuccess: ({ filename }) => {
          navigate(
            `/app/ideas/top?filename=${encodeURIComponent(filename)}`,
            { replace: true }
          )
        },
        onError: err => {
          console.error(err)
          const msg = err.response?.data?.detail
                   || err.response?.data?.error
                   || err.message
                   || 'Unknown error'
          alert(`Analysis failed: ${msg}`)
        }
      }
    )
  }

  // — Drag & drop CSV support —
  const onDrop = useCallback(e => {
    e.preventDefault()
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }, [])

  return (
    <div className="relative h-full">
      {/* Mobile sidebar toggle (logout removed) */}
      <div className="md:hidden p-4">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-white rounded shadow"
        >
          <IconMenu2 size={20} />
        </button>
      </div>

      {/* Center card */}
      <div className="h-full p-8 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="
            relative w-full max-w-3xl
            bg-white bg-opacity-80
            rounded-3xl p-8 shadow-lg
            hover:scale-[1.02] transition-transform
          ">
          {/* Greeting (desktop logout removed) */}
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">
              {greeting}, {firstName}!
            </h2>
            <p className="text-gray-500 text-sm">{today}</p>
          </div>

          <p className="mt-4 text-gray-600 uppercase tracking-wide text-sm">
            Would you like to evaluate a bunch or a single idea?
          </p>

          {/* Mode toggle */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {['bunch', 'single'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`
                  py-2 rounded font-medium transition
                  ${mode === m
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                `}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          {/* Sliders */}
          <div className="mt-8">
  <label className="block text-gray-700 font-medium mb-2 text-center">
    ROI vs EIE Preference
  </label>
  <div className="w-full px-2">
    <input
      type="range"
      min="0"
      max="100"
      value={roi}
      onChange={e => {
        const newRoi = +e.target.value;
        setRoi(newRoi);
        setEie(100 - newRoi);
      }}
      className="w-full appearance-none bg-blue-200 h-2 rounded-full outline-none transition-all"
    />
    <div className="text-center text-sm text-gray-600 mt-2">
      <strong>{roi}% ROI</strong> &nbsp;|&nbsp; <strong>{eie}% EIE</strong>
    </div>
  </div>
</div>

          {/* BUNCH mode */}
          {mode === 'bunch' && (
            <div
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
              className={`
                mt-6 p-6 rounded-lg border-4 border-dashed
                ${analyzeMutation.isLoading
                  ? 'border-blue-300 animate-pulse bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'}
                transition-colors
              `}
            >
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={e => setFile(e.target.files[0] || null)}
                className="hidden"
              />
              <label
                htmlFor="csv-upload"
                className="block text-center cursor-pointer text-gray-700"
              >
                {file ? `📄 ${file.name}` : 'Click or drag CSV to upload'}
              </label>

              <button
                onClick={handleAnalyze}
                disabled={analyzeMutation.isLoading}
                className={`
                  mt-6 w-full flex items-center justify-center
                  py-3 rounded-lg font-medium transition
                  ${analyzeMutation.isLoading
                    ? 'bg-blue-400 text-white opacity-75 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'}
                `}
              >
                {analyzeMutation.isLoading
                  ? <>
                      <IconLoader className="animate-spin mr-2" />
                      Analyzing…
                    </>
                  : 'Analyze CSV'}
              </button>
            </div>
          )}

          {/* SINGLE mode */}
          {mode === 'single' && (
            <SingleIdeaForm
            roi={roi}
            eie={eie}
            />
          )}
        </div>
      </div>
    </div>
  )
}
