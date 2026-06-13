import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_DB_PATH = path.join(__dirname, '..', '..', 'database', 'local_db.json');

// Ensure database folder exists
const dbDir = path.dirname(LOCAL_DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Ensure local JSON database file exists
if (!fs.existsSync(LOCAL_DB_PATH)) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({
    users: [],
    profiles: [],
    roadmaps: [],
    skills: [],
    resources: [],
    projects: [],
    jobs: [],
    applications: [],
    resumes: [],
    interviews: [],
    achievements: [],
    notifications: [],
    settings: [],
    adminlogs: []
  }, null, 2));
}

let isUsingFallback = false;

// Simple file-based mock database query engine
class MockModel {
  constructor(collectionName) {
    this.collection = collectionName.toLowerCase();
  }

  readData() {
    try {
      const content = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading JSON DB, resetting:', err);
      return {};
    }
  }

  writeData(data) {
    try {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error writing to JSON DB:', err);
    }
  }

  async find(query = {}) {
    const data = this.readData();
    const list = data[this.collection] || [];
    return list.filter(item => {
      for (const key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const list = await this.find(query);
    return list[0] || null;
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async create(doc) {
    const data = this.readData();
    if (!data[this.collection]) {
      data[this.collection] = [];
    }
    const newDoc = {
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    data[this.collection].push(newDoc);
    this.writeData(data);
    return newDoc;
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const data = this.readData();
    const list = data[this.collection] || [];
    const index = list.findIndex(item => item._id === id);
    if (index === -1) return null;

    const updated = {
      ...list[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    this.writeData(data);
    return updated;
  }

  async findOneAndUpdate(query, updateData, options = {}) {
    const item = await this.findOne(query);
    if (!item) {
      if (options.upsert) {
        return this.create({ ...query, ...updateData });
      }
      return null;
    }
    return this.findByIdAndUpdate(item._id, updateData, options);
  }

  async deleteOne(query) {
    const data = this.readData();
    const list = data[this.collection] || [];
    const initialLength = list.length;
    
    data[this.collection] = list.filter(item => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return true;
        }
      }
      return false;
    });

    this.writeData(data);
    return { deletedCount: initialLength - data[this.collection].length };
  }
}

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careergps';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000 // Timeout fast if no local MongoDB is running
    });
    console.log('✅ MongoDB connected successfully');
    isUsingFallback = false;
  } catch (error) {
    console.log('⚠️ MongoDB connection failed. Falling back to Local JSON database.');
    console.log(`📂 Local JSON Database path: ${LOCAL_DB_PATH}`);
    isUsingFallback = true;
  }
};

export const getModel = (name, schema) => {
  // If we connected to MongoDB, return actual mongoose model.
  // Otherwise, return our custom MockModel file-based adapter.
  if (!isUsingFallback) {
    try {
      return mongoose.model(name);
    } catch {
      return mongoose.model(name, schema);
    }
  } else {
    return new MockModel(name);
  }
};
