'use client';

import { useState, useEffect } from 'react';
import { Globe, RefreshCw, MapPin, Wifi } from 'lucide-react';

export default function MyIpTool() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchIp = async () => {
        setLoading(true);
        try {
            // Try ipwho.is first (reliable, loose limits)
            const res = await fetch('https://ipwho.is/');
            const json = await res.json();

            if (!json.success) {
                // If ipwho.is fails (it returns success: false on failure), throw to try fallback
                throw new Error(json.message || 'Failed to fetch IP');
            }

            setData({
                ip: json.ip,
                city: json.city,
                region: json.region,
                country_name: json.country,
                org: json.connection?.isp || json.connection?.org || 'Unknown ISP'
            });
        } catch (e) {
            console.warn('Primary IP fetch failed, trying fallback...', e);
            try {
                // Fallback to ipapi.co
                const res = await fetch('https://ipapi.co/json/');
                const json = await res.json();
                if (json.error) throw new Error(json.reason);
                setData(json);
            } catch (err) {
                console.error('All IP fetch methods failed', err);
                setData(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIp();
    }, []);

    if (loading) return <div className="loader">Loading IP details...</div>;
    if (!data) return <div className="error">Failed to load IP details.</div>;

    return (
        <div className="tool-ui">
            <div className="ip-card">
                <div className="main-ip">
                    <div className="label">Your IP Address</div>
                    <div className="value">{data.ip}</div>
                </div>

                <div className="details-grid">
                    <div className="detail-item">
                        <MapPin size={20} className="icon" />
                        <div>
                            <span className="lbl">Location</span>
                            <span className="val">{data.city}, {data.region}, {data.country_name}</span>
                        </div>
                    </div>
                    <div className="detail-item">
                        <Wifi size={20} className="icon" />
                        <div>
                            <span className="lbl">ISP</span>
                            <span className="val">{data.org}</span>
                        </div>
                    </div>
                </div>

                <button onClick={fetchIp} className="refresh-btn">
                    <RefreshCw size={16} /> Refresh Data
                </button>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .loader { text-align: center; padding: 2rem; color: var(--secondary); font-weight: 600; }
                
                .ip-card { background: var(--surface); padding: 3rem; border-radius: 2rem; border: 1px solid var(--border); box-shadow: var(--shadow-lg); text-align: center; }
                
                .main-ip { margin-bottom: 3rem; }
                .label { font-size: 0.9rem; text-transform: uppercase; color: var(--secondary); font-weight: 700; margin-bottom: 0.5rem; letter-spacing: 0.1em; }
                .value { font-size: 3.5rem; font-weight: 800; color: var(--primary); line-height: 1; }

                .details-grid { display: grid; gap: 2rem; text-align: left; margin-bottom: 2rem; border-top: 1px solid var(--border); padding-top: 2rem; }
                .detail-item { display: flex; gap: 1rem; align-items: flex-start; }
                .icon { color: var(--primary); margin-top: 0.25rem; }
                .lbl { display: block; font-size: 0.8rem; font-weight: 700; color: var(--secondary); }
                .val { font-size: 1.1rem; font-weight: 600; color: var(--foreground); }

                .refresh-btn { margin-top: 1rem; color: var(--secondary); display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 600; transition: color 0.2s; }
                .refresh-btn:hover { color: var(--primary); }
            `}</style>
        </div>
    );
}
