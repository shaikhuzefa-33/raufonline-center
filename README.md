# LEARNOVA — Online Learning Management System (LMS)
**B.Tech CSE Web Development Mini-Project**

LEARNOVA is an enterprise-grade full-stack Online Learning Management System built for students, instructors, and administrators. It connects directly to **MySQL Server 8.0** via MySQL Workbench and provides RESTful APIs, role-based dashboards, course authoring, interactive video classrooms, and real-time progress calculations.

---

## 1. System Architecture & ER Diagram

### Entity-Relationship Diagram (ASCII)

```
       +-------------------------------------------------------------+
       |                           USERS                             |
       +-------------------------------------------------------------+
       | PK user_id      INT (Auto Increment)                        |
       |    name         VARCHAR(100)                                |
       |    email        VARCHAR(150) UNIQUE                         |
       |    password     VARCHAR(255) (bcrypt hashed)                |
       |    role         VARCHAR(30) ('admin','instructor','student')|
       |    bio          TEXT                                        |
       |    avatar       VARCHAR(500)                                |
       |    created_at   TIMESTAMP                                   |
       +-------------------------------------------------------------+
             | 1                                        | 1
             | (Creates as Instructor)                  | (Enrolls as Student)
             | 0..*                                     | 0..*
             v                                          v
+------------------------------------+    +------------------------------------+
|              COURSES               |    |             ENROLLMENT             |
+------------------------------------+    +------------------------------------+
| PK course_id      INT (Auto Inc)   |    | PK enrollment_id    INT (Auto Inc) |
|    title          VARCHAR(200)     |    | FK user_id          INT ---------> |
|    description    TEXT             |    | FK course_id        INT ---------> |
| FK instructor_id  INT -----------> |    |    lesson_title     VARCHAR(200)   |
|    price          DECIMAL(10,2)    |    |    content          TEXT           |
|    duration       INT (Hours)      |    |    enrollment_date  TIMESTAMP      |
|    category       VARCHAR(100)     |    |    progress         INT (0-100%)   |
|    level          VARCHAR(50)      |    |    status           VARCHAR(50)    |
|    thumbnail      VARCHAR(500)     |    |    last_accessed_id INT            |
|    rating         DECIMAL(3,2)     |    |    completed_lessons TEXT (JSON)   |
+------------------------------------+    +------------------------------------+
             | 1                                        ^
             | (Contains)                               |
             | 1..*                                     |
             v                                          |
+------------------------------------+                  |
|              LESSONS               |                  |
+------------------------------------+                  |
| PK lesson_id      INT (Auto Inc)   |                  |
| FK course_id      INT -----------> | -----------------+
|    lesson_title   VARCHAR(200)     |
|    content        TEXT             |
|    video_url      VARCHAR(500)     |
|    sequence_no    INT              |
|    duration       INT (Minutes)    |
+------------------------------------+

+------------------------------------+
|          CONTACT_MESSAGES          |
+------------------------------------+
| PK message_id     INT (Auto Inc)   |
|    name           VARCHAR(100)     |
|    email          VARCHAR(150)     |
|    subject        VARCHAR(200)     |
|    message        TEXT             |
|    status         VARCHAR(30)      |
|    created_at     TIMESTAMP        |
+------------------------------------+
```

### Relational Constraints & Integrity
1. **1-to-Many**: One Instructor creates multiple Courses (`courses.instructor_id -> users.user_id`).
2. **1-to-Many**: One Course contains multiple Lessons ordered by `sequence_no` (`lessons.course_id -> courses.course_id`).
3. **Many-to-Many**: Students and Courses are associated via the `enrollment` table.
4. **Duplicate Prevention**: `UNIQUE KEY uq_user_course (user_id, course_id)` prevents accidental duplicate enrollments.
5. **Cascading Integrity**: `ON DELETE CASCADE` cleans up lessons and enrollments when a course is removed.

---

## 2. MySQL Workbench 8.0 Setup Instructions

### Prerequisites
- MySQL Server 8.0 installed on `localhost:3306`
- MySQL Workbench 8.0 installed
- Node.js v18+ & npm

### Step-by-Step Execution
1. **Open MySQL Workbench**:
   - Connect to your local MySQL instance (`localhost:3306`, user: `root`).
2. **Open Database Script**:
   - In MySQL Workbench, click **File -> Open SQL Script...**
   - Select `database/database.sql` from this project repository.
3. **Execute SQL Script**:
   - Click the **Execute (Lightning Bolt)** icon or press `Ctrl + Shift + Enter`.
   - The script creates:
     - Database `learnova_db`
     - Tables `users`, `courses`, `lessons`, `enrollment`, and `contact_messages`
     - Sample seed data for Admin, Instructors, Students, and accredited courses.
4. **Configure Backend Environment**:
   - The `.env` file is pre-configured with your supplied credentials:
     ```env
     PORT=3000
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=root
     DB_PASSWORD=shaikrauf@12
     DB_NAME=learnova_db
     ```
5. **Start Application**:
   - In VS Code terminal:
     ```bash
     npm install
     npm run dev
     ```
   - Open browser at `http://localhost:3000`.

---

## 3. Demo Login Credentials

| Role | Email | Password | Features Accessible |
|---|---|---|---|
| **Admin** | `admin@learnova.edu` | `password123` | System oversight, user deletion, courses audit, inquiries, MySQL console |
| **Instructor** | `sarah.chen@learnova.edu` | `password123` | Create courses, add/delete lessons, view student counts & ratings |
| **Student** | `student@learnova.edu` | `password123` | Course marketplace, 1-click enroll, classroom video player, progress tracking |

*(You can also use the 1-Click Fast Sign-In buttons on the Login page for rapid demonstration during your viva/evaluation!)*

---

## 4. Key Modules & Functional Checklist

- [x] **Home Page**: 10 full blocks (Hero, Live Stats, Categories, Popular Courses, Why LEARNOVA, How It Works, Faculty, Testimonials, CTA, Footer).
- [x] **Explore Courses**: Live search bar, academic category pills, price filtering, sorting, and empty search fallback.
- [x] **Course Details**: Dynamic pricing card, instructor bio, outcomes checklist, and complete lesson curriculum.
- [x] **Course Classroom**: Left lesson syllabus with completion indicators, responsive video player, notes guide, and "Mark as Completed" button that calculates progress % and updates MySQL.
- [x] **Student Dashboard**: Welcome banner, active course resume card, ongoing and completed course breakdown, and overall progress metrics.
- [x] **Instructor Dashboard**: Total authored courses, students taught, course management table, Create Course modal, and Add Lesson modal.
- [x] **Admin Dashboard**: System KPIs, Users table, Courses table, Enrollments audit log, Contact messages, and MySQL 8.0 console.
- [x] **Authentication**: Student & Instructor registration, bcrypt password hashing, login verification, and profile management.
- [x] **Contact Us**: Working contact submission form saved directly to MySQL `contact_messages` table.
