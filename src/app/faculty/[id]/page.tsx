import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFacultyById } from '@/services/faculty';
import FloorMap from '@/components/FloorMap';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function FacultyProfilePage({ params }: PageProps) {
  // In Next.js 15+, params is a Promise
  const resolvedParams = await params;
  const faculty = await getFacultyById(resolvedParams.id);

  if (!faculty) {
    notFound();
  }

  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&background=e0e7ff&color=4338ca&size=300`;
  const imageUrl = faculty.image_url || fallbackImage;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {/* Navbar / Back Button */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
            <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Search
          </Link>
        </div>
      </nav>

      {/* Main Profile Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Header Area */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          
          <div className="px-6 sm:px-10 pb-10">
            {/* Profile Image (Overlapping Header) */}
            <div className="relative flex justify-between items-end -mt-16 mb-6">
              <img 
                src={imageUrl} 
                alt={faculty.name} 
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-md bg-white"
              />
              <div className="mb-2 hidden sm:block">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Faculty Member
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                {faculty.name}
              </h1>
              <p className="text-lg text-indigo-600 font-medium mt-1">
                {faculty.department}
              </p>
              {faculty.qualifications && (
                <p className="text-md text-slate-600 mt-2">
                  <span className="font-semibold text-slate-500">Qualifications:</span> {faculty.qualifications}
                </p>
              )}
              <p className="text-sm text-slate-400 mt-1">
                <span className="font-semibold text-slate-400">Employee ID:</span> {faculty.id}
              </p>
            </div>

            <hr className="my-8 border-slate-100" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Location Card */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Office Location
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-slate-900">Building</p>
                      <p className="text-sm text-slate-600 mt-0.5">{faculty.building}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-slate-900">Room Details</p>
                      <p className="text-sm text-slate-600 mt-0.5">Room {faculty.room}, {faculty.floor} Floor</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact/Action Card (Placeholder for future features) */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 text-indigo-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Contact Faculty</h3>
                <p className="text-xs text-slate-500 mb-4">Send a message to their department email address.</p>
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                  Send Email
                </button>
              </div>
            </div>

            {/* Floor Map Section */}
            <div className="mt-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Floor Map Navigation
                </h2>
                
                <div className="bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl text-sm font-medium border border-indigo-100 flex items-start shadow-sm max-w-sm">
                  <svg className="w-5 h-5 mr-2.5 mt-0.5 flex-shrink-0 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span>
                    <strong className="block text-indigo-900 mb-0.5 uppercase tracking-wide text-xs">Directions</strong>
                    {faculty.directions || "From stairs go left, 2nd room on right."}
                  </span>
                </div>
              </div>
              <FloorMap 
                mapImageUrl="https://placehold.co/800x500/f8fafc/cbd5e1?text=Campus+Floor+Plan" 
                roomCoordinates={{ x: 65, y: 40 }} 
                roomName={`Room ${faculty.room}`}
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
