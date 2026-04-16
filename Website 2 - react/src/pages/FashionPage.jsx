import Magnet from '../components/Magnet/Magnet';
import Aurora from '../components/Aurora/Aurora';
import BorderGlow from '../components/BorderGlow/BorderGlow';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import FashionProjectFlow from './FashionProjectFlow';
import './FashionPage.css';

export default function FashionPage() {
  return (
    <div className="app">
      {/* ── Aurora background ── */}
      <div className="prism-bg">
        <Aurora colorStops={['#4691e2', '#9f83fb', '#0400ff']} amplitude={1} blend={0.5} />
      </div>

      {/* ── Nav (floating pill — same as main page) ── */}
      <nav className="nav" aria-label="Primary">
        <div className="nav-shell">
          <div className="nav-pill">
            <a href="/" className="nav-logo">
              Ron<span>.</span>Kohen
            </a>
            <ul className="nav-links">
              <li>
                <a href="/#work">Work</a>
              </li>
              <li>
                <a href="/fashion">Fashion</a>
              </li>
              <li>
                <a href="/#about">About</a>
              </li>
              <li>
                <a href="/#contact">Contact</a>
              </li>
            </ul>
            <a href="/ai" className="nav-ai-badge" aria-label="AI category">
              AI
            </a>
            <div className="nav-actions">
              <Magnet padding={96} magnetStrength={2.5} wrapperClassName="nav-magnet">
                <a href="/#contact" className="nav-btn nav-btn--primary">
                  Pricing
                </a>
              </Magnet>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Fashion header ── */}
      <section className="hero">
        <div className="hero-text">
          <p className="hero-sub">Fashion editorial</p>
          <h1 className="hero-title fashion-opening-title">Creative video campaigns for boutique apparel brands.</h1>

          <div className="hero-square-wrap">
            <BorderGlow
              className="hero-border-glow"
              backgroundColor="transparent"
              borderRadius={10}
              glowRadius={28}
              glowColor="270 80 75"
              colors={['#a78bfa', '#818cf8', '#7dd3fc']}
              fillOpacity={0.15}
              glowIntensity={1.2}
              edgeSensitivity={20}
            >
              <VideoPlayer src="/Fashion/Mira/Mira_Wide_Website.mp4" />
            </BorderGlow>
          </div>
          <p className="fashion-hero-caption">Mira Zwillinger Bridal Collection — Fall 2023</p>
        </div>
      </section>

      {/* ── Full-width divider strip ── */}
      <section className="fashion-divider-strip" aria-label="Fashion divider">
        <video
          className="fashion-divider-video"
          src="/Fashion/Fashion_Website_Cover2.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </section>

      <FashionProjectFlow />
    </div>
  );
}

