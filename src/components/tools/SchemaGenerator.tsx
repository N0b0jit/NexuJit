'use client';

import { useState } from 'react';
import { Copy, Check, FileJson } from 'lucide-react';

type SchemaType = 'Article' | 'Product' | 'FAQ' | 'Person' | 'Organization';

export default function SchemaGenerator() {
    const [type, setType] = useState<SchemaType>('Article');
    const [data, setData] = useState<any>({});
    const [copied, setCopied] = useState(false);

    const updateData = (field: string, value: any) => {
        setData({ ...data, [field]: value });
    };

    const generateJSON = () => {
        let schema: any = {
            "@context": "https://schema.org",
            "@type": type
        };

        if (type === 'Article') {
            schema = {
                ...schema,
                "headline": data.headline || "",
                "image": data.image ? [data.image] : [],
                "author": {
                    "@type": "Person",
                    "name": data.author || ""
                },
                "publisher": {
                    "@type": "Organization",
                    "name": data.publisher || "",
                    "logo": {
                        "@type": "ImageObject",
                        "url": data.publisherLogo || ""
                    }
                },
                "datePublished": data.datePublished || ""
            };
        } else if (type === 'Product') {
            schema = {
                ...schema,
                "name": data.name || "",
                "image": data.image ? [data.image] : [],
                "description": data.description || "",
                "brand": {
                    "@type": "Brand",
                    "name": data.brand || ""
                },
                "offers": {
                    "@type": "Offer",
                    "url": data.url || "",
                    "priceCurrency": data.currency || "USD",
                    "price": data.price || "",
                    "availability": "https://schema.org/InStock"
                }
            };
        } else if (type === 'FAQ') {
            const faqs = parseFAQ(data.faqs || "");
            schema = {
                ...schema,
                "mainEntity": faqs.map((f: any) => ({
                    "@type": "Question",
                    "name": f.q,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": f.a
                    }
                }))
            };
        } else if (type === 'Person') {
            schema = {
                ...schema,
                "name": data.name || "",
                "url": data.url || "",
                "jobTitle": data.jobTitle || "",
                "sameAs": data.socials ? data.socials.split(',').map((s: string) => s.trim()) : []
            };
        } else if (type === 'Organization') {
            schema = {
                ...schema,
                "name": data.name || "",
                "url": data.url || "",
                "logo": data.logo || "",
                "sameAs": data.socials ? data.socials.split(',').map((s: string) => s.trim()) : []
            };
        }

        return JSON.stringify(schema, null, 2);
    };

    const parseFAQ = (text: string) => {
        // Simple parser: Q: ... \nA: ...
        const lines = text.split('\n');
        const faqs = [];
        let currentQ = '';
        for (const line of lines) {
            if (line.startsWith('Q:')) currentQ = line.substring(2).trim();
            else if (line.startsWith('A:') && currentQ) {
                faqs.push({ q: currentQ, a: line.substring(2).trim() });
                currentQ = '';
            }
        }
        return faqs;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateJSON());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="schema-gen max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-surface p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex justify-between items-center border-b border-border pb-6 mb-6">
                    <h2 className="font-bold text-lg flex items-center gap-2"><FileJson className="text-primary" /> Schema Builder</h2>
                    <select
                        value={type}
                        onChange={(e) => { setType(e.target.value as SchemaType); setData({}); }}
                        className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-semibold outline-none focus:border-primary"
                    >
                        <option value="Article">Article</option>
                        <option value="Product">Product</option>
                        <option value="FAQ">FAQ Page</option>
                        <option value="Person">Person</option>
                        <option value="Organization">Organization</option>
                    </select>
                </div>

                <div className="space-y-4">
                    {type === 'Article' && (
                        <>
                            <Input label="Headline" onChange={(e: any) => updateData('headline', e.target.value)} />
                            <Input label="Image URL" onChange={(e: any) => updateData('image', e.target.value)} />
                            <Input label="Author Name" onChange={(e: any) => updateData('author', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Publisher Name" onChange={(e: any) => updateData('publisher', e.target.value)} />
                                <Input label="Publisher Logo URL" onChange={(e: any) => updateData('publisherLogo', e.target.value)} />
                            </div>
                            <Input label="Date Published (ISO)" type="date" onChange={(e: any) => updateData('datePublished', e.target.value)} />
                        </>
                    )}

                    {type === 'Product' && (
                        <>
                            <Input label="Product Name" onChange={(e: any) => updateData('name', e.target.value)} />
                            <Input label="Description" as="textarea" onChange={(e: any) => updateData('description', e.target.value)} />
                            <Input label="Image URL" onChange={(e: any) => updateData('image', e.target.value)} />
                            <Input label="Brand" onChange={(e: any) => updateData('brand', e.target.value)} />
                            <div className="grid grid-cols-3 gap-4">
                                <Input label="Price" type="number" onChange={(e: any) => updateData('price', e.target.value)} />
                                <Input label="Currency" placeholder="USD" onChange={(e: any) => updateData('currency', e.target.value)} />
                                <Input label="URL" onChange={(e: any) => updateData('url', e.target.value)} />
                            </div>
                        </>
                    )}

                    {type === 'FAQ' && (
                        <div className="space-y-1">
                            <label className="text-secondary text-xs uppercase font-bold">Questions & Answers</label>
                            <textarea
                                className="input-field h-48 font-mono text-sm"
                                placeholder="Q: What is this?&#10;A: It is a schema generator.&#10;&#10;Q: Is it free?&#10;A: Yes."
                                onChange={(e: any) => updateData('faqs', e.target.value)}
                            />
                            <p className="text-xs text-secondary">Format: Q: Question... A: Answer...</p>
                        </div>
                    )}

                    {(type === 'Person' || type === 'Organization') && (
                        <>
                            <Input label="Name" onChange={(e: any) => updateData('name', e.target.value)} />
                            <Input label="URL" onChange={(e: any) => updateData('url', e.target.value)} />
                            {type === 'Person' && <Input label="Job Title" onChange={(e: any) => updateData('jobTitle', e.target.value)} />}
                            {type === 'Organization' && <Input label="Logo URL" onChange={(e: any) => updateData('logo', e.target.value)} />}
                            <Input label="Social Profiles (Comma Separated)" placeholder="https://twitter.com/x, https://linkedin.com/in/x" onChange={(e: any) => updateData('socials', e.target.value)} />
                        </>
                    )}
                </div>
            </div>

            <div className="lg:w-1/3">
                <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-xl sticky top-24">
                    <div className="bg-[#2d2d2d] px-4 py-3 flex justify-between items-center border-b border-[#3e3e3e]">
                        <span className="text-xs font-mono text-gray-400">JSON-LD</span>
                        <button onClick={copyToClipboard} className="text-gray-400 hover:text-white transition-colors">
                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                    </div>
                    <pre className="p-4 text-sm font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap leading-relaxed h-[500px]">
                        {generateJSON()}
                    </pre>
                </div>
            </div>
            <style jsx>{`
                .input-field {
                    width: 100%;
                    padding: 0.75rem;
                    background: var(--background);
                    border: 1px solid var(--border);
                    border-radius: 0.5rem;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                    color: var(--foreground);
                }
                .input-field:focus {
                    outline: none;
                    border-color: var(--primary);
                }
            `}</style>
        </div>
    );
}

function Input({ label, as = 'input', ...props }: any) {
    const Component = as;
    return (
        <div className="space-y-1">
            <label className="text-secondary text-xs uppercase font-bold">{label}</label>
            <Component className={`input-field ${as === 'textarea' ? 'h-24' : ''}`} {...props} />
        </div>
    );
}
