"use client";

import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import FacultyCard from '@/components/FacultyCard';
import { searchFaculty, Faculty } from '@/services/faculty';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const [results, setResults] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session, isAdmin } = useAuth();

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-10">
      {/* Header / Hero Section */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-6">
            <div>
              <h1 className="text-2xl md:text-[28px] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight leading-tight">
                Campus Faculty Finder
              </h1>
              <p className="text-[15px] font-medium text-slate-500 mt-1.5 max-w-sm">
                Locate professors, staff, and department contacts instantly.
              </p>
            </div>

            {/* Search Bar & Admin Button */}
            <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-auto">
                <SearchBar onSearch={handleSearch} suggestions={results} />
              </div>
              {session && isAdmin && (
                <Link
                  href="/admin"
                  className="w-full md:w-auto text-center px-4 py-2 border border-transparent rounded-[12px] shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        ) : results.length === 0 ? (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        )}
      </main>

      {/* Discreet Footer Link for Admin Login */}
      <footer className="max-w-5xl mx-auto px-4 py-8 text-center border-t border-slate-200">
        <Link href="/login" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
          Admin Portal
        </Link>
      </footer>
    </div>
  );
}
