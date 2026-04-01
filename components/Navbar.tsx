'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/tools', label: '产品中心' },
    { href: '/skills', label: 'Skill市场' },
    { href: '/scenes', label: '场景方案' },
    { href: '/favorites', label: '收藏夹' },
  ];

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
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="搜索工具、Skill..."
                    className="w-48 md:w-64 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
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
