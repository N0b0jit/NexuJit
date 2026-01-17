'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Type, FileText, Settings2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const HANDWRITING_FONTS = [
    { name: 'Dancing Script', family: "'Dancing Script', cursive" },
    { name: 'Caveat', family: "'Caveat', cursive" },
    { name: 'Pacifico', family: "'Pacifico', cursive" },
    { name: 'Shadows Into Light', family: "'Shadows Into Light', cursive" },
    { name: 'Satisfy', family: "'Satisfy', cursive" },
    { name: 'Indie Flower', family: "'Indie Flower', cursive" },
];

const PAPER_TYPES = [
    { name: 'White Plane', class: 'paper-white' },
    { name: 'Lined Paper', class: 'paper-lined' },
    { name: 'Grid Paper', class: 'paper-grid' },
    { name: 'Yellow Legal', class: 'paper-yellow' },
];

export default function TextToHandwriting() {
    const [text, setText] = useState('Dear friend,\n\nThis is a sample of digital text converted into a handwriting style. You can customize the font, color, and paper type to make it look like a real letter.\n\nBest regards,\nSEO Studio');
    const [font, setFont] = useState(HANDWRITING_FONTS[0]);
    const [paper, setPaper] = useState(PAPER_TYPES[1]);
    const [fontSize, setFontSize] = useState(20);
    const [color, setColor] = useState('#000080'); // Royal Blue
    const [isGenerating, setIsGenerating] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    // Load fonts
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script&family=Caveat&family=Pacifico&family=Shadows+Into+Light&family=Satisfy&family=Indie+Flower&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, []);

    const handleDownloadPDF = async () => {
        if (!previewRef.current) return;
        setIsGenerating(true);

        try {
            // Wait for fonts to load properly
            await document.fonts.ready;

            const canvas = await html2canvas(previewRef.current, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
                backgroundColor: paper.class === 'paper-yellow' ? '#fff9c4' : '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('handwriting.pdf');
        } catch (err) {
            console.error('PDF Generation Error:', err);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="tool-ui">
            <div className="controls-grid">
                <div className="control-group">
                    <label><Type size={16} /> Font Style</label>
                    <select
                        value={font.name}
                        onChange={(e) => setFont(HANDWRITING_FONTS.find(f => f.name === e.target.value) || HANDWRITING_FONTS[0])}
                    >
                        {HANDWRITING_FONTS.map(f => (
                            <option key={f.name} value={f.name}>{f.name}</option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label><FileText size={16} /> Paper Type</label>
                    <select
                        value={paper.name}
                        onChange={(e) => setPaper(PAPER_TYPES.find(p => p.name === e.target.value) || PAPER_TYPES[0])}
                    >
                        {PAPER_TYPES.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label><Settings2 size={16} /> Font Size: {fontSize}px</label>
                    <input
                        type="range"
                        min="12" max="40"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                    />
                </div>

                <div className="control-group">
                    <label>Ink Color</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </div>
            </div>

            <div className="main-editor">
                <div className="input-side">
                    <textarea
                        placeholder="Type or paste your text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div className="preview-side">
                    <div
                        ref={previewRef}
                        className={`handwriting-preview ${paper.class}`}
                        style={{
                            fontFamily: font.family,
                            fontSize: `${fontSize}px`,
                            color: color,
                        }}
                    >
                        {text.split('\n').map((line, i) => (
                            <p key={i}>{line || '\u00A0'}</p>
                        ))}
                    </div>
                </div>
            </div>

            <div className="actions">
                <button onClick={handleDownloadPDF} className="action-btn" disabled={isGenerating}>
                    <Download size={16} /> {isGenerating ? 'Generating PDF...' : 'Download PDF'}
                </button>
            </div>

            <style jsx>{`
                .tool-ui {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .controls-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    background: var(--card-bg, #f8f9fa);
                    padding: 1.5rem;
                    border-radius: 1rem;
                    border: 1px solid var(--border);
                }
                .control-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .control-group label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    font-size: 0.875rem;
                }
                select, input[type="range"], input[type="color"] {
                    width: 100%;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    border: 1px solid var(--border);
                }
                .main-editor {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    min-height: 400px;
                }
                .input-side textarea {
                    width: 100%;
                    height: 100%;
                    padding: 1.5rem;
                    border-radius: 1rem;
                    border: 2px solid var(--border);
                    resize: none;
                    font-family: inherit;
                }
                .preview-side {
                    background: #fff;
                    border-radius: 1rem;
                    border: 1px solid var(--border);
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .handwriting-preview {
                    height: 100%;
                    padding: 2rem;
                    overflow-y: auto;
                    line-height: 1.5;
                    white-space: pre-wrap;
                }
                .paper-white { background: #fff; }
                .paper-lined {
                    background: #fff;
                    background-image: linear-gradient(#94ACD4 1px, transparent 1px);
                    background-size: 100% 1.5em;
                }
                .paper-grid {
                    background: #fff;
                    background-image: linear-gradient(#eee 1px, transparent 1px), linear-gradient(90deg, #eee 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                .paper-yellow {
                    background: #fff9c4;
                    background-image: linear-gradient(#d4c194 1px, transparent 1px);
                    background-size: 100% 1.5em;
                }
                .actions {
                    display: flex;
                    justify-content: center;
                }
                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem 2rem;
                    background: var(--primary);
                    color: white;
                    border-radius: 0.75rem;
                    font-weight: 700;
                    transition: all 0.2s;
                }
                .action-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                }
                @media (max-width: 768px) {
                    .main-editor {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
