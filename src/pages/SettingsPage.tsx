import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, LayoutDashboard, Image as ImageIcon, BookOpen, Newspaper, Home, 
  Share2, Database, Plus, Trash2, Edit3, CheckCircle2, AlertCircle, RefreshCw, 
  Sparkles, Globe, Shield, ExternalLink, Send, Facebook, Twitter, Instagram, Linkedin,
  Layers, Copy, Check, Sliders, Zap
} from 'lucide-react';

// Types
interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: string;
  date: string;
}

interface ProgramItem {
  id: string;
  name: string;
  category: string;
  description: string;
  impact: string;
  imageUrl?: string;
}

interface NewsItem {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
}

interface HomepageData {
  badge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  primaryCta: string;
  secondaryCta: string;
  statsJson: string;
  aboutTitle: string;
  aboutDescription: string;
}

interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
  handle: string;
  status: 'Active' | 'Disconnected' | 'Syncing';
  autoPublish: number;
  pageId?: string;
  followerCount?: number;
}

interface SocialPost {
  id: string;
  content: string;
  imageUrl?: string;
  targetPlatformsJson: string;
  status: string;
  publishedAt: string;
  likes: number;
  shares: number;
  engagementRate: string;
}

export default function SettingsPage() {
  const ADMIN_PASSWORD = 'liftersadmincentre@1';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('lifters_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('lifters_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Incorrect password. Please enter the valid admin password.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lifters_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const [activeTab, setActiveTab] = useState<'cms' | 'social' | 'backend'>('cms');
  const [cmsSubTab, setCmsSubTab] = useState<'gallery' | 'programs' | 'news' | 'homepage'>('gallery');

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Data States
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [programsList, setProgramsList] = useState<ProgramItem[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);

  const [loading, setLoading] = useState(true);

  // Forms Modal state
  const [showModal, setShowModal] = useState<string | null>(null); // 'add-gallery', 'edit-gallery', etc.
  const [editingItem, setEditingItem] = useState<any>(null);

  // Cross Post Publisher state
  const [postContent, setPostContent] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Facebook', 'Twitter / X', 'LinkedIn']);
  const [previewPlatform, setPreviewPlatform] = useState<string>('Facebook');
  const [isPublishing, setIsPublishing] = useState(false);

  // Form Fields
  const [galleryForm, setGalleryForm] = useState({ title: '', caption: '', imageUrl: '', category: 'Community', date: '', autoPublishSocial: true });
  const [programForm, setProgramForm] = useState({ name: '', category: 'Education', description: '', impact: '', imageUrl: '', autoPublishSocial: true });
  const [newsForm, setNewsForm] = useState({ title: '', author: 'LiftersTouch Team', date: '', excerpt: '', content: '', imageUrl: '', autoPublishSocial: true });
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [galRes, progRes, newsRes, hpRes, accRes, postRes] = await Promise.all([
        fetch('/api/content/gallery'),
        fetch('/api/content/programs'),
        fetch('/api/content/news'),
        fetch('/api/content/homepage'),
        fetch('/api/social/accounts'),
        fetch('/api/social/posts'),
      ]);

      if (galRes.ok) setGalleryList(await galRes.json());
      if (progRes.ok) setProgramsList(await progRes.json());
      if (newsRes.ok) setNewsList(await newsRes.json());
      if (hpRes.ok) setHomepageData(await hpRes.json());
      if (accRes.ok) setSocialAccounts(await accRes.json());
      if (postRes.ok) setSocialPosts(await postRes.json());
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      showToast('Failed to load server data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- HANDLERS ----------------
  const handleSaveGallery = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await fetch(`/api/content/gallery/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(galleryForm),
        });
        if (res.ok) {
          showToast('Gallery item updated successfully!');
          setShowModal(null);
          fetchAllData();
        }
      } else {
        const res = await fetch('/api/content/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(galleryForm),
        });
        if (res.ok) {
          showToast('New gallery item added' + (galleryForm.autoPublishSocial ? ' and cross-published to social!' : '!'));
          setShowModal(null);
          setGalleryForm({ title: '', caption: '', imageUrl: '', category: 'Community', date: '', autoPublishSocial: true });
          fetchAllData();
        }
      }
    } catch (err) {
      showToast('Failed to save gallery item', 'error');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      const res = await fetch(`/api/content/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Gallery item deleted');
        fetchAllData();
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const handleSaveProgram = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await fetch(`/api/content/programs/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(programForm),
        });
        if (res.ok) {
          showToast('Program updated!');
          setShowModal(null);
          fetchAllData();
        }
      } else {
        const res = await fetch('/api/content/programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(programForm),
        });
        if (res.ok) {
          showToast('New program created!');
          setShowModal(null);
          setProgramForm({ name: '', category: 'Education', description: '', impact: '', imageUrl: '', autoPublishSocial: true });
          fetchAllData();
        }
      }
    } catch (err) {
      showToast('Failed to save program', 'error');
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    try {
      const res = await fetch(`/api/content/programs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Program deleted');
        fetchAllData();
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const handleSaveNews = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await fetch(`/api/content/news/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsForm),
        });
        if (res.ok) {
          showToast('Article updated!');
          setShowModal(null);
          fetchAllData();
        }
      } else {
        const res = await fetch('/api/content/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsForm),
        });
        if (res.ok) {
          showToast('Article published' + (newsForm.autoPublishSocial ? ' and synced to social media!' : '!'));
          setShowModal(null);
          setNewsForm({ title: '', author: 'LiftersTouch Team', date: '', excerpt: '', content: '', imageUrl: '', autoPublishSocial: true });
          fetchAllData();
        }
      }
    } catch (err) {
      showToast('Failed to save article', 'error');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      const res = await fetch(`/api/content/news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Article removed');
        fetchAllData();
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const handleSaveHomepage = async (e: FormEvent) => {
    e.preventDefault();
    if (!homepageData) return;
    try {
      const res = await fetch('/api/content/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homepageData),
      });
      if (res.ok) {
        showToast('Homepage hero content updated successfully!');
      }
    } catch (err) {
      showToast('Failed to update homepage', 'error');
    }
  };

  const toggleSocialAutoPublish = async (accId: string, currentVal: number) => {
    try {
      const res = await fetch(`/api/social/accounts/${accId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoPublish: currentVal === 1 ? 0 : 1 }),
      });
      if (res.ok) {
        showToast('Social sync settings updated');
        fetchAllData();
      }
    } catch (err) {
      showToast('Failed to update setting', 'error');
    }
  };

  const handlePublishSocialPost = async (e: FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) {
      showToast('Please enter message text for the social post.', 'error');
      return;
    }
    if (selectedPlatforms.length === 0) {
      showToast('Please select at least one social media channel.', 'error');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: postContent,
          imageUrl: postImageUrl,
          targetPlatforms: selectedPlatforms,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Post cross-published successfully!');
        setPostContent('');
        setPostImageUrl('');
        fetchAllData();
      } else {
        showToast(data.error || 'Publish failed', 'error');
      }
    } catch (err) {
      showToast('Connection error during post broadcast.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const togglePlatformSelection = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-brand-alt-bg/40 flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8 bg-white shadow-xl border border-black/10 rounded-brand text-center">
          <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Admin Security Gate</h2>
          <p className="text-sm text-brand-muted mb-6">
            Please enter the admin password to access LiftersTouch Settings.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1.5 uppercase tracking-wider">
                Admin Password
              </label>
              <input 
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-brand border border-black/15 focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm font-semibold"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-brand text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-500" />
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold shadow-md hover:shadow-lg"
            >
              Unlock Settings
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-black/5 text-xs text-brand-muted">
            Authorized Personnel Only • LiftersTouch
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-brand-alt-bg/40 min-h-screen">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 p-4 rounded-brand shadow-xl flex items-center gap-3 border ${
          toast.type === 'success' ? 'bg-emerald-900 text-white border-emerald-700' : 'bg-rose-900 text-white border-rose-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <AlertCircle className="h-5 w-5 text-rose-400" />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="container-page">
        {/* Top Header Banner */}
        <div className="bg-white rounded-brand border border-black/10 p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  Admin Workspace
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> SQLite Engine Active
                </span>
              </div>
              <h1 className="text-3xl font-bold text-brand-text">LiftersTouch CMS & Social Sync Hub</h1>
              <p className="text-sm text-brand-muted mt-1">
                Dynamically manage gallery stories, programs, news articles, and sync cross-platform social broadcasts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={fetchAllData}
                className="btn-secondary text-xs flex items-center gap-2 py-2"
                title="Refresh Data from Server"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
              <button 
                onClick={handleLogout}
                className="btn-secondary text-xs flex items-center gap-1.5 py-2 text-rose-600 hover:bg-rose-50 border-rose-200"
                title="Log Out"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-black/5">
            <button
              onClick={() => setActiveTab('cms')}
              className={`px-5 py-2.5 rounded-brand text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'cms'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'bg-black/5 text-brand-text hover:bg-black/10'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Content Manager (CMS)
            </button>

            <button
              onClick={() => setActiveTab('social')}
              className={`px-5 py-2.5 rounded-brand text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'social'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'bg-black/5 text-brand-text hover:bg-black/10'
              }`}
            >
              <Share2 className="h-4 w-4" /> Social Media Sync Hub
              <span className="ml-1 px-1.5 py-0.2 bg-brand-accent text-white rounded-full text-[10px]">
                {socialAccounts.filter(a => a.status === 'Active').length} Active
              </span>
            </button>

            <button
              onClick={() => setActiveTab('backend')}
              className={`px-5 py-2.5 rounded-brand text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'backend'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'bg-black/5 text-brand-text hover:bg-black/10'
              }`}
            >
              <Database className="h-4 w-4" /> Backend Architecture & Scheme
            </button>
          </div>
        </div>

        {/* ----------------- TAB 1: CONTENT MANAGER (CMS) ----------------- */}
        {activeTab === 'cms' && (
          <div className="space-y-6">
            {/* Sub-navigation bar */}
            <div className="bg-white rounded-brand border border-black/10 p-2 flex flex-wrap gap-2">
              <button
                onClick={() => setCmsSubTab('gallery')}
                className={`px-4 py-2 rounded-brand text-xs font-bold flex items-center gap-2 transition-all ${
                  cmsSubTab === 'gallery' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'text-brand-muted hover:text-black'
                }`}
              >
                <ImageIcon className="h-4 w-4" /> Gallery Images ({galleryList.length})
              </button>
              <button
                onClick={() => setCmsSubTab('programs')}
                className={`px-4 py-2 rounded-brand text-xs font-bold flex items-center gap-2 transition-all ${
                  cmsSubTab === 'programs' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'text-brand-muted hover:text-black'
                }`}
              >
                <BookOpen className="h-4 w-4" /> Impact Programs ({programsList.length})
              </button>
              <button
                onClick={() => setCmsSubTab('news')}
                className={`px-4 py-2 rounded-brand text-xs font-bold flex items-center gap-2 transition-all ${
                  cmsSubTab === 'news' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'text-brand-muted hover:text-black'
                }`}
              >
                <Newspaper className="h-4 w-4" /> News Articles ({newsList.length})
              </button>
              <button
                onClick={() => setCmsSubTab('homepage')}
                className={`px-4 py-2 rounded-brand text-xs font-bold flex items-center gap-2 transition-all ${
                  cmsSubTab === 'homepage' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'text-brand-muted hover:text-black'
                }`}
              >
                <Home className="h-4 w-4" /> Homepage Hero & Sections
              </button>
            </div>

            {/* GALLERY CMS */}
            {cmsSubTab === 'gallery' && (
              <div className="bg-white rounded-brand border border-black/10 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Manage Gallery Content</h2>
                    <p className="text-xs text-brand-muted">
                      Add, edit, or remove photos shown on the public Gallery page.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setGalleryForm({ title: '', caption: '', imageUrl: 'https://picsum.photos/seed/gallery-new/800/800', category: 'Community', date: new Date().toISOString().split('T')[0], autoPublishSocial: true });
                      setShowModal('gallery');
                    }}
                    className="btn-primary text-xs flex items-center gap-2 py-2.5"
                  >
                    <Plus className="h-4 w-4" /> Add Gallery Image
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryList.map((item) => (
                    <div key={item.id} className="border border-black/10 rounded-brand overflow-hidden group hover:shadow-md transition-shadow bg-white">
                      <div className="aspect-video relative overflow-hidden bg-black/5">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-white rounded text-[10px] font-bold">
                          {item.category || 'Community'}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-base mb-1 truncate">{item.title}</h4>
                        <p className="text-xs text-brand-muted line-clamp-2 mb-4">{item.caption || 'No caption provided.'}</p>
                        <div className="flex justify-between items-center pt-3 border-t border-black/5 text-xs">
                          <span className="text-brand-muted text-[11px]">{item.date}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setGalleryForm({
                                  title: item.title,
                                  caption: item.caption,
                                  imageUrl: item.imageUrl,
                                  category: item.category || 'Community',
                                  date: item.date || '',
                                  autoPublishSocial: false,
                                });
                                setShowModal('gallery');
                              }}
                              className="p-1.5 text-brand-primary hover:bg-brand-primary/10 rounded"
                              title="Edit"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteGallery(item.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROGRAMS CMS */}
            {cmsSubTab === 'programs' && (
              <div className="bg-white rounded-brand border border-black/10 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Manage Impact Programs</h2>
                    <p className="text-xs text-brand-muted">
                      Add and update core social initiatives displayed on the Programs page.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setProgramForm({ name: '', category: 'Education', description: '', impact: '', imageUrl: 'https://picsum.photos/seed/prog-new/600/600', autoPublishSocial: true });
                      setShowModal('program');
                    }}
                    className="btn-primary text-xs flex items-center gap-2 py-2.5"
                  >
                    <Plus className="h-4 w-4" /> Add New Program
                  </button>
                </div>

                <div className="space-y-4">
                  {programsList.map((prog) => (
                    <div key={prog.id} className="p-4 border border-black/10 rounded-brand flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-brand-primary/40 transition-colors">
                      <div className="flex items-center gap-4">
                        <img src={prog.imageUrl || `https://picsum.photos/seed/${prog.id}/100/100`} alt={prog.name} className="w-16 h-16 rounded-brand object-cover flex-shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded mb-1 inline-block">
                            {prog.category}
                          </span>
                          <h4 className="font-bold text-lg">{prog.name}</h4>
                          <p className="text-xs text-brand-muted line-clamp-1 max-w-xl">{prog.description}</p>
                          <p className="text-xs font-semibold text-brand-primary mt-1">Impact: {prog.impact}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => {
                            setEditingItem(prog);
                            setProgramForm({
                              name: prog.name,
                              category: prog.category,
                              description: prog.description,
                              impact: prog.impact,
                              imageUrl: prog.imageUrl || '',
                              autoPublishSocial: false,
                            });
                            setShowModal('program');
                          }}
                          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProgram(prog.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEWS CMS */}
            {cmsSubTab === 'news' && (
              <div className="bg-white rounded-brand border border-black/10 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Manage News Articles</h2>
                    <p className="text-xs text-brand-muted">
                      Publish announcements and stories to the News section.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setNewsForm({ title: '', author: 'LiftersTouch Team', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), excerpt: '', content: '', imageUrl: 'https://picsum.photos/seed/news-new/600/400', autoPublishSocial: true });
                      setShowModal('news');
                    }}
                    className="btn-primary text-xs flex items-center gap-2 py-2.5"
                  >
                    <Plus className="h-4 w-4" /> Create Article
                  </button>
                </div>

                <div className="space-y-4">
                  {newsList.map((item) => (
                    <div key={item.id} className="p-4 border border-black/10 rounded-brand flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-brand-primary/40 transition-colors">
                      <div className="flex items-center gap-4">
                        <img src={item.imageUrl || `https://picsum.photos/seed/${item.id}/120/80`} alt={item.title} className="w-20 h-14 rounded-brand object-cover flex-shrink-0" />
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-brand-muted font-medium mb-1">
                            <span>{item.date}</span>
                            <span>•</span>
                            <span>By {item.author}</span>
                          </div>
                          <h4 className="font-bold text-base">{item.title}</h4>
                          <p className="text-xs text-brand-muted line-clamp-1 max-w-xl">{item.excerpt}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setNewsForm({
                              title: item.title,
                              author: item.author,
                              date: item.date,
                              excerpt: item.excerpt,
                              content: item.content || item.excerpt,
                              imageUrl: item.imageUrl || '',
                              autoPublishSocial: false,
                            });
                            setShowModal('news');
                          }}
                          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNews(item.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HOMEPAGE CMS */}
            {cmsSubTab === 'homepage' && homepageData && (
              <form onSubmit={handleSaveHomepage} className="bg-white rounded-brand border border-black/10 p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-black/10">
                  <div>
                    <h2 className="text-xl font-bold">Homepage Hero & Story Content</h2>
                    <p className="text-xs text-brand-muted">
                      Update banner headings, badges, and call-to-action text on the main landing page.
                    </p>
                  </div>
                  <button type="submit" className="btn-primary text-xs py-2.5 px-6">
                    Save Changes
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Hero Badge Text</label>
                    <input
                      type="text"
                      value={homepageData.badge || ''}
                      onChange={(e) => setHomepageData({ ...homepageData, badge: e.target.value })}
                      className="w-full px-3 py-2 border rounded-brand text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Hero Highlight Word</label>
                    <input
                      type="text"
                      value={homepageData.heroHighlight || ''}
                      onChange={(e) => setHomepageData({ ...homepageData, heroHighlight: e.target.value })}
                      className="w-full px-3 py-2 border rounded-brand text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-brand-text mb-1">Main Hero Headline</label>
                    <input
                      type="text"
                      value={homepageData.heroTitle || ''}
                      onChange={(e) => setHomepageData({ ...homepageData, heroTitle: e.target.value })}
                      className="w-full px-3 py-2 border rounded-brand text-sm font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-brand-text mb-1">Hero Description</label>
                    <textarea
                      rows={3}
                      value={homepageData.heroDescription || ''}
                      onChange={(e) => setHomepageData({ ...homepageData, heroDescription: e.target.value })}
                      className="w-full px-3 py-2 border rounded-brand text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Primary Button Label</label>
                    <input
                      type="text"
                      value={homepageData.primaryCta || ''}
                      onChange={(e) => setHomepageData({ ...homepageData, primaryCta: e.target.value })}
                      className="w-full px-3 py-2 border rounded-brand text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Secondary Button Label</label>
                    <input
                      type="text"
                      value={homepageData.secondaryCta || ''}
                      onChange={(e) => setHomepageData({ ...homepageData, secondaryCta: e.target.value })}
                      className="w-full px-3 py-2 border rounded-brand text-sm"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ----------------- TAB 2: SOCIAL MEDIA SYNCHRONIZATION HUB ----------------- */}
        {activeTab === 'social' && (
          <div className="space-y-8">
            {/* Registered Accounts Header & Cards */}
            <div className="bg-white rounded-brand border border-black/10 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Share2 className="h-6 w-6 text-brand-primary" /> Synchronized Social Accounts
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Connected channels receive automatic cross-posts whenever you publish news or gallery updates.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-brand-muted">Auto-Broadcast Status:</span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-emerald-600" /> Active
                  </span>
                </div>
              </div>

              {/* Accounts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {socialAccounts.map((acc) => {
                  const getIcon = () => {
                    switch (acc.platform) {
                      case 'Facebook': return <Facebook className="h-5 w-5 text-blue-600" />;
                      case 'Twitter / X': return <Twitter className="h-5 w-5 text-sky-500" />;
                      case 'Instagram': return <Instagram className="h-5 w-5 text-pink-600" />;
                      case 'LinkedIn': return <Linkedin className="h-5 w-5 text-blue-700" />;
                      default: return <Globe className="h-5 w-5 text-brand-primary" />;
                    }
                  };

                  return (
                    <div key={acc.id} className="p-4 border border-black/10 rounded-brand bg-white hover:border-brand-primary/40 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <div className="p-2 bg-black/5 rounded-full">
                            {getIcon()}
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            acc.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {acc.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-brand-text">{acc.platform}</h4>
                        <p className="text-xs text-brand-muted truncate">{acc.accountName}</p>
                        <p className="text-xs font-semibold text-brand-primary mt-0.5">{acc.handle}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-black/5 flex justify-between items-center">
                        <span className="text-[11px] font-medium text-brand-muted">Auto-Sync</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={acc.autoPublish === 1}
                            onChange={() => toggleSocialAutoPublish(acc.id, acc.autoPublish)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Multi-Platform Cross-Post Publisher with Device Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Publisher Column */}
              <div className="lg:col-span-7 bg-white rounded-brand border border-black/10 p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                  <Send className="h-5 w-5 text-brand-primary" /> Cross-Post Multi-Publisher
                </h3>
                <p className="text-xs text-brand-muted mb-6">
                  Broadcast updates simultaneously across all connected social media accounts.
                </p>

                <form onSubmit={handlePublishSocialPost} className="space-y-5">
                  {/* Target selection */}
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-2">Target Platforms</label>
                    <div className="flex flex-wrap gap-2">
                      {['Facebook', 'Twitter / X', 'Instagram', 'LinkedIn'].map((plat) => {
                        const isSelected = selectedPlatforms.includes(plat);
                        return (
                          <button
                            key={plat}
                            type="button"
                            onClick={() => togglePlatformSelection(plat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                : 'bg-black/5 text-brand-text border-black/10 hover:bg-black/10'
                            }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5" />} {plat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">
                      Post Message ({postContent.length} chars)
                    </label>
                    <textarea
                      rows={4}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Type your message here... e.g. 🎉 Thrilled to announce our new community initiative! #LiftersTouch #Nonprofit"
                      className="w-full p-3 border rounded-brand text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1">Image / Media Asset URL</label>
                    <input
                      type="url"
                      value={postImageUrl}
                      onChange={(e) => setPostImageUrl(e.target.value)}
                      placeholder="https://picsum.photos/seed/social-post/800/600"
                      className="w-full px-3 py-2 border rounded-brand text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPublishing || !postContent.trim()}
                    className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Broadcasting to Social Networks...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Publish & Sync Across Selected Channels
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Live Device Preview Column */}
              <div className="lg:col-span-5 bg-white rounded-brand border border-black/10 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Live Social Preview</h3>
                    <div className="flex gap-1">
                      {['Facebook', 'Twitter / X', 'Instagram', 'LinkedIn'].map((p) => (
                        <button
                          key={p}
                          onClick={() => setPreviewPlatform(p)}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            previewPlatform === p ? 'bg-brand-primary text-white' : 'bg-black/5 text-brand-muted'
                          }`}
                        >
                          {p.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Device Frame */}
                  <div className="border border-black/15 rounded-2xl p-4 bg-gray-50 shadow-inner">
                    <div className="bg-white rounded-xl border border-black/10 p-4 shadow-sm">
                      {/* Social Post Mock Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                          LT
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs text-black">LiftersTouch Official</span>
                            <span className="text-blue-500 font-bold text-[10px]">✓</span>
                          </div>
                          <span className="text-[10px] text-gray-500">
                            {previewPlatform === 'Twitter / X' ? '@LiftersTouch • Just now' : 'Sponsored • Just now'}
                          </span>
                        </div>
                      </div>

                      {/* Post Text */}
                      <p className="text-xs text-gray-800 leading-relaxed mb-3 whitespace-pre-wrap">
                        {postContent || "Your cross-posted social media content preview will render here in real-time."}
                      </p>

                      {/* Post Image */}
                      {postImageUrl && (
                        <div className="rounded-lg overflow-hidden border border-black/5 mb-3 aspect-video bg-black/5">
                          <img src={postImageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Mock Interactions Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                        <span>❤️ 12 Likes</span>
                        <span>💬 3 Comments</span>
                        <span>🔁 2 Retweets</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-brand-muted text-center mt-4">
                  Simulated multi-channel broadcast rendering matching real mobile feed constraints.
                </p>
              </div>
            </div>

            {/* Broadcast History Log */}
            <div className="bg-white rounded-brand border border-black/10 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Cross-Post Broadcast Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 text-[11px] uppercase tracking-wider text-brand-muted bg-brand-alt-bg">
                      <th className="p-3">Post Content</th>
                      <th className="p-3">Target Channels</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Engagement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-xs">
                    {socialPosts.map((p) => {
                      let platforms: string[] = [];
                      try {
                        platforms = JSON.parse(p.targetPlatformsJson);
                      } catch (e) {
                        platforms = ['Facebook', 'Twitter'];
                      }

                      return (
                        <tr key={p.id} className="hover:bg-brand-alt-bg/30">
                          <td className="p-3 max-w-xs truncate font-medium">
                            {p.content}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {platforms.map((plat, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-black/5 rounded text-[10px] font-semibold">
                                  {plat}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3 text-brand-muted text-[11px]">
                            {new Date(p.publishedAt).toLocaleString()}
                          </td>
                          <td className="p-3 font-semibold text-brand-primary">
                            {p.likes} Likes • {p.shares} Shares
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: BACKEND STACK & SCHEME ----------------- */}
        {activeTab === 'backend' && (
          <div className="space-y-8">
            <div className="bg-white rounded-brand border border-black/10 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-brand">
                  <Database className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Recommended Backend Architecture & Scheme</h2>
                  <p className="text-sm text-brand-muted">
                    Full technical specifications and relational database schemas powering the LiftersTouch platform.
                  </p>
                </div>
              </div>

              {/* Architecture Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-5 border border-black/10 rounded-brand bg-brand-alt-bg/50">
                  <Zap className="h-6 w-6 text-brand-primary mb-2" />
                  <h4 className="font-bold text-base mb-1">Database Engine</h4>
                  <p className="text-xs text-brand-muted">
                    SQLite (`better-sqlite3` WAL mode) for light single-instance deployments, seamlessly upgradeable to Google Cloud SQL (PostgreSQL) or Firebase Firestore for high availability.
                  </p>
                </div>

                <div className="p-5 border border-black/10 rounded-brand bg-brand-alt-bg/50">
                  <Layers className="h-6 w-6 text-brand-primary mb-2" />
                  <h4 className="font-bold text-base mb-1">Async Social Queue</h4>
                  <p className="text-xs text-brand-muted">
                    Redis + BullMQ background job queue handling exponential backoff retries, rate-limiting per social platform API, and Webhook callback acknowledgments.
                  </p>
                </div>

                <div className="p-5 border border-black/10 rounded-brand bg-brand-alt-bg/50">
                  <Shield className="h-6 w-6 text-brand-primary mb-2" />
                  <h4 className="font-bold text-base mb-1">OAuth Token Vault</h4>
                  <p className="text-xs text-brand-muted">
                    AES-256-GCM encrypted token storage for connected Facebook Page access tokens, Twitter OAuth 2.0 secrets, and LinkedIn Organization scopes.
                  </p>
                </div>
              </div>

              {/* DDL Schema Code Block */}
              <div className="border border-black/10 rounded-brand overflow-hidden">
                <div className="bg-gray-900 text-gray-200 px-4 py-3 flex justify-between items-center text-xs font-mono">
                  <span>lifterstouch_schema.sql</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`
-- LiftersTouch Production SQLite / PostgreSQL Schema

CREATE TABLE gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT,
  imageUrl TEXT NOT NULL,
  category TEXT DEFAULT 'Community',
  date TEXT,
  createdAt TEXT NOT NULL
);

CREATE TABLE programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  impact TEXT NOT NULL,
  imageUrl TEXT,
  createdAt TEXT NOT NULL
);

CREATE TABLE news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  imageUrl TEXT,
  createdAt TEXT NOT NULL
);

CREATE TABLE homepage (
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

CREATE TABLE social_accounts (
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

CREATE TABLE social_posts (
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
                      setCopiedSchema(true);
                      setTimeout(() => setCopiedSchema(false), 2000);
                    }}
                    className="flex items-center gap-1 text-xs text-brand-accent hover:underline"
                  >
                    {copiedSchema ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedSchema ? 'Copied DDL!' : 'Copy Schema DDL'}
                  </button>
                </div>
                <pre className="bg-gray-950 text-emerald-400 p-6 text-xs font-mono overflow-x-auto leading-relaxed">
{`-- LiftersTouch Production Relational Database DDL Schema

CREATE TABLE gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT,
  imageUrl TEXT NOT NULL,
  category TEXT DEFAULT 'Community',
  date TEXT,
  createdAt TEXT NOT NULL
);

CREATE TABLE programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  impact TEXT NOT NULL,
  imageUrl TEXT,
  createdAt TEXT NOT NULL
);

CREATE TABLE news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  imageUrl TEXT,
  createdAt TEXT NOT NULL
);

CREATE TABLE homepage (
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

CREATE TABLE social_accounts (
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

CREATE TABLE social_posts (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  imageUrl TEXT,
  targetPlatformsJson TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Published',
  publishedAt TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  engagementRate TEXT DEFAULT '0.0%'
);`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ----------------- MODAL FOR ADD / EDIT ITEM ----------------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-brand max-w-lg w-full p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowModal(null)}
              className="absolute top-4 right-4 p-2 text-brand-muted hover:text-black rounded-full"
            >
              ✕
            </button>

            {/* Gallery Modal Form */}
            {showModal === 'gallery' && (
              <form onSubmit={handleSaveGallery} className="space-y-4">
                <h3 className="text-xl font-bold">{editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}</h3>
                <div>
                  <label className="block text-xs font-bold mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-brand text-sm"
                    placeholder="e.g. Annual Community Workshop"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Caption</label>
                  <textarea
                    rows={2}
                    value={galleryForm.caption}
                    onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                    className="w-full px-3 py-2 border rounded-brand text-sm"
                    placeholder="Short description..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={galleryForm.imageUrl}
                    onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-brand text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Category</label>
                    <input
                      type="text"
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-brand text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Date</label>
                    <input
                      type="date"
                      value={galleryForm.date}
                      onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-brand text-sm"
                    />
                  </div>
                </div>

                {!editingItem && (
                  <div className="p-3 bg-brand-primary/5 rounded-brand border border-brand-primary/20 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoPublishGal"
                      checked={galleryForm.autoPublishSocial}
                      onChange={(e) => setGalleryForm({ ...galleryForm, autoPublishSocial: e.target.checked })}
                      className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <label htmlFor="autoPublishGal" className="text-xs font-semibold text-brand-text cursor-pointer">
                      Auto-publish update to active social media accounts
                    </label>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowModal(null)} className="btn-secondary text-xs">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs">
                    {editingItem ? 'Update Item' : 'Add & Publish'}
                  </button>
                </div>
              </form>
            )}

            {/* Program Modal Form */}
            {showModal === 'program' && (
              <form onSubmit={handleSaveProgram} className="space-y-4">
                <h3 className="text-xl font-bold">{editingItem ? 'Edit Program' : 'Create New Program'}</h3>
                <div>
                  <label className="block text-xs font-bold mb-1">Program Name</label>
                  <input
                    type="text"
                    required
                    value={programForm.name}
                    onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-brand text-sm"
                    placeholder="e.g. Youth STEM Initiative"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Category</label>
                  <input
                    type="text"
                    value={programForm.category}
                    onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-brand text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={programForm.description}
                    onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-brand text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Impact Statement</label>
                  <input
                    type="text"
                    required
                    value={programForm.impact}
                    onChange={(e) => setProgramForm({ ...programForm, impact: e.target.value })}
                    className="w-full px-3 py-2 border rounded-brand text-sm"
                    placeholder="e.g. 500+ youth trained annually"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Image URL</label>
                  <input
                    type="url"
                    value={programForm.imageUrl}
                    onChange={(e) => setProgramForm({ ...programForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-brand text-sm"
                  />
                </div>

                {!editingItem && (
                  <div className="p-3 bg-brand-primary/5 rounded-brand border border-brand-primary/20 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoPublishProg"
                      checked={programForm.autoPublishSocial}
                      onChange={(e) => setProgramForm({ ...programForm, autoPublishSocial: e.target.checked })}
                      className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <label htmlFor="autoPublishProg" className="text-xs font-semibold text-brand-text cursor-pointer">
                      Auto-publish launch message to connected social accounts
                    </label>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowModal(null)} className="btn-secondary text-xs">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs">
                    {editingItem ? 'Update Program' : 'Save Program'}
                  </button>
                </div>
              </form>
            )}

            {/* News Modal Form */}
            {showModal === 'news' && (
              <form onSubmit={handleSaveNews} className="space-y-4">
                <h3 className="text-xl font-bold">{editingItem ? 'Edit Article' : 'Publish News Article'}</h3>
                <div>
                  <label className="block text-xs font-bold mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-brand text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Author</label>
                    <input
                      type="text"
                      value={newsForm.author}
                      onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                      className="w-full px-3 py-2 border rounded-brand text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Date String</label>
                    <input
                      type="text"
                      value={newsForm.date}
                      onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-brand text-sm"
                      placeholder="e.g. Aug 3, 2026"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Short Excerpt</label>
                  <textarea
                    rows={2}
                    required
                    value={newsForm.excerpt}
                    onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                    className="w-full px-3 py-2 border rounded-brand text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Full Content Body</label>
                  <textarea
                    rows={4}
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                    className="w-full px-3 py-2 border rounded-brand text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newsForm.imageUrl}
                    onChange={(e) => setNewsForm({ ...newsForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-brand text-sm"
                  />
                </div>

                {!editingItem && (
                  <div className="p-3 bg-brand-primary/5 rounded-brand border border-brand-primary/20 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoPublishNews"
                      checked={newsForm.autoPublishSocial}
                      onChange={(e) => setNewsForm({ ...newsForm, autoPublishSocial: e.target.checked })}
                      className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <label htmlFor="autoPublishNews" className="text-xs font-semibold text-brand-text cursor-pointer">
                      Auto-broadcast article announcement to social channels
                    </label>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowModal(null)} className="btn-secondary text-xs">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs">
                    {editingItem ? 'Update Article' : 'Publish Article'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
