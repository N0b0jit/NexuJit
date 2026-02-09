'use client';

import Link from 'next/link';
import { categories } from '@/data/tools';
import { ArrowRight, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';

export default function ToolsDirectory() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className="tools-directory-page">
            <section className="directory-hero">
                <div className="hero-glow"></div>
                <div className="container relative">
                    <div className="badge animate-bounce-slow">200+ Professional Tools</div>
                    <h1>Explore the <span className="text-gradient">Ultimate</span> Toolbox</h1>
                    <p>Powerful, free, and privacy-focused utilities designed for developers, creators, and SEO experts.</p>
                    <div className="search-wrap">
                        <SearchBar />
                    </div>
                </div>
            </section>

            <section className="tools-browser">
                <div className="container">
                    <div className="browser-header">
                        <div className="stats">
                            <span className="count-dot"></span>
                            <span>{categories.reduce((acc, cat) => acc + cat.tools.length, 0)} Tools Available</span>
                        </div>
                        <div className="view-toggle">
                            <button
                                className={viewMode === 'grid' ? 'active' : ''}
                                onClick={() => setViewMode('grid')}
                                title="Grid View"
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                className={viewMode === 'list' ? 'active' : ''}
                                onClick={() => setViewMode('list')}
                                title="List View"
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="category-navigation custom-scrollbar">
                        {categories.map(cat => (
                            <a key={cat.id} href={`#${cat.id}`} className="cat-chip">
                                <cat.icon size={14} />
                                {cat.title}
                            </a>
                        ))}
                    </div>

                    <div className="categories-stack">
                        {categories.map((category) => (
                            <div key={category.id} id={category.id} className="category-block animate-fade-in">
                                <div className="category-block-header">
                                    <div className="icon-box">
                                        <category.icon size={22} />
                                    </div>
                                    <div className="text">
                                        <h2>{category.title}</h2>
                                        <div className="badge-small">{category.tools.length} Tools</div>
                                    </div>
                                </div>

                                <div className={viewMode === 'grid' ? 'tools-grid' : 'tools-list'}>
                                    {category.tools.map((tool) => (
                                        <Link href={tool.href} key={tool.name} className="tool-item">
                                            <div className="tool-content">
                                                <div className="tool-header">
                                                    <h3>{tool.name}</h3>
                                                    <div className="arrow-box">
                                                        <ArrowRight size={14} />
                                                    </div>
                                                </div>
                                                <p>{tool.description}</p>
                                            </div>
                                            <div className="tool-hover-glow"></div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx>{`
                .tools-directory-page { 
                    padding-bottom: 8rem; 
                    background: var(--background);
                    min-height: 100vh;
                }
                
                .directory-hero { 
                    padding: 8rem 0 6rem; 
                    position: relative;
                    text-align: center;
                    overflow: hidden;
                }

                .hero-glow {
                    position: absolute;
                    top: -100px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 600px;
                    height: 400px;
                    background: var(--primary);
                    filter: blur(140px);
                    opacity: 0.15;
                    pointer-events: none;
                }

                .badge {
                    display: inline-block;
                    padding: 0.5rem 1.25rem;
                    background: var(--primary-soft);
                    color: var(--primary);
                    border-radius: 2rem;
                    font-size: 0.85rem;
                    font-weight: 800;
                    margin-bottom: 2rem;
                    border: 1px solid var(--primary-border);
                }

                .text-gradient {
                    background: linear-gradient(135deg, var(--primary), #8B5CF6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .directory-hero h1 { 
                    font-size: 4.5rem; 
                    font-weight: 900; 
                    margin-bottom: 1.5rem; 
                    letter-spacing: -0.05em; 
                    line-height: 1.1;
                    color: var(--foreground);
                }

                .directory-hero p { 
                    color: var(--secondary); 
                    font-size: 1.25rem; 
                    margin-bottom: 3.5rem; 
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .search-wrap { 
                    max-width: 800px; 
                    margin: 0 auto; 
                    position: relative;
                    z-index: 10;
                }

                .browser-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin: 4rem 0 2rem; 
                    padding: 1.5rem;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 1.5rem;
                }

                .stats { display: flex; align-items: center; gap: 0.75rem; }
                .count-dot { width: 8px; height: 8px; border-radius: 50%; background: #10B981; box-shadow: 0 0 10px #10B981; }
                .stats span { font-weight: 800; color: var(--foreground); font-size: 0.95rem; }
                
                .view-toggle { 
                    display: flex; 
                    gap: 0.5rem; 
                    background: var(--background); 
                    padding: 0.35rem; 
                    border-radius: 1rem; 
                    border: 1px solid var(--border); 
                }
                .view-toggle button { 
                    padding: 0.6rem; 
                    border-radius: 0.75rem; 
                    color: var(--secondary); 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .view-toggle button:hover { color: var(--primary); }
                .view-toggle button.active { 
                    background: var(--primary); 
                    color: white; 
                    box-shadow: 0 4px 12px var(--primary-soft);
                }

                .category-navigation { 
                    display: flex; 
                    gap: 1rem; 
                    overflow-x: auto;
                    padding: 0.5rem 0 2rem;
                    margin-bottom: 4rem;
                    scrollbar-width: none;
                }
                .category-navigation::-webkit-scrollbar { display: none; }

                .cat-chip { 
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    white-space: nowrap;
                    padding: 0.75rem 1.5rem; 
                    border-radius: 1.25rem; 
                    background: var(--surface); 
                    border: 1px solid var(--border); 
                    font-size: 0.9rem; 
                    font-weight: 700; 
                    color: var(--secondary); 
                    transition: all 0.3s;
                }
                .cat-chip:hover { 
                    border-color: var(--primary); 
                    color: var(--primary); 
                    background: var(--primary-soft);
                    transform: translateY(-3px);
                }

                .category-block { margin-bottom: 6rem; scroll-margin-top: 100px; }
                .category-block-header { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2.5rem; }
                .icon-box { 
                    background: linear-gradient(135deg, var(--primary), #8B5CF6); 
                    color: white; 
                    padding: 0.85rem; 
                    border-radius: 1.25rem; 
                    box-shadow: 0 8px 16px var(--primary-soft);
                }
                .category-block-header h2 { font-size: 2rem; font-weight: 900; color: var(--foreground); }
                .badge-small { 
                    display: inline-block;
                    font-size: 0.75rem; 
                    font-weight: 800; 
                    color: var(--primary); 
                    background: var(--primary-soft); 
                    padding: 0.2rem 0.75rem; 
                    border-radius: 2rem;
                    margin-top: 0.25rem;
                }

                .tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
                .tools-grid .tool-item { 
                    position: relative;
                    background: var(--surface); 
                    border: 1px solid var(--border); 
                    padding: 2rem; 
                    border-radius: 2rem; 
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                
                .tool-content { position: relative; z-index: 2; }
                .tool-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }
                .tools-grid h3 { font-size: 1.25rem; font-weight: 800; color: var(--foreground); letter-spacing: -0.02em; }
                .arrow-box { 
                    width: 32px; height: 32px; border-radius: 50%; 
                    background: var(--background); border: 1px solid var(--border);
                    display: flex; align-items: center; justify-content: center;
                    color: var(--secondary); transition: all 0.3s;
                }

                .tools-grid p { font-size: 0.95rem; color: var(--secondary); line-height: 1.6; }

                .tools-grid .tool-item:hover { 
                    transform: translateY(-8px); 
                    border-color: var(--primary);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                }
                .tools-grid .tool-item:hover .arrow-box { 
                    background: var(--primary); 
                    color: white; 
                    border-color: var(--primary);
                    transform: rotate(-45deg);
                }

                .tool-hover-glow {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: radial-gradient(circle at center, var(--primary-soft), transparent 70%);
                    opacity: 0; transition: opacity 0.4s; pointer-events: none;
                }
                .tool-item:hover .tool-hover-glow { opacity: 0.5; }

                .tools-list { display: flex; flex-direction: column; gap: 1rem; }
                .tools-list .tool-item { 
                    background: var(--surface); 
                    border: 1px solid var(--border); 
                    padding: 1.25rem 2.5rem; 
                    border-radius: 1.5rem; 
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between;
                    transition: all 0.3s;
                }
                .tools-list .tool-item:hover { 
                    border-color: var(--primary); 
                    background: var(--primary-soft); 
                    transform: translateX(10px);
                }
                .tools-list .tool-header { margin-bottom: 0; align-items: center; gap: 2rem; width: 100%; }
                .tools-list h3 { font-size: 1.1rem; font-weight: 800; min-width: 250px; }
                .tools-list p { font-size: 0.9rem; color: var(--secondary); flex: 1; margin: 0; }

                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
                
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }

                @media (max-width: 1024px) {
                    .directory-hero h1 { font-size: 3.5rem; }
                }
                @media (max-width: 768px) {
                    .directory-hero h1 { font-size: 2.75rem; }
                    .directory-hero p { font-size: 1.1rem; }
                    .tools-list .tool-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
                    .tools-list h3 { min-width: auto; }
                    .tools-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
