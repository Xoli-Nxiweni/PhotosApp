import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { getLocationName } from './permissions';

// Open or create the database asynchronously
const db = SQLite.openDatabaseAsync('gallery.db');

// Initialize the database
export const initDatabase = async () => {
  try {
    // Use runAsync instead of transaction
    await (await db).runAsync(
      `CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        uri TEXT, 
        latitude REAL, 
        longitude REAL, 
        location TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

// Save an image to the database
export const saveImage = async (uri, latitude, longitude) => {
  try {
    const locationName = await getLocationName(latitude, longitude);
    const result = await (await db).runAsync(
      'INSERT INTO images (uri, latitude, longitude, location) VALUES (?, ?, ?, ?)',
      [uri, latitude, longitude, locationName]
    );
    console.log('✅ Image saved with location:', result);
    return result;
  } catch (error) {
    console.error('❌ Error saving image:', error);
    throw error;
  }
};

// Retrieve all images
export const getAllImages = async () => {
  try {
    const result = await (await db).getAllAsync(
      'SELECT * FROM images ORDER BY timestamp DESC'
    );
    console.log('✅ Images retrieved:', result);
    return result;
  } catch (error) {
    console.error('❌ Error retrieving images:', error);
    throw error;
  }
};

// Delete an image by its ID
export const deleteImage = async (imageId) => {
  try {
    // First, get the URI of the image to delete from file system
    const imageToDelete = await (await db).getFirstAsync(
      'SELECT uri FROM images WHERE id = ?',
      [imageId]
    );

    if (!imageToDelete) {
      console.error('❌ Image not found');
      return false;
    }

    // Delete the image file from the file system
    if (imageToDelete.uri) {
      try {
        await FileSystem.deleteAsync(imageToDelete.uri, { idempotent: true });
      } catch (fileDeleteError) {
        console.error('❌ Error deleting file:', fileDeleteError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete the image record from the database
    const result = await (await db).runAsync(
      'DELETE FROM images WHERE id = ?',
      [imageId]
    );

    console.log('✅ Image deleted:', result);
    return true;
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    throw error;
  }
};

// Update an image by its ID
export const updateImage = async (imageId, uri, latitude, longitude) => {
  try {
    const locationName = await getLocationName(latitude, longitude);
    const result = await (await db).runAsync(
      'UPDATE images SET uri = ?, latitude = ?, longitude = ?, location = ? WHERE id = ?',
      [uri, latitude, longitude, locationName, imageId]
    );
    console.log('✅ Image updated:', result);
    return result;
  } catch (error) {
    console.error('❌ Error updating image:', error);
    throw error;
  }
};

// Search images by location
export const searchImagesByLocation = async (searchQuery) => {
  try {
    const result = await (await db).getAllAsync(
      'SELECT * FROM images WHERE location LIKE ? ORDER BY timestamp DESC',
      [`%${searchQuery}%`]
    );
    console.log('✅ Images retrieved for search:', result);
    return result;
  } catch (error) {
    console.error('❌ Error searching images:', error);
    throw error;
  }
};

// Search images by date range
export const searchImagesByDateRange = async (startDate, endDate) => {
  try {
    const result = await (await db).getAllAsync(
      'SELECT * FROM images WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC',
      [startDate, endDate]
    );
    console.log('✅ Images retrieved for date range:', result);
    return result;
  } catch (error) {
    console.error('❌ Error searching images by date range:', error);
    throw error;
  }
};