'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getImageUrl } from '@/services/api';

export default function WatchClient({ movie, episodes, initialServer = 0, initialEpisodeSlug = '' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeServerIdx, setActiveServerIdx] = useState(initialServer);
  const [activeEpisodeSlug, setActiveEpisodeSlug] = useState(initialEpisodeSlug);
  // State for saved watch position and modal visibility
  const [savedPos, setSavedPos] = useState(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  // Load last watched position from localStorage if URL params are not present
  useEffect(() => {
    if (!searchParams.get('server') && !searchParams.get('episode')) {
      try {
        const stored = localStorage.getItem(`${movie.slug}-last`);
        if (stored) {
          const { server, episode } = JSON.parse(stored);
          setSavedPos({ server, episode });
          setShowResumePrompt(true);
          return; // defer applying until user decides
        }
      } catch (_) {}
    }
    // No saved position or URL already has params – start normally
    setShowResumePrompt(false);
  }, []);

  // Apply saved position when user chooses to resume
  const handleResume = () => {
    if (savedPos) {
      handleEpisodeChange(savedPos.server, savedPos.episode);
      setShowResumePrompt(false);
    }
  };

  // Start from beginning – clear stored position
  const handleStartOver = () => {
    localStorage.removeItem(`${movie.slug}-last`);
    setShowResumePrompt(false);
    // Ensure defaults (initialServer / initialEpisodeSlug) are used – they are already set
    setActiveServerIdx(initialServer);
    setActiveEpisodeSlug(initialEpisodeSlug);
    // Update URL to reflect start‑over (first episode will be set by effect later)
    router.replace(`/xem-phim/${movie.slug}?server=${initialServer}\u0026episode=${initialEpisodeSlug}`, { scroll: false });
  };

  
  // State for gesture controls
  const [brightness, setBrightness] = useState(1); // range 0.5 - 1.5
  const [volume, setVolume] = useState(1); // range 0 - 1
  // Refs to track touch start positions
  const touchStart = useRef({ x: 0, y: 0, brightness: 1, volume: 1 });

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    touchStart.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      brightness,
      volume,
    };
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const curX = touch.clientX - rect.left;
    const curY = touch.clientY - rect.top;
    const deltaX = curX - touchStart.current.x;
    const deltaY = curY - touchStart.current.y;
    const width = rect.width;

    // Right half -> vertical swipe adjusts volume
    if (touchStart.current.x > width / 2) {
      const newVol = Math.min(1, Math.max(0, touchStart.current.volume - deltaY / rect.height));
      setVolume(newVol);
    } else {
      // Left half -> horizontal swipe adjusts brightness
      const newBright = Math.min(1.5, Math.max(0.5, touchStart.current.brightness + deltaX / width));
      setBrightness(newBright);
    }
  };

  const handleTouchEnd = () => {
    // No action needed; state already updated
  };
  useEffect(() => {
    const serverParam = searchParams.get('server');
    const epParam = searchParams.get('episode');
    
    if (serverParam !== null) {
      setActiveServerIdx(parseInt(serverParam, 10));
    }
    if (epParam !== null) {
      setActiveEpisodeSlug(epParam);
    }
  }, [searchParams]);

  // Handle server and episode switching
  const handleEpisodeChange = (serverIdx, epSlug) => {
    setActiveServerIdx(serverIdx);
    setActiveEpisodeSlug(epSlug);
    // Update the browser URL without full page reload
    router.push(`/xem-phim/${movie.slug}?server=${serverIdx}&episode=${epSlug}`, { scroll: false });
    // Persist watch position
    try {
      localStorage.setItem(`${movie.slug}-last`, JSON.stringify({ server: serverIdx, episode: epSlug }));
    } catch (_) {}
  };

  // Safely retrieve the current episode object
  const currentServer = episodes[activeServerIdx] || episodes[0] || null;
  const currentEpisode = currentServer?.server_data?.find(ep => ep.slug === activeEpisodeSlug) 
    || currentServer?.server_data?.[0] 
    || null;

  // Retrieve current active index for the "Next Episode" feature
  const currentEpIdx = currentServer?.server_data?.findIndex(ep => ep.slug === (currentEpisode?.slug || '')) ?? -1;
  const hasNextEpisode = currentServer && currentEpIdx !== -1 && currentEpIdx < currentServer.server_data.length - 1;
  const nextEpisode = hasNextEpisode ? currentServer.server_data[currentEpIdx + 1] : null;

  const handleNextEpisode = () => {
    if (nextEpisode) {
      handleEpisodeChange(activeServerIdx, nextEpisode.slug);
    }
  };

  const iframeUrl = currentEpisode ? currentEpisode.link_embed : '';
  const episodeName = currentEpisode ? currentEpisode.name : '';

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      {/* Resume Prompt Modal */}
      {showResumePrompt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--glass-bg, #1a1a1a)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            minWidth: '260px',
          }}>
            <h3 className="gradient-text" style={{ marginBottom: '16px' }}>Tiếp tục xem?</h3>
            <p style={{ marginBottom: '24px' }}>Bạn có muốn tiếp tục từ vị trí đã lưu hay bắt đầu lại từ đầu?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={handleResume} className="btn-primary" style={{ flex: 1 }}>
                Tiếp tục
              </button>
              <button onClick={handleStartOver} className="btn-secondary" style={{ flex: 1 }}>
                Xem lại từ đầu
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="detail-bg-blur" style={{ opacity: 0.1 }}>
        <img src={getImageUrl(movie.thumb_url || movie.poster_url)} alt="" />
      </div>

      <div style={{ position: 'relative', zIndex: 2, paddingTop: '20px' }}>
        
        {/* Breadcrumbs */}
        <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <Link href="/" className="footer-link">Trang chủ</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href={`/phim/${movie.slug}`} className="footer-link">{movie.name}</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--accent-red)' }}>Đang phát {episodeName ? `: ${episodeName}` : ''}</span>
        </div>

        {/* Streaming Video Container */}
        <div className="player-container animated-fade-in"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ filter: `brightness(${brightness})` }}
        >
          {iframeUrl ? (
            <iframe
              src={iframeUrl}
              className="iframe-player"
              allow="autoplay"
              allowFullScreen
              scrolling="no"
              title={`Trình phát phim: ${movie.name} - ${episodeName}`}
              style={{ filter: `brightness(${brightness})`, opacity: volume }}
            ></iframe>
          ) : (
            <div className="loader-container" style={{ height: '100%' }}>
              <div className="spinner"></div>
              <p className="empty-state-desc">Đang cấu hình trình phát video...</p>
            </div>
          )}
        </div>

        {/* Player Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
              {movie.name}
            </h1>
            <p className="empty-state-desc" style={{ marginTop: '4px' }}>
              Đang xem: <span style={{ color: 'white', fontWeight: 700 }}>{episodeName || 'Đang tải tập phim'}</span>
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href={`/phim/${movie.slug}`} className="btn-secondary">
              Xem Thông Tin Phim
            </Link>
            {hasNextEpisode && (
              <button onClick={handleNextEpisode} className="btn-primary">
                Tập Tiếp Theo
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
              </button>
            )}
          </div>
        </div>

        {/* Episode Directory Card */}
        {episodes && episodes.length > 0 ? (
          <div className="episodes-card animated-fade-in">
            <h3 className="detail-plot-title" style={{ marginBottom: '24px' }}>Chọn Tập Phim</h3>
            
            {episodes.map((server, serverIdx) => (
              <div key={server.server_name} style={{ marginBottom: serverIdx < episodes.length - 1 ? '24px' : '0' }}>
                <div className="episodes-server-title">
                  Nguồn phát: <span style={{ color: 'white' }}>{server.server_name}</span>
                </div>
                
                <div className="episodes-list">
                  {server.server_data.map((ep) => (
                    <button
                      key={ep.slug}
                      onClick={() => handleEpisodeChange(serverIdx, ep.slug)}
                      className={`episode-btn ${activeServerIdx === serverIdx && activeEpisodeSlug === ep.slug ? 'active' : ''}`}
                    >
                      {ep.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3 className="empty-state-title">Chưa có tập phim nào.</h3>
            <p className="empty-state-desc">Vui lòng quay lại sau.</p>
          </div>
        )}

        {/* Details and Story Plot */}
        <div className="glass-panel" style={{ borderRadius: '16px', padding: '30px', border: '1px solid var(--glass-border)' }}>
          <h3 className="detail-plot-title" style={{ marginBottom: '16px' }}>Nội Dung Phim</h3>
          <p className="detail-plot-text" dangerouslySetInnerHTML={{ __html: movie.content || 'Bộ phim chưa có mô tả nội dung.' }}></p>
        </div>

      </div>
    </div>
  );
}
