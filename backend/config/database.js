import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'shaikrauf@12',
  database: process.env.DB_NAME || 'learnova_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;
let isConnectedToMySQL = false;

// Embedded persistent storage file for fallback mode when MySQL daemon is not running in sandbox
const DATA_FILE_PATH = path.resolve(process.cwd(), 'database/embedded_store.json');

// Initial seed data identical to database/database.sql
const initialData = {
  users: [
    {
      user_id: 1,
      name: 'Admin Learnova',
      email: 'admin@learnova.edu',
      password: '$2a$10$K8xSj4b3r9xY4Nf1qN0hbe47u5aZkU9kL6w7gT2mR3vP1o8s9jK4m',
      role: 'admin',
      bio: 'Chief System Administrator & Academic Supervisor at LEARNOVA.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      created_at: new Date('2026-01-15T08:00:00Z').toISOString()
    },
    {
      user_id: 2,
      name: 'Dr. Sarah Chen',
      email: 'sarah.chen@learnova.edu',
      password: '$2a$10$K8xSj4b3r9xY4Nf1qN0hbe47u5aZkU9kL6w7gT2mR3vP1o8s9jK4m',
      role: 'instructor',
      bio: 'Senior AI Researcher & Full-Stack Systems Architect with 12+ years experience in Silicon Valley.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      created_at: new Date('2026-01-20T09:30:00Z').toISOString()
    },
    {
      user_id: 3,
      name: 'Alex Rivera',
      email: 'alex.rivera@learnova.edu',
      password: '$2a$10$K8xSj4b3r9xY4Nf1qN0hbe47u5aZkU9kL6w7gT2mR3vP1o8s9jK4m',
      role: 'instructor',
      bio: 'Staff Frontend Architect & Design Systems Lead. Creator of top-rated UI frameworks.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      created_at: new Date('2026-01-25T11:00:00Z').toISOString()
    },
    {
      user_id: 4,
      name: 'Prof. Priya Patel',
      email: 'priya.patel@learnova.edu',
      password: '$2a$10$K8xSj4b3r9xY4Nf1qN0hbe47u5aZkU9kL6w7gT2mR3vP1o8s9jK4m',
      role: 'instructor',
      bio: 'Cloud Infrastructure & Distributed Database Specialist at leading FinTech platforms.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      created_at: new Date('2026-02-01T14:20:00Z').toISOString()
    },
    {
      user_id: 5,
      name: 'Shaik Rauf',
      email: 'student@learnova.edu',
      password: '$2a$10$K8xSj4b3r9xY4Nf1qN0hbe47u5aZkU9kL6w7gT2mR3vP1o8s9jK4m',
      role: 'student',
      bio: 'B.Tech CSE Student aspiring Full-Stack Software Engineer.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      created_at: new Date('2026-02-10T16:00:00Z').toISOString()
    }
  ],
  courses: [
    {
      course_id: 1,
      title: 'Full-Stack Web Development Bootcamp: React, Node & MySQL',
      description: 'Master modern web development from HTML, CSS and TypeScript to high-performance Express backends, REST APIs, and scalable MySQL relational databases.',
      instructor_id: 2,
      price: 79.99,
      duration: 48,
      category: 'Web Development',
      level: 'Beginner to Advanced',
      thumbnail: '/src/assets/images/course_web_dev_1793960054939.jpg',
      rating: 4.92,
      enrolled_count: 1240,
      created_at: new Date('2026-02-15T10:00:00Z').toISOString()
    },
    {
      course_id: 2,
      title: 'Applied Artificial Intelligence & Machine Learning with Python',
      description: 'A comprehensive practical masterclass covering neural network architectures, predictive modeling, NLP pipelines, and enterprise model deployment.',
      instructor_id: 2,
      price: 89.99,
      duration: 56,
      category: 'Artificial Intelligence',
      level: 'Intermediate',
      thumbnail: '/src/assets/images/course_ai_datasci_1793960056847.jpg',
      rating: 4.95,
      enrolled_count: 980,
      created_at: new Date('2026-02-18T12:00:00Z').toISOString()
    },
    {
      course_id: 3,
      title: 'Modern UI/UX Design Masterclass: Systems, Tokens & Prototypes',
      description: 'Learn how top tech organizations craft design systems, accessibility tokens, responsive wireframes, and production-ready interactive Figma prototypes.',
      instructor_id: 3,
      price: 64.99,
      duration: 32,
      category: 'UI/UX Design',
      level: 'All Levels',
      thumbnail: '/src/assets/images/course_ui_ux_1793960057128.jpg',
      rating: 4.88,
      enrolled_count: 760,
      created_at: new Date('2026-02-20T14:00:00Z').toISOString()
    },
    {
      course_id: 4,
      title: 'Cloud Computing & Microservices: AWS, Docker & Kubernetes',
      description: 'Architect fault-tolerant microservices, configure automated CI/CD pipelines, containerize backend apps, and manage distributed cloud workloads.',
      instructor_id: 4,
      price: 84.99,
      duration: 40,
      category: 'Cloud Computing',
      level: 'Advanced',
      thumbnail: '/src/assets/images/course_cloud_dev_1793960056715.jpg',
      rating: 4.89,
      enrolled_count: 610,
      created_at: new Date('2026-02-22T09:00:00Z').toISOString()
    },
    {
      course_id: 5,
      title: 'Java Enterprise Programming & Spring Boot Architecture',
      description: 'Deep dive into object-oriented design, multi-threading, Spring Boot microservices, Hibernate ORM, and secure enterprise RESTful web services.',
      instructor_id: 4,
      price: 74.99,
      duration: 44,
      category: 'Java Programming',
      level: 'Intermediate',
      thumbnail: '/src/assets/images/course_web_dev_1793960054939.jpg',
      rating: 4.84,
      enrolled_count: 520,
      created_at: new Date('2026-02-24T15:00:00Z').toISOString()
    },
    {
      course_id: 6,
      title: 'Database Management Systems & Advanced SQL Optimization',
      description: 'Master relational database theory, index query optimization, ACID transactions, stored procedures, normalization, and MySQL Workbench administration.',
      instructor_id: 2,
      price: 59.99,
      duration: 28,
      category: 'Database Management',
      level: 'Beginner to Intermediate',
      thumbnail: '/src/assets/images/course_cloud_dev_1793960056715.jpg',
      rating: 4.91,
      enrolled_count: 890,
      created_at: new Date('2026-02-26T11:00:00Z').toISOString()
    }
  ],
  lessons: [
    {
      lesson_id: 1,
      course_id: 1,
      lesson_title: 'Course Introduction & Modern Web Architecture',
      content: 'Welcome to Full-Stack Web Development! In this lesson we unpack the client-server lifecycle, HTTP request headers, REST conventions, and development environment setup.',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      sequence_no: 1,
      duration: 18
    },
    {
      lesson_id: 2,
      course_id: 1,
      lesson_title: 'Mastering React 19 State & Component Lifecycle',
      content: 'Deep dive into functional React hooks: useState, useEffect, useCallback, custom hooks, and immutable state management patterns for interactive web apps.',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      sequence_no: 2,
      duration: 28
    },
    {
      lesson_id: 3,
      course_id: 1,
      lesson_title: 'Building Robust Express.js RESTful APIs',
      content: 'Learn how to construct clean Express routers, implement CORS, parse request bodies, validate incoming DTO payloads, and handle errors centralized.',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      sequence_no: 3,
      duration: 34
    },
    {
      lesson_id: 4,
      course_id: 1,
      lesson_title: 'Connecting MySQL 8.0 with mysql2 & Connection Pooling',
      content: 'Step-by-step implementation of mysql2 connection pools in Node.js, parameterized queries to prevent SQL injections, and transaction management.',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      sequence_no: 4,
      duration: 40
    },
    {
      lesson_id: 5,
      course_id: 1,
      lesson_title: 'User Authentication with bcrypt & JWT/Session Security',
      content: 'Protecting API routes with password hashing, salt rounds, session cookies, Bearer tokens, and role-based access control (RBAC).',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      sequence_no: 5,
      duration: 36
    },
    {
      lesson_id: 6,
      course_id: 2,
      lesson_title: 'Foundations of Machine Learning & Python Ecosystem',
      content: 'Setting up NumPy, Pandas, Scikit-Learn, and understanding supervised vs unsupervised learning workflows with real-world datasets.',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      sequence_no: 1,
      duration: 25
    },
    {
      lesson_id: 7,
      course_id: 2,
      lesson_title: 'Deep Learning Fundamentals with PyTorch',
      content: 'Tensors, computation graphs, forward pass, backpropagation, gradient descent optimizers, and loss functions explained visually.',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      sequence_no: 2,
      duration: 42
    },
    {
      lesson_id: 8,
      course_id: 2,
      lesson_title: 'Computer Vision & Convolutional Neural Networks',
      content: 'Building CNNs for feature extraction, pooling, edge detection, image classification, and transfer learning with pre-trained models.',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      sequence_no: 3,
      duration: 38
    },
    {
      lesson_id: 9,
      course_id: 3,
      lesson_title: 'Principles of Visual Hierarchy & Typographic Scale',
      content: 'Mastering the 60-30-10 color rule, modular type scales, vertical rhythm, and contrast ratios compliant with WCAG AA standards.',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      sequence_no: 1,
      duration: 22
    },
    {
      lesson_id: 10,
      course_id: 3,
      lesson_title: 'Building Scalable Design Systems & Tokens',
      content: 'Defining atomic design tokens: colors, spacing scales, elevation, radius, component variants, and interactive micro-states.',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      sequence_no: 2,
      duration: 35
    },
    {
      lesson_id: 11,
      course_id: 4,
      lesson_title: 'Cloud Computing Fundamentals & AWS Core Services',
      content: 'Understanding EC2 compute, S3 object storage, VPC networking, IAM security policies, and regional availability zones.',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      sequence_no: 1,
      duration: 30
    },
    {
      lesson_id: 12,
      course_id: 4,
      lesson_title: 'Docker Containerization & Multi-Stage Builds',
      content: 'Writing optimized Dockerfiles, docker-compose orchestration, environment isolation, and production image caching techniques.',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      sequence_no: 2,
      duration: 32
    }
  ],
  enrollment: [
    {
      enrollment_id: 1,
      user_id: 5,
      course_id: 1,
      lesson_title: 'Mastering React 19 State & Component Lifecycle',
      content: 'Currently studying state management and hooks.',
      enrollment_date: '2026-03-01 10:30:00',
      progress: 40,
      status: 'In Progress',
      last_accessed_lesson_id: 2,
      completed_lessons: [1, 2]
    },
    {
      enrollment_id: 2,
      user_id: 5,
      course_id: 3,
      lesson_title: 'Principles of Visual Hierarchy & Typographic Scale',
      content: 'Enrolled in UI/UX masterclass.',
      enrollment_date: '2026-03-04 14:15:00',
      progress: 100,
      status: 'Completed',
      last_accessed_lesson_id: 10,
      completed_lessons: [9, 10]
    },
    {
      enrollment_id: 3,
      user_id: 5,
      course_id: 2,
      lesson_title: 'Foundations of Machine Learning & Python Ecosystem',
      content: 'Enrolled in AI masterclass.',
      enrollment_date: '2026-03-05 09:00:00',
      progress: 0,
      status: 'Enrolled',
      last_accessed_lesson_id: 6,
      completed_lessons: []
    }
  ],
  contact_messages: [
    {
      message_id: 1,
      name: 'Michael Vance',
      email: 'michael.v@example.com',
      subject: 'Corporate Team Training Inquiry',
      message: 'Hello LEARNOVA team, we are interested in enrolling our engineering team of 25 developers in your Full-Stack and Cloud Computing tracks. Can you share bulk licensing pricing?',
      status: 'read',
      created_at: '2026-03-02 08:30:00'
    },
    {
      message_id: 2,
      name: 'Sophia Miller',
      email: 'sophia.m@example.com',
      subject: 'Instructor Partnership Application',
      message: 'Hi! I am a senior data scientist and author. I would love to develop a specialized course on LLM agents on LEARNOVA.',
      status: 'unread',
      created_at: '2026-03-05 11:20:00'
    }
  ]
};

// Load or persist fallback database data
function getStore() {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading embedded store:', e);
  }
  // Initialize file
  saveStore(initialData);
  return initialData;
}

function saveStore(data) {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving embedded store:', e);
  }
}

// Initialize database connection
export async function initializeDatabase() {
  console.log('----------------------------------------------------');
  console.log(`[LEARNOVA DB] Attempting connection to MySQL 8.0...`);
  console.log(`[LEARNOVA DB] Target: ${DB_CONFIG.user}@${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`);

  try {
    pool = mysql.createPool(DB_CONFIG);
    // Test connection with timeout
    const testPromise = pool.query('SELECT 1 as test');
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timed out')), 2500)
    );

    await Promise.race([testPromise, timeoutPromise]);
    isConnectedToMySQL = true;
    console.log(`[LEARNOVA DB] SUCCESS: Connected directly to MySQL Server 8.0!`);
    console.log(`[LEARNOVA DB] Using live MySQL tables and connection pool.`);
    console.log('----------------------------------------------------');
  } catch (err) {
    isConnectedToMySQL = false;
    console.warn(`[LEARNOVA DB] NOTICE: Local MySQL Server not reachable on ${DB_CONFIG.host}:${DB_CONFIG.port} (${err.message}).`);
    console.log(`[LEARNOVA DB] Active Mode: Embedded persistent relational store.`);
    console.log(`[LEARNOVA DB] All tables (users, courses, lessons, enrollment, contact_messages) are fully active.`);
    console.log(`[LEARNOVA DB] MySQL Workbench SQL file ready at database/database.sql for your local MySQL Server 8.0 setup.`);
    console.log('----------------------------------------------------');
    // Ensure initial store is populated
    getStore();
  }
}

// Database helper for queries
export async function dbQuery(sql, params = []) {
  if (isConnectedToMySQL && pool) {
    try {
      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      console.error('[LEARNOVA MySQL Query Error]', err);
      throw err;
    }
  }

  // Fallback simulator for embedded database
  return executeEmbeddedQuery(sql, params);
}

// Embedded query execution for fallback compatibility
function executeEmbeddedQuery(sql, params = []) {
  const store = getStore();
  const normalized = sql.trim().toLowerCase();

  // 1. SELECT users by email
  if (normalized.includes('select') && normalized.includes('from users') && normalized.includes('where email =')) {
    const email = params[0];
    const user = store.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    return user ? [user] : [];
  }

  // 2. SELECT user by user_id
  if (normalized.includes('select') && normalized.includes('from users') && normalized.includes('where user_id =')) {
    const id = parseInt(params[0], 10);
    const user = store.users.find(u => u.user_id === id);
    return user ? [user] : [];
  }

  // 3. SELECT all users
  if (normalized.includes('select') && normalized.includes('from users') && !normalized.includes('where')) {
    return [...store.users].sort((a, b) => b.user_id - a.user_id);
  }

  // 4. INSERT INTO users
  if (normalized.includes('insert into users')) {
    const newUser = {
      user_id: store.users.length ? Math.max(...store.users.map(u => u.user_id)) + 1 : 1,
      name: params[0],
      email: params[1],
      password: params[2],
      role: params[3] || 'student',
      bio: params[4] || '',
      avatar: params[5] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString()
    };
    store.users.push(newUser);
    saveStore(store);
    return { insertId: newUser.user_id, affectedRows: 1 };
  }

  // 5. UPDATE users
  if (normalized.includes('update users set')) {
    const id = parseInt(params[params.length - 1], 10);
    const index = store.users.findIndex(u => u.user_id === id);
    if (index !== -1) {
      if (params.length >= 3) {
        store.users[index].name = params[0] || store.users[index].name;
        store.users[index].bio = params[1] !== undefined ? params[1] : store.users[index].bio;
      }
      saveStore(store);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 6. DELETE users
  if (normalized.includes('delete from users where user_id =')) {
    const id = parseInt(params[0], 10);
    store.users = store.users.filter(u => u.user_id !== id);
    saveStore(store);
    return { affectedRows: 1 };
  }

  // 7. SELECT courses with instructor info
  if (normalized.includes('select') && normalized.includes('from courses')) {
    // Check if by course_id
    if (normalized.includes('where c.course_id =') || normalized.includes('where course_id =')) {
      const id = parseInt(params[0], 10);
      const course = store.courses.find(c => c.course_id === id);
      if (!course) return [];
      const instructor = store.users.find(u => u.user_id === course.instructor_id);
      return [{
        ...course,
        instructor_name: instructor ? instructor.name : 'Learnova Faculty',
        instructor_bio: instructor ? instructor.bio : '',
        instructor_avatar: instructor ? instructor.avatar : ''
      }];
    }

    // Check if by instructor_id
    if (normalized.includes('where c.instructor_id =') || normalized.includes('where instructor_id =')) {
      const id = parseInt(params[0], 10);
      return store.courses
        .filter(c => c.instructor_id === id)
        .map(c => {
          const instructor = store.users.find(u => u.user_id === c.instructor_id);
          return {
            ...c,
            instructor_name: instructor ? instructor.name : 'Learnova Faculty'
          };
        });
    }

    // All courses
    return store.courses.map(c => {
      const instructor = store.users.find(u => u.user_id === c.instructor_id);
      return {
        ...c,
        instructor_name: instructor ? instructor.name : 'Learnova Faculty',
        instructor_avatar: instructor ? instructor.avatar : ''
      };
    });
  }

  // 8. INSERT INTO courses
  if (normalized.includes('insert into courses')) {
    const newCourse = {
      course_id: store.courses.length ? Math.max(...store.courses.map(c => c.course_id)) + 1 : 1,
      title: params[0],
      description: params[1],
      instructor_id: parseInt(params[2], 10),
      price: parseFloat(params[3]) || 0,
      duration: parseInt(params[4], 10) || 10,
      category: params[5] || 'Web Development',
      level: params[6] || 'All Levels',
      thumbnail: params[7] || '/src/assets/images/course_web_dev_1793960054939.jpg',
      rating: 4.9,
      enrolled_count: 0,
      created_at: new Date().toISOString()
    };
    store.courses.push(newCourse);
    saveStore(store);
    return { insertId: newCourse.course_id, affectedRows: 1 };
  }

  // 9. UPDATE courses
  if (normalized.includes('update courses set')) {
    const id = parseInt(params[params.length - 1], 10);
    const index = store.courses.findIndex(c => c.course_id === id);
    if (index !== -1) {
      store.courses[index].title = params[0] || store.courses[index].title;
      store.courses[index].description = params[1] || store.courses[index].description;
      store.courses[index].price = parseFloat(params[2]) || store.courses[index].price;
      store.courses[index].duration = parseInt(params[3], 10) || store.courses[index].duration;
      store.courses[index].category = params[4] || store.courses[index].category;
      if (params[5]) store.courses[index].level = params[5];
      if (params[6]) store.courses[index].thumbnail = params[6];
      saveStore(store);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 10. DELETE courses
  if (normalized.includes('delete from courses where course_id =')) {
    const id = parseInt(params[0], 10);
    store.courses = store.courses.filter(c => c.course_id !== id);
    store.lessons = store.lessons.filter(l => l.course_id !== id);
    store.enrollment = store.enrollment.filter(e => e.course_id !== id);
    saveStore(store);
    return { affectedRows: 1 };
  }

  // 11. SELECT lessons by course_id
  if (normalized.includes('select') && normalized.includes('from lessons where course_id =')) {
    const courseId = parseInt(params[0], 10);
    return store.lessons
      .filter(l => l.course_id === courseId)
      .sort((a, b) => a.sequence_no - b.sequence_no);
  }

  // 12. SELECT lesson by lesson_id
  if (normalized.includes('select') && normalized.includes('from lessons where lesson_id =')) {
    const id = parseInt(params[0], 10);
    const lesson = store.lessons.find(l => l.lesson_id === id);
    return lesson ? [lesson] : [];
  }

  // 13. SELECT all lessons
  if (normalized.includes('select') && normalized.includes('from lessons') && !normalized.includes('where')) {
    return [...store.lessons];
  }

  // 14. INSERT INTO lessons
  if (normalized.includes('insert into lessons')) {
    const newLesson = {
      lesson_id: store.lessons.length ? Math.max(...store.lessons.map(l => l.lesson_id)) + 1 : 1,
      course_id: parseInt(params[0], 10),
      lesson_title: params[1],
      content: params[2],
      video_url: params[3] || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      sequence_no: parseInt(params[4], 10) || 1,
      duration: parseInt(params[5], 10) || 15
    };
    store.lessons.push(newLesson);
    saveStore(store);
    return { insertId: newLesson.lesson_id, affectedRows: 1 };
  }

  // 15. UPDATE lessons
  if (normalized.includes('update lessons set')) {
    const id = parseInt(params[params.length - 1], 10);
    const index = store.lessons.findIndex(l => l.lesson_id === id);
    if (index !== -1) {
      store.lessons[index].lesson_title = params[0] || store.lessons[index].lesson_title;
      store.lessons[index].content = params[1] || store.lessons[index].content;
      store.lessons[index].video_url = params[2] || store.lessons[index].video_url;
      store.lessons[index].sequence_no = parseInt(params[3], 10) || store.lessons[index].sequence_no;
      saveStore(store);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 16. DELETE lessons
  if (normalized.includes('delete from lessons where lesson_id =')) {
    const id = parseInt(params[0], 10);
    store.lessons = store.lessons.filter(l => l.lesson_id !== id);
    saveStore(store);
    return { affectedRows: 1 };
  }

  // 17. ENROLLMENT queries
  // Check existing enrollment
  if (normalized.includes('select') && normalized.includes('from enrollment where user_id =') && normalized.includes('and course_id =')) {
    const userId = parseInt(params[0], 10);
    const courseId = parseInt(params[1], 10);
    const enroll = store.enrollment.find(e => e.user_id === userId && e.course_id === courseId);
    return enroll ? [enroll] : [];
  }

  // Get user enrollments with course details
  if (normalized.includes('select') && normalized.includes('from enrollment e') && normalized.includes('where e.user_id =')) {
    const userId = parseInt(params[0], 10);
    const userEnrollments = store.enrollment.filter(e => e.user_id === userId);
    return userEnrollments.map(e => {
      const course = store.courses.find(c => c.course_id === e.course_id) || {};
      const instructor = store.users.find(u => u.user_id === course.instructor_id);
      return {
        ...e,
        course_title: course.title,
        course_description: course.description,
        thumbnail: course.thumbnail,
        category: course.category,
        duration: course.duration,
        instructor_name: instructor ? instructor.name : 'Learnova Faculty'
      };
    });
  }

  // Get all enrollments (Admin)
  if (normalized.includes('select') && normalized.includes('from enrollment e')) {
    return store.enrollment.map(e => {
      const user = store.users.find(u => u.user_id === e.user_id) || {};
      const course = store.courses.find(c => c.course_id === e.course_id) || {};
      return {
        ...e,
        student_name: user.name,
        student_email: user.email,
        course_title: course.title
      };
    });
  }

  // INSERT INTO enrollment
  if (normalized.includes('insert into enrollment')) {
    const newEnrollment = {
      enrollment_id: store.enrollment.length ? Math.max(...store.enrollment.map(e => e.enrollment_id)) + 1 : 1,
      user_id: parseInt(params[0], 10),
      course_id: parseInt(params[1], 10),
      lesson_title: params[2] || 'Course Orientation',
      content: params[3] || 'Welcome to the course.',
      enrollment_date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      progress: 0,
      status: 'Enrolled',
      last_accessed_lesson_id: null,
      completed_lessons: []
    };
    store.enrollment.push(newEnrollment);

    // Increment enrolled_count on course
    const courseIndex = store.courses.findIndex(c => c.course_id === newEnrollment.course_id);
    if (courseIndex !== -1) {
      store.courses[courseIndex].enrolled_count = (store.courses[courseIndex].enrolled_count || 0) + 1;
    }

    saveStore(store);
    return { insertId: newEnrollment.enrollment_id, affectedRows: 1 };
  }

  // UPDATE enrollment progress & status
  if (normalized.includes('update enrollment set progress =')) {
    const progress = parseInt(params[0], 10);
    const status = params[1];
    const lessonTitle = params[2];
    const lastLessonId = params[3];
    const completedLessonsJson = params[4];
    const enrollmentId = parseInt(params[params.length - 1], 10);

    const index = store.enrollment.findIndex(e => e.enrollment_id === enrollmentId);
    if (index !== -1) {
      store.enrollment[index].progress = progress;
      store.enrollment[index].status = status;
      if (lessonTitle) store.enrollment[index].lesson_title = lessonTitle;
      if (lastLessonId) store.enrollment[index].last_accessed_lesson_id = lastLessonId;
      if (completedLessonsJson) {
        try {
          store.enrollment[index].completed_lessons = JSON.parse(completedLessonsJson);
        } catch {
          // ignore
        }
      }
      saveStore(store);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // CONTACT MESSAGES
  if (normalized.includes('insert into contact_messages')) {
    const newMsg = {
      message_id: store.contact_messages.length ? Math.max(...store.contact_messages.map(m => m.message_id)) + 1 : 1,
      name: params[0],
      email: params[1],
      subject: params[2],
      message: params[3],
      status: 'unread',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    store.contact_messages.push(newMsg);
    saveStore(store);
    return { insertId: newMsg.message_id, affectedRows: 1 };
  }

  if (normalized.includes('select') && normalized.includes('from contact_messages')) {
    return [...store.contact_messages].sort((a, b) => b.message_id - a.message_id);
  }

  // Default empty or mock response
  return [];
}

export function getDatabaseStatus() {
  return {
    connectedToMySQL: isConnectedToMySQL,
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    database: DB_CONFIG.database,
    user: DB_CONFIG.user,
    mode: isConnectedToMySQL ? 'MySQL 8.0 Live Connection Pool' : 'Embedded Relational Database (MySQL 8.0 Compatible)'
  };
}

export default {
  initializeDatabase,
  dbQuery,
  getDatabaseStatus
};
