import React, { useEffect, useState } from 'react';
import { Course, PlatformStats, User } from '../types';
import { api } from '../services/api';
import { CourseCard } from '../components/CourseCard';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Code2,
  Database,
  Terminal,
  Cpu,
  Layers,
  Cloud,
  CheckCircle,
  Award,
  PlayCircle,
  TrendingUp,
  Globe2,
  Clock,
  ShieldCheck,
  Star,
  UserCheck,
  GraduationCap
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onEnrollCourse: (courseId: number) => void;
  enrolledCourseIds: Set<number>;
}

const CATEGORIES = [
  { name: 'Web Development', icon: Code2, desc: 'React, Node.js, Express & Modern HTML/CSS', count: '14 Courses' },
  { name: 'Java Programming', icon: Terminal, desc: 'Spring Boot, OOP, Microservices & JPA', count: '8 Courses' },
  { name: 'Python Programming', icon: Code2, desc: 'Data structures, automation & scripting', count: '12 Courses' },
  { name: 'Data Science', icon: TrendingUp, desc: 'Pandas, statistical analytics & visual models', count: '9 Courses' },
  { name: 'Artificial Intelligence', icon: Cpu, desc: 'Deep learning, neural networks & LLM agents', count: '11 Courses' },
  { name: 'Database Management', icon: Database, desc: 'MySQL 8.0, relational schema & SQL queries', count: '7 Courses' },
  { name: 'UI/UX Design', icon: Layers, desc: 'Figma prototypes, design systems & tokens', count: '10 Courses' },
  { name: 'Cloud Computing', icon: Cloud, desc: 'AWS, Docker, Kubernetes & DevOps pipelines', count: '6 Courses' },
];

const WHY_US_ITEMS = [
  {
    title: 'Expert Instructors',
    desc: 'Learn directly from industry staff engineers and university professors with real commercial experience.',
    icon: Award,
  },
  {
    title: 'Flexible Learning',
    desc: 'Self-paced video modules and interactive curriculum accessible anytime on any desktop or mobile device.',
    icon: Clock,
  },
  {
    title: 'Track Your Progress',
    desc: 'Automated MySQL-backed progress tracker calculating percentage and completion status in real-time.',
    icon: TrendingUp,
  },
  {
    title: 'Learn Anywhere',
    desc: 'Seamless multi-device cloud architecture with persistent profiles and cross-session resume state.',
    icon: Globe2,
  },
  {
    title: 'Practical Lessons',
    desc: 'Hands-on projects, code assignments, and applied case studies that simulate genuine engineering sprints.',
    icon: Code2,
  },
  {
    title: 'Career Development',
    desc: 'Curricula structured specifically to prepare you for technical interviews, portfolio builds, and B.Tech evaluations.',
    icon: CheckCircle,
  },
];

const STEPS = [
  { num: '01', title: 'Create an Account', desc: 'Register as a student in seconds to access your personalized learning dashboard.' },
  { num: '02', title: 'Explore Courses', desc: 'Filter courses by academic category, difficulty level, rating, and curriculum syllabus.' },
  { num: '03', title: 'Enroll in a Course', desc: 'Instant 1-click enrollment saved directly to your MySQL database profile.' },
  { num: '04', title: 'Start Learning', desc: 'Watch HD video lectures, read structured lesson guides, and inspect code notes.' },
  { num: '05', title: 'Complete Lessons', desc: 'Mark lessons as completed to trigger real-time progress calculations in MySQL.' },
  { num: '06', title: 'Track Your Progress', desc: 'Achieve 100% course completion and earn your validated course milestone.' },
];

const TESTIMONIALS = [
  {
    name: 'Karthik Ramanathan',
    role: 'B.Tech CSE Graduate · Software Engineer at FinTech Corp',
    quote: 'LEARNOVA gave me the exact full-stack foundation I needed for my campus placement. The connection between React frontends, Express APIs, and MySQL relational schemas is taught brilliantly.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'Ananya Sharma',
    role: 'Data Analyst · Cloud Systems Tech',
    quote: 'The AI and Database Management courses are exceptional. The learning interface with real lesson progress tracking and instant SQL query context made studying effortless.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'Rahul Deshmukh',
    role: 'Full-Stack Developer · B.Tech Project Gold Medalist',
    quote: 'This platform sets the gold standard for university project demonstrations. The UI/UX is clean, intuitive, and the database architecture with MySQL Workbench is completely transparent.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onEnrollCourse,
  enrolledCourseIds,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    totalStudents: 14250,
    availableCourses: 6,
    expertInstructors: 45,
    lessonsCompleted: 98400,
    totalEnrollments: 3,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, sRes, iRes] = await Promise.all([
          api.getCourses({ sort: 'popular' }),
          api.getStats(),
          api.getInstructors(),
        ]);
        setCourses(cRes.courses.slice(0, 6));
        setStats(sRes);
        setInstructors(iRes.instructors.slice(0, 3));
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* ========================================================= */}
      {/* BLOCK 1: HERO SECTION                                     */}
      {/* ========================================================= */}
      <section className="relative pt-8 sm:pt-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0EDFF] border border-[#5B4BDB]/20 text-xs font-semibold text-[#5B4BDB]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation Online Education Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17172B] tracking-tight leading-[1.1] font-display text-balance">
                Unlock Your Potential With Online Learning
              </h1>

              <p className="text-base sm:text-lg text-[#52526B] leading-relaxed max-w-2xl text-balance">
                Discover expert-led courses, develop in-demand skills and achieve your career goals with LEARNOVA.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('courses')}
                  className="px-6 py-3.5 text-sm font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-xl shadow-md shadow-[#5B4BDB]/25 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('register')}
                  className="px-6 py-3.5 text-sm font-bold text-[#17172B] bg-white hover:bg-[#F0EDFF] hover:text-[#5B4BDB] border border-[#E6E8F0] rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-[#5B4BDB]" />
                  <span>Start Learning</span>
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-6 border-t border-[#E6E8F0] flex flex-wrap items-center gap-6 text-xs text-[#52526B]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>MySQL 8.0 Real-Time Persistence</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Role-Based Dashboards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Verified Course Curriculum</span>
                </div>
              </div>
            </div>

            {/* Right Educational Illustration Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/60 bg-white">
                <img
                  src="/src/assets/images/learnova_hero_banner_1793960054793.jpg"
                  alt="Students learning with LEARNOVA online LMS"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17172B]/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Metric Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F0EDFF] flex items-center justify-center text-[#5B4BDB]">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#17172B]">Active Classroom</div>
                      <div className="text-[11px] text-[#52526B]">Interactive video syllabus & progress</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('courses')}
                    className="px-3 py-1.5 text-xs font-bold text-[#5B4BDB] bg-[#F0EDFF] hover:bg-[#5B4BDB] hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BLOCK 2: TRUST STATISTICS                                 */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E6E8F0] shadow-sm p-8 sm:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#E6E8F0]">
            {/* Stat 1 */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left px-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#5B4BDB] tabular-nums font-display">
                {stats.totalStudents.toLocaleString()}+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#17172B] mt-1">
                Total Students
              </span>
              <span className="text-xs text-[#52526B] mt-0.5">
                Active global learners
              </span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left px-4 pt-6 lg:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#17172B] tabular-nums font-display">
                {stats.availableCourses}+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#17172B] mt-1">
                Available Courses
              </span>
              <span className="text-xs text-[#52526B] mt-0.5">
                Curated technical paths
              </span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left px-4 pt-6 lg:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#5B4BDB] tabular-nums font-display">
                {stats.expertInstructors}+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#17172B] mt-1">
                Expert Instructors
              </span>
              <span className="text-xs text-[#52526B] mt-0.5">
                Engineers & researchers
              </span>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left px-4 pt-6 lg:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#17172B] tabular-nums font-display">
                {stats.lessonsCompleted.toLocaleString()}+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#17172B] mt-1">
                Lessons Completed
              </span>
              <span className="text-xs text-[#52526B] mt-0.5">
                Saved in MySQL database
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BLOCK 3: COURSE CATEGORIES                                */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17172B] font-display">
            Explore Course Categories
          </h2>
          <p className="text-sm text-[#52526B] mt-2">
            Select an academic discipline to filter our library of accredited courses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => onNavigate('courses', { category: cat.name })}
                className="group p-5 bg-white rounded-xl border border-[#E6E8F0] hover:border-[#5B4BDB]/40 hover:shadow-lg transition-all duration-200 text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#F0EDFF] text-[#5B4BDB] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#17172B] group-hover:text-[#5B4BDB] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#52526B] mt-1 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="pt-4 mt-2 border-t border-[#F0EDFF] flex items-center justify-between text-[11px] font-semibold text-[#5B4BDB]">
                  <span>{cat.count}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* BLOCK 4: POPULAR COURSES                                  */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17172B] font-display">
              Popular Courses
            </h2>
            <p className="text-sm text-[#52526B] mt-1">
              Real courses dynamically fetched from MySQL 8.0 database.
            </p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-xs font-bold text-[#5B4BDB] hover:text-[#4A3BB8] flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.course_id}
                course={course}
                isEnrolled={enrolledCourseIds.has(course.course_id)}
                onViewDetails={(id) => onNavigate('course-details', { courseId: id })}
                onEnroll={(id) => onEnrollCourse(id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">No courses loaded yet.</p>
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* BLOCK 5: WHY CHOOSE LEARNOVA                              */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-b from-[#F0EDFF]/50 to-transparent py-16 border-y border-[#E6E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17172B] font-display">
              Why Choose LEARNOVA
            </h2>
            <p className="text-sm text-[#52526B] mt-2">
              Engineered with modern pedagogical principles, verified curricula, and commercial-grade web technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_US_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-7 rounded-2xl border border-[#E6E8F0] shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F0EDFF] text-[#5B4BDB] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#17172B] mb-2 font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52526B] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BLOCK 6: HOW IT WORKS                                     */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17172B] font-display">
            How It Works
          </h2>
          <p className="text-sm text-[#52526B] mt-2">
            A seamless six-step pathway from registration to career-defining skill mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="bg-white p-6 rounded-xl border border-[#E6E8F0] relative overflow-hidden"
            >
              <span className="text-3xl font-extrabold text-[#5B4BDB]/20 font-display">
                {s.num}
              </span>
              <h3 className="text-sm font-bold text-[#17172B] mt-2 mb-1.5 font-display">
                {s.title}
              </h3>
              <p className="text-xs text-[#52526B] leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* BLOCK 7: FEATURED INSTRUCTORS                             */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17172B] font-display">
            Featured Instructors
          </h2>
          <p className="text-sm text-[#52526B] mt-2">
            Learn from verified faculty members retrieved from MySQL users table.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {instructors.map((inst) => (
            <div
              key={inst.user_id}
              className="bg-white p-6 rounded-2xl border border-[#E6E8F0] shadow-xs text-center flex flex-col items-center"
            >
              <img
                src={inst.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={inst.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#5B4BDB]/30 mb-4 shadow-xs"
              />
              <h3 className="text-base font-bold text-[#17172B] font-display">
                {inst.name}
              </h3>
              <span className="text-xs font-semibold text-[#5B4BDB] uppercase tracking-wider mt-0.5 mb-3">
                {inst.role}
              </span>
              <p className="text-xs text-[#52526B] leading-relaxed line-clamp-3">
                {inst.bio || 'Senior instructor specializing in enterprise software architecture.'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* BLOCK 8: STUDENT TESTIMONIALS                             */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17172B] font-display">
            Student Testimonials
          </h2>
          <p className="text-sm text-[#52526B] mt-2">
            Real stories and career outcomes from students trained on LEARNOVA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-[#E6E8F0] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#17172B] leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#F0EDFF]">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-[#17172B]">{t.name}</div>
                  <div className="text-[11px] text-[#52526B] line-clamp-1">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* BLOCK 9: FINAL CALL TO ACTION                             */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#5B4BDB] to-[#7B6DF5] rounded-3xl p-10 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-balance">
              Your Learning Journey Starts Today.
            </h2>
            <p className="text-sm sm:text-base text-purple-100 leading-relaxed text-balance">
              Join thousands of students and faculty leveraging LEARNOVA for certified technical education, practical project building, and academic excellence.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('register')}
                className="px-8 py-3.5 text-sm font-bold text-[#5B4BDB] bg-white hover:bg-purple-50 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Join LEARNOVA
              </button>
              <button
                onClick={() => onNavigate('courses')}
                className="px-8 py-3.5 text-sm font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl transition-all cursor-pointer"
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
