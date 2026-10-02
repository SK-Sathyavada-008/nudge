import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { gemmaService } from './gemmaService.ts';
import { mongoService } from './mongoService.ts';
import { roadmapService } from './roadmapService.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Attempt MongoDB connection on startup (non-blocking)
mongoService.connect().catch(() => {
  console.log('🍃 Note: MongoDB is optional; Nudge Veer runs with automatic local fallback.');
});

// Health Check
app.get('/api/health', async (_req, res) => {
  const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
  let ollamaConnected = false;
  try {
    const check = await fetch(`${ollamaHost}/api/tags`, { signal: AbortSignal.timeout(1500) });
    ollamaConnected = check.ok;
  } catch {
    ollamaConnected = false;
  }

  res.json({
    status: 'online',
    brain: 'Gemma 2 / Gemma 4',
    ollamaConnected,
    mongoConnected: mongoService.isAvailable(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// ==========================================
// GEMMA CODING COMPANION DECISION ENDPOINT
// ==========================================
app.post('/api/gemma/decide', async (req, res) => {
  try {
    const decision = await gemmaService.decide(req.body);
    res.json(decision);
  } catch (error) {
    console.error('Error in Gemma decision endpoint:', error);
    res.status(500).json({
      action: 'HINT',
      difficulty: 'ACTUALLY_THINK',
      message: 'Bro, the server had a quick hiccup, but your brain is still online. Try again!',
      points: 10,
      hintLevel: req.body.hintLevel || 1,
    });
  }
});

// ==========================================
// 🗺️ GAME PLAN & ROADMAP ENDPOINTS
// ==========================================

// 1. Clarification Check
app.post('/api/roadmap/clarify', async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal || typeof goal !== 'string') {
      res.status(400).json({ error: 'Goal is required' });
      return;
    }
    const clarification = await roadmapService.checkClarification(goal);
    res.json(clarification);
  } catch (err: any) {
    console.error('Clarification error:', err);
    res.json({
      needsClarification: false,
      friendlyMessage: "Let's build your plan directly.",
      questions: [],
    });
  }
});

// 2. Generate Roadmap
app.post('/api/roadmap/generate', async (req, res) => {
  try {
    const { goal, why, level, timeCommitment, deadline, language, knownTopics } = req.body;
    if (!goal) {
      res.status(400).json({ error: 'Goal is required' });
      return;
    }

    const result = await roadmapService.generateRoadmap({
      goal,
      why,
      level,
      timeCommitment,
      deadline,
      language,
      knownTopics,
    });

    // Try saving to MongoDB if connected
    let mongoSaved = false;
    if (mongoService.isAvailable()) {
      const saveRes = await mongoService.saveRoadmap(result.plan);
      mongoSaved = saveRes.success;
    }

    res.json({
      plan: {
        ...result.plan,
        savedLocally: !mongoSaved,
      },
      isAiGenerated: result.isAiGenerated,
      mongoSaved,
      error: result.error,
    });
  } catch (err: any) {
    console.error('Error generating roadmap:', err);
    res.status(500).json({
      error: 'Okay... the AI has temporarily gone to get chai. ☕ Try again in a moment.',
    });
  }
});

// 3. Save Roadmap (explicit save or local-to-mongo sync)
app.post('/api/roadmap/save', async (req, res) => {
  try {
    const { roadmap } = req.body;
    if (!roadmap || !roadmap.id) {
      res.status(400).json({ error: 'Valid roadmap object required' });
      return;
    }

    const saveRes = await mongoService.saveRoadmap(roadmap);
    res.json(saveRes);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message, savedLocally: true });
  }
});

// 4. Get Latest Roadmap for User
app.get('/api/roadmap/latest', async (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'veer-01';
    const plan = await mongoService.getLatestRoadmap(userId);
    res.json({ plan, mongoConnected: mongoService.isAvailable() });
  } catch (err: any) {
    res.status(500).json({ plan: null, error: err.message });
  }
});

// 5. Update Roadmap Progress
app.post('/api/roadmap/progress', async (req, res) => {
  try {
    const progress = req.body;
    if (!progress || !progress.roadmapId) {
      res.status(400).json({ error: 'Progress data with roadmapId required' });
      return;
    }

    const success = await mongoService.updateProgress(progress);
    res.json({ success, savedToMongo: success, savedLocally: !success });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message, savedLocally: true });
  }
});

// 6. Adaptive Roadmap Analysis
app.post('/api/roadmap/adapt', async (req, res) => {
  try {
    const { plan, progress, recentStruggleCount } = req.body;
    if (!plan) {
      res.status(400).json({ error: 'Plan is required for adaptation' });
      return;
    }

    const adaptation = await roadmapService.adaptRoadmap(
      plan,
      progress || {
        completedTasks: [],
        completedTopics: [],
        completedPhases: [],
        roadmapId: plan.id,
        userId: 'veer-01',
        currentPhaseId: plan.phases[0]?.id || '',
        currentTopicId: plan.phases[0]?.topics[0]?.id || '',
        timeSpentMinutes: 0,
        problemsCompleted: 0,
        lastUpdated: new Date().toISOString(),
      },
      recentStruggleCount || 0
    );

    res.json(adaptation);
  } catch (err: any) {
    console.error('Error adapting roadmap:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 🎁 REAL-WORLD TREAT REDEMPTION ENDPOINTS
// ==========================================

// POST /api/treats/redeem — Server-side atomic redemption
app.post('/api/treats/redeem', async (req, res) => {
  const { userId = 'veer-01', treatId, cost } = req.body;
  if (!treatId || typeof cost !== 'number' || cost <= 0) {
    res.status(400).json({ success: false, error: 'treatId and positive cost are required' });
    return;
  }

  try {
    if (!mongoService.isAvailable()) {
      // No MongoDB — client handles it via localStorage
      res.json({ success: true, persisted: false, message: 'No MongoDB; local fallback used.' });
      return;
    }

    const db = (mongoService as any).db;
    if (!db) {
      res.json({ success: true, persisted: false, message: 'DB not ready' });
      return;
    }

    const users = db.collection('nudge_users');
    const redemptions = db.collection('nudge_redemptions');

    // Atomically decrement balance only if sufficient
    const result = await users.findOneAndUpdate(
      { userId, coinBalance: { $gte: cost } },
      {
        $inc: { coinBalance: -cost },
        $set: { updatedAt: new Date() },
        $setOnInsert: { userId, createdAt: new Date() },
      },
      { upsert: false, returnDocument: 'after' }
    );

    if (!result) {
      res.status(402).json({ success: false, error: 'Insufficient balance or user not found' });
      return;
    }

    // Log redemption
    await redemptions.insertOne({
      redemptionId: `rdm_${Date.now()}`,
      userId,
      treatId,
      cost,
      redeemedAt: new Date(),
    });

    res.json({ success: true, persisted: true, newBalance: result.coinBalance });
  } catch (err: any) {
    console.error('Treat redemption error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/user/score — Get user totalPoints and full profile from MongoDB
app.get('/api/user/score', async (req, res) => {
  const userId = (req.query.userId as string) || 'veer-01';
  try {
    if (!mongoService.isAvailable()) {
      res.json({ success: false, persisted: false, message: 'MongoDB not available' });
      return;
    }
    const db = (mongoService as any).db;
    const user = db ? await db.collection('nudge_users').findOne({ userId }) : null;
    if (!user) {
      res.json({ success: true, exists: false, totalPoints: 0, coinBalance: 0 });
      return;
    }
    res.json({
      success: true,
      exists: true,
      persisted: true,
      totalPoints: user.totalPoints ?? user.coinBalance ?? 0,
      coinBalance: user.coinBalance ?? user.totalPoints ?? 0,
      completedChallenges: user.completedChallenges || {},
      unlockedBadges: user.unlockedBadges || [],
      unlockedTreats: user.unlockedTreats || [],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/user/score — Save user totalPoints, challenges, and badges to MongoDB
app.post('/api/user/score', async (req, res) => {
  const {
    userId = 'veer-01',
    totalPoints,
    coinBalance,
    completedChallenges,
    unlockedBadges,
    unlockedTreats,
  } = req.body;

  const points = typeof totalPoints === 'number' ? totalPoints : typeof coinBalance === 'number' ? coinBalance : null;
  if (points === null) {
    res.status(400).json({ success: false, error: 'totalPoints or coinBalance number required' });
    return;
  }

  try {
    if (!mongoService.isAvailable()) {
      res.json({ success: false, persisted: false, message: 'MongoDB not available' });
      return;
    }
    const db = (mongoService as any).db;
    if (!db) {
      res.json({ success: false, persisted: false });
      return;
    }

    const updateDoc: Record<string, any> = {
      totalPoints: points,
      coinBalance: typeof coinBalance === 'number' ? coinBalance : points,
      updatedAt: new Date(),
    };
    if (completedChallenges) updateDoc.completedChallenges = completedChallenges;
    if (unlockedBadges) updateDoc.unlockedBadges = unlockedBadges;
    if (unlockedTreats) updateDoc.unlockedTreats = unlockedTreats;

    await db.collection('nudge_users').updateOne(
      { userId },
      { $set: updateDoc, $setOnInsert: { userId, createdAt: new Date() } },
      { upsert: true }
    );

    res.json({ success: true, persisted: true, totalPoints: points });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/treats/balance — Get user coin balance from MongoDB
app.get('/api/treats/balance', async (req, res) => {
  const userId = (req.query.userId as string) || 'veer-01';
  try {
    if (!mongoService.isAvailable()) {
      res.json({ balance: null, persisted: false });
      return;
    }
    const db = (mongoService as any).db;
    const user = db ? await db.collection('nudge_users').findOne({ userId }) : null;
    res.json({ balance: user?.coinBalance ?? user?.totalPoints ?? null, persisted: Boolean(user) });
  } catch (err: any) {
    res.json({ balance: null, error: err.message });
  }
});

// POST /api/treats/sync — Sync local balance to MongoDB
app.post('/api/treats/sync', async (req, res) => {
  const { userId = 'veer-01', coinBalance, totalPoints } = req.body;
  const balance = typeof coinBalance === 'number' ? coinBalance : totalPoints;
  if (typeof balance !== 'number') {
    res.status(400).json({ success: false, error: 'coinBalance required' });
    return;
  }
  try {
    if (!mongoService.isAvailable()) {
      res.json({ success: false, persisted: false });
      return;
    }
    const db = (mongoService as any).db;
    if (!db) { res.json({ success: false }); return; }
    await db.collection('nudge_users').updateOne(
      { userId },
      { $set: { coinBalance: balance, totalPoints: balance, updatedAt: new Date() }, $setOnInsert: { userId, createdAt: new Date() } },
      { upsert: true }
    );
    res.json({ success: true, persisted: true, balance });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve static frontend files in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

app.use(express.static(distPath));
// Express 5 compatible SPA fallback — no wildcard '*' parameter
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Nudge Veer Gemma Brain Server running on port ${PORT}`);
});

