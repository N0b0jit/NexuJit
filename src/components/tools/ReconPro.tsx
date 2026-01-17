'use client';

import { useState } from 'react';
import { ToolShell, Card, Button, Input, Badge, Tabs } from '@/components/ui/Core';
import { Terminal, Copy, Check, Shield, Search, Globe, Database, Bug, FileText } from 'lucide-react';

export default function ReconPro() {
    const [domain, setDomain] = useState('');
    const [activeTab, setActiveTab] = useState('subdomains');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const categories = [
        { id: 'subdomains', label: 'Subdomains', icon: Globe },
        { id: 'content', label: 'Content Discovery', icon: FileText },
        { id: 'vulns', label: 'Vulnerability Scan', icon: Bug },
        { id: 'wordpress', label: 'WordPress', icon: Database },
        { id: 'network', label: 'Network Info', icon: Shield },
    ];

    const commands: Record<string, Array<{ tool: string, cmd: string, desc: string }>> = {
        subdomains: [
            { tool: 'Subfinder', cmd: `subfinder -d ${domain || 'example.com'} -o subs.txt`, desc: 'Fast passive subdomain enumeration tool.' },
            { tool: 'Assetfinder', cmd: `assetfinder --subs-only ${domain || 'example.com'} > assetfinder_subs.txt`, desc: 'Find domains and subdomains related to a given domain.' },
            { tool: 'Amass', cmd: `amass enum -active -d ${domain || 'example.com'} -o amass_subs.txt`, desc: 'In-depth attack surface mapping and asset discovery.' },
            { tool: 'Findomain', cmd: `findomain -t ${domain || 'example.com'} -u findomain_subs.txt`, desc: 'Cross-platform subdomain enumerator.' }
        ],
        content: [
            { tool: 'FFuF', cmd: `ffuf -u https://${domain || 'example.com'}/FUZZ -w /path/to/wordlist.txt -mc 200`, desc: 'Fast web fuzzer written in Go.' },
            { tool: 'Dirsearch', cmd: `dirsearch -u https://${domain || 'example.com'} -e conf,config,bak,backup,swp,old,db,sql,asp,aspx,aspx~,asp~,py,py~,rb,rb~,php,php~,bkp,cache,cgi,conf,csv,html,inc,jar,js,json,jsp,jsp~,lock,log,rar,old,sql,sql.gz,sql.zip,sql.tar.gz,sql~,swp,swp~,tar,tar.bz2,tar.gz,txt,wadl,zip`, desc: 'Web path scanner.' },
            { tool: 'Gau', cmd: `echo "${domain || 'example.com'}" | gau > urls.txt`, desc: 'Fetch known URLs from AlienVault\'s OTX, the Wayback Machine, and Common Crawl.' },
            { tool: 'Katana', cmd: `katana -u https://${domain || 'example.com'} -d 5 -ps -pss waybackarchive,commoncrawl,alienvault -kf -jc -fx -ef woff,css,png,svg,jpg,woff2,jpeg,gif,svg -o katana.txt`, desc: 'A next-generation crawling and spidering framework.' }
        ],
        vulns: [
            { tool: 'Nuclei', cmd: `nuclei -u https://${domain || 'example.com'} -t nuclei-templates/`, desc: 'Template-based vulnerability scanner.' },
            { tool: 'Nikto', cmd: `nikto -h https://${domain || 'example.com'}`, desc: 'Web server scanner.' },
            { tool: 'SQLMap', cmd: `sqlmap -u "https://${domain || 'example.com'}/page?id=1" --batch`, desc: 'Automatic SQL injection and database takeover tool.' },
            { tool: 'Dalfox', cmd: `dalfox url https://${domain || 'example.com'}`, desc: 'Parameter analysis and XSS scanning tool.' }
        ],
        wordpress: [
            { tool: 'WPScan', cmd: `wpscan --url https://${domain || 'example.com'} --enumerate p,t,u`, desc: 'WordPress security scanner.' },
            { tool: 'WP-Sploit', cmd: `wpsploit --target https://${domain || 'example.com'}`, desc: 'Exploit WordPress vulnerabilities.' }
        ],
        network: [
            { tool: 'Nmap (Quick)', cmd: `nmap -F ${domain || 'example.com'}`, desc: 'Fast scan of top 100 ports.' },
            { tool: 'Nmap (Full)', cmd: `nmap -sC -sV -p- ${domain || 'example.com'}`, desc: 'Comprehensive scan of all ports with service version detection.' },
            { tool: 'Masscan', cmd: `masscan ${domain || 'example.com'} -p0-65535 --rate 1000`, desc: 'High-speed internet-scale port scanner.' }
        ]
    };

    return (
        <ToolShell
            title="Recon Pro"
            description="Generate elite bug bounty reconnaissance commands for your target."
        >
            <div className="space-y-12">
                <Card className="border-accent/20 shadow-2xl shadow-accent/5">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4 text-accent mb-2">
                            <Terminal size={32} />
                            <h2 className="text-2xl font-black uppercase tracking-widest">Target Configuration</h2>
                        </div>
                        <Input
                            placeholder="e.g., target.com"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className="font-mono text-xl"
                            label="Target Domain / IP"
                        />
                    </div>
                </Card>

                <div className="space-y-8">
                    <Tabs
                        tabs={categories}
                        activeTab={activeTab}
                        setTab={setActiveTab}
                    />

                    <div className="grid gap-6">
                        {commands[activeTab].map((cmd, idx) => (
                            <Card key={idx} padding="p-6" className="group border-white/5 hover:border-accent/20">
                                <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="accent" className="font-mono">{cmd.tool}</Badge>
                                            <p className="text-sm text-fg-tertiary">{cmd.desc}</p>
                                        </div>
                                        <div className="bg-black/40 p-4 rounded-xl font-mono text-sm md:text-base text-accent overflow-x-auto whitespace-pre-wrap break-all border border-white/5 max-w-full">
                                            {cmd.cmd}
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleCopy(cmd.cmd, `${activeTab}-${idx}`)}
                                        className="shrink-0"
                                    >
                                        {copiedId === `${activeTab}-${idx}` ? <Check size={18} /> : <Copy size={18} />}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
