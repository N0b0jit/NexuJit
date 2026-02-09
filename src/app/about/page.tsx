import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us - Nobojitudio',
    description: 'Learn more about Nobojitudio and our mission to provide free SEO and web tools.',
};

export default function AboutPage() {
    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
            <h1 className="page-title">About Us</h1>
            <div className="content">
                <p>Welcome to <strong>Nobojitudio</strong>, your number one source for all things SEO and Digital Marketing tools. We're dedicated to providing you the very best of online utilities, with an emphasis on usability, accuracy, and performance.</p>

                <p>Founded in 2026, Nobojitudio has come a long way from its beginnings. When we first started out, our passion for "free accessible web tools" drove us to start our own business.</p>

                <p>We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.</p>

                <h2>Our Mission</h2>
                <p>To empower creators, developers, and marketers with professional-grade tools for free.</p>
            </div>

            <style>{`
                .page-title { font-size: 3rem; font-weight: 800; margin-bottom: 2rem; color: var(--foreground); }
                .content p { font-size: 1.1rem; line-height: 1.8; color: var(--secondary); margin-bottom: 1.5rem; }
                .content h2 { font-size: 2rem; font-weight: 700; margin: 2rem 0 1rem; color: var(--foreground); }
            `}</style>
        </div>
    );
}
