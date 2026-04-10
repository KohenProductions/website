import { useRef } from 'react';
import AnimatedContent from './components/AnimatedContent/AnimatedContent';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import VariableProximity from './components/VariableProximity/VariableProximity';
import BorderGlow from './components/BorderGlow/BorderGlow';
import Skiper16Stack from './components/Skiper16Stack/Skiper16Stack';
import HoverExpandGallery from './components/HoverExpandGallery/HoverExpandGallery';
import HoverExpandShowcase, { FASHION_HOVER_EXPAND_ITEMS } from './components/HoverExpandShowcase/HoverExpandShowcase';
import Aurora from './components/Aurora/Aurora';
import './App.css';

const projects = [
  { id: 1, title: 'Karl Studio',   category: 'Brand Film',      ratio: '16:9', year: '2026', client: 'Karl Studio', clientDesc: 'Menswear boutique · TLV & Jerusalem' },
  { id: 2, title: 'Bettercare',    category: 'Social Content',  ratio: '9:16', year: '2024', clientDesc: 'Health & wellness app · Israel' },
  { id: 3, title: 'Project Three', category: 'Documentary',     ratio: '16:9', year: '2024' },
  { id: 4, title: 'Project Four',  category: 'AI Commercial',   ratio: '9:16', year: '2024' },
  { id: 5, title: 'Project Five',  category: 'Brand Film',      ratio: '16:9', year: '2023' },
  { id: 6, title: 'Project Six',   category: 'Social Content',  ratio: '9:16', year: '2023' },
  { id: 7, title: 'Project Seven', category: 'AI Commercial',   ratio: '16:9', year: '2023' },
  { id: 8, title: 'Project Eight', category: 'Documentary',     ratio: '9:16', year: '2023' },
];

function Placeholder({ ratio, index }) {
  const is169 = ratio === '16:9';
  return (
    <div className={`placeholder ${is169 ? 'ratio-169' : 'ratio-916'}`}>
      <div className="placeholder-inner">
        <span className="placeholder-label">{ratio}</span>
        <span className="placeholder-num">0{index}</span>
      </div>
    </div>
  );
}

export default function App() {
  const heroRef = useRef(null);

  return (
    <div className="app">

      {/* ── Aurora background ── */}
      <div className="prism-bg">
        <Aurora
          colorStops={["#4691e2","#9f83fb","#0400ff"]}
          amplitude={1}
          blend={0.5}
        />
      </div>

      {/* ── Nav ── */}
      <nav className="nav">
        <a href="#" className="nav-logo">Ron<span>.</span>Kohen</a>
        <ul className="nav-links">
          <li><a href="#work">Work</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* ── Hero ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-text">
          <p className="hero-sub">AI commercials · Brand films · Social content</p>
          <h1 className="hero-title">
            <VariableProximity
              label="creating the right video content for you"
              containerRef={heroRef}
              fromFontVariationSettings="'wght' 200"
              toFontVariationSettings="'wght' 900"
              radius={300}
              falloff="gaussian"
              className="hero-variable"
            />
          </h1>
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
              <VideoPlayer placeholder placeholderSrc="/ron.jpg" />
            </BorderGlow>
          </div>
          <a href="#work" className="explore-btn">
            <span>explore projects</span>
            <svg className="explore-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </a>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="projects" id="work">

        {/* 1 — Full-width 16:9 with header above and description below */}
        <div className="project-feature project-feature--karl-stack">
          <AnimatedContent distance={30} duration={0.8} delay={0}>
            <div className="project-feature-header">
              <div className="project-feature-left">
                <span className="project-cat">{projects[0].category}</span>
                <h2 className="project-feature-title">{projects[0].title}</h2>
              </div>
              <div className="project-feature-right">
                <span className="project-feature-client">{projects[0].clientDesc}</span>
                <span className="project-year">{projects[0].year}</span>
              </div>
            </div>
          </AnimatedContent>
          <AnimatedContent distance={60} duration={1} delay={0.1}>
            <BorderGlow
              backgroundColor="transparent"
              borderRadius={6}
              glowRadius={32}
              glowColor="270 80 75"
              colors={['#a78bfa', '#818cf8', '#7dd3fc']}
              fillOpacity={0.15}
              glowIntensity={1.2}
              edgeSensitivity={20}
            >
              <VideoPlayer src="/office.mp4" />
            </BorderGlow>
          </AnimatedContent>
          <AnimatedContent distance={30} duration={0.9} delay={0.2}>
            <div className="project-feature-desc">
              <p>
                A series of five short-form commercials crafted to go beyond the rack. Each film peels back the surface of fabric and fit to reveal what Karl Studio is really about — a perspective, a posture, a quiet confidence that has nothing to do with trends. Shot across Tel Aviv and Jerusalem, the work captures the brand's dual identity: the energy of the city and the weight of craftsmanship, woven together into a visual language that speaks before the clothes even do.
              </p>
            </div>
          </AnimatedContent>

          <Skiper16Stack className="skiper16-root--tight-intro" />
          <HoverExpandShowcase
            items={FASHION_HOVER_EXPAND_ITEMS}
            label="International"
            title="Magazine publications"
            headingId="core-team-expand-heading"
            variant="fashion"
          />
        </div>

        <HoverExpandGallery />

        {/* 2 — Bettercare — 4-video grid */}
        <div className="project-feature">
          <AnimatedContent distance={30} duration={0.8}>
            <div className="project-feature-header">
              <div className="project-feature-left">
                <span className="project-cat">{projects[1].category}</span>
                <h2 className="project-feature-title">{projects[1].title}</h2>
              </div>
              <div className="project-feature-right">
                <span className="project-feature-client">{projects[1].clientDesc}</span>
                <span className="project-year">{projects[1].year}</span>
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={50} duration={1} delay={0.1}>
            <div className="bettercare-grid">

              {/* Portrait — AI (4:5) — spans both rows */}
              <div className="bc-item bc-item--portrait">
                <div className="bc-cell">
                  <VideoPlayer src="/bettercare/Bettercare - ai.mp4" className="vp--portrait" />
                </div>
                <div className="bc-caption">
                  <span className="bc-cat">AI</span>
                  <span className="bc-title-ph">Title placeholder</span>
                </div>
              </div>

              {/* Hero — Krav Maga (16:9) — top right, wide */}
              <div className="bc-item bc-item--hero">
                <div className="bc-cell">
                  <VideoPlayer src="/bettercare/Bettercare - kravmaga.mp4" />
                </div>
                <div className="bc-caption">
                  <span className="bc-cat">Fitness</span>
                  <span className="bc-title-ph">Title placeholder</span>
                </div>
              </div>

              {/* Game (3:2) — bottom middle */}
              <div className="bc-item bc-item--game">
                <div className="bc-cell">
                  <VideoPlayer src="/bettercare/Bettercare - game.mp4" />
                </div>
                <div className="bc-caption">
                  <span className="bc-cat">Gaming</span>
                  <span className="bc-title-ph">Title placeholder</span>
                </div>
              </div>

              {/* Medical (16:9) — bottom right */}
              <div className="bc-item bc-item--medican">
                <div className="bc-cell">
                  <VideoPlayer src="/bettercare/Bettercare - medican.mp4" />
                </div>
                <div className="bc-caption">
                  <span className="bc-cat">Medical</span>
                  <span className="bc-title-ph">Title placeholder</span>
                </div>
              </div>

            </div>
          </AnimatedContent>

          <AnimatedContent distance={30} duration={0.9} delay={0.2}>
            <div className="project-feature-desc">
              <p>
                Four short-form social ads for Bettercare — each built around a different content vertical. From AI-generated health insights to krav maga training, gaming challenges, and medical explainers, the campaign speaks to a wide audience with a consistent visual voice. Fast-cut, platform-native, designed to stop the scroll.
              </p>
            </div>
          </AnimatedContent>
        </div>

        {/* 3 — Full-width 16:9 + left text */}
        <div className="project-row full reverse">
          <AnimatedContent distance={80} duration={1}>
            <Placeholder ratio="16:9" index={3} />
          </AnimatedContent>
          <AnimatedContent distance={30} duration={0.8} delay={0.15} direction="horizontal" reverse>
            <div className="project-meta">
              <span className="project-cat">{projects[2].category}</span>
              <h2 className="project-title">{projects[2].title}</h2>
              <span className="project-year">{projects[2].year}</span>
            </div>
          </AnimatedContent>
        </div>

        {/* 4 — Two 9:16 side by side */}
        <div className="project-row split">
          {[3, 4].map((i, idx) => (
            <AnimatedContent key={i} distance={50} duration={0.9} delay={idx * 0.12}>
              <Placeholder ratio="9:16" index={i + 1} />
              <div className="project-meta below small">
                <span className="project-cat">{projects[i].category}</span>
                <h2 className="project-title">{projects[i].title}</h2>
              </div>
            </AnimatedContent>
          ))}
        </div>

        {/* 5 — Full-width cinematic 16:9 */}
        <div className="project-row full">
          <AnimatedContent distance={100} duration={1.1} scale={0.98}>
            <Placeholder ratio="16:9" index={5} />
          </AnimatedContent>
          <AnimatedContent distance={30} duration={0.8} delay={0.2} direction="horizontal">
            <div className="project-meta">
              <span className="project-cat">{projects[4].category}</span>
              <h2 className="project-title">{projects[4].title}</h2>
              <span className="project-year">{projects[4].year}</span>
            </div>
          </AnimatedContent>
        </div>

        {/* 6 — 9:16 offset */}
        <div className="project-row offset">
          <AnimatedContent distance={60} duration={1} delay={0}>
            <Placeholder ratio="9:16" index={6} />
            <div className="project-meta below">
              <span className="project-cat">{projects[5].category}</span>
              <h2 className="project-title">{projects[5].title}</h2>
            </div>
          </AnimatedContent>
        </div>

        {/* 7 — Full-width 16:9 */}
        <div className="project-row full reverse">
          <AnimatedContent distance={80} duration={1}>
            <Placeholder ratio="16:9" index={7} />
          </AnimatedContent>
          <AnimatedContent distance={30} duration={0.8} delay={0.15} direction="horizontal" reverse>
            <div className="project-meta">
              <span className="project-cat">{projects[6].category}</span>
              <h2 className="project-title">{projects[6].title}</h2>
              <span className="project-year">{projects[6].year}</span>
            </div>
          </AnimatedContent>
        </div>

        {/* 8 — Final 9:16 centered large */}
        <div className="project-row centered last">
          <AnimatedContent distance={60} duration={1.1} scale={0.96}>
            <div className="project-portrait wide">
              <Placeholder ratio="9:16" index={8} />
              <div className="project-meta below">
                <span className="project-cat">{projects[7].category}</span>
                <h2 className="project-title">{projects[7].title}</h2>
              </div>
            </div>
          </AnimatedContent>
        </div>

      </section>

      {/* ── Footer ── */}
      <footer className="footer" id="contact">
        <div className="footer-inner">
          <span className="footer-logo">Ron<span>.</span>Kohen</span>
          <div className="footer-links">
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
            <a href="#">Contact</a>
          </div>
          <span className="footer-copy">© 2026</span>
        </div>
      </footer>

    </div>
  );
}
