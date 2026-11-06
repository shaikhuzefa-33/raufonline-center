import React, { useEffect, useState } from 'react';
import { Course, Lesson } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  PlusCircle,
  Users,
  Award,
  Trash2,
  Edit,
  LayoutDashboard,
  FilePlus,
  Clock,
  CheckCircle,
  X,
  PlayCircle
} from 'lucide-react';

interface InstructorDashboardProps {
  onNavigate: (page: string, params?: any) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [showCreateCourseModal, setShowCreateCourseModal] = useState<boolean>(false);
  const [showLessonModal, setShowLessonModal] = useState<boolean>(false);
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<Course | null>(null);

  // New Course Form State
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    price: 49.99,
    duration: 24,
    level: 'Beginner to Advanced',
    thumbnail: '/src/assets/images/course_web_dev_1793960054939.jpg',
  });

  // New Lesson Form State
  const [newLesson, setNewLesson] = useState({
    lesson_title: '',
    content: '',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    sequence_no: 1,
    duration: 20,
  });

  const loadInstructorData = async () => {
    setLoading(true);
    try {
      const data = await api.getInstructorDashboard();
      setCourses(data.courses);
      setTotalStudents(data.totalStudents);
    } catch (err: any) {
      console.error('Error loading instructor data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstructorData();
  }, []);

  // Handle Course Creation
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title.trim() || !newCourse.description.trim()) {
      onShowToast('Please fill in title and description.', 'error');
      return;
    }

    try {
      await api.createCourse(newCourse);
      onShowToast(`Course "${newCourse.title}" successfully created in MySQL!`, 'success');
      setShowCreateCourseModal(false);
      setNewCourse({
        title: '',
        description: '',
        category: 'Web Development',
        price: 49.99,
        duration: 24,
        level: 'Beginner to Advanced',
        thumbnail: '/src/assets/images/course_web_dev_1793960054939.jpg',
      });
      loadInstructorData();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to create course in MySQL', 'error');
    }
  };

  // Handle Course Deletion
  const handleDeleteCourse = async (courseId: number, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}" and all its lessons?`)) {
      return;
    }

    try {
      await api.deleteCourse(courseId);
      onShowToast(`Deleted "${title}" from MySQL database.`, 'info');
      loadInstructorData();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to delete course', 'error');
    }
  };

  // Open Lesson Management
  const handleOpenLessons = async (course: Course) => {
    try {
      const res = await api.getCourse(course.course_id);
      setSelectedCourseForLessons(res.course);
      setNewLesson({
        ...newLesson,
        sequence_no: (res.course.lessons?.length || 0) + 1,
      });
      setShowLessonModal(true);
    } catch (err: any) {
      onShowToast('Failed to load course lessons', 'error');
    }
  };

  // Handle Add Lesson
  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForLessons || !newLesson.lesson_title.trim() || !newLesson.content.trim()) {
      onShowToast('Please provide a lesson title and content notes.', 'error');
      return;
    }

    try {
      await api.addLesson(selectedCourseForLessons.course_id, newLesson);
      onShowToast(`Lesson "${newLesson.lesson_title}" added successfully!`, 'success');
      // Refresh current course lessons
      const res = await api.getCourse(selectedCourseForLessons.course_id);
      setSelectedCourseForLessons(res.course);
      setNewLesson({
        lesson_title: '',
        content: '',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        sequence_no: (res.course.lessons?.length || 0) + 1,
        duration: 20,
      });
    } catch (err: any) {
      onShowToast(err.message || 'Failed to add lesson', 'error');
    }
  };

  // Handle Delete Lesson
  const handleDeleteLesson = async (lessonId: number) => {
    if (!selectedCourseForLessons) return;
    try {
      await api.deleteLesson(lessonId);
      onShowToast('Lesson removed from syllabus.', 'info');
      const res = await api.getCourse(selectedCourseForLessons.course_id);
      setSelectedCourseForLessons(res.course);
    } catch (err: any) {
      onShowToast('Failed to delete lesson', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E6E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#5B4BDB] uppercase tracking-wider">
            Faculty Instructor Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17172B] font-display mt-0.5">
            Instructor Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#52526B] mt-1">
            Author courses, publish structured curriculum lessons, and monitor student enrollment performance.
          </p>
        </div>

        <button
          onClick={() => setShowCreateCourseModal(true)}
          className="px-5 py-3 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-xl shadow-md shadow-[#5B4BDB]/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E6E8F0] shadow-xs">
          <span className="text-xs font-bold text-[#52526B]">My Courses</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#17172B] tabular-nums font-display mt-1">
            {courses.length}
          </div>
          <span className="text-[11px] text-[#52526B] mt-0.5 block">Published courses</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E8F0] shadow-xs">
          <span className="text-xs font-bold text-[#52526B]">Enrolled Students</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#5B4BDB] tabular-nums font-display mt-1">
            {totalStudents.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#52526B] mt-0.5 block">Across all curricula</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E8F0] shadow-xs">
          <span className="text-xs font-bold text-[#52526B]">Average Rating</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 tabular-nums font-display mt-1">
            4.91
          </div>
          <span className="text-[11px] text-[#52526B] mt-0.5 block">Student satisfaction</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E8F0] shadow-xs">
          <span className="text-xs font-bold text-[#52526B]">Database Status</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display mt-1">
            Active
          </div>
          <span className="text-[11px] text-[#52526B] mt-0.5 block">MySQL 8.0 Synchronized</span>
        </div>
      </div>

      {/* Courses Management Table */}
      <div className="bg-white rounded-2xl border border-[#E6E8F0] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#F0EDFF] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#17172B] font-display">
              Course Management Table
            </h2>
            <p className="text-xs text-[#52526B] mt-0.5">
              Manage your authored courses and add syllabus lessons directly.
            </p>
          </div>
          <button
            onClick={() => setShowCreateCourseModal(true)}
            className="px-3.5 py-1.5 text-xs font-bold text-[#5B4BDB] bg-[#F0EDFF] hover:bg-[#5B4BDB] hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            + Add Course
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading courses...</div>
        ) : courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F7F8FC] border-b border-[#E6E8F0] text-[#52526B]">
                  <th className="py-3 px-4 font-bold">Course Title</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Price</th>
                  <th className="py-3 px-4 font-bold">Duration</th>
                  <th className="py-3 px-4 font-bold">Enrolled</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDFF]">
                {courses.map((course) => (
                  <tr key={course.course_id} className="hover:bg-[#F7F8FC]/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#17172B] max-w-xs">
                      <div className="truncate">{course.title}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#52526B]">{course.category}</td>
                    <td className="py-3.5 px-4 font-bold text-[#5B4BDB] tabular-nums">
                      ${Number(course.price).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums">{course.duration} hrs</td>
                    <td className="py-3.5 px-4 tabular-nums">{course.enrolled_count || 0}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenLessons(course)}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#5B4BDB] bg-[#F0EDFF] hover:bg-[#5B4BDB] hover:text-white rounded transition-colors cursor-pointer"
                        >
                          Manage Lessons
                        </button>
                        <button
                          onClick={() => onNavigate('course-details', { courseId: course.course_id })}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.course_id, course.title)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete course from MySQL"
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
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            You have not created any courses yet. Click "Create New Course" above!
          </div>
        )}
      </div>

      {/* CREATE COURSE MODAL */}
      {showCreateCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E6E8F0] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#F0EDFF] pb-3">
              <h3 className="text-base font-bold text-[#17172B] font-display">
                Create New Course
              </h3>
              <button
                onClick={() => setShowCreateCourseModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#17172B] mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="e.g. Advanced Distributed Systems with Go & MySQL"
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-[#E6E8F0] rounded-lg focus:outline-hidden focus:border-[#5B4BDB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#17172B] mb-1">Category *</label>
                <select
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-[#E6E8F0] rounded-lg focus:outline-hidden focus:border-[#5B4BDB]"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Java Programming">Java Programming</option>
                  <option value="Python Programming">Python Programming</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Database Management">Database Management</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#17172B] mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Comprehensive syllabus overview and technical topics covered..."
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-[#E6E8F0] rounded-lg focus:outline-hidden focus:border-[#5B4BDB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#17172B] mb-1">Price ($USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#F7F8FC] border border-[#E6E8F0] rounded-lg focus:outline-hidden focus:border-[#5B4BDB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#17172B] mb-1">Duration (Hours) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 bg-[#F7F8FC] border border-[#E6E8F0] rounded-lg focus:outline-hidden focus:border-[#5B4BDB]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EDFF] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCourseModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#52526B] hover:bg-[#F7F8FC] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-lg shadow-sm cursor-pointer"
                >
                  Save Course to MySQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE LESSONS MODAL */}
      {showLessonModal && selectedCourseForLessons && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E6E8F0] space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0EDFF] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#17172B] font-display">
                  Manage Lessons for: {selectedCourseForLessons.title}
                </h3>
                <span className="text-[11px] text-[#52526B]">
                  Current total lessons: {selectedCourseForLessons.lessons?.length || 0}
                </span>
              </div>
              <button
                onClick={() => setShowLessonModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Existing Lessons List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8A9E]">
                Current Syllabus Lessons
              </h4>
              <div className="divide-y divide-[#F0EDFF] border border-[#F0EDFF] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                {selectedCourseForLessons.lessons && selectedCourseForLessons.lessons.length > 0 ? (
                  selectedCourseForLessons.lessons.map((lesson) => (
                    <div
                      key={lesson.lesson_id}
                      className="p-2.5 flex items-center justify-between text-xs hover:bg-[#F7F8FC]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-[#F0EDFF] text-[#5B4BDB] font-bold text-[10px] flex items-center justify-center">
                          {lesson.sequence_no}
                        </span>
                        <span className="font-semibold text-[#17172B]">{lesson.lesson_title}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteLesson(lesson.lesson_id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Delete lesson"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No lessons created for this course yet.
                  </div>
                )}
              </div>
            </div>

            {/* Add New Lesson Form */}
            <form onSubmit={handleAddLesson} className="pt-2 border-t border-[#F0EDFF] space-y-3 text-xs">
              <h4 className="text-xs font-bold text-[#17172B]">Add New Lesson</h4>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-[#17172B] mb-1">Lesson Title *</label>
                  <input
                    type="text"
                    required
                    value={newLesson.lesson_title}
                    onChange={(e) => setNewLesson({ ...newLesson, lesson_title: e.target.value })}
                    placeholder="e.g. Database Transactions & Rollbacks"
                    className="w-full px-3 py-2 bg-[#F7F8FC] border border-[#E6E8F0] rounded-lg focus:outline-hidden focus:border-[#5B4BDB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#17172B] mb-1">Sequence # *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newLesson.sequence_no}
                    onChange={(e) => setNewLesson({ ...newLesson, sequence_no: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 bg-[#F7F8FC] border border-[#E6E8F0] rounded-lg focus:outline-hidden focus:border-[#5B4BDB]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#17172B] mb-1">Video Embed URL</label>
                <input
                  type="text"
                  value={newLesson.video_url}
                  onChange={(e) => setNewLesson({ ...newLesson, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-[#E6E8F0] rounded-lg focus:outline-hidden focus:border-[#5B4BDB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#17172B] mb-1">Lesson Content / Notes *</label>
                <textarea
                  required
                  rows={3}
                  value={newLesson.content}
                  onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                  placeholder="Write lesson explanation, code examples, or reference links..."
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-[#E6E8F0] rounded-lg focus:outline-hidden focus:border-[#5B4BDB]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#52526B] hover:bg-[#F7F8FC] rounded-lg cursor-pointer"
                >
                  Done
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-lg shadow-sm cursor-pointer"
                >
                  + Add Lesson to MySQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
