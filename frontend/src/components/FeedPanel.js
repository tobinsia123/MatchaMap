import React, { useEffect, useState } from 'react';
import './FeedPanel.css';

const FeedPanel = ({
  isOpen,
  onClose,
  experiences = [],
  loading,
  onRefresh,
  onCreate,
  user,
  spots = [],
  onRequireAuth,
  onLogout,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: '',
    spot: '',
  });
  const [ submitting, setSubmitting ] = useState(false);
  const [ formError, setFormError ] = useState('');

  useEffect(() => {
    if (isOpen) {
      onRefresh();
    }
  }, [isOpen, onRefresh]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', rating: '', spot: '' });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError('Please provide both a title and your matcha experience.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      await onCreate({
        title: formData.title,
        content: formData.content,
        rating: formData.rating ? Number(formData.rating) : null,
        spot: formData.spot || null,
      });
      resetForm();
    } catch (err) {
      const msg = err?.message || 'Unable to post experience right now.';
      setFormError(msg);
      console.error('Error creating experience:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`feed-panel ${isOpen ? 'open' : ''}`}>
      <div className="feed-panel-header">
        <div>
          <h2>Matcha Feed</h2>
          <p>Share and discover matcha experiences from the community.</p>
        </div>
        <div className="feed-header-actions">
          {user ? (
            <div className="feed-user-info">
              <div className="feed-user-avatar" aria-hidden="true">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="feed-user-meta">
                <span>@{user.username}</span>
                <button type="button" onClick={onLogout} className="feed-logout-btn">
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="feed-login-btn" onClick={onRequireAuth}>
              Log in / Register
            </button>
          )}
          <button className="feed-close-btn" onClick={onClose} aria-label="Close feed">
            ✕
          </button>
        </div>
      </div>

      <div className="feed-panel-body">
        <section className="feed-create">
          <h3>{user ? 'Share your experience' : 'Join the conversation'}</h3>
          {user ? (
            <form className="feed-form" onSubmit={handleSubmit}>
              <div className="feed-form-group">
                <label htmlFor="experience-title">Title</label>
                <input
                  id="experience-title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Serene afternoon at Ten Ren"
                  required
                />
              </div>

              <div className="feed-form-group">
                <label htmlFor="experience-spot">Matcha Spot (optional)</label>
                <select
                  id="experience-spot"
                  name="spot"
                  value={formData.spot}
                  onChange={handleChange}
                >
                  <option value="">General experience</option>
                  {spots.map((spot) => (
                    <option key={spot.id} value={spot.id}>
                      {spot.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="feed-form-group">
                <label htmlFor="experience-rating">Rating (optional)</label>
                <select
                  id="experience-rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                >
                  <option value="">No rating</option>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>{value} / 5</option>
                  ))}
                </select>
              </div>

              <div className="feed-form-group">
                <label htmlFor="experience-content">Your experience</label>
                <textarea
                  id="experience-content"
                  name="content"
                  rows="4"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Tell us about the matcha, vibes, staff, and more..."
                  required
                />
              </div>

              {formError && <p className="feed-form-error">{formError}</p>}

              <button type="submit" className="feed-submit-btn" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post experience'}
              </button>
            </form>
          ) : (
            <div className="feed-login-prompt">
              <p>You need an account to post your matcha experiences.</p>
              <button onClick={onRequireAuth}>Log in or sign up</button>
            </div>
          )}
        </section>

        <section className="feed-list">
          <div className="feed-list-header">
            <h3>Community Experiences</h3>
            <button className="feed-refresh-btn" onClick={onRefresh} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {loading ? (
            <div className="feed-loading">Loading experiences...</div>
          ) : experiences.length === 0 ? (
            <div className="feed-empty">
              <span role="img" aria-label="cup">🍵</span>
              <p>No matcha experiences yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="feed-items">
              {experiences.map((experience) => (
                <article key={experience.id} className="feed-item">
                  <header>
                    <div className="feed-item-meta">
                      <span className="feed-item-user">@{experience.user?.username || 'anonymous'}</span>
                      <span className="feed-item-date">
                        {new Date(experience.created_at).toLocaleString()}
                      </span>
                    </div>
                    {experience.rating && (
                      <span className="feed-item-rating">{experience.rating} / 5</span>
                    )}
                  </header>

                  <h4>{experience.title}</h4>
                  {experience.spot_name && (
                    <p className="feed-item-spot">at {experience.spot_name}</p>
                  )}
                  <p className="feed-item-content">{experience.content}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FeedPanel;
