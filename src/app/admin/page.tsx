"use client";

import React, { useState, useEffect } from 'react';
import { Faculty, searchFaculty, addFaculty, updateFaculty, deleteFaculty } from '@/services/faculty';
import FacultyForm from '@/components/FacultyForm';

export default function AdminDashboard() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await searchFaculty('');
      setFaculties(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddNew = () => {
    setEditingFaculty(undefined);
    setIsEditing(true);
  };

  const handleEdit = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      await deleteFaculty(id);
      setFaculties(faculties.filter(f => f.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleSubmit = async (data: Omit<Faculty, 'id'>) => {
    setSubmitting(true);
    try {
      if (editingFaculty) {
        await updateFaculty(editingFaculty.id, data);
      } else {
        await addFaculty(data);
      }
      setIsEditing(false);
      await loadData();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !isEditing) {
    return <div className="py-12 text-center text-slate-500">Loading faculty data...</div>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">Faculty Management</h2>
          <p className="mt-1 text-sm text-slate-500">Add, edit, or remove faculty members from the directory.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          {!isEditing && (
            <button
              onClick={handleAddNew}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Add New Faculty
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-[24px] p-6 sm:p-8 border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            {editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
          </h3>
          <FacultyForm
            initialData={editingFaculty}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditing(false)}
            isSubmitting={submitting}
          />
        </div>
      ) : (
        <div className="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-[24px] overflow-hidden border border-slate-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {faculties.map((faculty) => (
                  <tr key={faculty.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={faculty.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}`} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{faculty.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{faculty.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{faculty.building}, Rm {faculty.room}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(faculty)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(faculty.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
                {faculties.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                      No faculty members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
