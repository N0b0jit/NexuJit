'use client';

import { useState } from 'react';
import { CheckSquare, Printer, Download, ListFilter, SlidersHorizontal } from 'lucide-react';
import jsPDF from 'jspdf';

const CHECKLISTS = {
    blog: [
        { id: 'b1', category: 'On-Page', text: 'Target keyword in H1 tag' },
        { id: 'b2', category: 'On-Page', text: 'Target keyword in first 100 words' },
        { id: 'b3', category: 'On-Page', text: 'Meta description includes keyword and CTA' },
        { id: 'b4', category: 'Content', text: 'Content length > 1500 words (deep dive)' },
        { id: 'b5', category: 'Content', text: 'Use short paragraphs (2-3 sentences)' },
        { id: 'b6', category: 'Technical', text: 'Images have descriptive Alt Text' },
        { id: 'b7', category: 'Technical', text: 'Internal links to 3-5 relevant posts' },
    ],
    saas: [
        { id: 's1', category: 'On-Page', text: 'Clear Value Proposition above the fold' },
        { id: 's2', category: 'On-Page', text: 'Social Proof (Logos/Testimonials) visible' },
        { id: 's3', category: 'Conversion', text: 'Primary CTA stands out (Color contrast)' },
        { id: 's4', category: 'Technical', text: 'Page Speed < 2s' },
        { id: 's5', category: 'Content', text: 'Features vs Benefits structure' },
        { id: 's6', category: 'Schema', text: 'SoftwareApplication Schema implemented' },
    ],
    ecommerce: [
        { id: 'e1', category: 'On-Page', text: 'Product Title includes critical specs' },
        { id: 'e2', category: 'Images', text: 'High-res zoomable product images' },
        { id: 'e3', category: 'Technical', text: 'Canonical tags set for variants' },
        { id: 'e4', category: 'Schema', text: 'Product Schema (Price, Availability)' },
        { id: 'e5', category: 'UX', text: 'Clear Shipping & Return policy' },
        { id: 'e6', category: 'Content', text: 'Unique product description (no manufacturer copy)' },
    ],
    local: [
        { id: 'l1', category: 'GMB', text: 'Google Business Profile verified' },
        { id: 'l2', category: 'On-Page', text: 'NAP (Name, Address, Phone) consistent' },
        { id: 'l3', category: 'On-Page', text: 'City/Area in Title Tag' },
        { id: 'l4', category: 'Content', text: 'Embed Google Map on contact page' },
        { id: 'l5', category: 'Schema', text: 'LocalBusiness Schema JSON-LD' },
        { id: 'l6', category: 'Reviews', text: 'Strategy for getting customer reviews' },
    ]
};

export default function SeoChecklistGenerator() {
    const [type, setType] = useState<keyof typeof CHECKLISTS>('blog');
    const [checked, setChecked] = useState<Record<string, boolean>>({});

    const currentList = CHECKLISTS[type];
    const groupedList = currentList.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof currentList>);

    const toggle = (id: string) => {
        setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(`${type.toUpperCase()} SEO Checklist`, 10, 10);

        let y = 30;
        Object.entries(groupedList).forEach(([category, items]) => {
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 255);
            doc.text(category, 10, y);
            y += 10;

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            items.forEach(item => {
                const status = checked[item.id] ? '[x]' : '[ ]';
                doc.text(`${status} ${item.text}`, 15, y);
                y += 8;
            });
            y += 5;
        });

        doc.save('seo-checklist.pdf');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 print:w-full print:max-w-none">
            <div className="bg-surface p-8 rounded-2xl border border-border shadow-lg print:border-none print:shadow-none">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">SEO Checklist Generator</h2>
                        <p className="text-secondary">Select your site type to generate a tailored audit list.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as any)}
                                className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl font-medium outline-none focus:border-primary appearance-none hover:bg-surface-hover cursor-pointer"
                            >
                                <option value="blog">Blog / Content Site</option>
                                <option value="saas">SaaS / Startup</option>
                                <option value="ecommerce">E-Commerce Store</option>
                                <option value="local">Local Business</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {Object.entries(groupedList).map(([category, items]) => (
                        <div key={category} className="space-y-4">
                            <h3 className="text-lg font-black uppercase tracking-wider text-primary border-b border-border pb-2 flex items-center gap-2">
                                <span className="w-2 h-8 bg-primary rounded-full"></span>
                                {category}
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {items.map(item => (
                                    <label key={item.id} className="flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-border hover:bg-background/50 transition-all cursor-pointer group">
                                        <div className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${checked[item.id] ? 'bg-primary border-primary text-white' : 'border-secondary/30 group-hover:border-primary'}`}>
                                            {checked[item.id] && <CheckSquare size={14} />}
                                        </div>
                                        <div className="flex-1">
                                            <span className={`text-base font-medium transition-colors ${checked[item.id] ? 'text-secondary line-through decorations-2' : 'text-foreground'}`}>
                                                {item.text}
                                            </span>
                                            <input type="checkbox" className="hidden" checked={checked[item.id] || false} onChange={() => toggle(item.id)} />
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-background border border-border hover:bg-surface-hover text-secondary transition-colors"
                    >
                        <Printer size={20} /> Print
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-primary text-white shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Download size={20} /> Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
