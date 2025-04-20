// components/IdeaChatBot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IdeaChatBot({ idea, onBack }) {
  const [introMessage, setIntroMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (idea?.analysis?.final_summary?.final_summary) {
      const { title, description, aggregated_reasoning, roi_score, eie_score } =
        idea.analysis.final_summary.final_summary;
      const summaryText = `📝 Overview of "${title}"\n\n${description}\n\n💡 Summary Reasoning:\n${aggregated_reasoning}\n\n📊 ROI Score: ${roi_score} | 🛠️ Effort Score: ${eie_score}`;
      setIntroMessage(summaryText);
    }
  }, [idea]);
  
  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: 'user', text: input }];
    const botResponse = {
      from: 'bot',
      text: `Certainly! Based on "${idea.title}", here's what I know:\n\n${idea.description}\n\nROI: ${idea.roi || "?"} | Effort: ${idea.effort || "?"} | Score: ${idea.score || "?"}`
    };
    setMessages([...newMessages, botResponse]);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!idea) return <div className="p-10 text-center text-lg">Idea not found</div>;

  return (
    <div className="flex flex-col w-full h-full font-sans overflow-hidden animate-slide-up-fade">
      {/* Header */}
      <div className="p-4 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 animate-fade-in-up">AI Assistant — {idea.title}</h1>
        <button
          onClick={onBack}
          className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
        >
          ⬅ Back
        </button>
      </div>

      {/* Main Content */}
      {!showChat ? (
        <div className="max-w-4xl mx-auto w-full px-6 py-10 text-gray-800 animate-fade-in-up">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Idea Overview</h2>
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-3 border border-gray-200">
          <p><strong className="text-indigo-700">Title:</strong> {idea.title}</p>
          <p><strong className="text-indigo-700">Author:</strong> {idea.analysis?.author ?? "Unknown"}</p>
          <p><strong className="text-indigo-700">Category:</strong> {idea.analysis?.category ?? "N/A"}</p>
          <p><strong className="text-indigo-700">Description:</strong> {idea.analysis?.description ?? "No description provided."}</p>
          <p><strong className="text-indigo-700">Summary Reasoning:</strong> {idea.analysis?.final_summary?.final_summary?.aggregated_reasoning ?? "N/A"}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              ROI: {idea.analysis?.final_summary?.final_summary?.roi_score ?? "N/A"}
            </span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
              Effort: {idea.analysis?.final_summary?.final_summary?.eie_score ?? "N/A"}
            </span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              Score: {(() => {
                const roi = idea.analysis?.roi?.score;
                const eie = idea.analysis?.eie?.score;
                return roi && eie ? (roi / eie).toFixed(2) : idea.score?.toFixed?.(2) ?? "N/A";
              })()}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            setMessages([{ from: 'bot', text: introMessage }]);
            setShowChat(true);
          }}
          className="mt-8 px-6 py-2 bg-black text-white  rounded-full hover:scale-105 transition transform duration-300 shadow-lg"
        >
          Chat to Know More
        </button>
      </div>
      
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-w-5xl mx-auto w-full">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === 'bot' ? 'justify-start' : 'justify-end'} animate-fade-in`}>
                <div className="flex items-start space-x-3 w-fit max-w-full">
                  {msg.from === 'bot' && <span className="text-2xl mt-1 animate-wiggle">🤖</span>}
                  {msg.from === 'user' && <span className="text-2xl mt-1 animate-wiggle">🧑‍💻</span>}
                  <div
                    className={`px-5 py-3 rounded-2xl shadow-md text-sm whitespace-pre-line transition-all duration-200 ${
                      msg.from === 'bot'
                        ? 'bg-white/90 text-gray-900 border border-gray-200'
                        : 'bg-indigo-100 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t backdrop-blur-md sticky bottom-0 z-10 bg-white/80">
            <div className="flex items-center gap-3 max-w-5xl mx-auto w-full">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about the idea..."
                className="flex-1 border border-gray-300 rounded-full px-5 py-2 focus:ring-2 focus:ring-indigo-300 outline-none shadow-md"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full hover:scale-105 hover:shadow-xl transition-all duration-300 animate-pulse"
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
