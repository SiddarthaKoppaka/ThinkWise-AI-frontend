import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IdeaChatBot from './IdeaChatBot';
import AnalyticsPage from './AnalyticsPage';
import SearchIdeasPage from './SearchIdeasPage';
import { loginUser } from "../utils/api";
const UPLOAD_API = "http://localhost:8000/analyze/csv";
const TOP_IDEAS_API = "http://localhost:8000/ideas/top";

export default function IdeaPage() {
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ author: '', title: '', category: '', description: '' });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  // const [topIdeas, setTopIdeas] = useState([]);
  const [topIdeas, setTopIdeas] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
const [showAuthModal, setShowAuthModal] = useState(true);
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [token, setToken] = useState(localStorage.getItem("token") || "");

useEffect(() => {
  if (token) {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  }
}, [token]);

useEffect(() => {
  if (!token) return;

  const fetchTopIdeas = async () => {
    try {
      const res = await fetch("http://localhost:8000/ideas/overall_top", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTopIdeas(data.top_3_ideas || []);
    } catch (err) {
      console.error("Error fetching previous top 3 ideas:", err);
    }
  };

  fetchTopIdeas();
}, [token]);


  const handleChange = (e) => {
    const { name, value, maxLength } = e.target;
    if (value.length <= maxLength) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    alert("Idea Submitted:\n" + JSON.stringify(formData, null, 2));
    setFormData({ author: '', title: '', category: '', description: '' });
    setShowForm(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
    setIsProcessing(true);
    setShowIdeas(false);
  
    try {
      const uploadRes = await fetch(UPLOAD_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach token here
        },
        body: formData,
      });
  
      const uploadData = await uploadRes.json();
  
      if (uploadRes.ok && uploadData?.status === "ok" && uploadData?.filename) {
        const filename = encodeURIComponent(uploadData.filename);
  
        const topRes = await fetch(`${TOP_IDEAS_API}?filename=${filename}`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Also required for this fetch
          },
        });
  
        const topData = await topRes.json();
        setTopIdeas(topData.top_3_ideas || []);
  
        setTimeout(() => {
          setShowIdeas(true);
          setIsProcessing(false);
        }, 3000); // ❗Change 30000 to 3000 or a more realistic timeout
      } else {
        throw new Error("Backend analysis failed or filename missing.");
      }
    } catch (err) {
      alert("Upload or analysis failed: " + err.message);
      setIsProcessing(false);
    }
  };
  
 
  
  
  return (
    <>
     {showAuthModal && (
  <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full space-y-6">
      <div className="text-center space-y-1">
        <img src="/icon.png" alt="Logo" className="mx-auto w-14 h-14 rounded-full shadow" />
        <h2 className="text-2xl font-bold text-indigo-700">Welcome to Thinkwise</h2>
        <p className="text-gray-500 text-sm">Login or create an account to evaluate your brilliant ideas.</p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          className={`text-sm font-semibold ${
            !showForm ? 'text-indigo-600 underline' : 'text-gray-500'
          }`}
          onClick={() => setShowForm(false)}
        >
          Login
        </button>
        <button
          className={`text-sm font-semibold ${
            showForm ? 'text-indigo-600 underline' : 'text-gray-500'
          }`}
          onClick={() => setShowForm(true)}
        >
          Register
        </button>
      </div>

      {!showForm ? (
        <>
          {/* Login Form */}
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={async () => {
                try {
                  const { access_token } = await loginUser(email, password);
                  localStorage.setItem("token", access_token);
                  setToken(access_token);
                  setIsAuthenticated(true);
                  setShowAuthModal(false);
                } catch (err) {
                  alert("❌ Login failed: " + err.message);
                }
              }}
              className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Sign In
            </button>
            <button className="text-sm text-indigo-500 hover:underline">
              Forgot password?
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Register Form */}
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={async () => {
                try {
                  const res = await fetch("http://localhost:8000/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                  });
                  if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.detail || "Registration failed");
                  }
                  alert("✅ Registered successfully! Please log in.");
                  setShowForm(false); // Switch to login tab
                } catch (err) {
                  alert("❌ Registration failed: " + err.message);
                }
              }}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Account
            </button>
          </div>
        </>
      )}

      <div className="text-center">
      <button
  onClick={() => navigate("/")} // 👈 this assumes your landing page is at "/"
  className="text-gray-400 text-xs hover:underline mt-3"
>
  Exit and go back
</button>
      </div>
    </div>
  </div>
)}


  <div className={`relative ${!isAuthenticated ? 'pointer-events-none blur-sm' : ''}`}>
    <div className="relative flex h-screen overflow-hidden">
  {/* Background Image with 50% opacity */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-100"
    style={{ backgroundImage: "url('/IdeaPage3.jpg')" }}
  />

      {/* Sidebar */}
      <div className="w-1/6 bg-white/30 backdrop-blur-md p-6 shadow-xl border-r border-white/30 transition-all duration-300 ease-in-out animate-fade-in">

        <div
          className="flex flex-col space-y-1 mb-6 cursor-pointer hover:opacity-90"
          onClick={() => {
            setSelectedIdea(null);
            setShowForm(false);
            setShowAnalytics(false);
            setShowSearch(false);
            setShowIdeas(false);
          }}
        >
          <div className="flex items-center space-x-3 hover:scale-105 transform transition-transform duration-200">
  <div className="w-20 h-10 rounded-full overflow-hidden shadow-inner">
    <img
      src="/icon.png"
      alt="Brain Icon"
      className="w-full h-full object-cover"
    />
  </div>
  <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
    Thinkwise
  </h1>
</div>

        </div>

        <h2 className="text-lg font-semibold mb-4 text-purple-700 flex items-center gap-2">
          Previous Top 3 Ideas
          <span className='text-sm text-gray-400'>Curated by ROI + Effort</span>
        </h2>

        {topIdeas.map((idea, idx) => (
          <div
            key={`sidebar-idea-${idea.idea_id || idx}`}
            className="bg-white p-4 mb-4 rounded-lg shadow hover:shadow-xl transition-transform duration-300 ease-out transform hover:-translate-y-1 hover:scale-[1.02] animate-fade-in-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <h3 className="font-semibold text-sm text-gray-900 mb-1">{idea.title}</h3>
            <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-green-100 text-green-700 px-3 py-0.5 rounded-full">
  ROI: {idea.analysis?.final_summary?.final_summary?.roi_score ??
        idea.analysis?.roi?.score?.toFixed(2) ??
        "N/A"}
</span>
<span className="bg-yellow-100 text-yellow-700 px-3 py-0.5 rounded-full">
  Effort: {idea.analysis?.final_summary?.final_summary?.eie_score ??
           idea.analysis?.eie?.score?.toFixed(2) ??
           "N/A"}
</span>
<span className="bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full">
  Score: {(() => {
    const roi = idea.analysis?.roi?.score;
    const eie = idea.analysis?.eie?.score;
    return roi && eie ? (roi / eie).toFixed(2) : idea.score?.toFixed?.(2) ?? "N/A";
  })()}
</span>

            </div>
            <button
              onClick={() => {
                setSelectedIdea(idea);
                setShowForm(false);
                setShowAnalytics(false);
                setShowSearch(false);
              }}
              className="mt-3 text-indigo-600 hover:underline text-xs font-medium"
            >
              Learn more →
            </button>
          </div>
        ))}

        <div className="mt-6 space-y-3">
          <button
            onClick={() => {
              setShowAnalytics(true);
              setSelectedIdea(null);
              setShowForm(false);
              setShowSearch(false);
            }}
            className="w-full text-left px-4 py-3 bg-gradient-to-r from-purple-400 to-purple-600 text-white text-sm font-semibold rounded-xl shadow hover:scale-105 transition"
          >
            View Analytics
          </button>
          <button
            onClick={() => {
              setShowSearch(true);
              setSelectedIdea(null);
              setShowForm(false);
              setShowAnalytics(false);
            }}
            className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-sm font-semibold rounded-xl shadow hover:scale-105 transition"
          >
            Search Ideas
          </button>

          {isAuthenticated && (
    <div className="absolute bottom-6 left-6 right-6 text-sm text-gray-800 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold">👤 {username}</span>
        <button
  onClick={() => {
    localStorage.removeItem("token");
    setToken("");
    setIsAuthenticated(false);
    setShowAuthModal(true);
  }}
  className="text-red-500 hover:underline text-xs"
>
  Logout
</button>

      </div>
      <button className="text-indigo-600 hover:underline text-xs">
        ⚙️ Settings
      </button>
    </div>
  )}
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
        {selectedIdea ? (
          <div className="w-full h-full animate-slide-up-fade transition-all duration-700 ease-in-out">
            <IdeaChatBot idea={selectedIdea} onBack={() => setSelectedIdea(null)} />
          </div>
        ) : showAnalytics ? (
          <AnalyticsPage />
        ) : showSearch ? (
          <SearchIdeasPage />
        ) : showForm ? (
          <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-lg animate-fade-in space-y-4">
            <h2 className="text-2xl font-bold text-center text-indigo-700">✍️ Submit a Game-Changing Idea</h2>
            <p className="text-sm text-gray-500 text-center">Every big product started with a wild idea. Yours could be next.</p>
            <input
              name="author"
              maxLength={150}
              value={formData.author}
              onChange={handleChange}
              placeholder=" Full Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              name="title"
              maxLength={150}
              value={formData.title}
              onChange={handleChange}
              placeholder=" Idea Title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              name="category"
              maxLength={150}
              value={formData.category}
              onChange={handleChange}
              placeholder=" Category (e.g., AI, HR, Sales...)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <textarea
              name="description"
              maxLength={1000}
              value={formData.description}
              onChange={handleChange}
              placeholder=" Describe your idea in detail..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-400 text-right">Max 200 words</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Submit Idea
              </button>
            </div>
          </div>
        ) : (
          <div className={`flex flex-col items-center w-full space-y-10 animate-fade-in transition-all duration-700 ${topIdeas.length ? 'mt-4' : 'justify-center h-full'}`}>
            {/* Header */}
            <div className="text-center space-y-10">
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gray-800 animate-pulse">
                🌱 Got a Brilliant Idea?
              </h1>
              <p className="text-xs font-bold text-gray-400/80">Let it bloom, get ranked, and make an impact ✨</p>

              <div className="flex space-x-4 justify-center">
                <input
                  id="idea-upload"
                  type="file"
                  accept=".json,.csv"
                  hidden
                  onChange={handleFileUpload}
                />
                <button
  type="button"
  onClick={() => document.getElementById("idea-upload").click()}
  className="bg-white border border-gray-300 px-6 py-2 rounded-full shadow hover:bg-gray-100 flex items-center gap-2"
  aria-label="Upload Idea File"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className="w-5 h-5"
    fill="currentColor"
  >
    <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
  </svg>
  Upload Idea File
</button>

<button
  type="button"
  onClick={() => setShowForm(true)}
  className="bg-sky-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-sky-600 transition flex items-center gap-2"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    viewBox="0 0 16 16"
    className="bi bi-lightbulb-fill"
  >
    <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5" />
  </svg>
  Enter Idea Manually
</button>

              </div>

              <div className="text-sm text-gray-600 max-w-xl text-center space-y-2 mt-2 px-4">
                <p>
                 <strong>Upload Idea File</strong> lets you submit a file (CSV/JSON) containing multiple ideas.
                  We'll extract the <span className="text-White-600 font-medium">Top 3</span> using ROI, Effort, Score.
                </p>
                <p>
                  <strong>Enter Idea Manually</strong> gives you instant evaluation from our AI engine.
                </p>
              </div>
            </div>

            {/* Funny Loading */}
            {isProcessing && (
              <div className="text-center text-lg text-purple-600 animate-bounce mt-10">
                🤔 Analyzing brilliance... ✨ Brewing innovation soup 🍜
              </div>
            )}

            {/* Render Top 3 Ideas */}
            {showIdeas && topIdeas.length > 0 && (
              <div className="flex flex-wrap justify-center gap-6 mt-6 w-full animate-fade-in-up">
                {topIdeas.map((idea, idx) => (
                  <div
                    key={`uploaded-idea-${idea.idea_id || idx}`}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-xl transition-transform duration-300 ease-out transform hover:-translate-y-1 hover:scale-[1.02] animate-fade-in-up w-80"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{idea.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{idea.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs mb-2">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
  ROI: {idea.analysis?.final_summary?.final_summary?.roi_score ??
        idea.analysis?.roi?.score?.toFixed(2) ??
        "N/A"}
</span>
<span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
  Effort: {idea.analysis?.final_summary?.final_summary?.eie_score ??
           idea.analysis?.eie?.score?.toFixed(2) ??
           "N/A"}
</span>
<span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
  Score: {(() => {
    const roi = idea.analysis?.roi?.score;
    const eie = idea.analysis?.eie?.score;
    return roi && eie ? (roi / eie).toFixed(2) : idea.score?.toFixed?.(2) ?? "N/A";
  })()}
</span>

                      {idea.category && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Category: {idea.category}</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedIdea({
                          ...idea,
                          title: idea.title || "N/A",
                          category: idea.category || "N/A"
                        });
                        setShowForm(false);
                        setShowAnalytics(false);
                        setShowSearch(false);
                      }}
                      className="mt-2 text-indigo-600 hover:underline text-xs font-medium"
                    >
                      Learn more →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
    </>
  );
}
