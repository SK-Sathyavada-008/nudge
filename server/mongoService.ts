import { MongoClient, Db, Collection } from 'mongodb';
import type { RoadmapPlan, RoadmapProgressData } from '../src/types';

export class MongoService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected = false;
  private connectionAttempted = false;

  private uri: string;
  private dbName: string;

  constructor() {
    this.uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
    this.dbName = process.env.MONGODB_DB || 'nudgeveer';
  }

  public async connect(): Promise<boolean> {
    if (this.isConnected && this.db) return true;
    this.connectionAttempted = true;

    try {
      this.client = new MongoClient(this.uri, {
        serverSelectionTimeoutMS: 2500,
        connectTimeoutMS: 2500,
      });

      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.isConnected = true;
      console.log(`🍃 [MongoDB] Connected successfully to database: ${this.dbName}`);

      // Ensure indexes on roadmaps and progress
      try {
        await this.db.collection('roadmaps').createIndex({ id: 1 }, { unique: true });
        await this.db.collection('roadmaps').createIndex({ userId: 1, generatedAt: -1 });
        await this.db.collection('roadmap_progress').createIndex({ roadmapId: 1 }, { unique: true });
        await this.db.collection('roadmap_events').createIndex({ roadmapId: 1, timestamp: -1 });
      } catch {
        // Index creation best-effort
      }

      return true;
    } catch (err: any) {
      this.isConnected = false;
      console.warn(`⚠️ [MongoDB] Connection failed: ${err.message || 'Offline'}. Operating in graceful offline/local storage mode.`);
      return false;
    }
  }

  public isAvailable(): boolean {
    return this.isConnected && this.db !== null;
  }

  private getCollection<T extends Record<string, any>>(name: string): Collection<T> | null {
    if (!this.isConnected || !this.db) return null;
    return this.db.collection<T>(name);
  }

  public async saveRoadmap(roadmap: RoadmapPlan): Promise<{ success: boolean; id: string; savedLocally?: boolean }> {
    if (!this.isAvailable()) {
      await this.connect();
    }

    const col = this.getCollection<RoadmapPlan>('roadmaps');
    if (!col) {
      return { success: false, id: roadmap.id, savedLocally: true };
    }

    try {
      await col.updateOne(
        { id: roadmap.id },
        { $set: { ...roadmap, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );

      // Log event
      await this.logEvent({
        roadmapId: roadmap.id,
        userId: roadmap.userId || 'veer-01',
        eventType: 'ROADMAP_SAVED',
        data: { goal: roadmap.goal, phasesCount: roadmap.phases.length },
      });

      return { success: true, id: roadmap.id };
    } catch (err: any) {
      console.error('Error saving roadmap to MongoDB:', err.message);
      return { success: false, id: roadmap.id, savedLocally: true };
    }
  }

  public async getRoadmap(id: string): Promise<RoadmapPlan | null> {
    if (!this.isAvailable()) {
      await this.connect();
    }
    const col = this.getCollection<RoadmapPlan>('roadmaps');
    if (!col) return null;

    try {
      const doc = await col.findOne({ id }, { projection: { _id: 0 } });
      return doc as RoadmapPlan | null;
    } catch (err) {
      console.error('Error getting roadmap from MongoDB:', err);
      return null;
    }
  }

  public async getLatestRoadmap(userId: string): Promise<RoadmapPlan | null> {
    if (!this.isAvailable()) {
      await this.connect();
    }
    const col = this.getCollection<RoadmapPlan>('roadmaps');
    if (!col) return null;

    try {
      const doc = await col.findOne(
        { userId },
        { sort: { generatedAt: -1 }, projection: { _id: 0 } }
      );
      return doc as RoadmapPlan | null;
    } catch (err) {
      console.error('Error getting latest roadmap from MongoDB:', err);
      return null;
    }
  }

  public async updateProgress(progress: RoadmapProgressData): Promise<boolean> {
    if (!this.isAvailable()) {
      await this.connect();
    }
    const col = this.getCollection<RoadmapProgressData>('roadmap_progress');
    if (!col) return false;

    try {
      await col.updateOne(
        { roadmapId: progress.roadmapId },
        { $set: { ...progress, lastUpdated: new Date().toISOString() } },
        { upsert: true }
      );

      // Also log progress event
      await this.logEvent({
        roadmapId: progress.roadmapId,
        userId: progress.userId,
        eventType: 'PROGRESS_UPDATED',
        data: {
          completedTasksCount: progress.completedTasks.length,
          completedTopicsCount: progress.completedTopics.length,
        },
      });

      return true;
    } catch (err) {
      console.error('Error updating progress in MongoDB:', err);
      return false;
    }
  }

  public async getProgress(roadmapId: string): Promise<RoadmapProgressData | null> {
    if (!this.isAvailable()) {
      await this.connect();
    }
    const col = this.getCollection<RoadmapProgressData>('roadmap_progress');
    if (!col) return null;

    try {
      const doc = await col.findOne({ roadmapId }, { projection: { _id: 0 } });
      return doc as RoadmapProgressData | null;
    } catch (err) {
      console.error('Error getting progress from MongoDB:', err);
      return null;
    }
  }

  public async logEvent(event: {
    roadmapId: string;
    userId: string;
    eventType: string;
    data: any;
  }): Promise<boolean> {
    if (!this.isAvailable()) return false;
    const col = this.getCollection('roadmap_events');
    if (!col) return false;

    try {
      await col.insertOne({
        ...event,
        timestamp: new Date().toISOString(),
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const mongoService = new MongoService();
