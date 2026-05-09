import { supabase } from '@/lib/supabase';

export interface Faculty {
  id: string;
  name: string;
  department: string;
  room: string;
  floor: string;
  building: string;
  image_url: string; // Note: In the guide we used image_url
  directions?: string; // Optional text directions for floor map
  qualifications?: string;
}

// Helper function to map DB row to Faculty interface
function mapRowToFaculty(row: any): Faculty {
  return {
    id: row['Employee ID']?.toString() || Math.random().toString(),
    name: row['Staff Name'] || '',
    department: row['Designation'] || '',
    room: row['room'] || '',
    floor: row['floor'] || '',
    building: row['building'] || '',
    image_url: row['image_url'] || '',
    directions: row['directions'] || '',
    qualifications: row['Qualifications'] || '',
  };
}

/**
 * Fetches all faculty from the database or filters based on a search query.
 */
export async function searchFaculty(query: string): Promise<Faculty[]> {
  // If the query is empty, fetch all
  if (!query || query.trim() === '') {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .order('Staff Name');
      
    if (error) {
      console.error('Error fetching faculty:', error);
      throw new Error(error.message);
    }
    return (data || []).map(mapRowToFaculty);
  }
  
  const lowerCaseQuery = query.toLowerCase().trim();
  
  // Use Supabase's ilike filter for case-insensitive search on Staff Name
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .ilike('Staff Name', `%${lowerCaseQuery}%`)
    .order('Staff Name');

  if (error) {
    console.error('Error searching faculty:', error);
    throw new Error(error.message);
  }
  
  return (data || []).map(mapRowToFaculty);
}

/**
 * Fetches a single faculty member by ID.
 */
export async function getFacultyById(id: string): Promise<Faculty | null> {
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('Employee ID', id)
    .single();

  if (error) {
    console.error('Error fetching faculty by ID:', error);
    return null;
  }
  
  return mapRowToFaculty(data);
}

/**
 * Admin: Add a new faculty member.
 */
export async function addFaculty(faculty: Omit<Faculty, 'id'>): Promise<Faculty> {
  const dbRow = {
    'Staff Name': faculty.name,
    'Designation': faculty.department,
    'room': faculty.room,
    'floor': faculty.floor,
    'building': faculty.building,
    'image_url': faculty.image_url,
    'directions': faculty.directions,
    'Qualifications': faculty.qualifications
  };

  const { data, error } = await supabase
    .from('faculty')
    .insert([dbRow])
    .select()
    .single();

  if (error) {
    console.error('Error adding faculty:', error);
    throw new Error(error.message);
  }
  return mapRowToFaculty(data);
}

/**
 * Admin: Update an existing faculty member.
 */
export async function updateFaculty(id: string, updates: Partial<Faculty>): Promise<Faculty> {
  const dbRow: any = {};
  if (updates.name !== undefined) dbRow['Staff Name'] = updates.name;
  if (updates.department !== undefined) dbRow['Designation'] = updates.department;
  if (updates.room !== undefined) dbRow['room'] = updates.room;
  if (updates.floor !== undefined) dbRow['floor'] = updates.floor;
  if (updates.building !== undefined) dbRow['building'] = updates.building;
  if (updates.image_url !== undefined) dbRow['image_url'] = updates.image_url;
  if (updates.directions !== undefined) dbRow['directions'] = updates.directions;
  if (updates.qualifications !== undefined) dbRow['Qualifications'] = updates.qualifications;

  const { data, error } = await supabase
    .from('faculty')
    .update(dbRow)
    .eq('Employee ID', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating faculty:', error);
    throw new Error(error.message);
  }
  return mapRowToFaculty(data);
}

/**
 * Admin: Delete a faculty member.
 */
export async function deleteFaculty(id: string): Promise<void> {
  const { error } = await supabase
    .from('faculty')
    .delete()
    .eq('Employee ID', id);

  if (error) {
    console.error('Error deleting faculty:', error);
    throw new Error(error.message);
  }
}

/**
 * Admin: Upload a faculty image to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('faculty_images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage
    .from('faculty_images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
