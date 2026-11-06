import React, { useState, useEffect } from 'react';
import { Course, Lesson, Enrollment } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Award,
  Video,
  Clock,
  Sparkles,
  Check
} from 'lucide-react';

interface CourseLearningPageProps {
  courseId: number;
  onNavigate: (page: string, params?: any) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CourseLearningPage: React.FC<CourseLearningPageProps> = ({
  courseId,
  onNavigate,
  onShowToast,
}) => {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function initClassroom() {
      setLoading(true);
      try {
        const [courseRes, myCoursesRes] = await Promise.all([
          api.getCourse(courseId),
          api.getMyCourses().catch(() => ({ enrollments: [] })),
        ]);

        setCourse(courseRes.course);

        const currentEnrollment = myCoursesRes.enrollments.find(
          (e: Enrollment) => e.course_id === courseId
        );

        if (currentEnrollment) {
          setEnrollment(currentEnrollment);
          if (Array.isArray(currentEnrollment.completed_lessons)) {
            setCompletedLessonIds(new Set(currentEnrollment.completed_lessons));
          }

          // If last accessed lesson exists, find its index
          if (currentEnrollment.last_accessed_lesson_id && courseRes.course.lessons) {
            const idx = courseRes.course.lessons.findIndex(
              (l) => l.lesson_id === currentEnrollment.last_accessed_lesson_id
            );
            if (idx !== -1) setCurrentLessonIndex(idx);
          }
        }
      } catch (err: any) {
        console.error('Classroom loading error:', err);
        onShowToast('Could not load classroom curriculum.', 'error');
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      initClassroom();
    }
  }, [courseId]);

  if (loading || !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#5B4BDB] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-500">Opening LEARNOVA Interactive Classroom...</p>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const currentLesson: Lesson | undefined = lessons[currentLessonIndex];
  const totalLessons = lessons.length;
  const isLessonCompleted = currentLesson ? completedLessonIds.has(currentLesson.lesson_id) : false;

  // Calculate current progress
  const progressPercent = totalLessons > 0 ? Math.round((completedLessonIds.size / totalLessons) * 100) : 0;
  const isCourseFinished = progressPercent === 100;

  // Handle Mark as Completed
  const handleToggleComplete = async () => {
    if (!currentLesson || !enrollment) return;

    setUpdating(true);
    const updatedSet = new Set(completedLessonIds);

    if (updatedSet.has(currentLesson.lesson_id)) {
      updatedSet.delete(currentLesson.lesson_id);
    } else {
      updatedSet.add(currentLesson.lesson_id);
    }

    const newPercent = Math.min(100, Math.round((updatedSet.size / totalLessons) * 100));
    const newStatus = newPercent === 100 ? 'Completed' : newPercent > 0 ? 'In Progress' : 'Enrolled';

    try {
      await api.updateProgress(enrollment.enrollment_id, {
        progress: newPercent,
        status: newStatus,
        lesson_title: currentLesson.lesson_title,
        last_accessed_lesson_id: currentLesson.lesson_id,
        completed_lessons: Array.from(updatedSet),
      });

      setCompletedLessonIds(updatedSet);
      setEnrollment({
        ...enrollment,
        progress: newPercent,
        status: newStatus,
        completed_lessons: Array.from(updatedSet),
      });

      if (!completedLessonIds.has(currentLesson.lesson_id)) {
        onShowToast(`Completed lesson: "${currentLesson.lesson_title}"! Progress: ${newPercent}%`, 'success');

        // Automatically advance to next lesson if available
        if (currentLessonIndex < totalLessons - 1) {
          setTimeout(() => {
            setCurrentLessonIndex(currentLessonIndex + 1);
          }, 600);
        }
      } else {
        onShowToast(`Lesson unmarked. Progress: ${newPercent}%`, 'info');
      }
    } catch (err: any) {
      console.error('Progress update error:', err);
      onShowToast('Failed to save progress to MySQL.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-[#F7F8FC] min-h-[calc(100vh-72px)] flex flex-col">
      {/* Top Classroom Bar */}
      <div className="bg-white border-b border-[#E6E8F0] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(user?.role === 'student' ? 'student-dashboard' : 'courses')}
            className="p-1.5 rounded-lg text-[#52526B] hover:text-[#17172B] hover:bg-[#F0EDFF] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#17172B] truncate max-w-sm sm:max-w-md md:max-w-xl font-display">
              {course.title}
            </span>
            <span className="text-[10px] text-[#52526B]">
              Instructor: {course.instructor_name || 'Dr. Sarah Chen'}
            </span>
          </div>
        </div>

        {/* Progress Pill Bar */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-[#17172B] tabular-nums">
              {progressPercent}% Complete
            </span>
            <span className="text-[10px] text-[#52526B]">
              {completedLessonIds.size} of {totalLessons} lessons
            </span>
          </div>
          <div className="w-24 sm:w-32 h-2.5 bg-[#E6E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5B4BDB] to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {isCourseFinished && (
            <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-100 text-emerald-800">
              <Award className="w-3.5 h-3.5" />
              <span>Certified</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Layout: Left Sidebar + Right Video Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto w-full p-4 sm:p-6 gap-6">
        {/* LEFT SIDEBAR: Syllabus & Lessons List (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E6E8F0] shadow-xs flex flex-col max-h-[780px] overflow-hidden">
          <div className="p-4 border-b border-[#F0EDFF] bg-[#F7F8FC]/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#17172B]">
                Curriculum Lessons
              </h3>
              <span className="text-xs font-semibold text-[#5B4BDB] tabular-nums">
                {completedLessonIds.size}/{totalLessons}
              </span>
            </div>
            <div className="w-full bg-[#E6E8F0] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#5B4BDB] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="overflow-y-auto divide-y divide-[#F0EDFF] flex-1">
            {lessons.map((lesson, index) => {
              const active = index === currentLessonIndex;
              const completed = completedLessonIds.has(lesson.lesson_id);

              return (
                <button
                  key={lesson.lesson_id}
                  onClick={() => setCurrentLessonIndex(index)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#F0EDFF] border-l-4 border-l-[#5B4BDB]'
                      : 'hover:bg-[#F7F8FC]'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    ) : active ? (
                      <PlayCircle className="w-4 h-4 text-[#5B4BDB]" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold truncate ${active ? 'text-[#5B4BDB]' : 'text-[#17172B]'}`}>
                        {index + 1}. {lesson.lesson_title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#52526B]">
                      <Clock className="w-3 h-3" />
                      <span className="tabular-nums">{lesson.duration || 15} mins</span>
                      {completed && (
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 rounded">
                          Done
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Status */}
          <div className="p-3 bg-[#F7F8FC] border-t border-[#E6E8F0] text-center text-[11px] text-[#52526B]">
            Status: <strong className="text-[#17172B]">{enrollment?.status || 'In Progress'}</strong> (MySQL Synced)
          </div>
        </div>

        {/* MAIN SECTION: Video Player, Content, Controls (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-900 aspect-16/9 relative group">
            {currentLesson?.video_url && currentLesson.video_url.includes('embed') ? (
              <iframe
                src={`${currentLesson.video_url}?autoplay=0&rel=0`}
                title={currentLesson.lesson_title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-8 text-center space-y-3">
                <Video className="w-16 h-16 text-[#5B4BDB]" />
                <h4 className="text-base font-bold font-display">{currentLesson?.lesson_title}</h4>
                <p className="text-xs text-slate-400 max-w-md">
                  High-definition lecture streaming node active. Press play to view syllabus presentation.
                </p>
                <div className="pt-2">
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300">
                    Video Player: Ready
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Header & Mark as Completed Bar */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E8F0] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#5B4BDB] uppercase tracking-wider mb-1">
                  Lesson {currentLessonIndex + 1} of {totalLessons}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#17172B] font-display">
                  {currentLesson?.lesson_title}
                </h2>
              </div>

              {/* Mark Completed Button */}
              <button
                onClick={handleToggleComplete}
                disabled={updating}
                className={`px-4.5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  isLessonCompleted
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-[#5B4BDB] hover:bg-[#4A3BB8] text-white shadow-md shadow-[#5B4BDB]/20'
                }`}
              >
                {isLessonCompleted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Completed</span>
                  </>
                )}
              </button>
            </div>

            {/* Lesson Body Content */}
            <div className="pt-4 border-t border-[#F0EDFF] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8A9E]">
                Lesson Guide & Practical Notes
              </h4>
              <p className="text-sm text-[#17172B] leading-relaxed">
                {currentLesson?.content}
              </p>

              <div className="bg-[#F7F8FC] p-4 rounded-xl border border-[#E6E8F0] space-y-2 text-xs text-[#52526B]">
                <div className="font-bold text-[#17172B] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5B4BDB]" />
                  <span>Key Architectural Concept</span>
                </div>
                <p className="leading-relaxed">
                  Every lesson is directly bound to your relational database record. When you complete lessons, MySQL executes a transactional update to ensure your academic progress, timestamp, and syllabus sequence are permanently recorded.
                </p>
              </div>
            </div>

            {/* Previous & Next Navigation Controls */}
            <div className="pt-4 border-t border-[#F0EDFF] flex items-center justify-between">
              <button
                onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                disabled={currentLessonIndex === 0}
                className="px-4 py-2 text-xs font-semibold text-[#17172B] bg-[#F7F8FC] hover:bg-[#F0EDFF] hover:text-[#5B4BDB] rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Lesson</span>
              </button>

              <button
                onClick={() => setCurrentLessonIndex(Math.min(totalLessons - 1, currentLessonIndex + 1))}
                disabled={currentLessonIndex === totalLessons - 1}
                className="px-4 py-2 text-xs font-semibold text-[#17172B] bg-[#F7F8FC] hover:bg-[#F0EDFF] hover:text-[#5B4BDB] rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Lesson</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
