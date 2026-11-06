import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Mail, Shield, Save, CheckCircle2, ArrowLeft } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, onShowToast }) => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      onShowToast('Name cannot be empty', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.updateProfile(user.user_id, {
        name: name.trim(),
        bio: bio.trim(),
      });
      await refreshUser();
      onShowToast('Profile updated in MySQL database!', 'success');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate(user?.role === 'admin' ? 'admin-dashboard' : user?.role === 'instructor' ? 'instructor-dashboard' : 'student-dashboard')}
          className="text-xs font-semibold text-[#52526B] hover:text-[#17172B] flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E6E8F0] shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#5B4BDB] to-[#8B7CFF]" />

        <div className="px-6 sm:px-10 pb-10 relative">
          {/* Avatar Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-8">
            <div className="flex items-end gap-4">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
              />
              <div className="mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#17172B] font-display">
                  {user?.name}
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#52526B]">{user?.email}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#F0EDFF] text-[#5B4BDB]">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-5 text-xs max-w-xl">
            <div>
              <label className="block font-bold text-[#17172B] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border border-[#E6E8F0] rounded-xl focus:outline-hidden focus:border-[#5B4BDB] text-[#17172B]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#17172B] mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-[#E6E8F0] rounded-xl text-slate-500 cursor-not-allowed font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Email addresses are unique identifiers in the MySQL users table and cannot be changed.
              </p>
            </div>

            <div>
              <label className="block font-bold text-[#17172B] mb-1">Biography / About Me</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your technical interests, current projects, or credentials..."
                className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border border-[#E6E8F0] rounded-xl focus:outline-hidden focus:border-[#5B4BDB] text-[#17172B]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-xl shadow-sm transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
