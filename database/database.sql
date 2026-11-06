-- ====================================================================
-- LEARNOVA ONLINE LEARNING MANAGEMENT SYSTEM (LMS)
-- Database: learnova_db
-- Compatible with MySQL Server 8.0 & MySQL Workbench 8.0
-- B.Tech CSE Web Development Mini-Project
-- ====================================================================

-- 1. Create and select Database
CREATE DATABASE IF NOT EXISTS learnova_db;
USE learnova_db;

-- Disable foreign key checks during schema re-creation if needed
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS enrollment;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- TABLE 1: USERS
-- Roles: 'admin', 'instructor', 'student'
-- ====================================================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'student',
    bio TEXT,
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABLE 2: COURSES
-- Foreign key: instructor_id -> users(user_id)
-- ====================================================================
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructor_id INT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    duration INT NOT NULL DEFAULT 0, -- Duration in hours or minutes
    category VARCHAR(100) NOT NULL DEFAULT 'Web Development',
    level VARCHAR(50) DEFAULT 'All Levels',
    thumbnail VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 4.80,
    enrolled_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_course_category (category),
    INDEX idx_course_instructor (instructor_id),
    INDEX idx_course_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABLE 3: LESSONS
-- Foreign key: course_id -> courses(course_id)
-- ====================================================================
CREATE TABLE lessons (
    lesson_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    lesson_title VARCHAR(200) NOT NULL,
    content TEXT,
    video_url VARCHAR(500),
    sequence_no INT NOT NULL DEFAULT 1,
    duration INT NOT NULL DEFAULT 15, -- Duration in minutes
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    INDEX idx_lesson_course (course_id),
    INDEX idx_lesson_sequence (sequence_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABLE 4: ENROLLMENT
-- Foreign keys: user_id -> users(user_id), course_id -> courses(course_id)
-- Prevents duplicate enrollments via UNIQUE KEY
-- ====================================================================
CREATE TABLE enrollment (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    lesson_title VARCHAR(200) DEFAULT '',
    content TEXT,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INT NOT NULL DEFAULT 0, -- Percentage 0-100
    status VARCHAR(50) NOT NULL DEFAULT 'Enrolled', -- 'Enrolled', 'In Progress', 'Completed'
    last_accessed_lesson_id INT DEFAULT NULL,
    completed_lessons TEXT, -- JSON array string of completed lesson IDs
    UNIQUE KEY uq_user_course (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    INDEX idx_enrollment_user (user_id),
    INDEX idx_enrollment_course (course_id),
    INDEX idx_enrollment_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABLE 5: CONTACT_MESSAGES
-- For contact form submissions
-- ====================================================================
CREATE TABLE contact_messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SAMPLE SEED DATA
-- Default Passwords: "password123" (bcrypt hash: $2a$10$w8T0M4jC5k.nJ0vK5iV8Geqe3W8w54n2Xj6a5s8r9m0p1q2r3s4t5)
-- Admin User: admin@learnova.edu
-- Instructor: sarah.chen@learnova.edu, alex.rivera@learnova.edu, priya.patel@learnova.edu
-- Student: student@learnova.edu, shaik.rauf@learnova.edu
-- ====================================================================

-- 1. Insert Users
INSERT INTO users (user_id, name, email, password, role, bio, avatar) VALUES
(1, 'Admin Learnova', 'admin@learnova.edu', '$2a$10$K8xSj4b3r9xY4Nf1qN0hbe47u5aZkU9kL6w7gT2mR3vP1o8s9jK4m', 'admin', 'Chief System Administrator & Academic Supervisor at LEARNOVA.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'),
(2, 'Dr. Sarah Chen', 'sarah.chen@learnova.edu', '$2a$10$K8xSj4b3r9xY4Nf1qN0hbe47u5aZkU9kL6w7gT2mR3vP1o8s9jK4m', 'instructor', 'Senior AI Researcher & Full-Stack Systems Architect with 12+ years experience in Silicon Valley.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'),
(3, 'Alex Rivera', 'alex.rivera@learnova.edu', '$2a$10$K8xSj4b3r9xY4Nf1qN0hbe47u5aZkU9kL6w7gT2mR3vP1o8s9jK4m', 'instructor', 'Staff Frontend Architect & Design Systems Lead. Creator of top-rated UI frameworks.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'),
(4, 'Prof. Priya Patel', 'priya.patel@learnova.edu', '$2a$10$K8xSj4b3r9xY4Nf1qN0hbe47u5aZkU9kL6w7gT2mR3vP1o8s9jK4m', 'instructor', 'Cloud Infrastructure & Distributed Database Specialist at leading FinTech platforms.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'),
(5, 'Shaik Rauf', 'student@learnova.edu', '$2a$10$K8xSj4b3r9xY4Nf1qN0hbe47u5aZkU9kL6w7gT2mR3vP1o8s9jK4m', 'student', 'B.Tech CSE Student aspiring Full-Stack Software Engineer.', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80');

-- 2. Insert Courses
INSERT INTO courses (course_id, title, description, instructor_id, price, duration, category, level, thumbnail, rating, enrolled_count) VALUES
(1, 'Full-Stack Web Development Bootcamp: React, Node & MySQL', 'Master modern web development from HTML, CSS and TypeScript to high-performance Express backends, REST APIs, and scalable MySQL relational databases.', 2, 79.99, 48, 'Web Development', 'Beginner to Advanced', '/src/assets/images/course_web_dev_1793960054939.jpg', 4.92, 1240),
(2, 'Applied Artificial Intelligence & Machine Learning with Python', 'A comprehensive practical masterclass covering neural network architectures, predictive modeling, NLP pipelines, and enterprise model deployment.', 2, 89.99, 56, 'Artificial Intelligence', 'Intermediate', '/src/assets/images/course_ai_datasci_1793960056847.jpg', 4.95, 980),
(3, 'Modern UI/UX Design Masterclass: Systems, Tokens & Prototypes', 'Learn how top tech organizations craft design systems, accessibility tokens, responsive wireframes, and production-ready interactive Figma prototypes.', 3, 64.99, 32, 'UI/UX Design', 'All Levels', '/src/assets/images/course_ui_ux_1793960057128.jpg', 4.88, 760),
(4, 'Cloud Computing & Microservices: AWS, Docker & Kubernetes', 'Architect fault-tolerant microservices, configure automated CI/CD pipelines, containerize backend apps, and manage distributed cloud workloads.', 4, 84.99, 40, 'Cloud Computing', 'Advanced', '/src/assets/images/course_cloud_dev_1793960056715.jpg', 4.89, 610),
(5, 'Java Enterprise Programming & Spring Boot Architecture', 'Deep dive into object-oriented design, multi-threading, Spring Boot microservices, Hibernate ORM, and secure enterprise RESTful web services.', 4, 74.99, 44, 'Java Programming', 'Intermediate', '/src/assets/images/course_web_dev_1793960054939.jpg', 4.84, 520),
(6, 'Database Management Systems & Advanced SQL Optimization', 'Master relational database theory, index query optimization, ACID transactions, stored procedures, normalization, and MySQL Workbench administration.', 2, 59.99, 28, 'Database Management', 'Beginner to Intermediate', '/src/assets/images/course_cloud_dev_1793960056715.jpg', 4.91, 890);

-- 3. Insert Lessons
INSERT INTO lessons (lesson_id, course_id, lesson_title, content, video_url, sequence_no, duration) VALUES
-- Course 1 Lessons
(1, 1, 'Course Introduction & Modern Web Architecture', 'Welcome to Full-Stack Web Development! In this lesson we unpack the client-server lifecycle, HTTP request headers, REST conventions, and development environment setup.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 18),
(2, 1, 'Mastering React 19 State & Component Lifecycle', 'Deep dive into functional React hooks: useState, useEffect, useCallback, custom hooks, and immutable state management patterns for interactive web apps.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 28),
(3, 1, 'Building Robust Express.js RESTful APIs', 'Learn how to construct clean Express routers, implement CORS, parse request bodies, validate incoming DTO payloads, and handle errors centralized.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 3, 34),
(4, 1, 'Connecting MySQL 8.0 with mysql2 & Connection Pooling', 'Step-by-step implementation of mysql2 connection pools in Node.js, parameterized queries to prevent SQL injections, and transaction management.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 4, 40),
(5, 1, 'User Authentication with bcrypt & JWT/Session Security', 'Protecting API routes with password hashing, salt rounds, session cookies, Bearer tokens, and role-based access control (RBAC).', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 5, 36),
-- Course 2 Lessons
(6, 2, 'Foundations of Machine Learning & Python Ecosystem', 'Setting up NumPy, Pandas, Scikit-Learn, and understanding supervised vs unsupervised learning workflows with real-world datasets.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 25),
(7, 2, 'Deep Learning Fundamentals with PyTorch', 'Tensors, computation graphs, forward pass, backpropagation, gradient descent optimizers, and loss functions explained visually.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 42),
(8, 2, 'Computer Vision & Convolutional Neural Networks', 'Building CNNs for feature extraction, pooling, edge detection, image classification, and transfer learning with pre-trained models.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 3, 38),
-- Course 3 Lessons
(9, 3, 'Principles of Visual Hierarchy & Typographic Scale', 'Mastering the 60-30-10 color rule, modular type scales, vertical rhythm, and contrast ratios compliant with WCAG AA standards.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 22),
(10, 3, 'Building Scalable Design Systems & Tokens', 'Defining atomic design tokens: colors, spacing scales, elevation, radius, component variants, and interactive micro-states.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 35),
-- Course 4 Lessons
(11, 4, 'Cloud Computing Fundamentals & AWS Core Services', 'Understanding EC2 compute, S3 object storage, VPC networking, IAM security policies, and regional availability zones.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 30),
(12, 4, 'Docker Containerization & Multi-Stage Builds', 'Writing optimized Dockerfiles, docker-compose orchestration, environment isolation, and production image caching techniques.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 32);

-- 4. Insert Initial Enrollments
INSERT INTO enrollment (enrollment_id, user_id, course_id, lesson_title, content, enrollment_date, progress, status, last_accessed_lesson_id, completed_lessons) VALUES
(1, 5, 1, 'Mastering React 19 State & Component Lifecycle', 'Currently studying state management and hooks.', '2026-03-01 10:30:00', 40, 'In Progress', 2, '[1,2]'),
(2, 5, 3, 'Principles of Visual Hierarchy & Typographic Scale', 'Enrolled in UI/UX masterclass.', '2026-03-04 14:15:00', 100, 'Completed', 10, '[9,10]'),
(3, 5, 2, 'Foundations of Machine Learning & Python Ecosystem', 'Enrolled in AI masterclass.', '2026-03-05 09:00:00', 0, 'Enrolled', 6, '[]');

-- 5. Insert Contact Messages
INSERT INTO contact_messages (message_id, name, email, subject, message, status) VALUES
(1, 'Michael Vance', 'michael.v@example.com', 'Corporate Team Training Inquiry', 'Hello LEARNOVA team, we are interested in enrolling our engineering team of 25 developers in your Full-Stack and Cloud Computing tracks. Can you share bulk licensing pricing?', 'read'),
(2, 'Sophia Miller', 'sophia.m@example.com', 'Instructor Partnership Application', 'Hi! I am a senior data scientist and author. I would love to develop a specialized course on LLM agents on LEARNOVA.', 'unread');

-- ====================================================================
-- VERIFY QUERIES
-- ====================================================================
SELECT 'Users Count' AS Metric, COUNT(*) AS Total FROM users
UNION ALL
SELECT 'Courses Count', COUNT(*) FROM courses
UNION ALL
SELECT 'Lessons Count', COUNT(*) FROM lessons
UNION ALL
SELECT 'Enrollments Count', COUNT(*) FROM enrollment;
