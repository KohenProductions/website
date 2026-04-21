import Magnet from '../components/Magnet/Magnet';
import Aurora from '../components/Aurora/Aurora';
import BorderGlow from '../components/BorderGlow/BorderGlow';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import FadeContent from '../components/FadeContent/FadeContent';
import HoverExpandGallery from '../components/HoverExpandGallery/HoverExpandGallery';
import './FashionPage.css';
import './AiPage.css';

export default function AiPage() {
  return (
    <div className="app">
      <div className="prism-bg">
        <Aurora colorStops={['#4691e2', '#9f83fb', '#0400ff']} amplitude={1} blend={0.5} />
      </div>

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

      <section className="hero">
        <div className="hero-text">
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
              <VideoPlayer src="/ai/the-dance-1.2.mp4" />
            </BorderGlow>
          </div>
          <div className="project-feature-desc ai-page-hero-desc">
            <p>
              A cinematic AI-driven sequence set in a grand stone estate, blending elegant choreography with
              controlled camera movement and refined visual storytelling.
            </p>
            <p>
              Built through precise prompting and iteration, the project captures a seamless fusion of atmosphere,
              motion, and high-end cinematic aesthetics.
            </p>
          </div>
        </div>
      </section>

      <section className="projects" aria-label="More AI work">
        <FadeContent className="heg-fade-wrap" duration={0.85} threshold={0.14}>
          <HoverExpandGallery />
        </FadeContent>
      </section>
    </div>
  );
}
