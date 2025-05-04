// src/components/SettingsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useChangePassword,
  useDeleteAllIdeas,
  useDeleteAccount,
} from '../hooks/useAuth';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [msg, setMsg]     = useState('');

  const changePwdM = useChangePassword();
  const delIdeasM  = useDeleteAllIdeas();
  const delAccM    = useDeleteAccount();

  const onChangePassword = async e => {
    e.preventDefault();
    setMsg('');
    try {
      await changePwdM.mutateAsync({ old_password: oldPwd, new_password: newPwd });
      setMsg('Password changed successfully');
      setOldPwd(''); setNewPwd('');
    } catch (err) {
      setMsg(err.response?.data?.detail || 'Failed to change password');
    }
  };

  const onDeleteAll = () => {
    if (!window.confirm('Delete ALL your ideas? This cannot be undone.')) return;
    delIdeasM.mutate();
  };

  const onDeleteAccount = () => {
    if (!window.confirm('Delete your account and all data? This cannot be undone.')) return;
    delAccM.mutate();
  };

  return (
    <div className="min-h-screen bg-grid-pattern p-4">
      <div className="max-w-3xl mx-auto bg-white bg-opacity-70 backdrop-blur-md rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-black mb-6">Settings</h1>

        {/* Change Password */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-black mb-4">Change Password</h2>
          <form onSubmit={onChangePassword} className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={oldPwd}
              onChange={e => setOldPwd(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
            <button
              type="submit"
              disabled={changePwdM.isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {changePwdM.isLoading ? 'Saving…' : 'Save Password'}
            </button>
          </form>
          {msg && (
            <p className="mt-2 text-sm text-black">
              {msg}
            </p>
          )}
        </section>

        {/* Data Management */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-black mb-4">Data Management</h2>
          <button
            onClick={onDeleteAll}
            disabled={delIdeasM.isLoading}
            className="w-full border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 disabled:opacity-50"
          >
            {delIdeasM.isLoading ? 'Deleting…' : 'Delete All My Ideas'}
          </button>
        </section>

        {/* Account */}
        <section>
          <h2 className="text-xl font-semibold text-black mb-4">Account</h2>
          <button
            onClick={onDeleteAccount}
            disabled={delAccM.isLoading}
            className="w-full border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 disabled:opacity-50"
          >
            {delAccM.isLoading ? 'Deleting…' : 'Delete My Account'}
          </button>
        </section>
      </div>
    </div>
  );
}
