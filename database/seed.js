/**
 * LEARNOVA LMS - Database Seed Script
 * Run with: node database/seed.js
 */
import { initializeDatabase, dbQuery } from '../backend/config/database.js';

async function seed() {
  console.log('Seeding LEARNOVA Database...');
  await initializeDatabase();

  const usersCount = await dbQuery('SELECT COUNT(*) as count FROM users');
  const coursesCount = await dbQuery('SELECT COUNT(*) as count FROM courses');
  const lessonsCount = await dbQuery('SELECT COUNT(*) as count FROM lessons');

  console.log('Seed verification complete:');
  console.log(`- Users: ${usersCount.length}`);
  console.log(`- Courses: ${coursesCount.length}`);
  console.log(`- Lessons: ${lessonsCount.length}`);
  console.log('Database ready for LEARNOVA LMS operations.');
}

seed().catch(console.error);
