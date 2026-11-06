import React, { useEffect, useState } from 'react';
import { Course, Lesson } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  Star,
  Users,
  BookOpen,
  CheckCircle,
  PlayCircle,
  Award,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  FileText
} from 'lucide-react';

interface CourseDetailsPageProps {
  courseId: number;
  onNavigate: (page: string, params?: any) => void;
  onEnrollCourse: (courseId: number) => void;
  isEnrolled: boolean;
}

export const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({
  courseId,
  onNavigate,
  onEnrollCourse,
  isEnrolled,
}) => {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getCourse(courseId);
        setCourse(res.course);
      } catch (err: any) {
        console.error('Failed to load course details:', err);
        setError(err.message || 'Course not found.');
      } finally {
        setLoading(false);
      }
    }
    if (courseId) {
      fetchDetails();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Course Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'Could not locate the requested course in the database.'}</p>
        <button
          onClick={() => onNavigate('courses')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#5B4BDB] rounded-lg"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const outcomes = [
    'Gain hands-on mastery of production-grade architectural patterns and real development toolchains.',
    'Build and deploy commercial-standard projects with end-to-end integration and relational persistence.',
    'Write clean, optimized, production-grade code adhering to industry standards and security best practices.',
    'Prepare comprehensive portfolio assets ready for B.Tech project defense and corporate hiring interviews.'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#52526B]">
        <button onClick={() => onNavigate('courses')} className="hover:text-[#5B4BDB] flex items-center gap-1 cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Courses</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-[#5B4BDB] font-medium">{course.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-[#17172B] font-semibold truncate max-w-xs">{course.title}</span>
      </div>

      {/* Hero Header Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Overview, Syllabus, Outcomes */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#F0EDFF] text-[#5B4BDB]">
                {course.category}
              </span>
              {course.level && (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                  {course.level}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#17172B] font-display leading-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-[#52526B] leading-relaxed">
              {course.description}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#52526B] pt-2">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                <span className="tabular-nums">{Number(course.rating || 4.8).toFixed(1)} / 5.0</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="tabular-nums">{course.enrolled_count || 120} Students Enrolled</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="tabular-nums">{course.duration} Hours of Video</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span className="tabular-nums">{course.total_lessons || 0} Lessons</span>
              </div>
            </div>
          </div>

          {/* Instructor Information Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E8F0] shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A8A9E] mb-4">
              Course Instructor
            </h3>
            <div className="flex items-start gap-4">
              <img
                src={course.instructor_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={course.instructor_name || 'Instructor'}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#5B4BDB]/20"
              />
              <div className="space-y-1">
                <div className="text-base font-bold text-[#17172B] font-display">
                  {course.instructor_name || 'Dr. Sarah Chen'}
                </div>
                <div className="text-xs font-semibold text-[#5B4BDB]">
                  Senior University Faculty & Systems Architect
                </div>
                <p className="text-xs text-[#52526B] leading-relaxed pt-1">
                  {course.instructor_bio || 'Experienced software engineer and computer science educator specializing in enterprise full-stack development, database architecture, and applied AI systems.'}
                </p>
              </div>
            </div>
          </div>

          {/* Learning Outcomes Checklist */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E6E8F0] shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#17172B] font-display">
              What You Will Learn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {outcomes.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#52526B]">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Curriculum & Lessons List */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E6E8F0] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#17172B] font-display">
                  Course Curriculum
                </h2>
                <p className="text-xs text-[#52526B] mt-0.5">
                  {course.total_lessons || 0} modular lessons organized sequentially
                </p>
              </div>
              <span className="text-xs font-semibold text-[#5B4BDB] bg-[#F0EDFF] px-2.5 py-1 rounded-md">
                Full Syllabus
              </span>
            </div>

            <div className="divide-y divide-[#F0EDFF] border border-[#F0EDFF] rounded-xl overflow-hidden">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson: Lesson, idx: number) => (
                  <div
                    key={lesson.lesson_id}
                    className="p-4 flex items-center justify-between hover:bg-[#F7F8FC] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#F0EDFF] text-[#5B4BDB] text-xs font-bold flex items-center justify-center shrink-0 tabular-nums">
                        {lesson.sequence_no || idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#17172B]">
                          {lesson.lesson_title}
                        </div>
                        <div className="text-[11px] text-[#52526B] line-clamp-1 mt-0.5">
                          {lesson.content}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs text-[#52526B]">
                      <span className="tabular-nums">{lesson.duration || 15} mins</span>
                      <PlayCircle className="w-4 h-4 text-[#5B4BDB]" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  Curriculum lessons will be populated dynamically.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Sticky Pricing & Enrollment Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6E8F0] shadow-lg overflow-hidden">
            {/* Thumbnail */}
            <div className="aspect-16/10 bg-slate-100 overflow-hidden relative">
              <img
                src={course.thumbnail || '/src/assets/images/course_web_dev_1793960054939.jpg'}
                alt={course.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 text-[#5B4BDB] flex items-center justify-center shadow-lg">
                  <PlayCircle className="w-6 h-6 fill-[#5B4BDB] text-white" />
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="p-6 space-y-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-[#17172B] font-display tabular-nums">
                    ${Number(course.price).toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 line-through ml-2 tabular-nums">
                    ${(Number(course.price) * 1.6).toFixed(2)}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Limited Offer
                </span>
              </div>

              {/* Enrollment Trigger */}
              {isEnrolled ? (
                <div className="space-y-2">
                  <button
                    onClick={() => onNavigate('learn', { courseId: course.course_id })}
                    className="w-full py-3.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Go to Interactive Classroom</span>
                  </button>
                  <p className="text-[11px] text-center text-emerald-700 font-medium">
                    ✓ You are already enrolled in this course
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      if (!user) {
                        onNavigate('login', { redirectToCourse: course.course_id });
                      } else {
                        onEnrollCourse(course.course_id);
                      }
                    }}
                    className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-xl shadow-md shadow-[#5B4BDB]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Enroll Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-[#52526B]">
                    Instant access · Saves to MySQL database
                  </p>
                </div>
              )}

              {/* Course Features List */}
              <div className="pt-4 border-t border-[#F0EDFF] space-y-3 text-xs text-[#52526B]">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#5B4BDB]" />
                  <span>{course.duration} hours on-demand video</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#5B4BDB]" />
                  <span>Full practical assignments & lecture notes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-[#5B4BDB]" />
                  <span>Accredited certificate of completion</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#5B4BDB]" />
                  <span>Lifetime access & syllabus updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
