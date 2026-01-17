'use client';

import { useState, useEffect } from 'react';
import { X, Github, Instagram, Linkedin, ExternalLink, Heart } from 'lucide-react';

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Only show once per session
        const shownInSession = sessionStorage.getItem('exitIntentShown');
        if (shownInSession) {
            setHasShown(true);
            return;
        }

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasShown) {
                setIsVisible(true);
                setHasShown(true);
                sessionStorage.setItem('exitIntentShown', 'true');
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasShown]);

    if (!isVisible) return null;

    return (
        <div className="exit-intent-overlay animate-fade-in">
            <div className="exit-intent-card animate-zoom-in">
                <button className="close-btn" onClick={() => setIsVisible(false)}>
                    <X size={20} />
                </button>

                <div className="card-content">
                    <div className="heart-icon">
                        <Heart size={40} fill="#f43f5e" color="#f43f5e" />
                    </div>
                    <h2>Wait! Before you leave...</h2>
                    <p>I hope you found these tools helpful! If you did, would you mind supporting my work by following me or checking out my profile?</p>

                    <div className="social-grid">
                        <a href="https://github.com/nobojit-m" target="_blank" rel="noopener noreferrer" className="social-item github">
                            <Github size={20} />
                            <span>GitHub</span>
                        </a>
                        <a href="https://www.linkedin.com/in/nobojit-majumder-20713a333/" target="_blank" rel="noopener noreferrer" className="social-item linkedin">
                            <Linkedin size={20} />
                            <span>LinkedIn</span>
                        </a>
                        <a href="https://www.instagram.com/mr_nobojit.m" target="_blank" rel="noopener noreferrer" className="social-item instagram">
                            <Instagram size={20} />
                            <span>Instagram</span>
                        </a>
                    </div>

                    <a href="https://nobojit.com" target="_blank" rel="noopener noreferrer" className="cta-btn">
                        Visit My Professional Portfolio <ExternalLink size={16} />
                    </a>
                </div>
            </div>

            <style jsx>{`
                .exit-intent-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }

                .exit-intent-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    max-width: 500px;
                    width: 100%;
                    border-radius: 2.5rem;
                    padding: 3.5rem 2.5rem;
                    position: relative;
                    text-align: center;
                    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
                }

                .close-btn {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    color: var(--secondary);
                    transition: color 0.2s;
                    background: var(--background);
                    border: 1px solid var(--border);
                    padding: 0.5rem;
                    border-radius: 50%;
                    cursor: pointer;
                }
                .close-btn:hover { color: #f43f5e; }

                .heart-icon {
                    margin-bottom: 1.5rem;
                    animation: pulse 2s infinite;
                }

                h2 { font-size: 2rem; font-weight: 900; margin-bottom: 1rem; color: var(--foreground); }
                p { color: var(--secondary); font-size: 1.1rem; line-height: 1.6; margin-bottom: 2.5rem; }

                .social-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .social-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1.25rem 0.5rem;
                    border-radius: 1.25rem;
                    background: var(--background);
                    border: 1px solid var(--border);
                    transition: all 0.3s;
                    text-decoration: none;
                }
                .social-item span { font-size: 0.75rem; font-weight: 700; color: var(--secondary); }
                
                .social-item:hover { transform: translateY(-5px); border-color: var(--primary); }
                .github:hover { background: #333; color: white; border-color: #333; }
                .linkedin:hover { background: #0077b5; color: white; border-color: #0077b5; }
                .instagram:hover { background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); color: white; border-color: transparent; }
                .social-item:hover span { color: white; }

                .cta-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 1.25rem;
                    background: var(--primary);
                    color: white;
                    border-radius: 1.25rem;
                    font-weight: 800;
                    text-decoration: none;
                    transition: all 0.3s;
                    box-shadow: 0 10px 20px var(--primary-soft);
                }
                .cta-btn:hover { transform: scale(1.02); filter: brightness(1.1); }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }

                @keyframes zoom-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-zoom-in { animation: zoom-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

                @media (max-width: 480px) {
                    .social-grid { grid-template-columns: 1fr; }
                    .exit-intent-card { padding: 2.5rem 1.5rem; }
                    h2 { font-size: 1.5rem; }
                }
            `}</style>
        </div>
    );
}
