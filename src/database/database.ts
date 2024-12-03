import * as SQLite from 'expo-sqlite';

export interface Image {
  id?: number;
  uri: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
  description?: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync('geo_gallery.db');
    this.initDatabase();
  }

  private initDatabase() {
    this.db.runSync(
      `CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uri TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        description TEXT
      )`
    );
  }

  // Adjusted methods to use SQLiteDatabase sync methods
  addImage(image: Omit<Image, 'id' | 'timestamp'>): number {
    const result = this.db.runSync(
      'INSERT INTO images (uri, latitude, longitude, description) VALUES (?, ?, ?, ?)',
      [image.uri, image.latitude, image.longitude, image.description || '']
    );
    return result.lastInsertRowId;
  }

  getAllImages(): Image[] {
    const result = this.db.getAllSync('SELECT * FROM images ORDER BY timestamp DESC');
    return result as Image[];
  }

  getImageById(id: number): Image | null {
    const result = this.db.getFirstSync('SELECT * FROM images WHERE id = ?', [id]);
    return result as Image | null;
  }

  updateImage(image: Image): boolean {
    this.db.runSync(
      'UPDATE images SET uri = ?, latitude = ?, longitude = ?, description = ? WHERE id = ?',
      [image.uri, image.latitude, image.longitude, image.description, image.id]
    );
    return true;
  }

  deleteImage(id: number): boolean {
    this.db.runSync('DELETE FROM images WHERE id = ?', [id]);
    return true;
  }

  searchImagesByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Image[] {
    const result = this.db.getAllSync(
      `SELECT *, 
        (6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians(?)) + 
          sin(radians(?)) * sin(radians(latitude))
        )) AS distance 
      FROM images 
      HAVING distance < ? 
      ORDER BY distance`,
      [latitude, longitude, latitude, radiusKm]
    );
    return result as Image[];
  }
}

export default new DatabaseService();