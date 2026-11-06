import React from 'react';
import { GraduationCap, Award, ShieldCheck, Heart, BookOpen, Code2, Users, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5B4BDB] to-[#8B7CFF] text-white flex items-center justify-center mx-auto shadow-md shadow-[#5B4BDB]/25">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#17172B] font-display">
          About LEARNOVA
        </h1>
        <p className="text-sm sm:text-base text-[#52526B] leading-relaxed">
          LEARNOVA is an enterprise-grade Online Learning Management System designed to bridge the gap between academic computer science theory and real-world commercial software engineering.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-[#E6E8F0] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0EDFF] text-[#5B4BDB] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-[#17172B] font-display">Our Mission</h2>
          <p className="text-xs sm:text-sm text-[#52526B] leading-relaxed">
            To provide students and professionals with accredited, hands-on, and accessible technology education through rigorous curricula, production-grade tools, and real database tracking.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E6E8F0] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0EDFF] text-[#5B4BDB] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-[#17172B] font-display">Our Academic Vision</h2>
          <p className="text-xs sm:text-sm text-[#52526B] leading-relaxed">
            To set the benchmark for modern Web Development mini-projects by demonstrating uncompromising code quality, responsive UI/UX design, and transparent MySQL Server 8.0 relational architecture.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E6E8F0] shadow-xs space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-[#17172B] font-display">
            The Pillars of LEARNOVA
          </h2>
          <p className="text-xs text-[#52526B] mt-1">
            Built on foundational software principles that empower learners and educators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#52526B]">
          <div className="space-y-2">
            <div className="font-bold text-[#17172B] text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5B4BDB]" />
              <span>Full-Stack Integrity</span>
            </div>
            <p className="leading-relaxed">
              Every course, lesson, enrollment, and progress mark is permanently persisted in normalized MySQL 8.0 relational tables.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-[#17172B] text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5B4BDB]" />
              <span>Role-Based Access</span>
            </div>
            <p className="leading-relaxed">
              Three distinct user roles (Student, Instructor, and Admin) provide custom-tailored dashboards and secure endpoints.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-[#17172B] text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5B4BDB]" />
              <span>Commercial Polish</span>
            </div>
            <p className="leading-relaxed">
              Crafted with inspiration from Coursera, Udemy, Stripe, and Apple, ensuring high visual fidelity, WCAG accessibility, and fluid responsiveness.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('courses')}
          className="px-6 py-3 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-xl shadow-md transition-all cursor-pointer"
        >
          Explore LEARNOVA Courses
        </button>
      </div>
    </div>
  );
};
