// src/components/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthService from '../api/AuthService';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');             // 'login' | 'register' | 'forgot'
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const [searchParams] = useSearchParams();
  useEffect(() => {
    const m = searchParams.get('mode');
    if (m === 'register' || m === 'forgot') setMode(m);
  }, [searchParams]);

  useEffect(() => {
    setError('');
    setMessage('');
    setForm({ first_name: '', last_name: '', email: '', password: '' });
  }, [mode]);

  
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address (e.g., example@domain.com).");
      setLoading(false);
      return;
    }
  
    if ((mode === 'register' || mode === 'login') && !isStrongPassword(form.password)) {
      setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        const user = await AuthService.login({
          email: form.email,
          password: form.password
        });
        onAuth(user);
        navigate('/app', { replace: true });

      } else if (mode === 'register') {
        await AuthService.register({
          first_name: form.first_name,
          last_name:  form.last_name,
          email:      form.email,
          password:   form.password
        });
        const user = await AuthService.login({
          email: form.email,
          password: form.password
        });
        if (user) {
          onAuth(user);
          navigate('/app', { replace: true });
        }

      } else if (mode === 'forgot') {
        await AuthService.forgotPassword({ email: form.email });
        setMessage('If that email exists, you’ll receive a reset link shortly.');
      }
    } catch (err) {
      const msg = err.response?.data?.detail
                || err.response?.data?.message
                || err.message
                || 'Login failed: Invalid credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const tabVariant = {
    active:   { borderBottomColor: '#2563EB', fontWeight: 600 },
    inactive: { borderBottomColor: 'transparent', color: '#6B7280' }
  };

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
        initial={{ scale:0.9, opacity:0 }}
        animate={{ scale:1, opacity:1, transition:{ type:'spring', stiffness:120 } }}
      >
        {/* only show tabs for login/register */}
        {mode !== 'forgot' && (
          <div className="flex mb-6">
            {['login','register'].map(m => (
              <motion.button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                variants={tabVariant}
                animate={mode === m ? 'active' : 'inactive'}
                className="flex-1 py-2 text-center border-b-2"
                whileHover={{ color: '#1E40AF' }}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </motion.button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <input
                name="first_name"
                placeholder="First Name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                required
              />
              <input
                name="last_name"
                placeholder="Last Name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                required
              />
            </div>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
            required
          />

          {(mode === 'login' || mode === 'register') && (
            <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              required
            />
            {mode === 'register' && (
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters with uppercase, lowercase, number, and special character.
              </p>
            )}
          </div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{   scale: loading ? 1 : 0.98 }}
          >
            {loading
              ? mode === 'login'
                ? 'Logging in…'
                : mode === 'register'
                ? 'Registering…'
                : 'Sending…'
              : mode === 'login'
              ? 'Login'
              : mode === 'register'
              ? 'Register'
              : 'Send Reset Link'}
          </motion.button>
        </form>

        {error && (
          <motion.p
            className="mt-2 text-red-600 text-center"
            initial={{ opacity:0 }}
            animate={{ opacity:1, transition:{ duration:0.4 } }}
          >
            {error}
          </motion.p>
        )}
        {message && (
          <motion.p
            className="mt-2 text-green-600 text-center"
            initial={{ opacity:0 }}
            animate={{ opacity:1, transition:{ duration:0.4 } }}
          >
            {message}
          </motion.p>
        )}

        {/* forgot link under login */}
        {mode === 'login' && (
          <motion.p
            className="mt-4 text-center text-sm text-gray-600"
            initial={{ opacity:0 }}
            animate={{ opacity:1, transition:{ delay:0.6, duration:0.4 } }}
          >
            <button
              onClick={() => setMode('forgot')}
              className="text-primary-600 hover:underline"
            >
              Forgot Password?
            </button>
          </motion.p>
        )}

        {/* back to login under forgot */}
        {mode === 'forgot' && (
          <motion.p
            className="mt-4 text-center text-sm text-gray-600"
            initial={{ opacity:0 }}
            animate={{ opacity:1, transition:{ delay:0.6, duration:0.4 } }}
          >
            <button
              onClick={() => setMode('login')}
              className="text-primary-600 hover:underline"
            >
              Back to Login
            </button>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
