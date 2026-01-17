import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us - Nobojitudio',
    description: 'Get in touch with the Nobojitudio team.',
};

export default function ContactPage() {
    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
            <h1 className="page-title">Contact Us</h1>
            <p className="subtitle">Have questions or suggestions? We'd love to hear from you.</p>

            <div className="contact-grid">
                <div className="contact-item">
                    <div className="icon"><Mail size={24} /></div>
                    <h3>Email Us</h3>
                    <p>support@nobojitudio.com</p>
                </div>
                {/* 
                <div className="contact-item">
                    <div className="icon"><Phone size={24} /></div>
                    <h3>Call Us</h3>
                    <p>+1 (555) 123-4567</p>
                </div>
                */}
                <div className="contact-item">
                    <div className="icon"><MapPin size={24} /></div>
                    <h3>Location</h3>
                    <p>Global / Remote</p>
                </div>
            </div>

            <div className="form-section">
                <h2>Send a Message</h2>
                <form className="contact-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Your Name" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="your@email.com" required />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea placeholder="How can we help you?" rows={5} required></textarea>
                    </div>
                    <button type="submit" className="submit-btn">Send Message</button>
                    <p className="note">* This form is currently a demo.</p>
                </form>
            </div>

            <style>{`
                .page-title { font-size: 3rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--foreground); }
                .subtitle { font-size: 1.2rem; color: var(--secondary); margin-bottom: 3rem; }
                
                .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 4rem; }
                .contact-item { background: var(--surface); padding: 2rem; border-radius: 1rem; border: 1px solid var(--border); text-align: center; }
                .icon { width: 50px; height: 50px; background: var(--primary-soft); color: var(--primary); display: flex; align-items: center; justify-content: center; border-radius: 50%; margin: 0 auto 1rem; }
                .contact-item h3 { font-size: 1.2rem; margin-bottom: 0.5rem; }
                .contact-item p { color: var(--secondary); }

                .form-section { background: var(--surface); padding: 2.5rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                .form-section h2 { margin-bottom: 1.5rem; font-size: 1.5rem; }
                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--secondary); }
                .form-group input, .form-group textarea { width: 100%; padding: 0.8rem; border-radius: 0.5rem; border: 2px solid var(--border); background: var(--background); font-family: inherit; }
                .submit-btn { background: var(--primary); color: white; padding: 1rem 2rem; border-radius: 0.5rem; font-weight: 700; width: 100%; }
                .note { margin-top: 1rem; font-size: 0.8rem; color: var(--secondary); text-align: center; }
            `}</style>
        </div>
    );
}
