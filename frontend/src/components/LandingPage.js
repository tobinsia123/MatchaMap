import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const LandingPage = ({ onEnter }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create floating particles
    const particleCount = 20;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleClick = () => {
    onEnter();
  };

  return (
    <div 
      className={`landing-page ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`,
      }}
    >
      {/* Animated background gradient */}
      <div className="landing-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Floating particles */}
      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
      
      <div className="landing-content">
        <div className="logo-container">
          <div className="matcha-icon-wrapper">
            <span className="matcha-icon-large">🍵</span>
            <div className="icon-glow"></div>
          </div>
          <h1 className="landing-title">
            <span className="title-letter">M</span>
            <span className="title-letter">a</span>
            <span className="title-letter">t</span>
            <span className="title-letter">c</span>
            <span className="title-letter">h</span>
            <span className="title-letter">a</span>
            <span className="title-letter">v</span>
            <span className="title-letter">e</span>
            <span className="title-letter">r</span>
            <span className="title-letter">s</span>
            <span className="title-letter">e</span>
          </h1>
          <p className="landing-subtitle">
            <span className="subtitle-word">Discover</span>{' '}
            <span className="subtitle-word">the</span>{' '}
            <span className="subtitle-word">best</span>{' '}
            <span className="subtitle-word">matcha</span>{' '}
            <span className="subtitle-word">spots</span>{' '}
            <span className="subtitle-word">in</span>{' '}
            <span className="subtitle-word">Irvine</span>
          </p>
        </div>
        
        <div className="enter-hint">
          <div className="scroll-indicator">
            <span className="scroll-text">Scroll down or click to explore</span>
            <div className="scroll-arrow-container">
              <div className="scroll-arrow">↓</div>
              <div className="scroll-arrow">↓</div>
            </div>
          </div>
          <button className="enter-button" onClick={handleClick}>
            <span className="button-text">Explore Map</span>
            <span className="button-arrow">→</span>
            <div className="button-shine"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
