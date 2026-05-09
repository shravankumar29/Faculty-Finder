"use client";

import React, { useState } from 'react';
import { Faculty, uploadImage } from '@/services/faculty';

interface FacultyFormProps {
  initialData?: Faculty;
  onSubmit: (data: Omit<Faculty, 'id'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function FacultyForm({ initialData, onSubmit, onCancel, isSubmitting }: FacultyFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    department: initialData?.department || '',
    room: initialData?.room || '',
    floor: initialData?.floor || '',
    building: initialData?.building || '',
    image_url: initialData?.image_url || '',
    directions: initialData?.directions || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image_url || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        setUploading(true);
        finalImageUrl = await uploadImage(imageFile);
        setUploading(false);
      }

      await onSubmit({
        ...formData,
        image_url: finalImageUrl,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-[12px] text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-[12px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
          <input
            type="text"
            name="department"
            required
            value={formData.department}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-[12px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Building *</label>
          <input
            type="text"
            name="building"
            required
            value={formData.building}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-[12px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Floor *</label>
          <input
            type="text"
            name="floor"
            required
            value={formData.floor}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-[12px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Room *</label>
          <input
            type="text"
            name="room"
            required
            value={formData.room}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-[12px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Walking Directions</label>
        <textarea
          name="directions"
          rows={2}
          value={formData.directions}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-[12px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g. Turn left after the main entrance"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Profile Image</label>
        <div className="mt-1 flex items-center gap-4">
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-full object-cover border border-slate-200" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || uploading}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : isSubmitting ? 'Saving...' : 'Save Faculty'}
        </button>
      </div>
    </form>
  );
}
