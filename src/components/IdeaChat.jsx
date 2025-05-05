// src/components/IdeaChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useOutletContext, Navigate } from 'react-router-dom';
import { useChatWithIdea } from '../hooks/useChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

export default function IdeaChat() {
  const { toggleSidebar } = useOutletContext();
  const { state } = useLocation();
  const idea = state?.idea;
  const chatMutation = useChatWithIdea();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Initial idea rendering
  useEffect(() => {
    if (!idea) return;
    const chunks = [];

    // header and details
    chunks.push(`## ${idea.title || 'Untitled Idea'}`);
    chunks.push(`**Author:** ${idea.author || 'Unknown'}`);
    chunks.push(`**Category:** ${idea.category || 'Uncategorized'}`);
    chunks.push(`**Created:** ${idea.timestamp ? new Date(idea.timestamp).toLocaleDateString() : 'N/A'}`);
    chunks.push('');
    chunks.push(idea.description || 'No description available.');
    // (rest of parsing logic unchanged...)
    if (idea.analysis?.eie?.details) {
      chunks.push('', '### Effort Details');
      chunks.push(`- **Effort Score:** ${Math.round((idea.analysis.eie.details.eie_score || 0) * 100)}%`);
      chunks.push(`  - Reason: ${idea.analysis.eie.details.reasoning || 'No reasoning provided.'}`);
      chunks.push(`- **Time Needed:** ${idea.analysis.eie.details.details?.time_needed || 'N/A'}h`);
      const resObj = idea.analysis.eie.details.details?.resources;
      const resources = resObj && typeof resObj === 'object'
        ? Object.entries(resObj).map(([r, c]) => `\`${r}\`: ${c}`).join(', ')
        : 'None';
      chunks.push(`- **Resources:** ${resources}`);
      chunks.push(`- **Complexity:** ${idea.analysis.eie.details.details?.complexity || 'Unknown'}`);
      const depsRaw = idea.analysis.eie.details.details?.dependencies;
      const deps = Array.isArray(depsRaw)
        ? depsRaw.join(', ')
        : typeof depsRaw === 'string'
        ? depsRaw
        : 'None';
      chunks.push(`- **Dependencies:** ${deps}`);
    }
    if (idea.analysis?.roi?.details) {
      chunks.push('', '### ROI Details');
      chunks.push(`- **ROI Score:** ${Math.round((idea.analysis.roi.details.roi_score || 0) * 100)}%`);
      chunks.push(`  - Reason: ${idea.analysis.roi.details.reasoning || 'No reasoning provided.'}`);
      chunks.push(`- **Value Created:** ${idea.analysis.roi.details.details?.value_created || 'N/A'}`);
      chunks.push(`- **Impact:** ${idea.analysis.roi.details.details?.business_impact || 'N/A'}`);
      chunks.push(`- **Demand:** ${idea.analysis.roi.details.details?.user_demand || 'N/A'}`);
    }
    if (idea.analysis?.tavily?.results?.results?.length) {
      chunks.push('', '### External Context');
      idea.analysis.tavily.results.results.forEach((r, i) => {
        chunks.push(`${i + 1}. [${r.title}](${r.url})`);
      });
    }
    const agg = idea.analysis?.final_summary?.final_summary?.aggregated_reasoning;
    if (agg) chunks.push('', `> **Aggregated Reasoning:** ${agg}`);

    setMessages([{ from: 'idea', text: chunks.join('\n') }]);
  }, [idea]);

  if (!idea) return <Navigate to="/app/ideas" replace />;

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    chatMutation.mutate(
      { id: idea._id, message: text },
      {
        onSuccess: data => {
          setMessages(prev => [...prev, { from: 'idea', text: data.reply }]);
        },
        onError: err => {
          setMessages(prev => [...prev, { from: 'idea', text: `❌ ${err.message}` }]);
        }
      }
    );
  };

  return (
    <div className="relative h-full p-4 bg-grid-pattern">
      <div className="md:hidden mb-2">
        <button onClick={toggleSidebar} className="p-2 bg-white rounded-full shadow">☰</button>
      </div>

      <div className="flex flex-col h-[90vh] w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-semibold text-gray-700">Idea Chat</h2>
  <div className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full shadow-sm">
    Overall Score: {(idea.score * 100).toFixed(1)}%
  </div>
</div>
        <motion.div
          ref={scrollRef}
          className="flex-1 overflow-auto p-6 space-y-4 bg-white border border-gray-200 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="max-w-[75%] px-4 py-3 rounded-lg break-words"
                style={{
                  marginLeft: msg.from === 'user' ? 'auto' : undefined,
                  marginRight: msg.from === 'user' ? undefined : 'auto',
                  background: msg.from === 'user' ? '#2563EB' : '#FFFFFF',
                  color: msg.from === 'user' ? '#FFFFFF' : '#1F2937',
                  border: msg.from === 'user' ? 'none' : '1px solid #E5E7EB'
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                  h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-medium mb-2" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                  li: ({ node, ...props }) => <li className="ml-6 list-disc leading-relaxed" {...props} />,
                  a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                  hr: () => <hr className="my-4 border-gray-300" />,
                  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />
                }} children={msg.text} />
              </motion.div>
            ))}
          </AnimatePresence>

          {chatMutation.isLoading && (
            <motion.div
              className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-200 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0], y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              {[0, 1, 2].map(n => (
                <motion.span
                  key={n}
                  className="block w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, delay: n * 0.2, duration: 0.6 }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>

        <div className="flex justify-center mt-4">
          <motion.div
            className="flex items-center w-full max-w-4xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <input
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
              placeholder="Type a message…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()} />
            <motion.button
              onClick={handleSend}
              disabled={chatMutation.isLoading}
              className="ml-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              ➤
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Dot() {
  return <motion.div className="w-2 h-2 bg-gray-400 rounded-full mx-0.5" />;
}
