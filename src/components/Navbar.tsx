import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ChevronDown,
  User as UserIcon,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Search
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  onCategorySelect?: (cat: string) => void;
}

const CATEGORIES = [
  'Web Development',
  'Java Programming',
  'Python Programming',
  'Data Science',
  'Artificial Intelligence',
  'Database Management',
  'UI/UX Design',
  'Cloud Computing',
];

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onCategorySelect }) => {
  const { user, logout } = useAuth();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (category: string) => {
    setCategoriesOpen(false);
    setMobileMenuOpen(false);
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    onNavigate('courses', { category });
  };

  const getDashboardTarget = () => {
    if (!user) return 'login';
    if (user.role === 'admin') return 'admin-dashboard';
    if (user.role === 'instructor') return 'instructor-dashboard';
    return 'student-dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E6E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B4BDB] to-[#8B7CFF] flex items-center justify-center text-white shadow-md shadow-[#5B4BDB]/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#17172B] font-display">
                  LEARNOVA
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-[#5B4BDB] uppercase -mt-1">
                  Online LMS
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single-Line, 4-5 items) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#52526B]">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-[#5B4BDB] transition-colors whitespace-nowrap cursor-pointer ${
                currentPage === 'home' ? 'text-[#5B4BDB] font-semibold' : ''
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('courses')}
              className={`hover:text-[#5B4BDB] transition-colors whitespace-nowrap cursor-pointer ${
                currentPage === 'courses' ? 'text-[#5B4BDB] font-semibold' : ''
              }`}
            >
              Explore Courses
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                onBlur={() => setTimeout(() => setCategoriesOpen(false), 200)}
                className="flex items-center gap-1.5 hover:text-[#5B4BDB] transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E6E8F0] py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8A8A9E]">
                    Academic Fields
                  </div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onMouseDown={() => handleCategoryClick(cat)}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-[#17172B] hover:bg-[#F0EDFF] hover:text-[#5B4BDB] transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('about')}
              className={`hover:text-[#5B4BDB] transition-colors whitespace-nowrap cursor-pointer ${
                currentPage === 'about' ? 'text-[#5B4BDB] font-semibold' : ''
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className={`hover:text-[#5B4BDB] transition-colors whitespace-nowrap cursor-pointer ${
                currentPage === 'contact' ? 'text-[#5B4BDB] font-semibold' : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Primary Action / User Profile */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onBlur={() => setTimeout(() => setUserDropdownOpen(false), 200)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-[#F7F8FC] border border-[#E6E8F0] transition-colors cursor-pointer"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#5B4BDB]/30"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-[#17172B] max-w-[110px] truncate leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-[#5B4BDB] tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#52526B]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E6E8F0] py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-[#F0EDFF] mb-1">
                      <p className="text-xs font-bold text-[#17172B]">{user.name}</p>
                      <p className="text-[11px] text-[#52526B] truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-[#F0EDFF] text-[#5B4BDB]">
                        Role: {user.role.toUpperCase()}
                      </span>
                    </div>

                    <button
                      onMouseDown={() => {
                        setUserDropdownOpen(false);
                        onNavigate(getDashboardTarget());
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-[#17172B] hover:bg-[#F0EDFF] hover:text-[#5B4BDB] flex items-center gap-2.5 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#5B4BDB]" />
                      <span>My Dashboard</span>
                    </button>

                    {user.role === 'student' && (
                      <button
                        onMouseDown={() => {
                          setUserDropdownOpen(false);
                          onNavigate('my-courses');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-[#17172B] hover:bg-[#F0EDFF] hover:text-[#5B4BDB] flex items-center gap-2.5 cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4 text-[#5B4BDB]" />
                        <span>My Courses</span>
                      </button>
                    )}

                    <button
                      onMouseDown={() => {
                        setUserDropdownOpen(false);
                        onNavigate('profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-[#17172B] hover:bg-[#F0EDFF] hover:text-[#5B4BDB] flex items-center gap-2.5 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-[#5B4BDB]" />
                      <span>User Profile</span>
                    </button>

                    <div className="border-t border-[#F0EDFF] mt-1 pt-1">
                      <button
                        onMouseDown={() => {
                          setUserDropdownOpen(false);
                          logout();
                          onNavigate('home');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-xs font-semibold text-[#17172B] hover:text-[#5B4BDB] transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4.5 py-2 text-xs font-semibold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-lg shadow-sm shadow-[#5B4BDB]/20 hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#52526B] hover:bg-[#F7F8FC] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E6E8F0] bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('home');
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-[#17172B]"
          >
            Home
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('courses');
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-[#17172B]"
          >
            Explore Courses
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('about');
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-[#17172B]"
          >
            About Us
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('contact');
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-[#17172B]"
          >
            Contact
          </button>

          <div className="pt-2 border-t border-[#F0EDFF]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8A8A9E] mb-2">
              Browse Categories
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="text-left text-xs text-[#52526B] hover:text-[#5B4BDB] py-1 truncate"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0EDFF]">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 py-1">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#17172B]">{user.name}</div>
                    <div className="text-[10px] text-[#5B4BDB] uppercase font-semibold">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate(getDashboardTarget());
                  }}
                  className="w-full py-2 px-3 text-xs font-medium text-left bg-[#F0EDFF] text-[#5B4BDB] rounded-lg"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    onNavigate('home');
                  }}
                  className="w-full py-2 px-3 text-xs font-medium text-left text-rose-600 rounded-lg hover:bg-rose-50"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('login');
                  }}
                  className="w-full py-2 text-center text-xs font-semibold border border-[#E6E8F0] rounded-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('register');
                  }}
                  className="w-full py-2 text-center text-xs font-semibold bg-[#5B4BDB] text-white rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
