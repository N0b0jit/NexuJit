'use client';

import { useState } from 'react';
import { Search, Info, CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

export default function HttpStatusCode() {
    const [search, setSearch] = useState('');

    const codes = [
        { code: 200, title: 'OK', desc: 'The request succeeded.', category: 'Success', icon: CheckCircle, color: '#10b981' },
        { code: 201, title: 'Created', desc: 'The request succeeded, and a new resource was created as a result.', category: 'Success', icon: CheckCircle, color: '#10b981' },
        { code: 204, title: 'No Content', desc: 'The server successfully processed the request and is not returning any content.', category: 'Success', icon: CheckCircle, color: '#10b981' },
        { code: 301, title: 'Moved Permanently', desc: 'The URL of the requested resource has been changed permanently.', category: 'Redirection', icon: Info, color: '#3b82f6' },
        { code: 302, title: 'Found', desc: 'The URI of requested resource has been changed temporarily.', category: 'Redirection', icon: Info, color: '#3b82f6' },
        { code: 304, title: 'Not Modified', desc: 'Indicates that the resource has not been modified since the version specified by the request headers.', category: 'Redirection', icon: Info, color: '#3b82f6' },
        { code: 400, title: 'Bad Request', desc: 'The server cannot or will not process the request due to an apparent client error.', category: 'Client Error', icon: AlertTriangle, color: '#f59e0b' },
        { code: 401, title: 'Unauthorized', desc: 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.', category: 'Client Error', icon: AlertTriangle, color: '#f59e0b' },
        { code: 403, title: 'Forbidden', desc: 'The request was valid, but the server is refusing action.', category: 'Client Error', icon: AlertTriangle, color: '#f59e0b' },
        { code: 404, title: 'Not Found', desc: 'The requested resource could not be found but may be available in the future.', category: 'Client Error', icon: AlertTriangle, color: '#f59e0b' },
        { code: 429, title: 'Too Many Requests', desc: 'The user has sent too many requests in a given amount of time.', category: 'Client Error', icon: AlertTriangle, color: '#f59e0b' },
        { code: 500, title: 'Internal Server Error', desc: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.', category: 'Server Error', icon: XCircle, color: '#ef4444' },
        { code: 502, title: 'Bad Gateway', desc: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.', category: 'Server Error', icon: XCircle, color: '#ef4444' },
        { code: 503, title: 'Service Unavailable', desc: 'The server is currently unavailable (because it is overloaded or down for maintenance).', category: 'Server Error', icon: XCircle, color: '#ef4444' },
        { code: 504, title: 'Gateway Timeout', desc: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.', category: 'Server Error', icon: XCircle, color: '#ef4444' },
    ];

    const filteredCodes = codes.filter(c =>
        c.code.toString().includes(search) ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.desc.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="tool-ui">
            <div className="search-section">
                <div className="search-bar">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search code (e.g., 404) or name..."
                    />
                </div>
            </div>

            <div className="codes-grid">
                {filteredCodes.map((c) => {
                    const Icon = c.icon;
                    return (
                        <div key={c.code} className="code-card" style={{ borderLeftColor: c.color }}>
                            <div className="code-header">
                                <span className="code-num" style={{ color: c.color }}>{c.code}</span>
                                <span className="code-cat" style={{ background: `${c.color}20`, color: c.color }}>{c.category}</span>
                            </div>
                            <h3>{c.title}</h3>
                            <p>{c.desc}</p>
                            <div className="icon-bg" style={{ color: `${c.color}15` }}>
                                <Icon size={80} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                
                .search-section { margin-bottom: 3rem; }
                .search-bar { background: var(--surface); padding: 1rem; border-radius: 1rem; border: 1px solid var(--border); display: flex; align-items: center; gap: 1rem; box-shadow: var(--shadow); }
                .search-bar input { flex: 1; border: none; background: transparent; font-size: 1.1rem; outline: none; color: var(--foreground); }
                .search-icon { color: var(--secondary); }

                .codes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
                
                .code-card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); border-left-width: 6px; position: relative; overflow: hidden; transition: transform 0.2s; }
                .code-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
                
                .code-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .code-num { font-size: 2.5rem; font-weight: 800; line-height: 1; }
                .code-cat { font-size: 0.75rem; padding: 0.4rem 0.8rem; border-radius: 2rem; font-weight: 700; text-transform: uppercase; }
                
                h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; }
                p { color: var(--secondary); font-size: 0.95rem; line-height: 1.6; position: relative; z-index: 1; }

                .icon-bg { position: absolute; bottom: -20px; right: -20px; transform: rotate(-15deg); }
                
                @media(max-width: 640px) { .codes-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
