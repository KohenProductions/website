import { useRef } from 'react';
import AnimatedContent from './components/AnimatedContent/AnimatedContent';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import VariableProximity from './components/VariableProximity/VariableProximity';
import Aurora from './components/Aurora/Aurora';
import ScrollStack, { ScrollStackItem } from './components/ScrollStack/ScrollStack';
import './App.css';

const projects = [
  { id: 1, title: 'Karl Studio',   category: 'Brand Film',      ratio: '16:9', year: '2026', client: 'Karl Studio', clientDesc: 'Menswear boutique · TLV & Jerusalem' },
  { id: 2, title: 'Project Two',   category: 'Social Content',  ratio: '9:16', year: '2024' },
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
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="projects" id="work">

        {/* 1 — Full-width 16:9 with header above and description below */}
        <div className="project-feature">
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
            <VideoPlayer src="/office.mp4" />
          </AnimatedContent>
          <AnimatedContent distance={30} duration={0.9} delay={0.2}>
            <div className="project-feature-desc">
              <p>
                A series of five short-form commercials crafted to go beyond the rack. Each film peels back the surface of fabric and fit to reveal what Karl Studio is really about — a perspective, a posture, a quiet confidence that has nothing to do with trends. Shot across Tel Aviv and Jerusalem, the work captures the brand's dual identity: the energy of the city and the weight of craftsmanship, woven together into a visual language that speaks before the clothes even do.
              </p>
            </div>
          </AnimatedContent>

          {/* Remaining 4 commercials — ScrollStack */}
          <div className="karl-stack-wrap">
            <ScrollStack
              useWindowScroll={false}
              itemDistance={120}
              itemScale={0.04}
              itemStackDistance={24}
              stackPosition="18%"
              baseScale={0.88}
              rotationAmount={0}
              blurAmount={1}
            >
              {[
                { num: '02', label: 'The Fitting' },
                { num: '03', label: 'City Cut' },
                { num: '04', label: 'Jerusalem Stone' },
                { num: '05', label: 'The Signature' },
              ].map(({ num, label }) => (
                <ScrollStackItem key={num}>
                  <div className="karl-card-inner">
                    <div className="karl-card-placeholder" />
                    <div className="karl-card-meta">
                      <span className="karl-card-num">{num}</span>
                      <span className="karl-card-label">{label}</span>
                    </div>
                  </div>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        </div>

        {/* 2 — Centered 9:16 */}
        <div className="project-row centered">
          <AnimatedContent distance={60} duration={1} scale={0.97}>
            <div className="project-portrait">
              <Placeholder ratio="9:16" index={2} />
              <div className="project-meta below">
                <span className="project-cat">{projects[1].category}</span>
                <h2 className="project-title">{projects[1].title}</h2>
              </div>
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
