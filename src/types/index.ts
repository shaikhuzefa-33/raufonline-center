export type UserRole = 'admin' | 'instructor' | 'student';

export interface User {
  user_id: number;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  avatar?: string;
  created_at?: string;
}

export interface Course {
  course_id: number;
  title: string;
  description: string;
  instructor_id: number;
  instructor_name?: string;
  instructor_bio?: string;
  instructor_avatar?: string;
  price: number;
  duration: number; // in hours
  category: string;
  level?: string;
  thumbnail?: string;
  rating?: number;
  enrolled_count?: number;
  total_lessons?: number;
  lessons?: Lesson[];
  created_at?: string;
}

export interface Lesson {
  lesson_id: number;
  course_id: number;
  lesson_title: string;
  content: string;
  video_url?: string;
  sequence_no: number;
  duration?: number; // in minutes
}

export interface Enrollment {
  enrollment_id: number;
  user_id: number;
  course_id: number;
  lesson_title?: string;
  content?: string;
  enrollment_date: string;
  progress: number; // 0 to 100
  status: 'Enrolled' | 'In Progress' | 'Completed';
  last_accessed_lesson_id?: number;
  completed_lessons?: number[];
  // Joined course fields
  course_title?: string;
  course_description?: string;
  thumbnail?: string;
  category?: string;
  duration?: number;
  instructor_name?: string;
  student_name?: string;
  student_email?: string;
}

export interface ContactMessage {
  message_id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: string;
  created_at?: string;
}

export interface PlatformStats {
  totalStudents: number;
  availableCourses: number;
  expertInstructors: number;
  lessonsCompleted: number;
  totalEnrollments: number;
}

export interface DatabaseStatus {
  connectedToMySQL: boolean;
  host: string;
  port: number;
  database: string;
  user: string;
  mode: string;
  databaseSqlPath: string;
  bTechProject: string;
  version: string;
}
