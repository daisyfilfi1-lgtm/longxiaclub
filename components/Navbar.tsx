'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, Sparkles, Loader2 } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  type: 'tool' | 'skill';
  logo?: string;
  icon?: string;
}

export default function Navbar() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { href: '/tools', label: '产品中心' },
    { href: '/skills', label: 'Skill市场' },
    { href: '/daily', label: 'AI日报' },
    { href: '/trends', label: '趋势榜单' },
    { href: '/scenes', label: '场景方案' },
    { href: '/compare', label: '工具对比' },
    { href: '/favorites', label: '收藏夹' },
  ];

  // 搜索防抖
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (query.length < 1) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        
        if (data.success) {
          const results: SearchResult[] = [];
          
          // 添加工具结果
          data.data.tools?.forEach((tool: any) => {
            results.push({
              id: tool.id,
              name: tool.name,
              description: tool.description,
              type: 'tool',
              logo: tool.logo
            });
          });
          
          // 添加技能结果
          data.data.skills?.forEach((skill: any) => {
            results.push({
              id: skill.id,
              name: skill.name,
              description: skill.description,
              type: 'skill',
              icon: skill.icon
            });
          });
          
          setSearchResults(results.slice(0, 6));
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearch]);

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 聚焦时打开搜索
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/${result.type}s/${result.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowResults(false);
      setIsSearchOpen(false);
      router.push(`/tools?q=${encodeURIComponent(searchQuery)}`);
    }
    if (e.key === 'Escape') {
      setShowResults(false);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Glass background - light */}
      <div className="absolute inset-0 glass" />
      
      {/* Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-200 group-hover:shadow-teal-300 transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AI导航站</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              {isSearchOpen ? (
                <div className="flex items-center relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="搜索工具、Skill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-64 md:w-80 pl-12 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
                  )}
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setShowResults(false);
                      setSearchQuery('');
                    }}
                    className="ml-2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  {/* Search Results Dropdown */}
                  {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-white rounded-xl border border-slate-200 shadow-lg z-50">
                      {searchResults.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-slate-50 transition-colors text-left"
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                            {result.type === 'tool' ? result.logo : result.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-slate-800 truncate">{result.name}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                result.type === 'tool' 
                                  ? 'bg-teal-100 text-teal-700' 
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {result.type === 'tool' ? '工具' : 'Skill'}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 truncate">{result.description.slice(0, 40)}...</p>
                          </div>
                        </button>
                      ))}
                      <div className="px-4 py-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setShowResults(false);
                            setIsSearchOpen(false);
                            router.push(`/tools?q=${encodeURIComponent(searchQuery)}`);
                          }}
                          className="text-sm text-teal-600 hover:text-teal-700 flex items-center space-x-1"
                        >
                          <span>查看全部结果</span>
                          <span className="text-slate-400">→</span>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {showResults && searchQuery.length >= 1 && searchResults.length === 0 && !isSearching && (
                    <div className="absolute top-full left-0 right-0 mt-2 py-4 bg-white rounded-xl border border-slate-200 shadow-lg z-50 text-center">
                      <p className="text-slate-400 text-sm">未找到相关结果</p>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* CTA Button */}
            <button className="hidden sm:flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-teal-200 transition-all">
              <Sparkles className="w-4 h-4" />
              <span>探索AI</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 rounded-xl text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
