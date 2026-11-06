import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, User, ArrowRight, BookOpen, Award } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: string, params?: any) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, role);
      onShowToast(`Account created successfully! Welcome to LEARNOVA, ${name.trim()}!`, 'success');
      if (role === 'instructor') {
        onNavigate('instructor-dashboard');
      } else {
        onNavigate('student-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E6E8F0] shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5B4BDB] to-[#8B7CFF] text-white flex items-center justify-center mx-auto shadow-md shadow-[#5B4BDB]/25">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#17172B] font-display">
            Join LEARNOVA
          </h2>
          <p className="text-xs text-[#52526B]">
            Create your account to start learning or teaching courses.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 leading-snug">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Role Selection */}
          <div>
            <label className="block font-bold text-[#17172B] mb-1.5">Select Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                  role === 'student'
                    ? 'bg-[#F0EDFF] border-[#5B4BDB] text-[#5B4BDB]'
                    : 'bg-[#F7F8FC] border-[#E6E8F0] text-[#52526B] hover:text-[#17172B]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('instructor')}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                  role === 'instructor'
                    ? 'bg-[#F0EDFF] border-[#5B4BDB] text-[#5B4BDB]'
                    : 'bg-[#F7F8FC] border-[#E6E8F0] text-[#52526B] hover:text-[#17172B]'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Instructor</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#17172B] mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shaik Rauf"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#F7F8FC] border border-[#E6E8F0] rounded-xl focus:outline-hidden focus:border-[#5B4BDB] focus:bg-white text-[#17172B]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#17172B] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@learnova.edu"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#F7F8FC] border border-[#E6E8F0] rounded-xl focus:outline-hidden focus:border-[#5B4BDB] focus:bg-white text-[#17172B]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#17172B] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#F7F8FC] border border-[#E6E8F0] rounded-xl focus:outline-hidden focus:border-[#5B4BDB] focus:bg-white text-[#17172B]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#17172B] mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#F7F8FC] border border-[#E6E8F0] rounded-xl focus:outline-hidden focus:border-[#5B4BDB] focus:bg-white text-[#17172B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-xl shadow-md shadow-[#5B4BDB]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Saving Account in MySQL...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#F0EDFF] text-xs text-[#52526B]">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="font-bold text-[#5B4BDB] hover:underline cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
