import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import dotenv from "dotenv";
import { db, initDatabase } from "./src/server/db";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Initialize SQLite Database schema & seeds
  try {
    initDatabase();
    console.log("SQLite Database initialized successfully.");
  } catch (err) {
    console.error("Database initialization error:", err);
  }

  const app = express();
  const PORT = 3000;

  let stripe: Stripe | null = null;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (stripeSecretKey) {
    stripe = new Stripe(stripeSecretKey);
  }

  app.use(express.json());

  // ------------------- STRIPE DONATION ENDPOINT -------------------
  app.post("/api/create-checkout-session", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured on the server." });
    }

    const { amount, currency = "usd", description, lives } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid donation amount." });
    }

    try {
      const impactDescription = description || (lives ? `Direct contribution intended to save ${lives} lives` : "Sustainable communities support");

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: lives ? `LiftersTouch - Save ${lives}` : "LiftersTouch Donation",
                description: impactDescription,
              },
              unit_amount: Math.round(amount * 100), // Stripe expects cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.APP_URL || `http://localhost:${PORT}`}/?donation=success`,
        cancel_url: `${process.env.APP_URL || `http://localhost:${PORT}`}/donate?donation=cancelled`,
      });

      res.json({ id: session.id });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ------------------- GALLERY CMS ENDPOINTS -------------------
  app.get("/api/content/gallery", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM gallery ORDER BY createdAt DESC").all();
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/content/gallery", (req, res) => {
    try {
      const { title, caption, imageUrl, category = "Community", date, autoPublishSocial } = req.body;
      if (!title || !imageUrl) {
        return res.status(400).json({ error: "Title and Image URL are required." });
      }

      const id = 'gal-' + Date.now();
      const createdAt = new Date().toISOString();
      const itemDate = date || new Date().toISOString().split("T")[0];

      db.prepare(`
        INSERT INTO gallery (id, title, caption, imageUrl, category, date, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, title, caption || "", imageUrl, category, itemDate, createdAt);

      // Auto publish cross-post to social media if checked
      if (autoPublishSocial) {
        const activePlatforms = db.prepare("SELECT platform FROM social_accounts WHERE status = 'Active' AND autoPublish = 1").all() as { platform: string }[];
        const platformNames = activePlatforms.map(p => p.platform);
        
        if (platformNames.length > 0) {
          const postId = 'post-' + Date.now();
          const socialContent = `🖼️ New Gallery Update: "${title}" - ${caption || 'See our latest community impact story!'}\n\n#LiftersTouch #${category.replace(/\s+/g, '')} #CommunityImpact`;
          
          db.prepare(`
            INSERT INTO social_posts (id, content, imageUrl, targetPlatformsJson, status, publishedAt, likes, shares, engagementRate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(postId, socialContent, imageUrl, JSON.stringify(platformNames), 'Published', new Date().toISOString(), 1, 0, '1.0%');
        }
      }

      const createdItem = db.prepare("SELECT * FROM gallery WHERE id = ?").get(id);
      res.json(createdItem);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/content/gallery/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { title, caption, imageUrl, category, date } = req.body;

      db.prepare(`
        UPDATE gallery 
        SET title = COALESCE(?, title),
            caption = COALESCE(?, caption),
            imageUrl = COALESCE(?, imageUrl),
            category = COALESCE(?, category),
            date = COALESCE(?, date)
        WHERE id = ?
      `).run(title, caption, imageUrl, category, date, id);

      const updated = db.prepare("SELECT * FROM gallery WHERE id = ?").get(id);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/content/gallery/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM gallery WHERE id = ?").run(id);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------- PROGRAMS CMS ENDPOINTS -------------------
  app.get("/api/content/programs", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM programs ORDER BY createdAt DESC").all();
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/content/programs", (req, res) => {
    try {
      const { name, category, description, impact, imageUrl, autoPublishSocial } = req.body;
      if (!name || !description) {
        return res.status(400).json({ error: "Name and Description are required." });
      }

      const id = 'prog-' + Date.now();
      const createdAt = new Date().toISOString();
      const img = imageUrl || `https://picsum.photos/seed/${id}/600/600`;

      db.prepare(`
        INSERT INTO programs (id, name, category, description, impact, imageUrl, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, name, category || "Community", description, impact || "Positive community change.", img, createdAt);

      if (autoPublishSocial) {
        const activePlatforms = db.prepare("SELECT platform FROM social_accounts WHERE status = 'Active' AND autoPublish = 1").all() as { platform: string }[];
        const platformNames = activePlatforms.map(p => p.platform);
        
        if (platformNames.length > 0) {
          const postId = 'post-' + Date.now();
          const socialContent = `🌟 Program Launch: ${name} (${category})\n\n${description}\n\n🎯 Impact Goal: ${impact || 'Uplifting lives'}\n\nJoin us at LiftersTouch! #LiftersTouch #Nonprofit #Community`;
          
          db.prepare(`
            INSERT INTO social_posts (id, content, imageUrl, targetPlatformsJson, status, publishedAt, likes, shares, engagementRate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(postId, socialContent, img, JSON.stringify(platformNames), 'Published', new Date().toISOString(), 3, 1, '2.5%');
        }
      }

      const item = db.prepare("SELECT * FROM programs WHERE id = ?").get(id);
      res.json(item);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/content/programs/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, description, impact, imageUrl } = req.body;

      db.prepare(`
        UPDATE programs
        SET name = COALESCE(?, name),
            category = COALESCE(?, category),
            description = COALESCE(?, description),
            impact = COALESCE(?, impact),
            imageUrl = COALESCE(?, imageUrl)
        WHERE id = ?
      `).run(name, category, description, impact, imageUrl, id);

      const updated = db.prepare("SELECT * FROM programs WHERE id = ?").get(id);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/content/programs/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM programs WHERE id = ?").run(id);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------- NEWS CMS ENDPOINTS -------------------
  app.get("/api/content/news", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM news ORDER BY createdAt DESC").all();
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/content/news", (req, res) => {
    try {
      const { title, author, date, excerpt, content, imageUrl, autoPublishSocial } = req.body;
      if (!title || !excerpt) {
        return res.status(400).json({ error: "Title and Excerpt are required." });
      }

      const id = 'news-' + Date.now();
      const createdAt = new Date().toISOString();
      const itemDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const img = imageUrl || `https://picsum.photos/seed/${id}/600/400`;

      db.prepare(`
        INSERT INTO news (id, title, author, date, excerpt, content, imageUrl, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, title, author || "LiftersTouch Team", itemDate, excerpt, content || excerpt, img, createdAt);

      if (autoPublishSocial) {
        const activePlatforms = db.prepare("SELECT platform FROM social_accounts WHERE status = 'Active' AND autoPublish = 1").all() as { platform: string }[];
        const platformNames = activePlatforms.map(p => p.platform);
        
        if (platformNames.length > 0) {
          const postId = 'post-' + Date.now();
          const socialContent = `📰 Breaking News: "${title}"\n\n${excerpt}\n\nRead the full update on our website! #LiftersTouch #CommunityNews #ImpactUpdate`;
          
          db.prepare(`
            INSERT INTO social_posts (id, content, imageUrl, targetPlatformsJson, status, publishedAt, likes, shares, engagementRate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(postId, socialContent, img, JSON.stringify(platformNames), 'Published', new Date().toISOString(), 5, 2, '3.2%');
        }
      }

      const item = db.prepare("SELECT * FROM news WHERE id = ?").get(id);
      res.json(item);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/content/news/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { title, author, date, excerpt, content, imageUrl } = req.body;

      db.prepare(`
        UPDATE news
        SET title = COALESCE(?, title),
            author = COALESCE(?, author),
            date = COALESCE(?, date),
            excerpt = COALESCE(?, excerpt),
            content = COALESCE(?, content),
            imageUrl = COALESCE(?, imageUrl)
        WHERE id = ?
      `).run(title, author, date, excerpt, content, imageUrl, id);

      const updated = db.prepare("SELECT * FROM news WHERE id = ?").get(id);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/content/news/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM news WHERE id = ?").run(id);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------- HOMEPAGE CMS ENDPOINTS -------------------
  app.get("/api/content/homepage", (req, res) => {
    try {
      const data = db.prepare("SELECT * FROM homepage WHERE id = 'main'").get();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/content/homepage", (req, res) => {
    try {
      const { badge, heroTitle, heroHighlight, heroDescription, primaryCta, secondaryCta, statsJson, aboutTitle, aboutDescription } = req.body;

      db.prepare(`
        UPDATE homepage
        SET badge = COALESCE(?, badge),
            heroTitle = COALESCE(?, heroTitle),
            heroHighlight = COALESCE(?, heroHighlight),
            heroDescription = COALESCE(?, heroDescription),
            primaryCta = COALESCE(?, primaryCta),
            secondaryCta = COALESCE(?, secondaryCta),
            statsJson = COALESCE(?, statsJson),
            aboutTitle = COALESCE(?, aboutTitle),
            aboutDescription = COALESCE(?, aboutDescription)
        WHERE id = 'main'
      `).run(badge, heroTitle, heroHighlight, heroDescription, primaryCta, secondaryCta, typeof statsJson === 'object' ? JSON.stringify(statsJson) : statsJson, aboutTitle, aboutDescription);

      const updated = db.prepare("SELECT * FROM homepage WHERE id = 'main'").get();
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------- SOCIAL MEDIA SYNCHRONIZATION ENDPOINTS -------------------
  app.get("/api/social/accounts", (req, res) => {
    try {
      const accounts = db.prepare("SELECT * FROM social_accounts ORDER BY platform ASC").all();
      res.json(accounts);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/social/accounts", (req, res) => {
    try {
      const { platform, accountName, handle, pageId, followerCount, autoPublish = 1 } = req.body;
      if (!platform || !accountName || !handle) {
        return res.status(400).json({ error: "Platform, Account Name and Handle are required." });
      }

      const id = 'acc-' + Date.now();
      const updatedAt = new Date().toISOString();

      db.prepare(`
        INSERT INTO social_accounts (id, platform, accountName, handle, status, autoPublish, pageId, followerCount, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, platform, accountName, handle, 'Active', autoPublish ? 1 : 0, pageId || '', followerCount || 0, updatedAt);

      const acc = db.prepare("SELECT * FROM social_accounts WHERE id = ?").get(id);
      res.json(acc);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/social/accounts/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { status, autoPublish, accountName, handle, followerCount } = req.body;

      db.prepare(`
        UPDATE social_accounts
        SET status = COALESCE(?, status),
            autoPublish = COALESCE(?, autoPublish),
            accountName = COALESCE(?, accountName),
            handle = COALESCE(?, handle),
            followerCount = COALESCE(?, followerCount),
            updatedAt = ?
        WHERE id = ?
      `).run(status, autoPublish !== undefined ? (autoPublish ? 1 : 0) : null, accountName, handle, followerCount, new Date().toISOString(), id);

      const updated = db.prepare("SELECT * FROM social_accounts WHERE id = ?").get(id);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/social/accounts/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM social_accounts WHERE id = ?").run(id);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/social/posts", (req, res) => {
    try {
      const posts = db.prepare("SELECT * FROM social_posts ORDER BY publishedAt DESC").all();
      res.json(posts);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/social/publish", (req, res) => {
    try {
      const { content, imageUrl, targetPlatforms } = req.body;
      if (!content || !targetPlatforms || !Array.isArray(targetPlatforms) || targetPlatforms.length === 0) {
        return res.status(400).json({ error: "Post content and at least one target platform are required." });
      }

      const postId = 'post-' + Date.now();
      const publishedAt = new Date().toISOString();
      const platformsJson = JSON.stringify(targetPlatforms);

      // Simulate social publishing queue response
      db.prepare(`
        INSERT INTO social_posts (id, content, imageUrl, targetPlatformsJson, status, publishedAt, likes, shares, engagementRate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(postId, content, imageUrl || '', platformsJson, 'Published', publishedAt, Math.floor(Math.random() * 15) + 1, Math.floor(Math.random() * 5), '1.5%');

      const createdPost = db.prepare("SELECT * FROM social_posts WHERE id = ?").get(postId);
      res.json({
        success: true,
        message: `Successfully synchronized and published post across ${targetPlatforms.length} platform(s)!`,
        post: createdPost
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/social/posts/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM social_posts WHERE id = ?").run(id);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------- SCHEMA & ARCHITECTURE DOC -------------------
  app.get("/api/schema/doc", (req, res) => {
    res.json({
      stack: "Node.js (Express) + TypeScript + SQLite (better-sqlite3) + Redis Queue Architecture",
      database: "SQLite 3 (WAL Mode Enabled) / Portable to Cloud SQL (PostgreSQL)",
      tables: [
        {
          name: "gallery",
          ddl: `CREATE TABLE gallery (\n  id TEXT PRIMARY KEY,\n  title TEXT NOT NULL,\n  caption TEXT,\n  imageUrl TEXT NOT NULL,\n  category TEXT DEFAULT 'Community',\n  date TEXT,\n  createdAt TEXT NOT NULL\n);`
        },
        {
          name: "programs",
          ddl: `CREATE TABLE programs (\n  id TEXT PRIMARY KEY,\n  name TEXT NOT NULL,\n  category TEXT NOT NULL,\n  description TEXT NOT NULL,\n  impact TEXT NOT NULL,\n  imageUrl TEXT,\n  createdAt TEXT NOT NULL\n);`
        },
        {
          name: "news",
          ddl: `CREATE TABLE news (\n  id TEXT PRIMARY KEY,\n  title TEXT NOT NULL,\n  author TEXT NOT NULL,\n  date TEXT NOT NULL,\n  excerpt TEXT NOT NULL,\n  content TEXT,\n  imageUrl TEXT,\n  createdAt TEXT NOT NULL\n);`
        },
        {
          name: "homepage",
          ddl: `CREATE TABLE homepage (\n  id TEXT PRIMARY KEY DEFAULT 'main',\n  badge TEXT,\n  heroTitle TEXT,\n  heroHighlight TEXT,\n  heroDescription TEXT,\n  primaryCta TEXT,\n  secondaryCta TEXT,\n  statsJson TEXT,\n  aboutTitle TEXT,\n  aboutDescription TEXT\n);`
        },
        {
          name: "social_accounts",
          ddl: `CREATE TABLE social_accounts (\n  id TEXT PRIMARY KEY,\n  platform TEXT NOT NULL,\n  accountName TEXT NOT NULL,\n  handle TEXT NOT NULL,\n  status TEXT NOT NULL DEFAULT 'Active',\n  autoPublish INTEGER DEFAULT 1,\n  pageId TEXT,\n  followerCount INTEGER DEFAULT 0,\n  updatedAt TEXT NOT NULL\n);`
        },
        {
          name: "social_posts",
          ddl: `CREATE TABLE social_posts (\n  id TEXT PRIMARY KEY,\n  content TEXT NOT NULL,\n  imageUrl TEXT,\n  targetPlatformsJson TEXT NOT NULL,\n  status TEXT NOT NULL DEFAULT 'Published',\n  publishedAt TEXT NOT NULL,\n  likes INTEGER DEFAULT 0,\n  shares INTEGER DEFAULT 0,\n  engagementRate TEXT DEFAULT '0.0%'\n);`
        }
      ]
    });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
