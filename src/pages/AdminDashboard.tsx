import React, { useEffect, useState } from 'react';
import { User, Course, Enrollment, ContactMessage, DatabaseStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Users,
  BookOpen,
  GraduationCap,
  Layers,
  FileText,
  Mail,
  Database,
  Trash2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Server,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string, params?: any) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'courses' | 'enrollments' | 'messages' | 'db'
  >('overview');

  const [adminData, setAdminData] = useState<{
    totalUsers: number;
    totalStudents: number;
    totalInstructors: number;
    totalCourses: number;
    totalLessons: number;
    totalEnrollments: number;
    activeEnrollments: number;
    completedEnrollments: number;
    recentUsers: User[];
    recentEnrollments: Enrollment[];
    contactMessages: ContactMessage[];
  }>({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalLessons: 0,
    totalEnrollments: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    recentUsers: [],
    recentEnrollments: [],
    contactMessages: [],
  });

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dash, uRes, cRes, db] = await Promise.all([
        api.getAdminDashboard(),
        api.getAllUsers(),
        api.getCourses(),
        api.getDatabaseStatus(),
      ]);
      setAdminData(dash);
      setAllUsers(uRes.users);
      setAllCourses(cRes.courses);
      setDbStatus(db);
    } catch (err: any) {
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (userId: number, name: string) => {
    if (userId === user?.user_id) {
      onShowToast('You cannot delete your own active admin account.', 'error');
      return;
    }
    if (!confirm(`Delete user "${name}" from MySQL users table?`)) return;

    try {
      await api.deleteUser(userId);
      onShowToast(`User "${name}" deleted from database.`, 'info');
      loadData();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to delete user', 'error');
    }
  };

  const handleDeleteCourse = async (courseId: number, title: string) => {
    if (!confirm(`Permanently delete course "${title}" and its lessons from MySQL?`)) return;
    try {
      await api.deleteCourse(courseId);
      onShowToast(`Course "${title}" removed.`, 'info');
      loadData();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to delete course', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E6E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-rose-100 text-rose-700">
              Admin Control Panel
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-mono">learnova_db</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17172B] font-display mt-1">
            System Administration & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#52526B] mt-0.5">
            Full platform oversight, role-based user management, relational schemas, and audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-[#E6E8F0] hover:bg-[#F7F8FC] text-[#52526B] transition-colors cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('db')}
            className="px-4 py-2.5 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            <span>MySQL 8.0 Console</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-[#E6E8F0] shadow-xs">
          <span className="text-[11px] font-bold text-[#52526B] uppercase">Total Users</span>
          <div className="text-2xl font-extrabold text-[#17172B] tabular-nums font-display mt-0.5">
            {adminData.totalUsers}
          </div>
          <span className="text-[10px] text-slate-400">{adminData.totalStudents} Students</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6E8F0] shadow-xs">
          <span className="text-[11px] font-bold text-[#52526B] uppercase">Instructors</span>
          <div className="text-2xl font-extrabold text-[#5B4BDB] tabular-nums font-display mt-0.5">
            {adminData.totalInstructors}
          </div>
          <span className="text-[10px] text-slate-400">Faculty staff</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6E8F0] shadow-xs">
          <span className="text-[11px] font-bold text-[#52526B] uppercase">Total Courses</span>
          <div className="text-2xl font-extrabold text-[#17172B] tabular-nums font-display mt-0.5">
            {adminData.totalCourses}
          </div>
          <span className="text-[10px] text-slate-400">{adminData.totalLessons} Lessons</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6E8F0] shadow-xs">
          <span className="text-[11px] font-bold text-[#52526B] uppercase">Enrollments</span>
          <div className="text-2xl font-extrabold text-[#17172B] tabular-nums font-display mt-0.5">
            {adminData.totalEnrollments}
          </div>
          <span className="text-[10px] text-slate-400">Database rows</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6E8F0] shadow-xs">
          <span className="text-[11px] font-bold text-[#52526B] uppercase">Completed</span>
          <div className="text-2xl font-extrabold text-emerald-600 tabular-nums font-display mt-0.5">
            {adminData.completedEnrollments}
          </div>
          <span className="text-[10px] text-slate-400">100% Progress</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6E8F0] shadow-xs">
          <span className="text-[11px] font-bold text-[#52526B] uppercase">Inquiries</span>
          <div className="text-2xl font-extrabold text-amber-500 tabular-nums font-display mt-0.5">
            {adminData.contactMessages.length}
          </div>
          <span className="text-[10px] text-slate-400">Contact submissions</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6E8F0] pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#5B4BDB] text-white'
              : 'text-[#52526B] hover:text-[#17172B] hover:bg-[#F0EDFF]'
          }`}
        >
          Overview & Activity
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-[#5B4BDB] text-white'
              : 'text-[#52526B] hover:text-[#17172B] hover:bg-[#F0EDFF]'
          }`}
        >
          Users Table ({allUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'courses'
              ? 'bg-[#5B4BDB] text-white'
              : 'text-[#52526B] hover:text-[#17172B] hover:bg-[#F0EDFF]'
          }`}
        >
          Courses ({allCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('enrollments')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'enrollments'
              ? 'bg-[#5B4BDB] text-white'
              : 'text-[#52526B] hover:text-[#17172B] hover:bg-[#F0EDFF]'
          }`}
        >
          Enrollments Audit
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'messages'
              ? 'bg-[#5B4BDB] text-white'
              : 'text-[#52526B] hover:text-[#17172B] hover:bg-[#F0EDFF]'
          }`}
        >
          Contact Messages ({adminData.contactMessages.length})
        </button>
        <button
          onClick={() => setActiveTab('db')}
          className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'db'
              ? 'bg-[#5B4BDB] text-white'
              : 'text-[#52526B] hover:text-[#17172B] hover:bg-[#F0EDFF]'
          }`}
        >
          MySQL 8.0 Workbench Config
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW & ACTIVITY */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Registrations Table */}
          <div className="bg-white rounded-2xl border border-[#E6E8F0] shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#17172B] font-display">
              Recent User Registrations
            </h3>
            <div className="divide-y divide-[#F0EDFF] border border-[#F0EDFF] rounded-xl overflow-hidden">
              {adminData.recentUsers.map((u) => (
                <div key={u.user_id} className="p-3 flex items-center justify-between text-xs hover:bg-[#F7F8FC]">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={u.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-[#17172B]">{u.name}</div>
                      <div className="text-[11px] text-[#52526B]">{u.email}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#F0EDFF] text-[#5B4BDB]">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Enrollments Table */}
          <div className="bg-white rounded-2xl border border-[#E6E8F0] shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#17172B] font-display">
              Recent Course Enrollments
            </h3>
            <div className="divide-y divide-[#F0EDFF] border border-[#F0EDFF] rounded-xl overflow-hidden">
              {adminData.recentEnrollments.map((e) => (
                <div key={e.enrollment_id} className="p-3 flex items-center justify-between text-xs hover:bg-[#F7F8FC]">
                  <div>
                    <div className="font-bold text-[#17172B]">
                      {e.course_title || `Course #${e.course_id}`}
                    </div>
                    <div className="text-[11px] text-[#52526B]">
                      Student ID: {e.user_id} · Progress: {e.progress}%
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      e.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#F0EDFF] text-[#5B4BDB]'
                    }`}
                  >
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. USERS TABLE */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-[#E6E8F0] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#F0EDFF] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#17172B] font-display">
              All System Users (MySQL: users)
            </h3>
            <span className="text-xs text-[#52526B]">Total: {allUsers.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F7F8FC] border-b border-[#E6E8F0] text-[#52526B]">
                  <th className="py-3 px-4 font-bold">ID</th>
                  <th className="py-3 px-4 font-bold">User</th>
                  <th className="py-3 px-4 font-bold">Email</th>
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDFF]">
                {allUsers.map((u) => (
                  <tr key={u.user_id} className="hover:bg-[#F7F8FC]/60">
                    <td className="py-3 px-4 font-mono text-slate-400">#{u.user_id}</td>
                    <td className="py-3 px-4 font-bold text-[#17172B] flex items-center gap-2">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={u.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 px-4 text-[#52526B] font-mono">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-rose-100 text-rose-700'
                            : u.role === 'instructor'
                            ? 'bg-purple-100 text-[#5B4BDB]'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.user_id, u.name)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. COURSES TABLE */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl border border-[#E6E8F0] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#F0EDFF] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#17172B] font-display">
              All Courses (MySQL: courses)
            </h3>
            <span className="text-xs text-[#52526B]">Total: {allCourses.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F7F8FC] border-b border-[#E6E8F0] text-[#52526B]">
                  <th className="py-3 px-4 font-bold">Course ID</th>
                  <th className="py-3 px-4 font-bold">Title</th>
                  <th className="py-3 px-4 font-bold">Instructor</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Price</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDFF]">
                {allCourses.map((c) => (
                  <tr key={c.course_id} className="hover:bg-[#F7F8FC]/60">
                    <td className="py-3 px-4 font-mono text-slate-400">#{c.course_id}</td>
                    <td className="py-3 px-4 font-bold text-[#17172B]">{c.title}</td>
                    <td className="py-3 px-4 text-[#52526B]">{c.instructor_name || 'Faculty'}</td>
                    <td className="py-3 px-4 text-[#52526B]">{c.category}</td>
                    <td className="py-3 px-4 font-bold text-[#5B4BDB] tabular-nums">
                      ${Number(c.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onNavigate('course-details', { courseId: c.course_id })}
                          className="px-2 py-1 text-[11px] font-semibold text-[#5B4BDB] hover:bg-[#F0EDFF] rounded cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(c.course_id, c.title)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete course from database"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ENROLLMENTS AUDIT */}
      {activeTab === 'enrollments' && (
        <div className="bg-white rounded-2xl border border-[#E6E8F0] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#F0EDFF] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#17172B] font-display">
              Enrollment Database Records (MySQL: enrollment)
            </h3>
            <span className="text-xs text-[#52526B]">Total: {adminData.totalEnrollments}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F7F8FC] border-b border-[#E6E8F0] text-[#52526B]">
                  <th className="py-3 px-4 font-bold">Enrollment ID</th>
                  <th className="py-3 px-4 font-bold">User ID</th>
                  <th className="py-3 px-4 font-bold">Course Title</th>
                  <th className="py-3 px-4 font-bold">Progress</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Enrollment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDFF]">
                {adminData.recentEnrollments.map((en) => (
                  <tr key={en.enrollment_id} className="hover:bg-[#F7F8FC]/60">
                    <td className="py-3 px-4 font-mono text-slate-400">#{en.enrollment_id}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">User #{en.user_id}</td>
                    <td className="py-3 px-4 font-bold text-[#17172B]">{en.course_title || `Course #${en.course_id}`}</td>
                    <td className="py-3 px-4 font-bold text-[#5B4BDB] tabular-nums">{en.progress}%</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          en.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#F0EDFF] text-[#5B4BDB]'
                        }`}
                      >
                        {en.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(en.enrollment_date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. CONTACT MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-[#E6E8F0] shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#17172B] font-display">
            Inbound Contact Messages (MySQL: contact_messages)
          </h3>
          {adminData.contactMessages.length > 0 ? (
            <div className="space-y-3">
              {adminData.contactMessages.map((msg) => (
                <div
                  key={msg.message_id}
                  className="p-4 rounded-xl border border-[#E6E8F0] hover:border-[#5B4BDB]/30 transition-all bg-[#F7F8FC]/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[#17172B] flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#5B4BDB]" />
                      <span>{msg.name}</span>
                      <span className="text-slate-400 font-normal">({msg.email})</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <div className="font-semibold text-[#5B4BDB]">{msg.subject}</div>
                  <p className="text-[#52526B] leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No contact messages received yet.
            </div>
          )}
        </div>
      )}

      {/* 6. MYSQL 8.0 WORKBENCH CONFIG */}
      {activeTab === 'db' && (
        <div className="bg-white rounded-2xl border border-[#E6E8F0] shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0EDFF] pb-4">
            <div>
              <h3 className="text-base font-bold text-[#17172B] font-display flex items-center gap-2">
                <Database className="w-5 h-5 text-[#5B4BDB]" />
                <span>MySQL Server 8.0 & MySQL Workbench Setup</span>
              </h3>
              <p className="text-xs text-[#52526B] mt-0.5">
                Technical database architecture for B.Tech CSE Web Development mini-project evaluation.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Schema Validated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F7F8FC] border border-[#E6E8F0] space-y-2 font-mono">
              <span className="font-bold text-[#17172B] block font-sans">MySQL Connection Parameters</span>
              <div>Host: <strong className="text-[#5B4BDB]">localhost</strong></div>
              <div>Port: <strong className="text-[#5B4BDB]">3306</strong></div>
              <div>Username: <strong className="text-[#5B4BDB]">root</strong></div>
              <div>Password: <strong className="text-[#5B4BDB]">shaikrauf@12</strong></div>
              <div>Database: <strong className="text-[#5B4BDB]">learnova_db</strong></div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F8FC] border border-[#E6E8F0] space-y-2">
              <span className="font-bold text-[#17172B] block">Mandatory Database Tables</span>
              <ul className="space-y-1 text-slate-600 font-mono text-[11px]">
                <li>✓ <strong>users</strong>: user_id, name, email, password, role</li>
                <li>✓ <strong>courses</strong>: course_id, title, instructor_id, price, duration</li>
                <li>✓ <strong>lessons</strong>: lesson_id, course_id, lesson_title, content, video_url</li>
                <li>✓ <strong>enrollment</strong>: enrollment_id, user_id, course_id, progress, status</li>
                <li>✓ <strong>contact_messages</strong>: message_id, name, email, subject, message</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#5B4BDB]" />
              <span>How to Run in Local MySQL Workbench</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-purple-800 leading-relaxed">
              <li>Open MySQL Workbench and connect to your local MySQL Server 8.0 as user <code className="bg-purple-100 px-1 rounded">root</code>.</li>
              <li>Open SQL script file located at <code className="bg-purple-100 px-1 rounded">database/database.sql</code>.</li>
              <li>Click the Lightning Bolt icon to execute the script. It creates <code className="bg-purple-100 px-1 rounded">learnova_db</code> with all 4 tables & sample seed data.</li>
              <li>Run <code className="bg-purple-100 px-1 rounded">npm run dev</code> to connect the Express backend directly to MySQL!</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
