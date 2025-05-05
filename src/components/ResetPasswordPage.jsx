import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useResetPassword } from '../hooks/useAuth';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const token = useQuery().get('token');
  const resetM = useResetPassword();
  const nav = useNavigate();

  const handle = async e => {
    e.preventDefault();
    try {
      await resetM.mutateAsync({ token, new_password: password });
      setMsg('✅ Password reset — redirecting to login...');
      setTimeout(() => nav('/auth'), 2000);
    } catch (err) {
      setMsg(err.response?.data?.detail || '❌ Failed to reset password');
    }
  };

  if (!token) return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-grid-pattern">
      <p className="text-red-600 text-lg font-semibold">Invalid or expired reset link.</p>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-grid-pattern font-[Poppins] relative">
      {/* ThinkWise Header */}
      <div className="absolute top-10 text-center space-y-1">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 tracking-tight">
          ThinkWise AI
        </h1>
        <p className="text-gray-600 text-sm md:text-base italic">
          Think Wise, Choose Wise.
        </p>
      </div>

      <motion.div
        className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 120 } }}
      >
        <h2 className="text-xl font-semibold text-center mb-4 text-primary-700">Reset Your Password</h2>

        <form onSubmit={handle} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
            required
          />

          <motion.button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset Password
          </motion.button>
        </form>

        {msg && (
          <motion.p
            className={`mt-4 text-center ${msg.includes('✅') ? 'text-green-600' : 'text-red-600'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {msg}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
