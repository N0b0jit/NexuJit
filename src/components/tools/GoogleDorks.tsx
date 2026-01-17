'use client';

import { useState } from 'react';
import { ToolShell, Card, Button, Input, Badge, Tabs } from '@/components/ui/Core';
import { Search, FileText, Database, Lock, Globe, Server, AlertTriangle, ExternalLink } from 'lucide-react';

export default function GoogleDorks() {
    const [domain, setDomain] = useState('');
    const [activeTab, setActiveTab] = useState('files');

    const categories = [
        { id: 'files', label: 'Exposed Files', icon: FileText },
        { id: 'login', label: 'Login Pages', icon: Lock },
        { id: 'config', label: 'Config & Env', icon: Server },
        { id: 'database', label: 'Database & SQL', icon: Database },
        { id: 'sensitive', label: 'Sensitive Directories', icon: AlertTriangle },
        { id: 'public', label: 'Public Info', icon: Globe },
    ];

    const dorks: Record<string, Array<{ title: string, query: string, desc: string }>> = {
        files: [
            { title: 'PDF Files', query: `site:${domain || 'example.com'} filetype:pdf`, desc: 'Publicly indexed PDF documents.' },
            { title: 'Excel Spreadsheets', query: `site:${domain || 'example.com'} filetype:xls OR filetype:xlsx OR filetype:csv`, desc: 'Spreadsheets potentially containing data.' },
            { title: 'Word Documents', query: `site:${domain || 'example.com'} filetype:doc OR filetype:docx`, desc: 'Word documents and reports.' },
            { title: 'Text Files', query: `site:${domain || 'example.com'} filetype:txt`, desc: 'Plain text files found on the site.' },
            { title: 'Backup Files', query: `site:${domain || 'example.com'} filetype:bak OR filetype:old OR filetype:backup`, desc: 'Leftover backup files.' }
        ],
        login: [
            { title: 'Admin Login', query: `site:${domain || 'example.com'} inurl:admin OR inurl:login OR inurl:adminlogin`, desc: 'Administrative login portals.' },
            { title: 'Portal Login', query: `site:${domain || 'example.com'} intitle:"login" OR intitle:"signin"`, desc: 'Generic login pages.' },
            { title: 'Signup Pages', query: `site:${domain || 'example.com'} inurl:signup OR inurl:register`, desc: 'User registration pages.' }
        ],
        config: [
            { title: 'Environment Files', query: `site:${domain || 'example.com'} filetype:env OR filetype:env.example`, desc: 'Environment configuration files (High Risk).' },
            { title: 'Configuration Files', query: `site:${domain || 'example.com'} filetype:xml OR filetype:conf OR filetype:cnf OR filetype:ini`, desc: 'Server or app configuration files.' },
            { title: 'Git Folder', query: `site:${domain || 'example.com'} inurl:.git`, desc: 'Exposed .git repositories.' },
            { title: 'Docker Compose', query: `site:${domain || 'example.com'} filetype:yml "docker-compose"`, desc: 'Docker configuration files.' }
        ],
        database: [
            { title: 'SQL Dumps', query: `site:${domain || 'example.com'} filetype:sql OR filetype:db`, desc: 'Database dump files.' },
            { title: 'SQL Errors', query: `site:${domain || 'example.com'} intext:"sql syntax near" OR intext:"syntax error has occurred" OR intext:"incorrect syntax near"`, desc: 'Pages exposing SQL errors (SQLi potential).' },
            { title: 'Database Logs', query: `site:${domain || 'example.com'} filetype:log intext:"database"`, desc: 'Log files mentioning database operations.' }
        ],
        sensitive: [
            { title: 'Index Of /', query: `site:${domain || 'example.com'} intitle:"index of"`, desc: 'Directory listing enabled.' },
            { title: 'PHP Info', query: `site:${domain || 'example.com'} ext:php intitle:phpinfo "published by the PHP Group"`, desc: 'Exposed phpinfo() pages.' },
            { title: 'Apache Status', query: `site:${domain || 'example.com'} intitle:"Apache Status"`, desc: 'Apache server status pages.' }
        ],
        public: [
            { title: 'Subdomains', query: `site:*.${domain || 'example.com'} -www`, desc: 'Indexed subdomains (excluding www).' },
            { title: 'Pastebin Entries', query: `site:pastebin.com "${domain || 'example.com'}"`, desc: 'Mentions of target on Pastebin.' },
            { title: 'Github Mentions', query: `site:github.com "${domain || 'example.com'}"`, desc: 'Repositories or code mentioning the target.' },
            { title: 'StackOverflow', query: `site:stackoverflow.com "${domain || 'example.com'}"`, desc: 'Developer discussions involving the target.' }
        ]
    };

    const handleSearch = (query: string) => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    };

    return (
        <ToolShell
            title="Google Dork Gen"
            description="Advanced search operator generator for finding sensitive information."
        >
            <div className="space-y-12">
                <Card className="border-accent/20 shadow-2xl shadow-accent/5">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4 text-accent mb-2">
                            <Search size={32} />
                            <h2 className="text-2xl font-black uppercase tracking-widest">Target Configuration</h2>
                        </div>
                        <Input
                            placeholder="e.g., target.com"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className="font-mono text-xl"
                            label="Target Domain"
                        />
                    </div>
                </Card>

                <div className="space-y-8">
                    <Tabs
                        tabs={categories}
                        activeTab={activeTab}
                        setTab={setActiveTab}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                        {dorks[activeTab].map((dork, idx) => (
                            <Card key={idx} padding="p-8" className="group border-white/5 hover:border-accent/20 hover:bg-accent/5 cursor-pointer relative overflow-hidden" hover>
                                <div onClick={() => handleSearch(dork.query)} className="relative z-10 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge variant="accent" className="font-mono">{dork.title}</Badge>
                                        <ExternalLink size={20} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="text-lg font-bold text-fg-primary mb-2 break-all">{dork.query}</p>
                                    <p className="text-sm text-fg-tertiary mt-auto pt-4 border-t border-white/5">{dork.desc}</p>

                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
