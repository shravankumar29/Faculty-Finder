"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import FacultyCard from '@/components/FacultyCard';
import { searchFaculty, Faculty } from '@/services/faculty';


export default function Home() {
  const [results, setResults] = useState<Faculty[]>([]);
  const [activeCategory, setActiveCategory] = useState('All Faculty');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all faculty on initial mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchFaculty('');
        setResults(data);
      } catch (err: any) {
        setError('Failed to connect to the database. Have you set your Supabase credentials in .env.local?');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchFaculty(query);
      setResults(data);
    } catch (err: any) {
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredResults = results.filter(faculty => {
    if (activeCategory === 'All Faculty') return true;
    return faculty.branch?.toUpperCase() === activeCategory.toUpperCase();
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24 relative">
      {/* Header / Hero Section */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <svg className="w-8 h-8 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            <span className="ml-2 text-[22px] font-bold text-rose-500 tracking-tight hidden sm:block">FacultyFinder</span>
          </div>

          {/* Search Bar Center */}
          <div className="flex-1 flex justify-end md:justify-center w-full md:w-auto px-4">
            <SearchBar onSearch={handleSearch} suggestions={results} />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-2 pb-4">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-2 pt-2">
            {[
              { name: 'All Faculty', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z', active: true },
              { name: 'CSE', icon: 'M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z' },
              { name: 'ECE', icon: 'M7 2v11h3v9l7-12h-4l4-8z' },
              { name: 'EEE', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
              { name: 'MECH', icon: 'M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z' },
              { name: 'CIVIL', icon: 'M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm5 15h-2v-6H9v6H7v-7.81l5-4.5 5 4.5V18z' },
              { name: 'IT', icon: 'M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z' },
            ].map((category) => (
              <button 
                key={category.name} 
                onClick={() => setActiveCategory(category.name)}
                className={`flex flex-col items-center gap-2 min-w-max pb-3 border-b-2 transition-colors ${activeCategory === category.name ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'}`}
              >
                <svg className="w-6 h-6 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                  <path d={category.icon}/>
                </svg>
                <span className="text-[13px] font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-24 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading faculty records...</p>
          </div>
        ) : error ? (
          /* Error State UI */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-red-50 rounded-2xl border border-red-200 shadow-sm">
            <div className="bg-red-100 p-5 rounded-full mb-5 text-red-500">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-red-900 mb-2">
              Connection Error
            </h2>
            <p className="text-red-700 max-w-md mx-auto leading-relaxed">
              {error}
            </p>
          </div>
        ) : filteredResults.length === 0 ? (
          /* Empty Results Section */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="bg-indigo-50 p-5 rounded-full mb-5">
              <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
              No results found
            </h2>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              We couldn't find any faculty members matching your search. Try a different name, department, or building.
            </p>
          </div>
        ) : (
          /* Results Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {filteredResults.map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Map Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-full shadow-lg font-semibold text-[15px] flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
          <span>Show map</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
