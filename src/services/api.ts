import { Course, Lesson, Enrollment, User, PlatformStats, ContactMessage, DatabaseStatus } from '../types';

const TOKEN_KEY = 'learnova_auth_token';
const USER_KEY = 'learnova_auth_user';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeAuth(token: string, user: User) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Storage clear error:', e);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (payload: { name: string; email: string; password: string; role?: string }) =>
    request<{ message: string; user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ message: string; user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request<{ message: string }>('/api/auth/logout', { method: 'POST' }),

  getMe: () =>
    request<{ user: User }>('/api/auth/me'),

  // Platform stats
  getStats: () =>
    request<PlatformStats>('/api/stats'),

  // Courses
  getCourses: (params?: { category?: string; search?: string; sort?: string; instructor_id?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.instructor_id) query.append('instructor_id', String(params.instructor_id));
    const qs = query.toString();
    return request<{ count: number; courses: Course[] }>(`/api/courses${qs ? `?${qs}` : ''}`);
  },

  getCourse: (courseId: number) =>
    request<{ course: Course }>(`/api/courses/${courseId}`),

  createCourse: (payload: Partial<Course>) =>
    request<{ message: string; course_id: number }>('/api/courses', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateCourse: (courseId: number, payload: Partial<Course>) =>
    request<{ message: string }>(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteCourse: (courseId: number) =>
    request<{ message: string }>(`/api/courses/${courseId}`, {
      method: 'DELETE',
    }),

  // Lessons
  addLesson: (courseId: number, payload: Partial<Lesson>) =>
    request<{ message: string; lesson_id: number }>(`/api/courses/${courseId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateLesson: (lessonId: number, payload: Partial<Lesson>) =>
    request<{ message: string }>(`/api/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteLesson: (lessonId: number) =>
    request<{ message: string }>(`/api/lessons/${lessonId}`, {
      method: 'DELETE',
    }),

  // Enrollments
  enrollCourse: (courseId: number) =>
    request<{ message: string; enrollment_id: number }>('/api/enrollment', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId }),
    }),

  getMyCourses: () =>
    request<{ enrollments: Enrollment[] }>('/api/enrollment/my-courses'),

  updateProgress: (enrollmentId: number, payload: {
    progress: number;
    status: 'Enrolled' | 'In Progress' | 'Completed';
    lesson_title?: string;
    last_accessed_lesson_id?: number;
    completed_lessons?: number[];
  }) =>
    request<{ message: string; progress: number; status: string }>(`/api/enrollment/${enrollmentId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Dashboards
  getStudentDashboard: () =>
    request<{
      totalEnrolled: number;
      completed: number;
      inProgress: number;
      overallProgress: number;
      enrollments: Enrollment[];
    }>('/api/dashboard/student'),

  getInstructorDashboard: () =>
    request<{
      totalCourses: number;
      totalStudents: number;
      courses: Course[];
    }>('/api/dashboard/instructor'),

  getAdminDashboard: () =>
    request<{
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
    }>('/api/dashboard/admin'),

  // Users
  getInstructors: () =>
    request<{ instructors: User[] }>('/api/users/instructors'),

  getAllUsers: () =>
    request<{ users: User[] }>('/api/users'),

  updateProfile: (userId: number, payload: { name: string; bio?: string }) =>
    request<{ message: string }>(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteUser: (userId: number) =>
    request<{ message: string }>(`/api/users/${userId}`, {
      method: 'DELETE',
    }),

  // Contact
  submitContact: (payload: { name: string; email: string; subject: string; message: string }) =>
    request<{ message: string; message_id: number }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getDatabaseStatus: () =>
    request<DatabaseStatus>('/api/db-status'),
};
