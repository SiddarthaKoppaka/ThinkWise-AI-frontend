import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
<div
      className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center overflow-hidden px-6 text-center"
      style={{ backgroundImage: "url('/LandingPage.jpg')" }}
    >
      {/* <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">💡</div>
      <div className="absolute bottom-16 right-12 text-7xl opacity-10 animate-bounce">📊</div>
      <div className="absolute top-1/2 left-1/3 text-5xl opacity-10 animate-ping">🤖</div> */}

      <h1 className="text-7xl tracking-wide font-extrabold text-white mb-4 z-10 animate-fade-in">
        Welcome to Thinkwise
      </h1>
      <p className="text-lg text-white/60 max-w-xl font-bold italic mb-10 z-10">
        <Typewriter
          words={[
            "Prioritize what matters.",
            "Evaluate impact with AI.",
            "Think Wise ! Choose Wise"
          ]}
          loop={0}
          cursor
          cursorStyle="|"
          typeSpeed={60}
          deleteSpeed={30}
          delaySpeed={1200}
        />
      </p>

      <button
  onClick={() => navigate("/app")}
  className="bg-white text px-8 py-3 rounded-full text-lg font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 z-10 animate-fade-in animation-duration-[1s]"
>
  Get Started
</button>

      {/* Bottom Buttons */}
      <div className="absolute bottom-6 flex space-x-6 z-10">
        <button
          onClick={() => navigate("/about")}
          className="text-white text-sm underline hover:text-purple-200 transition"
        >
          About Us
        </button>
        <button
          onClick={() => navigate("/contact")}
          className="text-white text-sm underline hover:text-purple-200 transition"
        >
          Contact
        </button>
      </div>
    </div>
  );
}
