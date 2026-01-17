import type { Metadata } from 'next';
import { Tag, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Deals & Coupons - Nobojitudio',
    description: 'Exclusive deals and discounts for SEO tools and web hosting.',
};

export default function DealsPage() {
    const deals = [
        {
            title: 'Hostinger web hosting',
            discount: '75% OFF',
            code: 'NOBOJIT2024',
            link: '#',
            desc: 'Get high-speed web hosting with a free domain name.'
        },
        {
            title: 'Semrush Pro',
            discount: '14 Days Free',
            code: 'LINK',
            link: '#',
            desc: 'Try the leading SEO tool for free for 2 weeks.'
        },
        // Add more deals here
    ];

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <div className="header">
                <h1 className="page-title">Deals & Coupons</h1>
                <p>Save money on the best tools and services.</p>
            </div>

            <div className="deals-grid">
                {deals.map((deal, i) => (
                    <div key={i} className="deal-card">
                        <div className="deal-badge">{deal.discount}</div>
                        <h3>{deal.title}</h3>
                        <p>{deal.desc}</p>
                        <div className="code-box">
                            <span>Code:</span> <strong>{deal.code}</strong>
                        </div>
                        <a href={deal.link} className="deal-btn">Grab Deal <ExternalLink size={16} /></a>
                    </div>
                ))}
            </div>

            <style>{`
                .header { text-align: center; margin-bottom: 3rem; }
                .page-title { font-size: 3rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--foreground); }
                .deals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
                .deal-card { background: var(--surface); border: 1px solid var(--border); padding: 2rem; border-radius: 1.5rem; position: relative; display: flex; flex-direction: column; }
                .deal-badge { position: absolute; top: -10px; right: 2rem; background: #ef4444; color: white; padding: 0.5rem 1rem; border-radius: 99px; font-weight: 800; font-size: 0.8rem; letter-spacing: 0.05em; }
                .deal-card h3 { font-size: 1.5rem; margin-bottom: 1rem; margin-top: 0.5rem; }
                .deal-card p { color: var(--secondary); margin-bottom: 1.5rem; flex: 1; }
                .code-box { background: var(--background); padding: 1rem; border-radius: 0.5rem; border: 1px dashed var(--border); text-align: center; margin-bottom: 1.5rem; font-family: monospace; font-size: 1.1rem; }
                .deal-btn { background: var(--primary); color: white; padding: 0.8rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 700; transition: transform 0.2s; }
                .deal-btn:hover { transform: translateY(-2px); }
            `}</style>
        </div>
    );
}
