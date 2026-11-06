import React, { useEffect, useState } from 'react';
import { GraduationCap, Database, Heart, CheckCircle2, Server } from 'lucide-react';
import { api } from '../services/api';
import { DatabaseStatus } from '../types';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);

  useEffect(() => {
    api.getDatabaseStatus().then(setDbStatus).catch(() => null);
  }, []);

  return (
    <footer className="bg-[#17172B] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B4BDB] to-[#8B7CFF] flex items-center justify-center text-white">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight font-display">
                LEARNOVA
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              An enterprise-grade online learning management system engineered for ambitious students, expert instructors, and academic institutions worldwide.
            </p>

            {/* MySQL Status Chip */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300">
                <Database className="w-3.5 h-3.5 text-[#8B7CFF]" />
                <span>MySQL 8.0:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {dbStatus?.connectedToMySQL ? 'Connected (localhost:3306)' : 'Active Engine (SQL Schema Ready)'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors cursor-pointer">
                  All Courses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses', { category: 'Web Development' })} className="hover:text-white transition-colors cursor-pointer">
                  Web Development
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses', { category: 'Artificial Intelligence' })} className="hover:text-white transition-colors cursor-pointer">
                  Artificial Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses', { category: 'Cloud Computing' })} className="hover:text-white transition-colors cursor-pointer">
                  Cloud Computing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses', { category: 'UI/UX Design' })} className="hover:text-white transition-colors cursor-pointer">
                  UI/UX Design
                </button>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors cursor-pointer">
                  Instructor Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-white transition-colors cursor-pointer">
                  Student Registration
                </button>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Academic Project
            </h4>
            <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <p className="font-semibold text-slate-200">B.Tech CSE Web Development</p>
              <p>Full-Stack LMS with MySQL Server 8.0 & MySQL Workbench</p>
              <p className="pt-2 text-[11px] text-slate-500 font-mono">
                Script: database/database.sql
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Tables: users, courses, lessons, enrollment
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 LEARNOVA Learning Management System. Built for B.Tech CSE Mini-Project.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Honor Code</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
