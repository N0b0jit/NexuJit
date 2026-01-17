'use client';

import { useState, useRef } from 'react';
import { Download, Plus, Trash2, Printer, DollarSign, FileText, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

export default function InvoiceGenerator() {
    const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');

    // Sender (User)
    const [senderName, setSenderName] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [senderAddress, setSenderAddress] = useState('');

    // Receiver (Client)
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientAddress, setClientAddress] = useState('');

    const [items, setItems] = useState<LineItem[]>([
        { id: '1', description: 'Web Development Services', quantity: 1, price: 500 }
    ]);
    const [notes, setNotes] = useState('');
    const [taxRate, setTaxRate] = useState(0);
    const [currency, setCurrency] = useState('$');

    const invoiceRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const addItem = () => {
        setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const downloadPDF = async () => {
        if (!invoiceRef.current) return;
        setIsGenerating(true);

        try {
            const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Invoice_${invoiceNumber}.pdf`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="invoice-generator flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto">
            {/* Editor Side */}
            <div className="editor-panel flex-1 bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-6 h-fit overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                    <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="text-primary" /> Edit Invoice</h2>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-1 bg-background border border-border rounded-lg px-3 py-1">
                            <span className="text-sm text-secondary">Currency:</span>
                            <input
                                className="w-8 bg-transparent text-center font-bold outline-none"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormGroup label="Invoice #">
                        <input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="input-field" />
                    </FormGroup>
                    <FormGroup label="Date">
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
                    </FormGroup>
                </div>

                {/* Sender & Client */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 p-4 bg-background rounded-xl border border-border/50">
                        <h3 className="font-semibold text-sm text-primary uppercase">From (You)</h3>
                        <input placeholder="Your Name / Business" value={senderName} onChange={e => setSenderName(e.target.value)} className="input-field" />
                        <input placeholder="Email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} className="input-field" />
                        <textarea placeholder="Address" value={senderAddress} onChange={e => setSenderAddress(e.target.value)} className="input-field h-20" />
                    </div>
                    <div className="space-y-3 p-4 bg-background rounded-xl border border-border/50">
                        <h3 className="font-semibold text-sm text-secondary uppercase">Bill To (Client)</h3>
                        <input placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} className="input-field" />
                        <input placeholder="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="input-field" />
                        <textarea placeholder="Client Address" value={clientAddress} onChange={e => setClientAddress(e.target.value)} className="input-field h-20" />
                    </div>
                </div>

                {/* Line Items */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-sm">Line Items</h3>
                        <button onClick={addItem} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add Item</button>
                    </div>
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-2 items-start">
                            <input
                                className="input-field flex-[3]"
                                placeholder="Description"
                                value={item.description}
                                onChange={e => updateItem(item.id, 'description', e.target.value)}
                            />
                            <input
                                className="input-field flex-1 text-center"
                                type="number"
                                placeholder="Qty"
                                min="1"
                                value={item.quantity}
                                onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                            <input
                                className="input-field flex-1 text-right"
                                type="number"
                                placeholder="Price"
                                min="0"
                                value={item.price}
                                onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                            />
                            <button onClick={() => removeItem(item.id)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Notes & Tax */}
                <div className="grid grid-cols-2 gap-8">
                    <FormGroup label="Notes / Payment Terms">
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input-field h-24" placeholder="Thank you for your business..." />
                    </FormGroup>
                    <div className="space-y-4">
                        <FormGroup label={`Tax Rate (%)`}>
                            <input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="input-field text-right" />
                        </FormGroup>
                    </div>
                </div>
            </div>

            {/* Preview Side */}
            <div className="preview-panel flex-1 space-y-4">
                <div className="flex justify-between items-center bg-surface p-4 rounded-xl border border-border shadow-sm">
                    <h2 className="font-bold flex items-center gap-2"><Printer className="text-secondary" /> Live Preview</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadPDF}
                        disabled={isGenerating}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:bg-primary-hover disabled:opacity-50"
                    >
                        {isGenerating ? 'Generating...' : <><Download size={18} /> Download PDF</>}
                    </motion.button>
                </div>

                {/* The Invoice Paper */}
                <div className="bg-[#525659] p-4 md:p-8 rounded-xl overflow-x-auto shadow-inner">
                    <div
                        ref={invoiceRef}
                        className="bg-white text-black w-[210mm] min-h-[297mm] mx-auto p-12 shadow-2xl flex flex-col justify-between"
                        style={{ fontFamily: 'Arial, sans-serif' }}
                    >
                        <div>
                            {/* Header */}
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-800 tracking-tight">INVOICE</h1>
                                    <p className="text-gray-500 mt-2">#{invoiceNumber}</p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-xl font-bold text-gray-800">{senderName || 'Your Business'}</h2>
                                    <p className="text-gray-500 text-sm whitespace-pre-line mt-1">{senderAddress}</p>
                                    <p className="text-gray-500 text-sm mt-1">{senderEmail}</p>
                                </div>
                            </div>

                            {/* Info Row */}
                            <div className="flex justify-between mb-12">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
                                    <p className="text-gray-800 font-bold text-lg">{clientName || 'Client Name'}</p>
                                    <p className="text-gray-500 text-sm whitespace-pre-line">{clientAddress || 'Client Address'}</p>
                                    <p className="text-gray-500 text-sm">{clientEmail}</p>
                                </div>
                                <div className="text-right">
                                    <div className="mb-4">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</h3>
                                        <p className="text-gray-800 font-medium">{date}</p>
                                    </div>
                                    {dueDate && (
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</h3>
                                            <p className="text-gray-800 font-medium text-red-500">{dueDate}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Table */}
                            <table className="w-full mb-8">
                                <thead>
                                    <tr className="border-b-2 border-gray-100">
                                        <th className="text-left py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
                                        <th className="text-center py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Qty</th>
                                        <th className="text-right py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                        <th className="text-right py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-50">
                                            <td className="py-4 text-gray-700 font-medium">{item.description || 'Item Description'}</td>
                                            <td className="py-4 text-center text-gray-500">{item.quantity}</td>
                                            <td className="py-4 text-right text-gray-500">{currency}{item.price.toFixed(2)}</td>
                                            <td className="py-4 text-right text-gray-800 font-semibold">{currency}{(item.quantity * item.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="flex justify-end">
                                <div className="w-64 space-y-3">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span>{currency}{subtotal.toFixed(2)}</span>
                                    </div>
                                    {taxRate > 0 && (
                                        <div className="flex justify-between text-gray-500">
                                            <span>Tax ({taxRate}%)</span>
                                            <span>{currency}{taxAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xl font-bold text-gray-800 border-t-2 border-gray-100 pt-3">
                                        <span>Total</span>
                                        <span>{currency}{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Notes */}
                        {notes && (
                            <div className="mt-12 text-gray-500 text-sm border-l-4 border-blue-500 pl-4">
                                <h4 className="font-bold text-gray-700 mb-1">Notes</h4>
                                <p className="whitespace-pre-line">{notes}</p>
                            </div>
                        )}

                        {/* Fake Margin for Print Look */}
                        <div className="mt-8 text-center text-xs text-gray-300">
                            Generated by SEO Studio
                        </div>
                    </div>
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
                    box-shadow: 0 0 0 2px var(--primary-soft);
                }
            `}</style>
        </div>
    );
}

function FormGroup({ label, children }: { label: string, children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-secondary">{label}</label>
            {children}
        </div>
    );
}
