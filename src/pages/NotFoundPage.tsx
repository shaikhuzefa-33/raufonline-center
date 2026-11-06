import React from 'react';
import { GraduationCap, ArrowLeft, BookOpen } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E6E8F0] shadow-xl p-8 sm:p-10 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#F0EDFF] text-[#5B4BDB] flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-4xl font-extrabold text-[#5B4BDB] font-display">404</span>
          <h2 className="text-xl font-bold text-[#17172B] font-display">
            Course Page Not Found
          </h2>
          <p className="text-xs text-[#52526B] leading-relaxed">
            The page or course you requested cannot be found. It may have been moved or removed from our curriculum catalogue.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
          <button
            onClick={() => onNavigate('courses')}
            className="w-full py-2.5 px-4 text-xs font-semibold text-[#17172B] bg-[#F7F8FC] hover:bg-[#F0EDFF] hover:text-[#5B4BDB] rounded-xl transition-colors cursor-pointer"
          >
            Explore Courses
          </button>
        </div>
      </div>
    </div>
  );
};
