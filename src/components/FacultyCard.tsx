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
      className="group flex flex-col cursor-pointer"
    >
      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-xl bg-slate-200">
        <img 
          src={imgSrc} 
          alt={faculty.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setImgSrc(fallbackImage)}
      </div>
      
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-slate-900 truncate text-[15px] leading-tight">{faculty.name}</h3>
        {/* Placeholder for rating or status */}
      </div>
      
      <div className="text-slate-500 text-[15px] mt-0.5 leading-snug truncate">
        {faculty.department}
      </div>
      <div className="text-slate-500 text-[15px] leading-snug truncate">
        {faculty.building} • Room {faculty.room}
      </div>
      
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="font-semibold text-slate-900 text-[15px]">Emp ID: {faculty.id}</span>
      </div>
    </Link>
  );
}
