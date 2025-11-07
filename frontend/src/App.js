import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import FeedPanel from './components/FeedPanel';
import AuthModal from './components/AuthModal';
import { fbAuth } from './services/authFirebase';
import { fbExperiences } from './services/experiencesFirebase';
import { fbSpots } from './services/spotsFirebase';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFeed, setShowFeed] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [experiences, setExperiences] = useState([]);
  const [experiencesLoading, setExperiencesLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    city: '',
    price_range: '',
    is_featured: false,
  });
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const appRef = useRef(null);

  useEffect(() => {
    fetchSpots();
   
    const handleScroll = () => {
      if (window.scrollY > 100 && showLanding) {
        handleEnter();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showLanding]);

  useEffect(() => {
    fetchSpots();
  }, [filter, showFeaturedOnly]);

  // Firebase auth state subscription
  useEffect(() => {
    const unsub = fbAuth.onChange((user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          username: user.displayName || user.email?.split('@')[0] || 'user',
          email: user.email,
        });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsub();
  }, []);

  const fetchSpots = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const items = await fbSpots.list();

      // Client-side filters for simplicity
      let filtered = items;
      if (showFeaturedOnly || filter.is_featured) {
        filtered = filtered.filter((s) => !!s.is_featured);
      }
      if (filter.city) {
        filtered = filtered.filter((s) => s.city === filter.city);
      }
      if (filter.price_range) {
        filtered = filtered.filter((s) => s.price_range === filter.price_range);
      }

      setSpots(filtered);
    } catch (err) {
      console.error('Error fetching spots:', err);
      setError('Failed to load matcha spots. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = useCallback(async () => {
    try {
      setExperiencesLoading(true);
      const items = await fbExperiences.list();
      setExperiences(items);
    } catch (err) {
      console.error('Unable to load experiences', err);
      setExperiences([]);
    } finally {
      setExperiencesLoading(false);
    }
  }, []);

  const handleEnter = () => {
    setShowLanding(false);

    document.body.classList.add('map-active');
    document.documentElement.style.overflow = 'hidden';
  };

  const handleMarkerClick = (spot) => {
    setSelectedSpot(spot);
    setSidebarOpen(true);

    setTimeout(() => {
      const element = document.getElementById(`spot-${spot.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 400);
  };

  const handleSpotClick = (spot) => {
    setSelectedSpot(spot);
  };

  const filteredSpots = spots.filter((spot) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      spot.name.toLowerCase().includes(searchLower) ||
      spot.address.toLowerCase().includes(searchLower) ||
      (spot.description && spot.description.toLowerCase().includes(searchLower))
    );
  });


  const handleAuthSubmit = async (form, resetForm) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      if (authMode === 'login') {
        await fbAuth.login({ email: form.email || form.username, password: form.password });
      } else {
        // Registration requires an email for Firebase; use username as displayName
        const email = form.email || `${form.username}@example.com`;
        await fbAuth.register({ email, password: form.password, username: form.username });
      }
      resetForm();
      setAuthModalOpen(false);
    } catch (err) {
      const message = err?.message || 'Unable to complete request.';
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRequireAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthError('');
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await fbAuth.logout();
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleCreateExperience = async (payload) => {
    if (!currentUser) throw new Error('Please log in first.');
    try {
      await fbExperiences.create({ user: currentUser, ...payload });
      fetchExperiences();
    } catch (err) {
      let detail = err?.message || 'Unable to post experience right now.';
      // Check for Firestore permission errors
      if (detail.includes('permission') || detail.includes('PERMISSION_DENIED')) {
        detail = 'Permission denied. Make sure Firestore security rules allow authenticated users to create experiences. See README for setup instructions.';
      }
      throw new Error(detail);
    }
  };

  const openFeed = () => {
    setShowFeed(true);
    fetchExperiences();
  };

  return (
    <div className="App" ref={appRef}>
      {showLanding && <LandingPage onEnter={handleEnter} />}

      <div className={`main-content ${showLanding ? 'hidden' : ''}`}>
        <MapView 
          spots={filteredSpots} 
          onMarkerClick={handleMarkerClick}
          selectedSpot={selectedSpot}
          onUserLocationChange={setUserLocation}
        />
        
        <button 
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(true)}
          title="Open spots list"
        >
          <img src="/MatchaverseLogo.png" alt="Matchaverse" className="sidebar-logo" />
        </button>

        <button
          className="feed-toggle-btn"
          onClick={openFeed}
          title="Open matcha feed"
        >
          <span className="toggle-icon">📝</span>
          <span className="toggle-text">Feed</span>
        </button>

        <Sidebar
          spots={filteredSpots}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSpotClick={handleSpotClick}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filter={filter}
          onFilterChange={setFilter}
          showFeaturedOnly={showFeaturedOnly}
          onFeaturedToggle={setShowFeaturedOnly}
          onClearFilters={() => {
            setFilter({ city: '', price_range: '', is_featured: false });
            setShowFeaturedOnly(false);
            setSearchTerm('');
          }}
          loading={loading}
          userLocation={userLocation}
        />


        <FeedPanel
          isOpen={showFeed}
          onClose={() => setShowFeed(false)}
          experiences={experiences}
          loading={experiencesLoading}
          onRefresh={fetchExperiences}
          onCreate={handleCreateExperience}
          user={currentUser}
          spots={spots}
          onRequireAuth={() => handleRequireAuth('login')}
          onLogout={handleLogout}
        />

      </div>

      {loading && !showLanding && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading matcha spots...</p>
        </div>
      )}

      {error && !showLanding && (
        <div className="error-overlay">
          <p>{error}</p>
          <button onClick={fetchSpots} className="retry-btn">
            Retry
          </button>
        </div>
      )}


      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSwitchMode={(mode) => {
          setAuthMode(mode);
          setAuthError('');
        }}
        onSubmit={handleAuthSubmit}
        loading={authLoading}
        error={authError}
      />

    </div>
  );
}

export default App;
