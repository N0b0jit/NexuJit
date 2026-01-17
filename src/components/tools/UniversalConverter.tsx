'use client';

import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileType, CheckCircle, AlertCircle, X, Download, RefreshCw, Smartphone, Monitor } from 'lucide-react';
import { CONVERTER_TOOLS } from '@/data/converterConfig';

// Define Props
interface UniversalConverterProps {
    slug: string;
    title: string;
    description: string;
}

export default function UniversalConverter({ slug, title, description }: UniversalConverterProps) {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [outputFormat, setOutputFormat] = useState<string>('');
    const [convertedFile, setConvertedFile] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const ffmpegRef = useRef(new FFmpeg());
    const messageRef = useRef<HTMLParagraphElement | null>(null);

    // Get config based on slug
    const config = (CONVERTER_TOOLS as any)[slug] || { type: 'unknown', formats: ['png', 'jpg', 'mp4', 'mp3'] };
    const acceptedFormats = config.formats;

    const loadFFmpeg = async () => {
        setIsLoading(true);
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({ message }) => {
            if (messageRef.current) messageRef.current.innerHTML = message;
            // Simple logic to guess progress based on time/frame output usually needed here
            // For now, we simulate or just show indeterminate 'Working...'
        });

        ffmpeg.on('progress', ({ progress, time }) => {
            setProgress(Math.round(progress * 100));
        });

        try {
            const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            });
            setLoaded(true);
        } catch (err) {
            console.error("FFmpeg load error:", err);
            setError("Failed to load converter engine. Please try using a modern browser (Chrome/Edge/Firefox).");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            setConvertedFile(null);
            setProgress(0);
            setError('');
            setMessage('');

            // Auto-select first compatible output format that isn't the input format
            const inputExt = file.name.split('.').pop()?.toLowerCase() || '';
            const defaultOutput = acceptedFormats.find((f: string) => f !== inputExt) || acceptedFormats[0];
            setOutputFormat(defaultOutput);
        }
    };

    const convert = async () => {
        if (!file || !outputFormat) return;

        if (!loaded && ['video', 'audio'].includes(config.type)) {
            await loadFFmpeg();
        }

        setIsLoading(true);
        setError('');
        setMessage(`Converting ${file.name} to .${outputFormat}...`);

        try {
            const ffmpeg = ffmpegRef.current;

            if (config.type === 'video' || config.type === 'audio') {
                if (!loaded) await loadFFmpeg();

                await ffmpeg.writeFile(file.name, await fetchFile(file));
                const outputName = `output.${outputFormat}`;

                // Construct basic FFmpeg command
                await ffmpeg.exec(['-i', file.name, outputName]);

                const data = await ffmpeg.readFile(outputName);
                const url = URL.createObjectURL(new Blob([data as any], { type: `${config.type}/${outputFormat}` }));
                setConvertedFile(url);
                setMessage('Conversion Complete!');

            } else if (config.type === 'image') {
                // Use Canvas for simple image formats
                if (['jpg', 'png', 'webp', 'bmp'].includes(outputFormat)) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                ctx.drawImage(img, 0, 0);
                                const mimeType = `image/${outputFormat === 'jpg' ? 'jpeg' : outputFormat}`;
                                const dataUrl = canvas.toDataURL(mimeType, 0.9);
                                setConvertedFile(dataUrl);
                                setMessage('Image Converted Successfully!');
                                setIsLoading(false);
                            }
                        };
                        img.src = event.target?.result as string;
                    };
                    reader.readAsDataURL(file);
                    return; // Return early as canvas is async differently
                } else {
                    // Try FFmpeg as fallback for obscure images
                    if (!loaded) await loadFFmpeg();
                    await ffmpeg.writeFile(file.name, await fetchFile(file));
                    const outputName = `output.${outputFormat}`;
                    await ffmpeg.exec(['-i', file.name, outputName]);
                    const data = await ffmpeg.readFile(outputName);
                    const url = URL.createObjectURL(new Blob([data as any], { type: `image/${outputFormat}` }));
                    setConvertedFile(url);
                    setMessage('Conversion Complete!');
                }
            } else {
                // Document type mock/placeholder for purely client-side limitation
                // Real document conversion (DOCX -> PDF etc) needs Server-side in most cases
                setError("Complex document conversion currently requires server processing. Please try our standard Document Converter tool.");
            }

        } catch (err: any) {
            console.error(err);
            setError("Conversion failed. The file header might be corrupt or the format is not fully supported in browser mode.");
        } finally {
            if (config.type !== 'image') setIsLoading(false); // Image canvas handles its own
        }
    };

    return (
        <motion.div
            className="converter-tool"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="converter-card">
                {!file ? (
                    <div className="upload-zone">
                        <input type="file" onChange={handleUpload} id="file-upload" className="file-input" />
                        <label htmlFor="file-upload" className="upload-label">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Upload size={48} className="upload-icon" />
                            </motion.div>
                            <h3>Click to Upload or Drag & Drop</h3>
                            <p>Supported: All major {config.type} formats</p>
                        </label>
                    </div>
                ) : (
                    <div className="file-preview">
                        <div className="file-info-row">
                            <div className="file-icon-wrapper">
                                <FileType size={32} />
                            </div>
                            <div className="file-details">
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                            <button onClick={() => { setFile(null); setConvertedFile(null); }} className="remove-btn">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="controls-row">
                            <div className="control-group">
                                <label>Convert To:</label>
                                <select
                                    value={outputFormat}
                                    onChange={(e) => setOutputFormat(e.target.value)}
                                    className="format-select"
                                >
                                    {acceptedFormats.map((fmt: string) => (
                                        <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <motion.button
                                className="convert-btn"
                                onClick={convert}
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? <RefreshCw className="spin" /> : <RefreshCw />}
                                {isLoading ? 'Converting...' : 'Convert Now'}
                            </motion.button>
                        </div>
                    </div>
                )}

                {/* Progress & Message Area */}
                <AnimatePresence>
                    {(isLoading || progress > 0) && (
                        <motion.div
                            className="progress-container"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="progress-bar-bg">
                                <motion.div
                                    className="progress-bar-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                ></motion.div>
                            </div>
                            <p className="progress-text">{message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Result Area */}
                <AnimatePresence>
                    {convertedFile && (
                        <motion.div
                            className="result-box"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="success-icon"><CheckCircle size={32} /></div>
                            <h3>Conversion Successful!</h3>
                            <a href={convertedFile} download={`converted.${outputFormat}`} className="download-btn">
                                <Download size={20} /> Download Result
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div className="error-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <AlertCircle size={20} /> {error}
                    </motion.div>
                )}
            </div>

            <style jsx>{`
                .converter-tool { max-width: 800px; margin: 0 auto; }
                .converter-card { background: var(--surface); padding: 3rem; border-radius: 2rem; border: 1px solid var(--border); box-shadow: var(--shadow-lg); text-align: center; }
                
                .upload-zone { border: 2px dashed var(--border); border-radius: 1.5rem; padding: 4rem 2rem; transition: 0.3s; cursor: pointer; background: var(--background); }
                .upload-zone:hover { border-color: var(--primary); background: var(--primary-soft); }
                .file-input { display: none; }
                .upload-label { cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--secondary); }
                .upload-icon { color: var(--primary); margin-bottom: 0.5rem; }
                .upload-label h3 { color: var(--foreground); font-size: 1.25rem; font-weight: 700; margin: 0; }
                
                .file-preview { text-align: left; }
                .file-info-row { display: flex; align-items: center; gap: 1rem; background: var(--background); padding: 1rem; border-radius: 1rem; margin-bottom: 2rem; border: 1px solid var(--border); }
                .file-icon-wrapper { width: 3rem; height: 3rem; background: var(--surface); display: flex; align-items: center; justify-content: center; border-radius: 0.75rem; color: var(--primary); border: 1px solid var(--border); }
                .file-details { flex: 1; display: flex; flex-direction: column; }
                .file-name { font-weight: 700; color: var(--foreground); }
                .file-size { font-size: 0.85rem; color: var(--secondary); }
                .remove-btn { width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; color: var(--secondary); border-radius: 50%; transition: 0.2s; }
                .remove-btn:hover { background: #fee2e2; color: #ef4444; }

                .controls-row { display: flex; gap: 1.5rem; align-items: flex-end; }
                .control-group { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
                .control-group label { font-weight: 600; color: var(--secondary); font-size: 0.9rem; }
                .format-select { padding: 1rem; border-radius: 0.75rem; border: 1px solid var(--border); background: var(--background); font-size: 1rem; width: 100%; color: var(--foreground); }
                
                .convert-btn { flex: 1; padding: 1rem; background: var(--primary); color: white; border-radius: 0.75rem; font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; box-shadow: 0 4px 10px var(--primary-soft); }
                .convert-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .spin { animation: spin 1s linear infinite; }
                
                .progress-container { margin-top: 2rem; }
                .progress-bar-bg { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
                .progress-bar-fill { height: 100%; background: var(--primary); border-radius: 4px; }
                .progress-text { font-size: 0.9rem; color: var(--secondary); text-align: center; }

                .result-box { margin-top: 2rem; background: #ecfdf5; border: 1px solid #10b981; padding: 2rem; border-radius: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: #064e3b; }
                .success-icon { color: #10b981; }
                .download-btn { padding: 0.85rem 2rem; background: #10b981; color: white; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; text-decoration: none; transition: 0.2s; }
                .download-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3); }

                .error-box { margin-top: 1.5rem; padding: 1rem; background: #fee2e2; color: #ef4444; border-radius: 0.75rem; display: flex; align-items: center; gap: 0.5rem; justify-content: center; }

                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </motion.div>
    );
}
