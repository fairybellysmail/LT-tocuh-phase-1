import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Initialize SQLite database
const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "lifterstouch.db");
const db = new Database(dbPath);

// Enable WAL mode for performance
db.pragma("journal_mode = WAL");

export function initDatabase() {
  // Create tables if not exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      caption TEXT,
      imageUrl TEXT NOT NULL,
      category TEXT DEFAULT 'Community',
      date TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS programs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      impact TEXT NOT NULL,
      imageUrl TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS news (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      date TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT,
      imageUrl TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS homepage (
      id TEXT PRIMARY KEY DEFAULT 'main',
      badge TEXT,
      heroTitle TEXT,
      heroHighlight TEXT,
      heroDescription TEXT,
      primaryCta TEXT,
      secondaryCta TEXT,
      statsJson TEXT,
      aboutTitle TEXT,
      aboutDescription TEXT
    );

    CREATE TABLE IF NOT EXISTS social_accounts (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      accountName TEXT NOT NULL,
      handle TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active',
      autoPublish INTEGER DEFAULT 1,
      pageId TEXT,
      followerCount INTEGER DEFAULT 0,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS social_posts (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      imageUrl TEXT,
      targetPlatformsJson TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Published',
      publishedAt TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      shares INTEGER DEFAULT 0,
      engagementRate TEXT DEFAULT '0.0%'
    );
  `);

  // Seed Gallery if empty
  const galleryCount = db.prepare("SELECT COUNT(*) as count FROM gallery").get() as { count: number };
  if (galleryCount.count === 0) {
    const insertGallery = db.prepare(`
      INSERT INTO gallery (id, title, caption, imageUrl, category, date, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const initialGallery = [
      { id: '1', title: 'Community Workshop', caption: 'Hands-on skill building session with local neighborhood leaders.', imageUrl: 'https://picsum.photos/seed/gallery-1/800/800', category: 'Events', date: '2026-07-20' },
      { id: '2', title: 'Youth Mentorship Program', caption: 'Connecting young aspiring students with career mentors.', imageUrl: 'https://picsum.photos/seed/gallery-2/800/800', category: 'Education', date: '2026-07-15' },
      { id: '3', title: 'Urban Harvest & Garden', caption: 'Harvesting fresh organic produce for community health.', imageUrl: 'https://picsum.photos/seed/gallery-3/800/800', category: 'Sustainability', date: '2026-07-02' },
      { id: '4', title: 'Tech Literacy Bootcamp', caption: 'Equipping youth with coding and digital skills.', imageUrl: 'https://picsum.photos/seed/gallery-4/800/800', category: 'Education', date: '2026-06-28' },
      { id: '5', title: 'Food & Nutrition Relief', caption: 'Distributing weekly nutrition baskets to 300+ families.', imageUrl: 'https://picsum.photos/seed/gallery-5/800/800', category: 'Relief', date: '2026-06-18' },
      { id: '6', title: 'Neighborhood Cleanup Day', caption: 'Over 120 volunteers gathered to transform local parks.', imageUrl: 'https://picsum.photos/seed/gallery-6/800/800', category: 'Community', date: '2026-06-05' },
    ];

    for (const item of initialGallery) {
      insertGallery.run(item.id, item.title, item.caption, item.imageUrl, item.category, item.date, new Date().toISOString());
    }
  }

  // Seed Programs if empty
  const programsCount = db.prepare("SELECT COUNT(*) as count FROM programs").get() as { count: number };
  if (programsCount.count === 0) {
    const insertProgram = db.prepare(`
      INSERT INTO programs (id, name, category, description, impact, imageUrl, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const initialPrograms = [
      {
        id: 'youth-mentorship',
        name: 'Youth Mentorship & Leadership',
        category: 'Education',
        description: 'Pairing high school youth with experienced industry mentors for career guidance, college prep, and life skills training.',
        impact: 'Over 500 students mentored annually with 94% college acceptance.',
        imageUrl: 'https://picsum.photos/seed/youth-mentorship/600/600',
      },
      {
        id: 'urban-farming',
        name: 'Urban Agriculture & Nutrition',
        category: 'Sustainability',
        description: 'Establishing community-managed gardens and hydroponic centers in food deserts to build food independence.',
        impact: '10+ tons of fresh organic produce harvested yearly for local families.',
        imageUrl: 'https://picsum.photos/seed/urban-farming/600/600',
      },
      {
        id: 'tech-literacy',
        name: 'Digital Empowerment & Tech Skills',
        category: 'Technology',
        description: 'Providing free laptop access, web development bootcamps, and digital literacy training to bridge the tech divide.',
        impact: '350 graduates placed in junior tech roles or freelance work.',
        imageUrl: 'https://picsum.photos/seed/tech-literacy/600/600',
      },
    ];

    for (const prog of initialPrograms) {
      insertProgram.run(prog.id, prog.name, prog.category, prog.description, prog.impact, prog.imageUrl, new Date().toISOString());
    }
  }

  // Seed News if empty
  const newsCount = db.prepare("SELECT COUNT(*) as count FROM news").get() as { count: number };
  if (newsCount.count === 0) {
    const insertNews = db.prepare(`
      INSERT INTO news (id, title, author, date, excerpt, content, imageUrl, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialNews = [
      {
        id: '1',
        title: 'New Community Center Opening in Downtown Hub',
        author: 'Sarah Johnson',
        date: 'Oct 12, 2025',
        excerpt: 'We are thrilled to announce the grand opening of our newest facility, equipped with STEM labs and youth wellness rooms.',
        content: 'LiftersTouch has expanded into a brand new 12,000 sq ft facility downtown. The hub includes digital technology labs, interactive study rooms, and clean kitchen spaces designed to host over 500 local families weekly.',
        imageUrl: 'https://picsum.photos/seed/news-1/600/400',
      },
      {
        id: '2',
        title: 'Annual Impact Report 2025 Released',
        author: 'Michael Chen',
        date: 'Sep 28, 2025',
        excerpt: 'Our latest annual report demonstrates a 25% increase in youth program participation and record community health outcomes.',
        content: 'Through generous donor contributions and partner grants, LiftersTouch hit unprecedented milestones in 2025, reaching 15 cities and expanding healthcare and education support to over 10,000 direct beneficiaries.',
        imageUrl: 'https://picsum.photos/seed/news-2/600/400',
      },
      {
        id: '3',
        title: 'Volunteer Spotlight: Meet Our Regional Leaders',
        author: 'Elena Rodriguez',
        date: 'Sep 15, 2025',
        excerpt: 'Highlighting the tireless dedication of over 120 grassroots volunteers powering our weekend food distribution drives.',
        content: 'Our volunteers are the heartbeat of LiftersTouch. This month we celebrate Elena and her team who organized weekend distribution drives across 6 districts during extreme weather conditions.',
        imageUrl: 'https://picsum.photos/seed/news-3/600/400',
      },
    ];

    for (const item of initialNews) {
      insertNews.run(item.id, item.title, item.author, item.date, item.excerpt, item.content, item.imageUrl, new Date().toISOString());
    }
  }

  // Seed Homepage if empty
  const hpCount = db.prepare("SELECT COUNT(*) as count FROM homepage").get() as { count: number };
  if (hpCount.count === 0) {
    const initialStats = JSON.stringify([
      { label: "Programs Active", value: "50+" },
      { label: "Cities Reached", value: "15" },
      { label: "Raised & Distributed", value: "$1.2M" },
      { label: "Transparency Index", value: "100%" }
    ]);

    db.prepare(`
      INSERT INTO homepage (id, badge, heroTitle, heroHighlight, heroDescription, primaryCta, secondaryCta, statsJson, aboutTitle, aboutDescription)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'main',
      'Phase-1 Active Expansion',
      'Empowering Communities Through LiftersTouch',
      'LiftersTouch',
      'We provide the tools, resources, and support needed to uplift individuals and transform neighborhoods. Join our mission to create lasting impact.',
      'Our Programs',
      'Support Our Mission',
      initialStats,
      'Our LiftersTouch Mission',
      'Founded on the belief that everyone deserves a chance to thrive, LiftersTouch works tirelessly to bridge the gap between human potential and opportunity.'
    );
  }

  // Seed Social Accounts if empty
  const socialAccCount = db.prepare("SELECT COUNT(*) as count FROM social_accounts").get() as { count: number };
  if (socialAccCount.count === 0) {
    const insertAccount = db.prepare(`
      INSERT INTO social_accounts (id, platform, accountName, handle, status, autoPublish, pageId, followerCount, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialAccounts = [
      { id: 'fb-1', platform: 'Facebook', accountName: 'LiftersTouch Official Page', handle: '@LiftersTouchOrg', status: 'Active', autoPublish: 1, pageId: '1098472910384', followerCount: 14200 },
      { id: 'tw-1', platform: 'Twitter / X', accountName: 'LiftersTouch X Channel', handle: '@LiftersTouch', status: 'Active', autoPublish: 1, pageId: '984102941', followerCount: 8900 },
      { id: 'ig-1', platform: 'Instagram', accountName: 'LiftersTouch Community', handle: '@lifterstouch.official', status: 'Active', autoPublish: 1, pageId: 'ig_9482019482', followerCount: 22500 },
      { id: 'li-1', platform: 'LinkedIn', accountName: 'LiftersTouch Foundation', handle: 'company/lifterstouch', status: 'Active', autoPublish: 1, pageId: 'li_88392019', followerCount: 5100 },
      { id: 'th-1', platform: 'Threads', accountName: 'LiftersTouch Threads', handle: '@lifterstouch.official', status: 'Disconnected', autoPublish: 0, pageId: 'th_000000', followerCount: 1200 },
    ];

    for (const acc of initialAccounts) {
      insertAccount.run(acc.id, acc.platform, acc.accountName, acc.handle, acc.status, acc.autoPublish, acc.pageId, acc.followerCount, new Date().toISOString());
    }
  }

  // Seed Social Posts if empty
  const socialPostsCount = db.prepare("SELECT COUNT(*) as count FROM social_posts").get() as { count: number };
  if (socialPostsCount.count === 0) {
    const insertPost = db.prepare(`
      INSERT INTO social_posts (id, content, imageUrl, targetPlatformsJson, status, publishedAt, likes, shares, engagementRate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialPosts = [
      {
        id: 'post-101',
        content: '🎉 Thrilled to announce our new Downtown Community Center opening! Over 500 families will have access to youth mentorship, STEM labs, and health resources. #LiftersTouch #CommunityFirst #NonprofitImpact',
        imageUrl: 'https://picsum.photos/seed/news-1/600/400',
        targetPlatformsJson: JSON.stringify(['Facebook', 'Twitter / X', 'LinkedIn', 'Instagram']),
        status: 'Published',
        publishedAt: '2026-08-01T14:30:00Z',
        likes: 342,
        shares: 88,
        engagementRate: '4.8%'
      },
      {
        id: 'post-102',
        content: '🌱 Our Urban Farming initiative harvested over 500 lbs of fresh vegetables this week! Together we are building sustainable, food-secure neighborhoods. 🥦🍎 #Sustainability #FoodRelief #UrbanAgriculture',
        imageUrl: 'https://picsum.photos/seed/gallery-3/800/800',
        targetPlatformsJson: JSON.stringify(['Facebook', 'Instagram']),
        status: 'Published',
        publishedAt: '2026-07-28T09:15:00Z',
        likes: 215,
        shares: 42,
        engagementRate: '3.9%'
      }
    ];

    for (const p of initialPosts) {
      insertPost.run(p.id, p.content, p.imageUrl, p.targetPlatformsJson, p.status, p.publishedAt, p.likes, p.shares, p.engagementRate);
    }
  }
}

export { db };
