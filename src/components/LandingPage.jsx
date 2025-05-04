// src/components/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();

  const heroVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const features = [
    {
      title: 'Effort vs ROI Scoring',
      desc:  'Quickly evaluate your ideas with a balanced score of effort and return potential.'
    },
    {
      title: 'Interactive AI Chat',
      desc:  'Get detailed, actionable insights via conversational AI on each idea.'
    },
    {
      title: 'Real-time Analytics',
      desc:  'Visualize idea performance metrics and track progress dynamically.'
    }
  ];

  // helper to send user to AuthPage in "register" mode
  const goRegister = () => navigate('/auth?mode=register');

  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-gray-900">
      {/* Gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none mix-blend-overlay" />

      {/* Navbar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white">ThinkWise AI</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/auth')}
            className="text-white hover:text-gray-200 transition"
          >
            Log In
          </button>
          <button
            onClick={goRegister}
            className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-gray-100 transition"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Hero */}
      <motion.section
        className="relative z-10 flex flex-col items-center text-center pt-20 px-6 pb-40 max-w-3xl mx-auto"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-xl">
          Bring Your Ideas to Life with AI Insights
        </h2>
        <p className="mt-4 text-lg md:text-xl text-white drop-shadow-lg">
          Prioritize, score, and act on your best concepts using intuitive
          Effort vs ROI analysis, conversational AI chat, and dynamic analytics.
        </p>
        <div className="flex gap-2">
          <button
          onClick={goRegister}
          className="mt-8 bg-white text-blue-600 font-semibold rounded-full px-8 py-3 hover:shadow-lg transition"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate('/auth')}
          className="mt-8 bg-transparent border-white text-white font-semibold rounded-full border px-8 py-3 "
        >
          Login
        </button></div>
      </motion.section>

      {/* Features */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-3 -mt-20">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.2 } }}
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer CTA + About Us */}
      <motion.footer
        className="relative z-10 mt-20 pb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.8 } }}
      >
        <p className="text-white mb-4 text-lg">Ready to transform your ideas?</p>
        <button
          onClick={goRegister}
          className="bg-white text-blue-600 font-semibold rounded-full px-8 py-3 hover:shadow-lg transition"
        >
          Register Here
        </button>
        <p className="mt-4">
          <button
            onClick={() => navigate('/about')}
            className="text-white underline hover:text-gray-200 transition"
          >
            About Us
          </button>
        </p>
      </motion.footer>
    </div>
  );
}
