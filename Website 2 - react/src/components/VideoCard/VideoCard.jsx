import { useRef, useState } from 'react';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import './VideoCard.css';

export default function VideoCard({ src, ratio = '16:9', fill = false }) {
  const [active, setActive] = useState(false);
  const videoRef = useRef(null);

  // Seek to first frame once metadata is ready
  const handleMeta = () => {
    if (videoRef.current) videoRef.current.currentTime = 0.001;
  };

  if (active) return <VideoPlayer src={src} />;

  return (
    <div
      className={`vc ${fill ? 'vc--fill' : ratio === '9:16' ? 'vc--916' : 'vc--169'}`}
      onClick={() => setActive(true)}
    >
      <video
        ref={videoRef}
        src={src}
        preload="metadata"
        muted
        playsInline
        onLoadedMetadata={handleMeta}
        className="vc__thumb"
      />
      <div className="vc__overlay">
        <div className="vc__play-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M8 5.14v14l11-7-11-7z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
