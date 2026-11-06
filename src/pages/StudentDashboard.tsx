import React, { useEffect, useState } from 'react';
import { Enrollment } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Clock,
  User as UserIcon,
  Settings,
  LogOut,
  PlayCircle,
  ArrowRight,
  Database,
  Award
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (page: string, params?: any) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'my-courses' | 'progress' | 'completed'>('overview');
  const [dashboardData, setDashboardData] = useState<{
    totalEnrolled: number;
    completed: number;
    inProgress: number;
    overallProgress: number;
    enrollments: Enrollment[];
  }>({
    totalEnrolled: 0,
    completed: 0,
    inProgress: 0,
    overallProgress: 0,
    enrollments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      setLoading(true);
      try {
        const data = await api.getStudentDashboard();
        setDashboardData(data);
      } catch (err: any) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, []);

  const enrollments = dashboardData.enrollments || [];
  const completedCourses = enrollments.filter((e) => e.status === 'Completed' || e.progress >= 100);
  const inProgressCourses = enrollments.filter((e) => e.status !== 'Completed' && e.progress < 100);

  // Active / continue course is first in-progress or first enrolled
  const activeCourse = inProgressCourses[0] || enrollments[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR NAVIGATION (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* User Profile Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6E8F0] shadow-xs text-center">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-[#5B4BDB]/30 mb-3"
            />
            <h3 className="text-base font-bold text-[#17172B] font-display">{user?.name}</h3>
            <p className="text-xs text-[#52526B] truncate">{user?.email}</p>
            <div className="mt-2.5 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F0EDFF] text-[#5B4BDB] uppercase tracking-wider">
              Student Account
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-2xl border border-[#E6E8F0] shadow-xs p-2 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#F0EDFF] text-[#5B4BDB]'
                  : 'text-[#52526B] hover:text-[#17172B] hover:bg-[#F7F8FC]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#5B4BDB]" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('my-courses')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'my-courses'
                  ? 'bg-[#F0EDFF] text-[#5B4BDB]'
                  : 'text-[#52526B] hover:text-[#17172B] hover:bg-[#F7F8FC]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#5B4BDB]" />
              <span>My Courses ({enrollments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'progress'
                  ? 'bg-[#F0EDFF] text-[#5B4BDB]'
                  : 'text-[#52526B] hover:text-[#17172B] hover:bg-[#F7F8FC]'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#5B4BDB]" />
              <span>Learning Progress</span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-[#F0EDFF] text-[#5B4BDB]'
                  : 'text-[#52526B] hover:text-[#17172B] hover:bg-[#F7F8FC]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-[#5B4BDB]" />
              <span>Completed ({completedCourses.length})</span>
            </button>

            <div className="pt-2 border-t border-[#F0EDFF]">
              <button
                onClick={() => onNavigate('profile')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-[#52526B] hover:text-[#17172B] hover:bg-[#F7F8FC] cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span>Profile Settings</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  onNavigate('home');
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT (9 Cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Welcome Message */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E6E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#5B4BDB] uppercase tracking-wider">
                Student Learning Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17172B] font-display mt-0.5">
                Welcome back, {user?.name || 'Student'}!
              </h1>
              <p className="text-xs sm:text-sm text-[#52526B] mt-1">
                You have {inProgressCourses.length} active courses in progress. Keep up the momentum!
              </p>
            </div>

            <button
              onClick={() => onNavigate('courses')}
              className="px-4.5 py-2.5 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Browse New Courses
            </button>
          </div>

          {/* 4 Trust Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E6E8F0] shadow-xs">
              <span className="text-xs font-bold text-[#52526B]">Enrolled</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#17172B] tabular-nums font-display mt-1">
                {dashboardData.totalEnrolled}
              </div>
              <span className="text-[11px] text-[#52526B] mt-0.5 block">Total courses</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E6E8F0] shadow-xs">
              <span className="text-xs font-bold text-[#52526B]">In Progress</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#5B4BDB] tabular-nums font-display mt-1">
                {dashboardData.inProgress}
              </div>
              <span className="text-[11px] text-[#52526B] mt-0.5 block">Ongoing syllabi</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E6E8F0] shadow-xs">
              <span className="text-xs font-bold text-[#52526B]">Completed</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums font-display mt-1">
                {dashboardData.completed}
              </div>
              <span className="text-[11px] text-[#52526B] mt-0.5 block">100% finished</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E6E8F0] shadow-xs">
              <span className="text-xs font-bold text-[#52526B]">Overall Progress</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#17172B] tabular-nums font-display mt-1">
                {dashboardData.overallProgress}%
              </div>
              <span className="text-[11px] text-[#52526B] mt-0.5 block">Average completion</span>
            </div>
          </div>

          {/* Continue Learning Spotlight Banner */}
          {activeCourse && (
            <div className="bg-gradient-to-r from-[#5B4BDB]/10 via-[#F0EDFF] to-white p-6 rounded-2xl border border-[#5B4BDB]/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <span className="text-[10px] font-extrabold text-[#5B4BDB] uppercase tracking-wider bg-white px-2 py-0.5 rounded shadow-2xs">
                  Continue Learning
                </span>
                <h3 className="text-base font-bold text-[#17172B] font-display">
                  {activeCourse.course_title}
                </h3>
                <p className="text-xs text-[#52526B]">
                  Current module: {activeCourse.lesson_title || 'Orientation & Setup'}
                </p>
                <div className="w-48 sm:w-64 bg-[#E6E8F0] h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-[#5B4BDB] h-full rounded-full transition-all"
                    style={{ width: `${activeCourse.progress}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => onNavigate('learn', { courseId: activeCourse.course_id })}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Resume Lesson</span>
              </button>
            </div>
          )}

          {/* Courses List Section based on activeTab */}
          <div className="bg-white rounded-2xl border border-[#E6E8F0] shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#17172B] font-display">
                {activeTab === 'completed'
                  ? 'Completed Courses'
                  : activeTab === 'progress'
                  ? 'Active Learning Progress'
                  : 'My Enrolled Courses'}
              </h2>
              <span className="text-xs font-semibold text-[#52526B]">
                Data synchronized with MySQL 8.0
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : enrollments.length > 0 ? (
              <div className="space-y-4">
                {(activeTab === 'completed'
                  ? completedCourses
                  : activeTab === 'progress'
                  ? inProgressCourses
                  : enrollments
                ).map((enroll) => (
                  <div
                    key={enroll.enrollment_id}
                    className="p-4 sm:p-5 rounded-xl border border-[#E6E8F0] hover:border-[#5B4BDB]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B4BDB] bg-[#F0EDFF] px-2 py-0.5 rounded">
                          {enroll.category || 'Curriculum'}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">
                          Enrolled on {new Date(enroll.enrollment_date).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#17172B] font-display">
                        {enroll.course_title}
                      </h4>

                      <div className="flex items-center gap-4 text-xs text-[#52526B]">
                        <span>Last lesson: <strong>{enroll.lesson_title || 'Orientation'}</strong></span>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-3 pt-1 max-w-md">
                        <div className="flex-1 bg-[#E6E8F0] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              enroll.progress === 100 ? 'bg-emerald-500' : 'bg-[#5B4BDB]'
                            }`}
                            style={{ width: `${enroll.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-[#17172B] tabular-nums">
                          {enroll.progress}%
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          enroll.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#F0EDFF] text-[#5B4BDB]'
                        }`}
                      >
                        {enroll.status}
                      </span>
                      <button
                        onClick={() => onNavigate('learn', { courseId: enroll.course_id })}
                        className="px-4 py-2 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Classroom</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#F7F8FC] rounded-xl border border-dashed border-[#E6E8F0] space-y-3">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-[#17172B]">No courses enrolled yet</h4>
                <p className="text-xs text-[#52526B]">
                  Explore the marketplace and enroll in your first course to begin learning!
                </p>
                <button
                  onClick={() => onNavigate('courses')}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#5B4BDB] rounded-lg"
                >
                  Explore Marketplace
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
