import React, { useEffect, useState, useMemo } from 'react';
import { Course } from '../types';
import { api } from '../services/api';
import { CourseCard } from '../components/CourseCard';
import { Search, Filter, X, ArrowUpDown, BookOpen } from 'lucide-react';

interface ExploreCoursesPageProps {
  initialCategory?: string;
  onNavigate: (page: string, params?: any) => void;
  onEnrollCourse: (courseId: number) => void;
  enrolledCourseIds: Set<number>;
}

const CATEGORIES = [
  'All Categories',
  'Web Development',
  'Java Programming',
  'Python Programming',
  'Data Science',
  'Artificial Intelligence',
  'Database Management',
  'UI/UX Design',
  'Cloud Computing',
];

export const ExploreCoursesPage: React.FC<ExploreCoursesPageProps> = ({
  initialCategory,
  onNavigate,
  onEnrollCourse,
  enrolledCourseIds,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || 'All Categories'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under75' | 'above75'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-low' | 'price-high'>('popular');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      try {
        const res = await api.getCourses({
          category: selectedCategory === 'All Categories' ? undefined : selectedCategory,
          search: searchQuery.trim() || undefined,
          sort: sortBy,
        });
        setCourses(res.courses);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadCourses();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, sortBy]);

  // Client-side price filter refinement
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const price = Number(c.price);
      if (priceFilter === 'under75') return price < 75;
      if (priceFilter === 'above75') return price >= 75;
      return true;
    });
  }, [courses, priceFilter]);

  const resetFilters = () => {
    setSelectedCategory('All Categories');
    setSearchQuery('');
    setPriceFilter('all');
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17172B] font-display">
          Explore Courses
        </h1>
        <p className="text-sm text-[#52526B] mt-1">
          Browse our accredited catalogue of computer science and technology curricula.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E6E8F0] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course title, topic, or instructor name..."
              className="w-full pl-10 pr-9 py-2.5 text-xs font-medium bg-[#F7F8FC] border border-[#E6E8F0] rounded-xl focus:outline-hidden focus:border-[#5B4BDB] focus:bg-white transition-all text-[#17172B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Price Filter & Sort Dropdown */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Price Segmented Filter */}
            <div className="flex items-center p-1 bg-[#F7F8FC] rounded-xl border border-[#E6E8F0]">
              <button
                onClick={() => setPriceFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  priceFilter === 'all'
                    ? 'bg-white text-[#5B4BDB] shadow-xs'
                    : 'text-[#52526B] hover:text-[#17172B]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setPriceFilter('under75')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  priceFilter === 'under75'
                    ? 'bg-white text-[#5B4BDB] shadow-xs'
                    : 'text-[#52526B] hover:text-[#17172B]'
                }`}
              >
                &lt; $75
              </button>
              <button
                onClick={() => setPriceFilter('above75')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  priceFilter === 'above75'
                    ? 'bg-white text-[#5B4BDB] shadow-xs'
                    : 'text-[#52526B] hover:text-[#17172B]'
                }`}
              >
                $75+
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort courses by"
                className="appearance-none bg-[#F7F8FC] border border-[#E6E8F0] text-xs font-semibold text-[#17172B] py-2.5 pl-3.5 pr-8 rounded-xl focus:outline-hidden focus:border-[#5B4BDB] cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Categories Horizontal Scroll / Wrap */}
        <div className="pt-2 border-t border-[#F0EDFF] flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#5B4BDB] text-white shadow-xs font-semibold'
                    : 'bg-[#F7F8FC] text-[#52526B] hover:text-[#17172B] hover:bg-[#F0EDFF]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result Count & Status Bar */}
      <div className="flex items-center justify-between text-xs text-[#52526B] px-1">
        <div>
          Showing <span className="font-bold text-[#17172B] tabular-nums">{filteredCourses.length}</span> courses
          {selectedCategory !== 'All Categories' && (
            <span> in <strong className="text-[#5B4BDB]">{selectedCategory}</strong></span>
          )}
        </div>

        {(selectedCategory !== 'All Categories' || searchQuery || priceFilter !== 'all') && (
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-[#5B4BDB] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.course_id}
              course={course}
              isEnrolled={enrolledCourseIds.has(course.course_id)}
              onViewDetails={(id) => onNavigate('course-details', { courseId: id })}
              onEnroll={(id) => onEnrollCourse(id)}
            />
          ))}
        </div>
      ) : (
        /* Empty Search Results Message */
        <div className="bg-white rounded-2xl border border-[#E6E8F0] p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#F0EDFF] text-[#5B4BDB] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#17172B] font-display">
            No matching courses found
          </h3>
          <p className="text-xs text-[#52526B] leading-relaxed">
            We couldn't find any courses matching your criteria. Try adjusting your search term or exploring all categories.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-lg transition-colors cursor-pointer"
          >
            View All Courses
          </button>
        </div>
      )}
    </div>
  );
};
