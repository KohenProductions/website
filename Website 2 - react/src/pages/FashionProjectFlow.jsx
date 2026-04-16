import { useState, useRef } from 'react';
import BorderGlow from '../components/BorderGlow/BorderGlow';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const ILANIT_FRAMES = [
  'Sequence 02.00_01_09_03.Still001.jpg',
  'Sequence 02.00_01_16_21.Still002.jpg',
  'Sequence 02.00_01_18_09.Still003.jpg',
  'Sequence 02.00_01_20_08.Still004.jpg',
  'Sequence 02.00_01_22_03.Still005.jpg',
  'Sequence 02.00_01_27_17.Still006.jpg',
  'Sequence 02.00_01_29_20.Still007.jpg',
  'Sequence 02.00_01_33_22.Still008.jpg',
  'Sequence 02.00_01_35_18.Still009.jpg',
  'Sequence 02.00_01_37_18.Still010.jpg',
  'Sequence 02.00_01_40_00.Still011.jpg',
  'Sequence 02.00_01_47_16.Still012.jpg',
  'Sequence 02.00_02_00_10.Still013.jpg',
  'Sequence 02.00_02_12_21.Still014.jpg',
  'Sequence 02.00_02_16_13.Still015.jpg',
  'Sequence 02.00_02_19_00.Still016.jpg',
  'Sequence 02.00_02_47_20.Still017.jpg',
  'Sequence 02.00_02_52_16.Still018.jpg',
  'Sequence 02.00_03_01_01.Still019.jpg',
  'Sequence 02.00_03_04_20.Still020.jpg',
  'Sequence 02.00_03_11_12.Still021.jpg',
  'Sequence 02.00_03_16_15.Still022.jpg',
  'Sequence 02.00_03_24_09.Still023.jpg',
  'Sequence 02.00_03_26_13.Still024.jpg',
  'Sequence 02.00_04_17_23.Still025.jpg',
].map((name) => `/Fashion/Ilanit/frames/${name}`);

const MASIMORE_FRAMES = [
  'DSCF3563.jpg',
  'DSCF3594.jpg',
  'DSCF3611.jpg',
  'DSCF3709.jpg',
  'DSCF3713.jpg',
  'DSCF3729.jpg',
  'DSCF3746.jpg',
  'DSCF3773.jpg',
  'DSCF3796.jpg',
  'DSCF3814.jpg',
  'DSCF3832.jpg',
  'DSCF3863.jpg',
  'DSCF3880.jpg',
  'DSCF3957.jpg',
  'DSCF3969.jpg',
  'DSCF3975.jpg',
  'DSCF3987.jpg',
  'DSCF4065.jpg',
  'DSCF4073.jpg',
  'DSCF4097.jpg',
  'DSCF4100.jpg',
  'DSCF4155.jpg',
  'DSCF4163.jpg',
].map((name) => `/Fashion/masimore/Frames/${name}`);

const PROJECTS = [
  {
    id: 'project-01',
    caption: 'Editorial campaign — project details coming soon',
    videoSrc: '/Fashion/Ilanit/Ilanit_Website_Vertical.mp4',
    images: ILANIT_FRAMES,
  },
  {
    id: 'project-02',
    caption: 'Collection story — project details coming soon',
    videoSrc: '/Fashion/Fashion_Website_Cover2.mp4',
    images: ['/Fashion/2.jpg', '/Fashion/3.png', '/Fashion/4.jpg', '/Fashion/6.jpg', '/Fashion/7.png'],
  },
  {
    id: 'project-03',
    caption: 'Brand film — project details coming soon',
    videoSrc: '/Fashion/masimore/miss masimore.mp4',
    images: MASIMORE_FRAMES,
  },
];

export default function FashionProjectFlow() {
  const galleryRefs = useRef({});
  const specialSwipeStartX = useRef({});
  const [specialImageIndex, setSpecialImageIndex] = useState({
    'project-01': 0,
    'project-03': 0,
  });
  const [imageMeta, setImageMeta] = useState({});
  const [lightboxState, setLightboxState] = useState({
    open: false,
    index: 0,
    slides: [],
  });

  const scrollGallery = (projectId, direction) => {
    const el = galleryRefs.current[projectId];
    if (!el) return;
    const card = el.querySelector('.fashion-project-gallery-card');
    const gap = 16;
    const amount = card ? card.clientWidth + gap : el.clientWidth * 0.6;
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  const openLightbox = (images, index) => {
    setLightboxState({
      open: true,
      index,
      slides: images.map((src) => ({ src })),
    });
  };

  const cycleSpecialImage = (projectId, direction, total) => {
    setSpecialImageIndex((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] ?? 0) + direction + total) % total,
    }));
  };

  const onSpecialViewerTouchStart = (projectId, e) => {
    specialSwipeStartX.current[projectId] = e.touches?.[0]?.clientX ?? null;
  };

  const onSpecialViewerTouchEnd = (projectId, total, e) => {
    const start = specialSwipeStartX.current[projectId];
    const end = e.changedTouches?.[0]?.clientX;
    specialSwipeStartX.current[projectId] = null;
    if (start == null || end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < 42) return;
    cycleSpecialImage(projectId, delta < 0 ? 1 : -1, total);
  };

  const onGalleryImageLoad = (metaKey, e) => {
    const img = e.currentTarget;
    if (!img?.naturalWidth || !img?.naturalHeight) return;
    setImageMeta((prev) => ({
      ...prev,
      [metaKey]: {
        ratio: img.naturalWidth / img.naturalHeight,
      },
    }));
  };

  return (
    <section className="fashion-project-flow" id="fashion">
      {PROJECTS.map((project, index) => {
        const isSpecialVertical = index === 0 || index === PROJECTS.length - 1;

        const gallery = (
          <div className="fashion-project-gallery-shell">
            <button
              type="button"
              className="fashion-project-gallery-arrow fashion-project-gallery-arrow--left"
              aria-label="Scroll project images left"
              onClick={() => scrollGallery(project.id, -1)}
            >
              ‹
            </button>

            <div
              className="fashion-project-gallery-track"
              ref={(el) => {
                if (el) galleryRefs.current[project.id] = el;
              }}
            >
              {project.images.map((src, idx) => (
                <figure
                  key={`${project.id}-image-${idx}`}
                  className={`fashion-project-gallery-card${imageMeta[`${project.id}-${idx}`] ? ' is-loaded' : ''}`}
                  style={{ '--img-ratio': imageMeta[`${project.id}-${idx}`]?.ratio ?? 1.25 }}
                >
                  <button
                    type="button"
                    className="fashion-project-gallery-imageBtn"
                    onClick={() => openLightbox(project.images, idx)}
                    aria-label={`Open image ${idx + 1}`}
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 88vw, 42vw"
                      onLoad={(e) => onGalleryImageLoad(`${project.id}-${idx}`, e)}
                    />
                  </button>
                </figure>
              ))}
            </div>

            <button
              type="button"
              className="fashion-project-gallery-arrow fashion-project-gallery-arrow--right"
              aria-label="Scroll project images right"
              onClick={() => scrollGallery(project.id, 1)}
            >
              ›
            </button>
          </div>
        );

        const video = (
          <div className={`fashion-project-video-wrap${isSpecialVertical ? ' fashion-project-video-wrap--first' : ''}`}>
            <BorderGlow
              className="hero-border-glow fashion-project-video-glow"
              backgroundColor="transparent"
              borderRadius={10}
              glowRadius={28}
              glowColor="270 80 75"
              colors={['#a78bfa', '#818cf8', '#7dd3fc']}
              fillOpacity={0.15}
              glowIntensity={1.2}
              edgeSensitivity={20}
            >
              {project.videoSrc ? (
                <VideoPlayer
                  src={project.videoSrc}
                  className={isSpecialVertical ? 'fashion-project-video--vertical' : ''}
                />
              ) : (
                <VideoPlayer
                  placeholder
                  placeholderSrc={project.placeholderSrc}
                  className={isSpecialVertical ? 'fashion-project-video--vertical' : ''}
                />
              )}
            </BorderGlow>
          </div>
        );

        return (
          <article key={project.id} className={`fashion-project-block${isSpecialVertical ? ' fashion-project-block--first' : ''}`}>
            {isSpecialVertical ? (
              <>
                <div className="fashion-project-first-campaign">
                  <div className="fashion-project-first-videoCol">
                    {video}
                    <p className="fashion-hero-caption fashion-project-caption fashion-project-caption--first">
                      {index === 0 ? 'Bridal Collection Summer 2022' : project.caption}
                    </p>
                  </div>

                  <div className="fashion-project-first-viewerCol">
                    <div className="fashion-project-first-viewer">
                      <button
                        type="button"
                        className="fashion-project-gallery-arrow fashion-project-gallery-arrow--left"
                        aria-label="Previous image"
                        onClick={() => cycleSpecialImage(project.id, -1, project.images.length)}
                      >
                        ‹
                      </button>

                      <button
                        type="button"
                        className="fashion-project-first-viewerImageBtn"
                        onClick={() => openLightbox(project.images, specialImageIndex[project.id] ?? 0)}
                        onTouchStart={(e) => onSpecialViewerTouchStart(project.id, e)}
                        onTouchEnd={(e) => onSpecialViewerTouchEnd(project.id, project.images.length, e)}
                        aria-label="Open image"
                      >
                        <img
                          key={project.images[specialImageIndex[project.id] ?? 0]}
                          className="fashion-project-first-viewerImage"
                          src={project.images[specialImageIndex[project.id] ?? 0]}
                          alt=""
                          loading="lazy"
                        />
                      </button>

                      <button
                        type="button"
                        className="fashion-project-gallery-arrow fashion-project-gallery-arrow--right"
                        aria-label="Next image"
                        onClick={() => cycleSpecialImage(project.id, 1, project.images.length)}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {video}
                {gallery}
                <p className="fashion-hero-caption fashion-project-caption">{project.caption}</p>
              </>
            )}
          </article>
        );
      })}

      <Lightbox
        open={lightboxState.open}
        close={() => setLightboxState((prev) => ({ ...prev, open: false }))}
        index={lightboxState.index}
        slides={lightboxState.slides}
        controller={{ closeOnBackdropClick: true }}
        animation={{ fade: 240, swipe: 280 }}
      />
    </section>
  );
}

