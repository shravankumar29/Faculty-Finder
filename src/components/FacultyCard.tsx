"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Faculty } from '@/services/faculty';

interface FacultyCardProps {
  faculty: Faculty;
}

export default function FacultyCard({ faculty }: FacultyCardProps) {
  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&background=e0e7ff&color=4338ca&size=150`;
  const [imgSrc, setImgSrc] = useState(faculty.image_url || fallbackImage);

  return (
    <Link 
      href={`/faculty/${faculty.id}`} 
      className="bg-white rounded-[28px] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 hover:border-indigo-100 transition-all duration-300 group flex flex-col relative overflow-hidden"
    >
      {/* Soft gradient background accent on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50/80 to-transparent rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="p-6 sm:p-8 flex-1 z-10">
        <div className="flex items-center gap-5 mb-6">
          <img 
            src={imgSrc} 
            alt={faculty.name} 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-sm border border-slate-100 group-hover:border-indigo-100 transition-colors duration-300"
            loading="lazy"
            onError={() => setImgSrc(fallbackImage)}
          />
          <div>
            <h3 className="font-bold text-slate-900 text-lg sm:text-xl leading-tight group-hover:text-indigo-600 transition-colors duration-300">{faculty.name}</h3>
            <p className="text-indigo-600 text-sm font-medium mt-1">{faculty.department}</p>
            {faculty.qualifications && (
              <p className="text-slate-500 text-xs mt-1">{faculty.qualifications}</p>
            )}
            <p className="text-slate-400 text-xs mt-1">Emp ID: {faculty.id}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center text-sm text-slate-500 font-medium">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-4 shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors duration-300 shadow-sm border border-slate-100 group-hover:border-indigo-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="truncate">{faculty.building}</span>
          </div>
          <div className="flex items-center text-sm text-slate-500 font-medium">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-4 shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors duration-300 shadow-sm border border-slate-100 group-hover:border-indigo-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span>Room {faculty.room}, {faculty.floor} Floor</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
