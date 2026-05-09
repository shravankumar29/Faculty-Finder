import React from 'react';

export interface RoomCoordinates {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
}

interface FloorMapProps {
  mapImageUrl: string;
  roomCoordinates?: RoomCoordinates;
  roomName?: string;
}

export default function FloorMap({ mapImageUrl, roomCoordinates, roomName }: FloorMapProps) {
  return (
    <div className="relative w-full max-w-3xl border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
      {/* Map Image */}
      <img 
        src={mapImageUrl} 
        alt="Floor Map" 
        className="w-full h-auto object-contain block"
      />

      {/* Room Marker overlay */}
      {roomCoordinates && (
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center group cursor-pointer"
          style={{ 
            left: `${roomCoordinates.x}%`, 
            top: `${roomCoordinates.y}%` 
          }}
        >
          {/* Tooltip / Label */}
          {roomName && (
            <div className="bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded shadow-lg mb-1.5 whitespace-nowrap pointer-events-none">
              {roomName}
            </div>
          )}
          
          {/* Marker Pin */}
          <div className="text-red-500 animate-bounce relative">
            <svg className="w-8 h-8 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Small shadow beneath the pin */}
          <div className="absolute -bottom-1 w-4 h-1.5 bg-black/20 rounded-[100%] blur-[1px]"></div>
        </div>
      )}
    </div>
  );
}
