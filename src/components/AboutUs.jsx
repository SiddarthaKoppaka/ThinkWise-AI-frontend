import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Inline SVG icon components
const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S.02 4.88.02 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zm7.5 0h3.8v2.2h.1c.5-1 1.8-2.2 3.7-2.2 4 0 4.8 2.6 4.8 6V24h-4v-7.1c0-1.7-.04-3.9-2.4-3.9-2.4 0-2.7 1.8-2.7 3.8V24h-4V8.5z" />
  </svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.263.82-.583 0-.287-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.332-1.753-1.332-1.753-1.089-.744.083-.729.083-.729 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.998.108-.775.419-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.931 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.527.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.656 1.65.244 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.624-5.475 5.921.43.37.824 1.102.824 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.7.825.582C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm7.93 9h-3.07a15.935 15.935 0 0 0-.724-4.492A8.003 8.003 0 0 1 19.931 11zM12 4c1.43 0 2.757.355 3.928.976A17.018 17.018 0 0 0 12 11V4zm-2 0v7c-1.747 0-3.42-.575-4.928-1.563A17.018 17.018 0 0 1 10 4zm-6.931 7A8.003 8.003 0 0 1 8.844 6.508 15.935 15.935 0 0 0 8 11H2.069zm0 2H8a15.935 15.935 0 0 0 .844 4.492A8.003 8.003 0 0 1 5.069 13zm2 6.491A15.935 15.935 0 0 0 10 13h4a15.935 15.935 0 0 0 .931 6.491A8.003 8.003 0 0 1 9.069 19.491zM16 19.492A15.935 15.935 0 0 0 17.156 13H22a8.003 8.003 0 0 1-6 6.492z"/>
  </svg>
);

const teamMembers = [
  {
    name: 'Siddartha Koppaka',
    role: 'AI Engineer',
    desc: 'Architected the AI stack end-to-end—building LangGraph backends, integrating LLM workflows, and crafting the React frontend.',
    image: '/images/sid.jpeg',
    links: { linkedin: '', github: '', portfolio: '' },
    musicUrl: '/music/sid.mp3',
    gifUrl: '/gifs/sid.gif',
  },
  {
    name: 'Rasaghna Kuturu',
    role: 'Data Engineer',
    desc: 'Bridged data and UI—designing robust backend pipelines, integrating frontend endpoints, and leading prompt-engineering standards.',
    image: '/images/ras.jpg',
    links: { linkedin: '', github: '', portfolio: '' },
    musicUrl: '/music/ras.mp3',
    gifUrl: '/gifs/ras.gif',
  },
  {
    name: 'Adithya Singupati',
    role: 'Data Analyst',
    desc: 'Delivered polished interfaces—crafting clean frontend designs, integrating data flows, and ensuring seamless analytics presentation.',
    image: '/images/adi.jpg',
    links: { linkedin: '', github: '', portfolio: '' },
    musicUrl: '/music/adi.mp3',
    gifUrl: '/gifs/adi.gif',
  },
  {
    name: 'Mohit Sai Tatineni',
    role: 'Software Engineer',
    desc: 'Ensured deployment excellence—maintaining CI/CD pipelines, orchestrating FastAPI integrations, and streamlining release workflows.',
    image: '/images/mohit.jpg',
    links: { linkedin: '', github: '', portfolio: '' },
    musicUrl: '/music/mohit.mp3',
    gifUrl: '/gifs/mohit.gif',
  }
];


const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const baseCard = {
  initial: { opacity: 0, y: 30, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 20 } }
};

const variantsByIndex = [
  // 1st card: gold glow
  {
    ...baseCard,
    hover: {
      boxShadow: '0 0 30px rgba(255,215,0,0.8)',
      transition: { duration: 0.5 }
    }
  },
  // 2nd card: pink border on hover, keep spin but no backgroundColor
  {
    ...baseCard,
    hover: {
      rotate: [0, 5, -5, 0],
      border: '4px solidrgb(255, 238, 3)',
      transition: { duration: 1.5, repeat: Infinity }
    }
  },
  // 3rd card: drop like fruit only
  {
    ...baseCard,
    hover: {
      y: [0, 120, 0],
      transition: { duration: 0.8, ease: 'easeInOut', times: [0, 0.5, 1] }
    }
  },
  // 4th card: keep original background, but no color change
  {
    ...baseCard,
    hover: {
      boxShadow: '0 0 15px rgba(0,0,0,0.2)',
      transition: { duration: 0.5 }
    }
  }
];

export default function AboutUs() {
  const [audio, setAudio] = useState(null);

  function handleMouseEnter(musicUrl) {
    // If same track is already playing, do nothing
    if (
      audio &&
      audio.src.includes(musicUrl) &&
      !audio.paused
    ) return;

    // Stop previous
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    // Start new
    const newAudio = new Audio(musicUrl);
    newAudio.loop = true;                // optional: loop
    newAudio.play().catch(() => {});    // suppress the warning
    setAudio(newAudio);
  }

  function handleMouseLeave() {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center py-20 px-6">
      <div className="text-center mb-8 max-w-2xl">
        <h2 className="text-5xl font-extrabold text-gray-900">Meet Our Team</h2>
        <p className="mt-4 text-lg text-gray-600">
          Introducing our Idea Evaluator application—built during the Luddy Hackathon and enhanced for public release.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl">
        {teamMembers.map((m) => (
          <div
            key={m.name}
            className={`
              relative group rounded-2xl overflow-hidden
              border-4 border-transparent p-6 flex flex-col items-center
              text-center cursor-pointer bg-white transition-colors duration-300
              ${m.borderHover}
            `}
            onMouseEnter={() => handleMouseEnter(m.musicUrl)}
            onMouseLeave={handleMouseLeave}
          >
            {/* GIF */}
            <img
              src={m.gifUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-0
                         group-hover:opacity-70 transition-opacity duration-500"
            />
            {/* Softer black overlay */}
            <div
              className="absolute inset-0 bg-black opacity-0
                         group-hover:opacity-20 transition-opacity duration-500"
            />

            {/* Content */}
            <img
              src={m.image}
              alt={m.name}
              className="relative z-10 w-28 h-28 rounded-full object-cover
                         border-4 border-white shadow-md mb-4
                         group-hover:border-white"
            />
            <h3 className="relative z-10 text-xl font-semibold text-gray-800
                           group-hover:text-white transition-colors">
              {m.name}
            </h3>
            <p className="relative z-10 text-sm font-bold text-black
                          group-hover:text-white transition-colors">
              {m.role}
            </p>
            <p className="relative z-10 mt-2 text-gray-600
                          group-hover:text-white transition-colors">
              {m.desc}
            </p>
            <div className="relative z-10 mt-4 flex space-x-4 justify-center
                            text-gray-900 group-hover:text-white transition-colors">
              <a href={m.links.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon />
              </a>
              <a href={m.links.github} target="_blank" rel="noopener noreferrer">
                <GithubIcon />
              </a>
              <a href={m.links.portfolio} target="_blank" rel="noopener noreferrer">
                <GlobeIcon />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}