'use client';

import { useState } from 'react';
import { FileText, Copy, Check, Wand2, ShieldCheck, Scale, Info, ScrollText } from 'lucide-react';
import { Button, Input, Card, Textarea } from '@/components/ui/Core';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrivacyPolicyGenerator() {
    const [companyName, setCompanyName] = useState('');
    const [websiteName, setWebsiteName] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [policy, setPolicy] = useState('');
    const [copied, setCopied] = useState(false);

    const generatePolicy = () => {
        if (!companyName || !websiteName || !websiteUrl) return;

        const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

        const template = `UTILITYSTUDIO LEGAL COMPLIANCE ENGINE
DRAFT: PRIVACY POLICY
VERSION AUTH: 1.0.4
GENERATED ON: ${date}

---------------------------------------------------------
1. INTRODUCTION
---------------------------------------------------------
Welcome to ${websiteName} ("we", "our", "us"). We respect the privacy of our users ("user", "you"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website: ${websiteUrl}.

---------------------------------------------------------
2. COLLECTION OF DATA
---------------------------------------------------------
We may collect information about you in several fundamental ways. The primary parameters include:

• PERSONAL IDENTIFIABLE INFORMATION: 
Names, email addresses, and contact protocols voluntarily submitted via site registration or interaction modules.

• SYSTEMIC DERIVATIVE DATA:
Automatic telemetry collected by our servers, including IP addresses, browser specifications, operating system versions, and access chronologies.

---------------------------------------------------------
3. UTILIZATION PROTOCOLS
---------------------------------------------------------
Accurate information allows for optimized experience delivery. We utilize telemetry for:
- Account synchronization and management.
- Transactional communication and verification.
- Predictive performance optimization.

---------------------------------------------------------
4. CONTACT INFRASTRUCTURE
---------------------------------------------------------
For legal inquiries regarding this drafted policy:

ENTITY: ${companyName}
PORTAL: ${websiteUrl}

---------------------------------------------------------
// DOCUMENT END
---------------------------------------------------------`;

        setPolicy(template);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(policy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Configuration Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-fg px-1 flex items-center gap-2">
                            <ShieldCheck size={12} className="text-accent" /> Compliance Data
                        </label>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-fg uppercase ml-1">Entity Name</span>
                                <Input
                                    placeholder="Acme Corp LLC"
                                    value={companyName}
                                    onChange={(e: any) => setCompanyName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-fg uppercase ml-1">Domain Handle</span>
                                <Input
                                    placeholder="My Personal Portfolio"
                                    value={websiteName}
                                    onChange={(e: any) => setWebsiteName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-fg uppercase ml-1">Access URL</span>
                                <Input
                                    placeholder="https://example.com"
                                    value={websiteUrl}
                                    onChange={(e: any) => setWebsiteUrl(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        className="w-full py-4 shadow-xl"
                        onClick={generatePolicy}
                        disabled={!companyName || !websiteName || !websiteUrl}
                    >
                        Synthesize Legal Draft <Wand2 size={16} fill="currentColor" />
                    </Button>

                    <Card className="p-4 bg-accent/5 border-accent/10">
                        <div className="flex items-start gap-3">
                            <Info size={16} className="text-accent shrink-0 mt-0.5" />
                            <p className="text-[10px] font-medium leading-relaxed text-muted-fg italic">
                                This generator provides a generalized draft. For production deployment, consult with specialized legal counsel to ensure region-specific compliance.
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Result Panel */}
                <div className="lg:col-span-8 space-y-4 h-full min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-fg flex items-center gap-2">
                            <ScrollText size={12} className="text-accent" /> Generated Scroll
                        </label>
                        {policy && (
                            <Button variant="ghost" size="sm" onClick={handleCopy} className="text-accent">
                                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied to Buffer' : 'Export Content'}
                            </Button>
                        )}
                    </div>

                    <div className="relative flex-1 bg-muted/10 border-2 border-border rounded-2xl overflow-hidden min-h-[480px]">
                        <AnimatePresence mode="wait">
                            {policy ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full p-8 md:p-12"
                                >
                                    <Textarea
                                        readOnly
                                        value={policy}
                                        className="h-full bg-transparent border-none p-0 text-sm font-mono leading-relaxed focus:ring-0 no-scrollbar overflow-auto"
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 opacity-30"
                                >
                                    <Scale size={64} className="text-muted-fg" />
                                    <p className="text-xs font-black italic max-w-xs uppercase tracking-widest">Awaiting Entity Protocol Initialization</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
