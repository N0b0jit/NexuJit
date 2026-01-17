'use client';

import { useState } from 'react';
import { Upload, FileText, Download, Trash2 } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function ImageToPdf() {
    const [images, setImages] = useState<File[]>([]);
    const [isConverting, setIsConverting] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages([...images, ...Array.from(e.target.files)]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const convertToPdf = async () => {
        if (images.length === 0) return;
        setIsConverting(true);

        const doc = new jsPDF();

        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const imgData = await readFileAsDataURL(image);
            const imgProps = await getImageProperties(imgData);

            // Calculate dimensions to fit A4
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const widthRatio = pageWidth / imgProps.width;
            const heightRatio = pageHeight / imgProps.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

            const finalWidth = imgProps.width * ratio;
            const finalHeight = imgProps.height * ratio;

            const x = (pageWidth - finalWidth) / 2;
            const y = (pageHeight - finalHeight) / 2;

            if (i > 0) doc.addPage();
            doc.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
        }

        doc.save('converted-images.pdf');
        setIsConverting(false);
    };

    // Helpers
    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
        });
    };

    const getImageProperties = (url: string): Promise<{ width: number, height: number }> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.src = url;
        });
    };

    return (
        <div className="tool-ui">
            <div className="card">
                <div className="upload-area">
                    <input type="file" multiple accept="image/*" onChange={handleUpload} id="file-upload" hidden />
                    <label htmlFor="file-upload" className="upload-label">
                        <Upload size={48} />
                        <p>Click to upload Images (JPG, PNG)</p>
                    </label>
                </div>

                {images.length > 0 && (
                    <div className="file-list">
                        {images.map((file, i) => (
                            <div key={i} className="file-item">
                                <span className="name">{file.name}</span>
                                <button onClick={() => removeImage(i)} className="del-btn"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={convertToPdf}
                    className="action-btn"
                    disabled={images.length === 0 || isConverting}
                >
                    {isConverting ? 'Converting...' : `Convert ${images.length} Images to PDF`} <Download size={20} />
                </button>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                
                .upload-label { border: 2px dashed var(--border); border-radius: 1rem; padding: 3rem; text-align: center; cursor: pointer; display: block; transition: all 0.2s; color: var(--secondary); }
                .upload-label:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }
                .upload-label p { margin-top: 1rem; font-weight: 600; }

                .file-list { margin: 2rem 0; border: 1px solid var(--border); border-radius: 1rem; overflow: hidden; }
                .file-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: var(--background); border-bottom: 1px solid var(--border); }
                .file-item:last-child { border-bottom: none; }
                .del-btn { color: #ef4444; padding: 0.5rem; border-radius: 0.5rem; }
                .del-btn:hover { background: #fee2e2; }

                .action-btn { width: 100%; padding: 1rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
        </div>
    );
}
