'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Play, Pause, Maximize, RotateCcw, Volume2, VolumeX,
    SkipBack, SkipForward, History, Trash2, ExternalLink,
    Smartphone, Monitor, Zap, Layout, Video, Settings,
    PictureInPicture as PipIcon, ChevronRight, Share2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayedVideo {
    url: string;
    timestamp: number;
    title: string;
}

export default function MeluaPlayer() {
    const [url, setUrl] = useState('');
    const [activeUrl, setActiveUrl] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [history, setHistory] = useState<PlayedVideo[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [volume, setVolume] = useState(1);
    const [isHoveringVolume, setIsHoveringVolume] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showFeedback, setShowFeedback] = useState<'play' | 'pause' | 'seek-f' | 'seek-b' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [videoError, setVideoError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Persistence
    useEffect(() => {
        const saved = localStorage.getItem('meluaplay_history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const saveToHistory = (videoUrl: string) => {
        try {
            const fileName = decodeURIComponent(videoUrl.split('/').pop()?.split('?')[0] || 'Unknown Stream');
            const newHistory = [
                { url: videoUrl, timestamp: Date.now(), title: fileName },
                ...history.filter(h => h.url !== videoUrl)
            ].slice(0, 15);
            setHistory(newHistory);
            localStorage.setItem('meluaplay_history', JSON.stringify(newHistory));
        } catch (e) {
            console.error("Error saving history:", e);
        }
    };

    const handlePlay = () => {
        if (!url) return;
        setVideoError(null);
        setIsLoading(true);
        setActiveUrl(url);
        setIsPlaying(true);
        saveToHistory(url);
    };

    const triggerFeedback = (type: 'play' | 'pause' | 'seek-f' | 'seek-b') => {
        setShowFeedback(type);
        setTimeout(() => setShowFeedback(null), 500);
    };

    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                triggerFeedback('pause');
            } else {
                videoRef.current.play();
                triggerFeedback('play');
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const skip = useCallback((seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
            triggerFeedback(seconds > 0 ? 'seek-f' : 'seek-b');
        }
    }, []);

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('meluaplay_history');
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT') return;

            switch (e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'f':
                    e.preventDefault();
                    handleFullscreen();
                    break;
                case 'm':
                    e.preventDefault();
                    if (videoRef.current) {
                        const newMute = !isMuted;
                        setIsMuted(newMute);
                        videoRef.current.muted = newMute;
                    }
                    break;
                case 'arrowright':
                case 'l':
                    skip(10);
                    break;
                case 'arrowleft':
                case 'j':
                    skip(-10);
                    break;
                case 'arrowup':
                    e.preventDefault();
                    setVolume(v => Math.min(1, v + 0.1));
                    break;
                case 'arrowdown':
                    e.preventDefault();
                    setVolume(v => Math.max(0, v - 0.1));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [togglePlay, skip, isMuted]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
            videoRef.current.muted = isMuted || volume === 0;
        }
    }, [volume, isMuted]);

    // Force video reload when URL changes (critical for MKV playback)
    useEffect(() => {
        if (videoRef.current && activeUrl) {
            videoRef.current.load();
        }
    }, [activeUrl]);

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        if (isPlaying && !showSettings && !isHoveringVolume) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    };

    // Show controls when video starts playing
    useEffect(() => {
        if (activeUrl) {
            setShowControls(true);
        }
    }, [activeUrl]);

    const formatTime = (time: number) => {
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = Math.floor(time % 60);
        if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="melua-container" onMouseMove={handleMouseMove} onMouseLeave={() => isPlaying && setShowControls(false)}>
            <div className="hero-banner">
                <div className="badge">
                    <Zap size={14} className="fill-current text-white" />
                    <span>Proprietary Video Engine</span>
                </div>
                <h1>Melua <span className="text-accent underline decoration-accent/30 underline-offset-8">Nexus</span> Player</h1>
                <p className="max-w-xl mx-auto opacity-70">The world's most accessible MKV & Stream bypasser. Built for pure performance.</p>
            </div>

            <div className={`player-workspace ${activeUrl ? 'active' : ''} group`} ref={containerRef}>
                {!activeUrl ? (
                    <div className="input-hub glass-dark shadow-2xl">
                        <div className="hub-header">
                            <Video className="text-accent" size={32} />
                            <h2>Ready to Initialize</h2>
                        </div>
                        <div className="input-field-container">
                            <input
                                type="text"
                                placeholder="Paste source link (HTTP, MKV, MP4, WEBM)..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
                                className="main-source-input"
                            />
                            <button onClick={handlePlay} className="btn-ignite">
                                <Zap size={18} className="fill-current" />
                                <span>IGNITE STREAM</span>
                            </button>
                        </div>
                        <div className="protocol-hints">
                            <div className="hint-item"><Monitor size={14} /> Desktop Optimized</div>
                            <div className="hint-item"><Smartphone size={14} /> Mobile Bypass</div>
                            <div className="hint-item"><Zap size={14} /> Zero Latency</div>
                        </div>
                    </div>
                ) : (
                    <div className="video-engine-wrap" onMouseMove={handleMouseMove} onMouseEnter={handleMouseMove}>
                        <video
                            ref={videoRef}
                            src={activeUrl}
                            autoPlay
                            playsInline
                            className="video-stage"
                            onClick={togglePlay}
                            onPlay={() => { setIsPlaying(true); setIsLoading(false); }}
                            onPause={() => setIsPlaying(false)}
                            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                            onLoadedMetadata={() => { setDuration(videoRef.current?.duration || 0); setIsLoading(false); }}
                            onLoadStart={() => setIsLoading(true)}
                            onWaiting={() => setIsLoading(true)}
                            onPlaying={() => setIsLoading(false)}
                            onError={(e) => {
                                const mediaError = e.currentTarget.error;
                                let internalMsg = "Unknown media error";
                                if (mediaError) {
                                    switch (mediaError.code) {
                                        case 1: internalMsg = "The fetch process was aborted."; break;
                                        case 2: internalMsg = "Network error prevented playback."; break;
                                        case 3: internalMsg = "Media decoding failed or browser codec mismatch."; break;
                                        case 4: internalMsg = "Format not supported or server unreachable."; break;
                                    }
                                }
                                console.error("High-Level Video Error:", internalMsg, mediaError);
                                setIsLoading(false);
                                setVideoError(`NEXUS_CODEC_LOCK: ${internalMsg}. This typically occurs with MKV/x265 streams that require external player support.`);
                            }}
                        />


                        {/* Feedbacks */}
                        <AnimatePresence>
                            {showFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.5 }}
                                    className="video-feedback-overlay"
                                >
                                    {showFeedback === 'play' && <Play size={48} fill="currentColor" />}
                                    {showFeedback === 'pause' && <Pause size={48} fill="currentColor" />}
                                    {showFeedback === 'seek-f' && <div className="flex flex-col items-center"><SkipForward size={48} /><span className="text-xs font-bold font-mono">+10s</span></div>}
                                    {showFeedback === 'seek-b' && <div className="flex flex-col items-center"><SkipBack size={48} /><span className="text-xs font-bold font-mono">-10s</span></div>}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ELITE CONTROLS */}
                        {showControls && (
                            <div className="ui-overlay">
                                {/* Top Metadata */}
                                <div className="ui-top">
                                    <div className="video-meta">
                                        <div className="status-dot"></div>
                                        <span className="source-title">{decodeURIComponent(activeUrl.split('/').pop()?.split('?')[0] || 'Unknown')}</span>
                                    </div>
                                    <div className="top-actions">
                                        <button className="icon-btn-s"><Share2 size={16} /></button>
                                        <button className="icon-btn-s" onClick={() => setActiveUrl('')}>RESET</button>
                                    </div>
                                </div>

                                {/* Bottom Console */}
                                <div className="ui-bottom">
                                    <div className="scrubber-group">
                                        <div className="progress-bar-wrap">
                                            <input
                                                type="range" min="0" max={duration || 100} value={currentTime}
                                                onChange={(e) => {
                                                    const t = parseFloat(e.target.value);
                                                    if (videoRef.current) videoRef.current.currentTime = t;
                                                    setCurrentTime(t);
                                                }}
                                                className="scrubber-line"
                                            />
                                            <div className="progress-fill" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="console-row">
                                        <div className="console-left">
                                            <button onClick={togglePlay} className="play-toggle">
                                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                                            </button>
                                            <button onClick={() => skip(10)} className="icon-btn"><SkipForward size={20} /></button>

                                            <div className="volume-nexus" onMouseEnter={() => setIsHoveringVolume(true)} onMouseLeave={() => setIsHoveringVolume(false)}>
                                                <button onClick={() => setIsMuted(!isMuted)}>
                                                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                                </button>
                                                <AnimatePresence>
                                                    {isHoveringVolume && (
                                                        <motion.input
                                                            initial={{ width: 0, opacity: 0 }} animate={{ width: 80, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                                                            type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
                                                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                                                            className="vol-slider"
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <div className="time-nexus">
                                                <span>{formatTime(currentTime)}</span>
                                                <span className="opacity-40">/</span>
                                                <span>{formatTime(duration)}</span>
                                            </div>
                                        </div>

                                        <div className="console-right">
                                            <div className="settings-nexus">
                                                <button onClick={() => setShowSettings(!showSettings)} className={`icon-btn ${showSettings ? 'text-accent' : ''}`}>
                                                    <Settings size={20} className={showSettings ? 'rotate-90 transition-transform' : ''} />
                                                </button>
                                                {showSettings && (
                                                    <div className="settings-menu glass-darker">
                                                        <div className="menu-header">Playback Speed</div>
                                                        {[0.5, 1, 1.25, 1.5, 2].map(r => (
                                                            <button key={r} onClick={() => {
                                                                setPlaybackRate(r);
                                                                if (videoRef.current) videoRef.current.playbackRate = r;
                                                                setShowSettings(false);
                                                            }} className={`menu-item ${playbackRate === r ? 'active' : ''}`}>
                                                                {r === 1 ? 'Normal' : `${r}x`}
                                                                {playbackRate === r && <Zap size={12} className="text-accent ml-auto" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (document.pictureInPictureElement) {
                                                        document.exitPictureInPicture();
                                                    } else if (videoRef.current) {
                                                        videoRef.current.requestPictureInPicture();
                                                    }
                                                }}
                                                className="icon-btn"
                                            >
                                                <PipIcon size={20} />
                                            </button>
                                            <button onClick={handleFullscreen} className="icon-btn"><Maximize size={20} /></button>
                                        </div>
                                    </div>
                                </div>

                        )}


                        {/* Loading Overlay */}
                        <AnimatePresence>
                            {isLoading && !videoError && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="loading-overlay"
                                >
                                    <div className="loader-pulse"></div>
                                    <span className="text-xs font-bold tracking-widest text-accent animate-pulse">BUFFERING SYSTEM...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Overlay */}
                        <AnimatePresence>
                            {videoError && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="error-overlay glass-darker"
                                >
                                    <div className="error-content">
                                        <div className="error-icon-box">
                                            <Info size={32} className="text-red-500" />
                                        </div>
                                        <h3>Playback Sequence Failure</h3>
                                        <p>{videoError}</p>
                                        <div className="error-actions">
                                            <div className="bypass-grid">
                                                <button onClick={() => { setActiveUrl(''); setUrl(''); setVideoError(null); }} className="btn-secondary">
                                                    <RotateCcw size={14} /> NEW SOURCE
                                                </button>
                                                <a href={activeUrl} download className="btn-secondary">
                                                    <ExternalLink size={14} /> DOWNLOAD
                                                </a>
                                            </div>
                                            <div className="bypass-primary-row">
                                                <a href={`vlc://${activeUrl}`} className="btn-bypass-vlc">
                                                    <Zap size={16} fill="currentColor" />
                                                    OPEN IN VLC (RECOMMENDED)
                                                </a>
                                            </div>
                                            <div className="bypass-utility">
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(activeUrl);
                                                        alert("Nexus: Source link copied. Use VLC > Open Network Stream.");
                                                    }}
                                                    className="btn-copy-nexus"
                                                >
                                                    COPY SOURCE URL
                                                </button>
                                            </div>
                                            <p className="bypass-hint">Pro Tip: Browsers hate MKV. VLC loves them. Use the Bypass for 4K/HDR content.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <div className="nexus-footer">
                <div className="row">
                    <div className="section">
                        <div className="section-title">
                            <History size={18} className="text-accent" />
                            <h2>Operation Log</h2>
                        </div>
                        <div className="log-scroll">
                            {history.length > 0 ? history.map((item, i) => (
                                <div key={i} className="log-entry" onClick={() => { setUrl(item.url); setActiveUrl(item.url); }}>
                                    <div className="entry-icon"><Video size={16} /></div>
                                    <div className="entry-content">
                                        <span className="entry-name">{item.title}</span>
                                        <span className="entry-meta">{new Date(item.timestamp).toLocaleString()} • {item.url.substring(0, 30)}...</span>
                                    </div>
                                    <ChevronRight size={14} className="entry-arrow" />
                                </div>
                            )) : <div className="empty-log">Log Empty. Awaiting Input.</div>}
                        </div>
                    </div>

                    <div className="section side">
                        <div className="info-card glass">
                            <Info size={24} className="text-accent mb-4" />
                            <h3>Pro Tip</h3>
                            <p>Press <kbd>L</kbd> to skip 10 seconds, <kbd>J</kbd> to go back, and <kbd>F</kbd> for Fullscreen mode.</p>
                            <button onClick={clearHistory} className="purge-btn">PURGE SYSTEM CACHE</button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .melua-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem 10rem; }
                
                .hero-banner { text-align: center; margin-bottom: 4rem; }
                .hero-banner h1 { font-size: 4rem; font-weight: 950; letter-spacing: -3px; margin-bottom: 1rem; color: var(--fg-primary); }
                .badge { display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.6rem 1.2rem; background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 2rem; }

                .player-workspace { position: relative; width: 100%; aspect-ratio: 16/9; margin-bottom: 5rem; border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.7); }
                
                .input-hub { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; gap: 3rem; background: linear-gradient(135deg, rgba(15,15,15,1) 0%, rgba(30,30,30,1) 100%); }
                .hub-header { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .hub-header h2 { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px; color: #fff; }
                
                .input-field-container { width: 100%; max-width: 700px; display: flex; gap: 10px; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
                .main-source-input { flex: 1; background: transparent; border: none; outline: none; padding: 0 1.5rem; color: #fff; font-size: 1rem; font-weight: 600; }
                .btn-ignite { background: var(--accent); color: #fff; padding: 0 2rem; height: 50px; border-radius: 8px; font-weight: 900; display: flex; align-items: center; gap: 10px; transition: 0.2s; }
                .btn-ignite:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(var(--accent-rgb), 0.4); }

                .protocol-hints { display: flex; gap: 2rem; }
                .hint-item { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 800; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; }

                .video-engine-wrap { position: relative; width: 100%; height: 100%; background: #000; cursor: crosshair; overflow: hidden; }
                .video-stage { width: 100%; height: 100%; object-fit: contain; display: block; position: relative; z-index: 1; }



                .video-feedback-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 120px; height: 120px; background: rgba(0,0,0,0.5); border-radius: 50%; display: flex; items-center; justify-content: center; color: #fff; pointer-events: none; z-index: 10; }

                .loading-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.8); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; z-index: 15; }
                .loader-pulse { width: 50px; height: 50px; border: 3px solid var(--accent); border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                .error-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 30; padding: 2rem; }
                .error-content { text-align: center; max-width: 400px; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .error-icon-box { width: 80px; height: 80px; background: rgba(239, 68, 68, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem; }
                .error-content h3 { font-size: 1.25rem; font-weight: 900; color: #fff; }
                .error-content p { font-size: 0.85rem; color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 0.5rem; }
                .error-actions { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 320px; }
                
                .bypass-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
                .btn-secondary { background: rgba(255,255,255,0.05); color: #fff; padding: 0.8rem; border-radius: 8px; font-size: 0.6rem; font-weight: 950; display: flex; align-items: center; justify-content: center; gap: 6px; border: 1px solid rgba(255,255,255,0.1); }
                
                .bypass-primary-row { width: 100%; }
                .btn-bypass-vlc { width: 100%; background: #ff8800; color: #fff; padding: 1rem; border-radius: 10px; font-size: 0.75rem; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 10px 20px rgba(255, 136, 0, 0.3); transition: 0.2s; }
                .btn-bypass-vlc:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(255, 136, 0, 0.5); }
                
                .btn-copy-nexus { width: 100%; background: var(--accent); color: #fff; padding: 0.8rem; border-radius: 8px; font-size: 0.65rem; font-weight: 900; }
                .bypass-hint { font-size: 0.6rem !important; opacity: 0.4; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 1rem; }

                .ui-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; z-index: 20; background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%); }
                
                .ui-top { padding: 2rem; display: flex; justify-content: space-between; align-items: center; }
                .video-meta { display: flex; align-items: center; gap: 12px; }
                .status-dot { width: 8px; height: 8px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 10px #ef4444; }
                .source-title { color: #fff; font-weight: 800; font-size: 1.1rem; text-shadow: 0 2px 10px rgba(0,0,0,1); }
                .top-actions { display: flex; gap: 10px; }
                .icon-btn-s { font-size: 0.65rem; font-weight: 900; color: #fff; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); padding: 6px 15px; border-radius: 5px; }

                .ui-bottom { padding: 1.5rem 2rem; display: flex; flex-direction: column; gap: 10px; }
                .scrubber-group { width: 100%; height: 15px; display: flex; align-items: center; position: relative; }
                .progress-bar-wrap { width: 100%; height: 4px; background: rgba(255,255,255,0.2); position: relative; border-radius: 2px; transition: 0.2s; }
                .progress-bar-wrap:hover { height: 8px; }
                .progress-fill { position: absolute; left: 0; top: 0; height: 100%; background: var(--accent); border-radius: 2px; z-index: 1; pointer-events: none; }
                .scrubber-line { position: absolute; width: 100%; top: 50%; transform: translateY(-50%); opacity: 0; cursor: pointer; z-index: 2; }

                .console-row { display: flex; justify-content: space-between; align-items: center; }
                .console-left, .console-right { display: flex; align-items: center; gap: 20px; }
                .icon-btn { color: #fff; opacity: 0.8; transition: 0.2s; }
                .icon-btn:hover { opacity: 1; transform: scale(1.1); }
                .play-toggle { color: #fff; margin-right: 10px; transition: 0.1s; }
                .play-toggle:active { scale: 0.9; }

                .volume-nexus { display: flex; align-items: center; gap: 10px; }
                .vol-slider { -webkit-appearance: none; height: 3px; background: #fff; border-radius: 5px; cursor: pointer; }

                .time-nexus { display: flex; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #fff; font-weight: 600; }

                .settings-nexus { position: relative; }
                .settings-menu { position: absolute; bottom: 100%; right: 0; margin-bottom: 20px; width: 180px; padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .menu-header { font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.4); text-transform: uppercase; margin-bottom: 8px; padding-left: 10px; }
                .menu-item { width: 100%; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 700; color: #fff; display: flex; align-items: center; transition: 0.2s; }
                .menu-item:hover { background: rgba(255,255,255,0.05); }
                .menu-item.active { color: var(--accent); background: rgba(var(--accent-rgb), 0.1); }

                .nexus-footer { border-top: 1px solid var(--glass-border); padding-top: 4rem; }
                .row { display: grid; grid-template-columns: 1fr 350px; gap: 4rem; }
                .section-title { display: flex; align-items: center; gap: 12px; margin-bottom: 2rem; }
                .section-title h2 { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.5px; }

                .log-scroll { display: flex; flex-direction: column; gap: 10px; max-height: 400px; overflow-y: auto; padding-right: 10px; }
                .log-entry { display: flex; align-items: center; gap: 15px; padding: 1rem; border-radius: 12px; border: 1px solid var(--glass-border); cursor: pointer; transition: 0.2s; }
                .log-entry:hover { background: var(--bg-tertiary); border-color: var(--accent); }
                .entry-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(var(--accent-rgb), 0.1); color: var(--accent); display: flex; items-center; justify-content: center; }
                .entry-content { flex: 1; display: flex; flex-direction: column; }
                .entry-name { font-weight: 800; font-size: 0.9rem; }
                .entry-meta { font-size: 0.7rem; opacity: 0.5; font-weight: 600; }

                .info-card { padding: 2rem; border-radius: 16px; position: sticky; top: 2rem; }
                .info-card h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 1rem; }
                .info-card p { font-size: 0.85rem; opacity: 0.7; line-height: 1.6; margin-bottom: 2rem; }
                kbd { background: #333; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: 800; }
                .purge-btn { width: 100%; padding: 12px; border: 1px solid #ef4444; color: #ef4444; border-radius: 8px; font-size: 0.65rem; font-weight: 900; transition: 0.2s; }
                .purge-btn:hover { background: #ef4444; color: #fff; }

                .glass-dark { background: rgba(10,10,10,0.8); backdrop-filter: blur(20px); }
                .glass-darker { background: rgba(5,5,5,0.95); backdrop-filter: blur(30px); }

                @media (max-width: 900px) {
                    .row { grid-template-columns: 1fr; }
                    .side { display: none; }
                    .hero-banner h1 { font-size: 2.5rem; }
                }
            `}</style>
        </div >
            );
}
