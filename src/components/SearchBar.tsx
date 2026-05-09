"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Faculty } from '@/services/faculty';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  suggestions?: Faculty[];
}

export default function SearchBar({ onSearch, suggestions = [] }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse recent searches');
    }
  }, []);

  // Debounce the input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  // Trigger search callback when debounced query changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToRecent = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    
    setRecentSearches((prev) => {
      const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveToRecent(query);
      setIsFocused(false);
    }
  };

  const displaySuggestions = suggestions.slice(0, 5);
  const showDropdown = isFocused && query.trim().length > 0 && displaySuggestions.length > 0;

  const handleSuggestionClick = (faculty: Faculty) => {
    saveToRecent(query); // Save the query that led to this suggestion
    setIsFocused(false);
    setQuery('');
    router.push(`/faculty/${faculty.id}`);
  };

  return (
    <div className="w-full md:w-96" ref={containerRef}>
      <div className="relative">
        <div className="flex items-center pl-4 pr-1 py-1.5 border border-slate-200 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-sm px-2 focus:ring-0"
            placeholder="Search faculty by name..."
          />
          <div className="bg-rose-500 p-2 rounded-full text-white ml-2 flex-shrink-0">
            <svg 
              className="h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
            >
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && (
          <div className="absolute z-50 w-full mt-3 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-[20px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col">
            {displaySuggestions.map((faculty) => {
              const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&background=e0e7ff&color=4338ca&size=50`;
              return (
                <button
                  key={faculty.id}
                  onClick={() => handleSuggestionClick(faculty)}
                  className="w-full text-left px-5 py-3.5 hover:bg-indigo-50/50 transition-colors border-b border-slate-100 last:border-0 flex items-center gap-4"
                >
                  <img 
                    src={faculty.image_url || fallbackImage} 
                    alt={faculty.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                    onError={(e) => { e.currentTarget.src = fallbackImage; }}
                  />
                  <div className="overflow-hidden">
                    <div className="text-sm font-semibold text-slate-900 truncate">{faculty.name}</div>
                    <div className="text-xs text-indigo-600 truncate">{faculty.department}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pl-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Recent:</span>
          {recentSearches.map((term, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(term);
                setIsFocused(true);
              }}
              className="text-xs bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 px-3 py-1 rounded-full transition-colors border border-slate-200 shadow-sm"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
