import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { api } from './services/api';

// Pages
import { HomePage } from './pages/HomePage';
import { ExploreCoursesPage } from './pages/ExploreCoursesPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { CourseLearningPage } from './pages/CourseLearningPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

function MainApp() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<number>>(new Set());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sync browser hash
    try {
      const hashPart = params.courseId ? `#${page}/${params.courseId}` : `#${page}`;
      window.history.pushState(null, '', hashPart);
    } catch {
      // ignore
    }
  };

  // Sync hash on initial load & popstate
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const parts = hash.split('/');
      const page = parts[0] || 'home';
      const id = parts[1] ? parseInt(parts[1], 10) : undefined;
      setCurrentPage(page);
      if (id) setPageParams({ courseId: id });
    };

    handleHash();
    window.addEventListener('popstate', handleHash);
    return () => window.removeEventListener('popstate', handleHash);
  }, []);

  // Fetch enrolled courses for current user
  useEffect(() => {
    async function fetchEnrollments() {
      if (user) {
        try {
          const res = await api.getMyCourses();
          const ids = new Set(res.enrollments.map((e) => e.course_id));
          setEnrolledCourseIds(ids);
        } catch (err) {
          console.error('Error fetching enrollments:', err);
        }
      } else {
        setEnrolledCourseIds(new Set());
      }
    }
    fetchEnrollments();
  }, [user]);

  // Handle instant enrollment
  const handleEnrollCourse = async (courseId: number) => {
    if (!user) {
      addToast('Please sign in or register to enroll in courses.', 'info');
      navigate('login', { redirectToCourse: courseId });
      return;
    }

    try {
      await api.enrollCourse(courseId);
      setEnrolledCourseIds((prev) => new Set(prev).add(courseId));
      addToast('Congratulations! Successfully enrolled in course. Opening classroom...', 'success');
      setTimeout(() => {
        navigate('learn', { courseId });
      }, 500);
    } catch (err: any) {
      if (err.message && err.message.includes('already enrolled')) {
        addToast('You are already enrolled! Opening your classroom...', 'info');
        navigate('learn', { courseId });
      } else {
        addToast(err.message || 'Enrollment failed.', 'error');
      }
    }
  };

  // Render current view
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={navigate}
            onEnrollCourse={handleEnrollCourse}
            enrolledCourseIds={enrolledCourseIds}
          />
        );

      case 'courses':
        return (
          <ExploreCoursesPage
            initialCategory={pageParams.category}
            onNavigate={navigate}
            onEnrollCourse={handleEnrollCourse}
            enrolledCourseIds={enrolledCourseIds}
          />
        );

      case 'course-details':
        return (
          <CourseDetailsPage
            courseId={pageParams.courseId || 1}
            onNavigate={navigate}
            onEnrollCourse={handleEnrollCourse}
            isEnrolled={enrolledCourseIds.has(pageParams.courseId || 1)}
          />
        );

      case 'learn':
        return (
          <CourseLearningPage
            courseId={pageParams.courseId || 1}
            onNavigate={navigate}
            onShowToast={addToast}
          />
        );

      case 'student-dashboard':
      case 'my-courses':
        if (!user) {
          return (
            <LoginPage
              onNavigate={navigate}
              onShowToast={addToast}
            />
          );
        }
        return (
          <StudentDashboard
            onNavigate={navigate}
            onShowToast={addToast}
          />
        );

      case 'instructor-dashboard':
        if (!user) {
          return <LoginPage onNavigate={navigate} onShowToast={addToast} />;
        }
        return (
          <InstructorDashboard
            onNavigate={navigate}
            onShowToast={addToast}
          />
        );

      case 'admin-dashboard':
        if (!user) {
          return <LoginPage onNavigate={navigate} onShowToast={addToast} />;
        }
        return (
          <AdminDashboard
            onNavigate={navigate}
            onShowToast={addToast}
          />
        );

      case 'login':
        return (
          <LoginPage
            onNavigate={navigate}
            onShowToast={addToast}
            redirectToCourse={pageParams.redirectToCourse}
          />
        );

      case 'register':
        return (
          <RegisterPage
            onNavigate={navigate}
            onShowToast={addToast}
          />
        );

      case 'about':
        return <AboutPage onNavigate={navigate} />;

      case 'contact':
        return <ContactPage onShowToast={addToast} />;

      case 'profile':
        if (!user) {
          return <LoginPage onNavigate={navigate} onShowToast={addToast} />;
        }
        return <ProfilePage onNavigate={navigate} onShowToast={addToast} />;

      default:
        return <NotFoundPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FC] selection:bg-[#5B4BDB]/20 selection:text-[#5B4BDB]">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigate}
        onCategorySelect={(cat) => navigate('courses', { category: cat })}
      />

      <main className="flex-1">
        {renderPage()}
      </main>

      {currentPage !== 'learn' && <Footer onNavigate={navigate} />}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
