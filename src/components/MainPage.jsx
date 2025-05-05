// src/components/MainPage.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { IconMenu2, IconLoader } from '@tabler/icons-react'
import { useAnalyzeCsv } from '../hooks/useAnalysis'
import { useCurrentUser, useLogout } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import SingleIdeaForm from '../components/SingleIdeaForm'
import { motion } from 'framer-motion';
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
  const loadingMessages = [
    "Compiling idea brilliance…",
    "Negotiating with AI agents…",
    "Ranking ROI like a Wall Street pro…",
    "Translating CSV into genius thoughts…",
    "Counting how many ideas beat the boss’s…",
    "Making ChatGPT jealous…",
    "Building a startup in your spreadsheet…",
    "Plotting effort vs. enlightenment…",
  ];
  
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  useEffect(() => {
    if (analyzeMutation.isLoading) {
      const interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500); // change message every 2.5s
      return () => clearInterval(interval);
    }
  }, [analyzeMutation.isLoading]);

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
          <div className="mt-8 grid md:grid-cols-2 gap-6">
  {/* ROI Slider */}
  <div className="bg-gray-100 p-4 rounded-lg">
    <label className="block text-gray-700">
      Return On Investment <span className="text-gray-500 text-sm">(0–100)</span>
    </label>
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
      className="w-full mt-2"
    />
    <p className="mt-1 text-gray-500 text-sm">
      Your expected ROI: {roi}%
    </p>
  </div>

  {/* EIE Slider */}
  <div className="bg-gray-100 p-4 rounded-lg">
    <label className="block text-gray-700">
      Effort of Estimation <span className="text-gray-500 text-sm">(0–100)</span>
    </label>
    <input
      type="range"
      min="0"
      max="100"
      value={eie}
      onChange={e => {
        const newEie = +e.target.value;
        setEie(newEie);
        setRoi(100 - newEie);
      }}
      className="w-full mt-2"
    />
    <p className="mt-1 text-gray-500 text-sm">
      Estimated effort: {eie}%
    </p>
  </div>
</div>


          {/* BUNCH mode */}
          {mode === 'bunch' && (
            <>
            {/* Instructional Alert */}
    <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm">
    <p className="font-medium">Required CSV Columns:</p>
    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
      <li><strong>title</strong> – Name of the idea</li>
      <li><strong>description</strong> – A short description of the idea</li>
      <li><strong>category</strong> – The category or domain of the idea</li>
      <li><strong>author</strong> – Creator or submitter of the idea</li>
    </ul>
    <p className="text-xs text-gray-600 mt-2">Ensure the header row matches these exactly.</p>
  </div>
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
                {file ? `${file.name}` : 'Click or drag CSV to upload'}
              </label>

              <button
  onClick={handleAnalyze}
  disabled={analyzeMutation.isLoading}
  className={`
    mt-6 w-full flex flex-col items-center justify-center
    py-3 rounded-lg font-medium transition text-center
    ${analyzeMutation.isLoading
      ? 'bg-blue-400 text-white opacity-90 cursor-wait'
      : 'bg-blue-600 text-white hover:bg-blue-700'}
  `}
>
  {analyzeMutation.isLoading ? (
    <>
      <IconLoader className="animate-spin mb-1" />
      <motion.span
        key={quoteIndex}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.4 }}
        className="text-sm font-medium"
      >
        {loadingMessages[quoteIndex]}
      </motion.span>
    </>
  ) : 'Analyze CSV'}
</button>
            </div>
            </>
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
