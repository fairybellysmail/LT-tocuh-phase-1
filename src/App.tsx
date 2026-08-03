/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Layout from './layouts/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsNewsPage from './pages/ProgramsNewsPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import DonatePage from './pages/DonatePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href.startsWith(window.location.origin)) {
        e.preventDefault();
        window.history.pushState({}, '', anchor.href);
        setCurrentPath(window.location.pathname);
        window.scrollTo(0, 0);
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/about':
        return <AboutPage />;
      case '/programs-news':
      case '/programs-impact':
      case '/news':
        return <ProgramsNewsPage />;
      case '/gallery':
        return <GalleryPage />;
      case '/contact-support':
        return <ContactPage />;
      case '/donate':
        return <DonatePage />;
      case '/settings':
      case '/admin':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}
