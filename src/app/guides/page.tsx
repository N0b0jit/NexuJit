import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'How-to Guides - Nobojitudio',
    description: 'Detailed guides on how to use our tools and improve your SEO.',
};

export default function GuidesPage() {
    const guides = [
        {
            title: 'How to Optimize YouTube Tags',
            excerpt: 'Learn the best strategies to find high-ranking tags for your videos.',
            link: '#'
        },
        {
            title: 'Understanding Robots.txt',
            excerpt: 'A complete guide to controlling crawler access to your website.',
            link: '#'
        },
        {
            title: 'Image Compression Best Practices',
            excerpt: 'Reduce file size without losing quality for faster loading speeds.',
            link: '#'
        }
    ];

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <div className="header">
                <h1 className="page-title">How-to Guides</h1>
                <p>Master digital marketing with our step-by-step tutorials.</p>
            </div>

            <div className="guides-grid">
                {guides.map((guide, i) => (
                    <Link href={guide.link} key={i} className="guide-card">
                        <div className="icon">
                            <BookOpen size={32} />
                        </div>
                        <div className="content">
                            <h3>{guide.title}</h3>
                            <p>{guide.excerpt}</p>
                            <span className="read-more">Read Guide <ArrowRight size={16} /></span>
                        </div>
                    </Link>
                ))}
            </div>

            <style>{`
                .header { text-align: center; margin-bottom: 4rem; }
                .page-title { font-size: 3rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--foreground); }
                .guides-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
                .guide-card { background: var(--surface); border: 1px solid var(--border); padding: 2rem; border-radius: 1.5rem; display: flex; gap: 1.5rem; transition: all 0.2s; align-items: start; }
                .guide-card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: var(--shadow-lg); }
                .icon { background: var(--primary-soft); color: var(--primary); padding: 1rem; border-radius: 1rem; }
                .content h3 { margin-bottom: 0.5rem; font-size: 1.25rem; }
                .content p { color: var(--secondary); margin-bottom: 1rem; font-size: 0.95rem; line-height: 1.6; }
                .read-more { font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
            `}</style>
        </div>
    );
}
