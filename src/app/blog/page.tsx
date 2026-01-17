import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User } from 'lucide-react';

export const metadata: Metadata = {
    title: 'SEO Blog - Nobojitudio',
    description: 'Latest insights, tips, and news from the world of SEO and Development.',
};

export default function BlogPage() {
    const posts = [
        {
            title: 'Top 10 SEO Tools for 2026',
            excerpt: 'Check out the must-have tools to rank #1 on Google this year.',
            date: 'Jan 10, 2026',
            author: 'Nobojit',
            slug: '#'
        },
        {
            title: 'Why Site Speed Matters',
            excerpt: 'How page load time affects your bounce rate and search rankings.',
            date: 'Jan 05, 2026',
            author: 'Team',
            slug: '#'
        },
        // Add more placeholders
    ];

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <div className="header">
                <h1 className="page-title">SEO Blog</h1>
                <p>Latest updates and articles.</p>
            </div>

            <div className="blog-grid">
                {posts.map((post, i) => (
                    <article key={i} className="post-card">
                        <div className="post-content">
                            <div className="meta">
                                <span><Calendar size={14} /> {post.date}</span>
                                <span><User size={14} /> {post.author}</span>
                            </div>
                            <h3><Link href={post.slug}>{post.title}</Link></h3>
                            <p>{post.excerpt}</p>
                            <Link href={post.slug} className="read-btn">Read Article</Link>
                        </div>
                    </article>
                ))}
            </div>

            <style>{`
                .header { text-align: center; margin-bottom: 4rem; }
                .page-title { font-size: 3rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--foreground); }
                .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
                .post-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; overflow: hidden; transition: all 0.2s; }
                .post-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); border-color: var(--primary); }
                .post-content { padding: 2rem; }
                .meta { display: flex; gap: 1rem; color: var(--secondary); font-size: 0.8rem; margin-bottom: 1rem; }
                .meta span { display: flex; align-items: center; gap: 0.4rem; }
                .post-content h3 { margin-bottom: 0.75rem; font-size: 1.4rem; line-height: 1.3; }
                .post-content p { color: var(--secondary); margin-bottom: 1.5rem; line-height: 1.6; }
                .read-btn { color: var(--primary); font-weight: 700; text-decoration: underline; text-decoration-color: transparent; transition: all 0.2s; }
                .read-btn:hover { text-decoration-color: var(--primary); }
            `}</style>
        </div>
    );
}
