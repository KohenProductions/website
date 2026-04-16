import { useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import BorderGlow from '../components/BorderGlow/BorderGlow';
import './FashionGallery6.css';

const SECTIONS = [
  { id: 'sec-1', title: 'Section 01', images: ['/Fashion/1.jpg', '/Fashion/2.jpg'] },
  { id: 'sec-2', title: 'Section 02', images: ['/Fashion/3.png', '/Fashion/4.jpg'] },
  { id: 'sec-3', title: 'Section 03', images: ['/Fashion/5.jpg', '/Fashion/6.jpg'] },
  { id: 'sec-4', title: 'Section 04', images: ['/Fashion/1.jpg', '/Fashion/3.png'] },
  { id: 'sec-5', title: 'Section 05', images: ['/Fashion/2.jpg', '/Fashion/4.jpg'] },
  { id: 'sec-6', title: 'Section 06', images: ['/Fashion/5.jpg', '/Fashion/7.png'] },
];

export default function FashionGallery6() {
  const scrollerRefs = useRef({});

  const scrollPhotoGallery = (sectionId, direction) => {
    const el = scrollerRefs.current[sectionId];
    if (!el) return;
    // One "page" == one visible photo (scroll-snap aligns the final position).
    const amount = Math.max(1, Math.floor(el.clientWidth));
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  return (
    <section className="fashion-gallery6" id="fashion-gallery">
      <header className="fashion-gallery6-head">
        <h2 className="fashion-gallery6-title">Gallery</h2>
        <p className="fashion-gallery6-sub">Six fashion sections with photo and video spots.</p>
      </header>

      <div className="fashion-gallery6-sections">
        {SECTIONS.map((s) => (
          <div key={s.id} className="fashion-gallery6-section">
            <div className="fashion-gallery6-section-label">{s.title}</div>

            <div className="fashion-gallery6-section-media">
              <div className="fashion-gallery6-photoGallery">
                <button
                  type="button"
                  className="fashion-gallery6-arrow fashion-gallery6-arrow--left"
                  aria-label={`Scroll ${s.title} photos left`}
                  onClick={() => scrollPhotoGallery(s.id, -1)}
                >
                  ‹
                </button>

                <div
                  className="fashion-gallery6-images"
                  ref={(el) => {
                    if (el) scrollerRefs.current[s.id] = el;
                  }}
                >
                  {s.images.map((src, idx) => (
                    <figure key={`${s.id}-img-${idx}`} className="fashion-gallery6-image-slot">
                      <img src={src} alt="" loading="lazy" />
                    </figure>
                  ))}
                </div>

                <button
                  type="button"
                  className="fashion-gallery6-arrow fashion-gallery6-arrow--right"
                  aria-label={`Scroll ${s.title} photos right`}
                  onClick={() => scrollPhotoGallery(s.id, 1)}
                >
                  ›
                </button>
              </div>

              <div className="fashion-gallery6-video-slot">
                <BorderGlow
                  backgroundColor="transparent"
                  borderRadius={10}
                  glowRadius={26}
                  glowColor="270 80 75"
                  colors={['#a78bfa', '#818cf8', '#7dd3fc']}
                  fillOpacity={0.12}
                  glowIntensity={1.1}
                  edgeSensitivity={18}
                >
                  {/* Video placeholder: swap to a real fashion mp4/webm later */}
                  <VideoPlayer
                    placeholder
                    placeholderSrc={s.images[0]}
                    className="fashion-gallery6-video-player"
                  />
                </BorderGlow>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

