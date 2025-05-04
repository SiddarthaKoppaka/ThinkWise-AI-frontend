// src/components/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
      setMsg('Password reset—please log in');
      setTimeout(() => nav('/auth'), 2000);
    } catch (err) {
      setMsg(err.response?.data?.detail || 'Failed to reset');
    }
  };

  if (!token) return <p>Invalid reset link</p>;

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handle} className="space-y-4">
        <h2 className="text-xl font-semibold">Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          value={password} onChange={e=>setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}
