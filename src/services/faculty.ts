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
  branch?: string;
}

// Helper function to map DB row to Faculty interface
function mapRowToFaculty(row: any): Faculty {
  return {
    id: (row['Employee ID'] || row['employee_id'] || row['id'])?.toString() || Math.random().toString(),
    name: row['Staff Name'] || row['staff_name'] || row['name'] || '',
    department: row['Designation'] || row['designation'] || row['department'] || '',
    room: row['room'] || '',
    floor: row['floor'] || '',
    building: row['building'] || '',
    image_url: row['image_url'] || '',
    directions: row['directions'] || '',
    qualifications: row['Qualifications'] || row['qualifications'] || '',
    branch: row['branch'] || row['Branch'] || '',
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

  try {
    // 1. Fetch all faculty (or a large enough subset) to perform client-side filtering
    // This is the most robust way to handle partial matching on numeric IDs
    const { data: allFaculty, error } = await supabase
      .from('faculty')
      .select('*')
      .order('Staff Name');

    if (error) throw error;

    if (allFaculty && allFaculty.length > 0) {
      // Diagnostic: Log the keys of the first row to ensure we have the right column names
      console.log('Database Row Keys:', Object.keys(allFaculty[0]));
    }

    // Filter by name OR ID in JavaScript
    const filtered = (allFaculty || []).filter(item => {
      const name = (item['Staff Name'] || '').toString().toLowerCase();
      const id = (item['Employee ID'] || '').toString();
      
      return name.includes(lowerCaseQuery) || id.includes(lowerCaseQuery);
    });

    return filtered.map(mapRowToFaculty);
  } catch (err) {
    console.error('Advanced search failed, falling back to basic name search:', err);
    // Ultimate fallback
    const { data } = await supabase
      .from('faculty')
      .select('*')
      .ilike('Staff Name', `%${lowerCaseQuery}%`)
      .order('Staff Name');
    
    return (data || []).map(mapRowToFaculty);
  }
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
