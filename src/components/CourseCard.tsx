import React, { useState } from 'react';
import { Course } from '../types';
import { Clock, Star, Users, ArrowRight, BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onViewDetails: (courseId: number) => void;
  onEnroll?: (courseId: number) => void;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onViewDetails,
  onEnroll,
  isEnrolled = false,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group bg-white rounded-2xl border border-[#E6E8F0] overflow-hidden hover:shadow-xl hover:border-[#5B4BDB]/30 transition-all duration-300 flex flex-col h-full">
      {/* Course Thumbnail */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onViewDetails(course.course_id)}>
        {!imageError && course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#5B4BDB]/10 via-[#F0EDFF] to-white p-6 text-center">
            <BookOpen className="w-10 h-10 text-[#5B4BDB] mb-2" />
            <span className="text-xs font-semibold text-[#17172B] line-clamp-1">{course.title}</span>
          </div>
        )}

        {/* Category Tag (clean unboxed inline text badge overlay) */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-[#17172B] shadow-xs">
          {course.category}
        </div>

        {course.level && (
          <div className="absolute top-3 right-3 bg-[#17172B]/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-white shadow-xs">
            {course.level}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Rating & Students */}
          <div className="flex items-center gap-3 text-xs text-[#52526B] mb-2">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              <span className="tabular-nums">{Number(course.rating || 4.8).toFixed(1)}</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="tabular-nums">{course.duration} hrs</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span className="tabular-nums">{course.enrolled_count || 120}+ enrolled</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(course.course_id)}
            className="text-base font-bold text-[#17172B] group-hover:text-[#5B4BDB] transition-colors line-clamp-2 cursor-pointer leading-snug mb-2 font-display"
          >
            {course.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#52526B] line-clamp-2 leading-relaxed mb-4">
            {course.description}
          </p>
        </div>

        <div>
          {/* Instructor & Price Row */}
          <div className="pt-3 border-t border-[#F0EDFF] flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img
                src={course.instructor_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={course.instructor_name || 'Instructor'}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-medium text-[#17172B] truncate max-w-[130px]">
                {course.instructor_name || 'Expert Faculty'}
              </span>
            </div>

            <div className="text-right">
              <span className="text-base font-extrabold text-[#5B4BDB] tabular-nums">
                ${Number(course.price).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails(course.course_id)}
              className="w-full py-2 px-3 text-xs font-semibold text-[#17172B] bg-[#F7F8FC] hover:bg-[#F0EDFF] hover:text-[#5B4BDB] rounded-lg transition-colors cursor-pointer text-center"
            >
              View Details
            </button>
            <button
              onClick={() => {
                if (isEnrolled) {
                  onViewDetails(course.course_id);
                } else if (onEnroll) {
                  onEnroll(course.course_id);
                } else {
                  onViewDetails(course.course_id);
                }
              }}
              className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                isEnrolled
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-[#5B4BDB] hover:bg-[#4A3BB8] text-white shadow-xs hover:shadow-md shadow-[#5B4BDB]/20'
              }`}
            >
              <span>{isEnrolled ? 'Enrolled' : 'Enroll Now'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
