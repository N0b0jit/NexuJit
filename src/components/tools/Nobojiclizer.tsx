'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Pause, Shuffle } from 'lucide-react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const COLOR_THEMES: Record<string, any> = {
    void: { primary: '#ffffff', secondary: '#888888', bg: '#020204' },
    ember: { primary: '#ff6b35', secondary: '#ff2200', bg: '#0a0505' },
    arctic: { primary: '#88ffff', secondary: '#0066ff', bg: '#020508' },
    neon: { primary: '#ff00ff', secondary: '#00ffff', bg: '#050008' },
    sunset: { primary: '#ff8855', secondary: '#ff3366', bg: '#0a0508' },
    forest: { primary: '#88ff88', secondary: '#00aa44', bg: '#030805' },
    vapor: { primary: '#ff71ce', secondary: '#01cdfe', bg: '#05020a' },
    gold: { primary: '#ffd700', secondary: '#ff8c00', bg: '#080604' },
    blood: { primary: '#ff0044', secondary: '#880022', bg: '#0a0204' },
    ocean: { primary: '#0088ff', secondary: '#004488', bg: '#020408' },
    aurora: { primary: '#00ff88', secondary: '#ff00ff', bg: '#020804' },
    plasma: { primary: '#ff4488', secondary: '#4488ff', bg: '#080408' }
};

const configDefaults = {
    form: 'icosahedron', density: 3, sensitivity: 1.2, volume: 0.8,
    colorTheme: 'void', colorPrimary: '#ffffff', colorSecondary: '#4488ff', colorBg: '#020204',
    smoothness: 0.7, cameraSpeed: 0.6, bloomStrength: 0.8, bloomRadius: 0.7,
    showParticles: true, showWireframe: true, particleBrightness: 1.0
};

class AudioAnalyzer {
    bands = 64; bandValues = new Float32Array(64); bandEdges: Float32Array;
    prevBandValues = new Float32Array(64); fftSmooth: Float32Array | null = null;
    lastBeatT = 0; bpm = 120; beatCount = 0; barCount = 0; energy = 0; tMs = 0;
    constructor() {
        this.bandEdges = new Float32Array(65);
        for (let i = 0; i <= 64; i++) this.bandEdges[i] = Math.pow(10, Math.log10(20) + (i / 64) * (Math.log10(20000) - Math.log10(20)));
    }
    analyze(freq: Uint8Array, dt: number) {
        this.tMs += dt * 1000; const N = freq.length; if (!this.fftSmooth) this.fftSmooth = new Float32Array(N);
        for (let i = 0; i < N; i++) { const l = Math.pow(freq[i] / 255, 1.2); this.fftSmooth[i] = lerp(this.fftSmooth[i], l, l > this.fftSmooth[i] ? 0.4 : 0.15); }
        let sE = 0; for (let b = 0; b < 64; b++) {
            const sB = Math.max(1, Math.floor(this.bandEdges[b] / 23)), eB = Math.min(N - 1, Math.ceil(this.bandEdges[b + 1] / 23));
            let v = 0; for (let i = sB; i <= eB; i++) v += this.fftSmooth[i];
            const val = v / (eB - sB + 1); sE += val * val; this.bandValues[b] = val;
        }
        this.energy = sE / 64; const kick = this.bandValues[2];
        if (kick > 0.5 && (this.tMs - this.lastBeatT) > 200) { this.lastBeatT = this.tMs; this.beatCount++; if (this.beatCount % 4 === 0) this.barCount++; return true; }
        return false;
    }
}

const BG_FRAG = `precision highp float; varying vec2 vUv; uniform float uTime, uEnergy, uPulse; uniform vec3 uBg, uA, uB;
void main(){ vec2 p = vUv*2.0-1.0; float r = length(p); vec3 col = mix(uBg, mix(uA, uB, sin(uTime*0.2+r)), 0.2*(uEnergy+0.2)); col += uA*uPulse*0.05*(1.0-r); gl_FragColor = vec4(col, 1.0); }`;
const RIM_VERT = `varying vec3 vN, vW; void main(){ vN = normalize(normalMatrix*normal); vW = (modelMatrix*vec4(position, 1.0)).xyz; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0); }`;
const RIM_FRAG = `uniform vec3 uC; varying vec3 vN, vW; void main(){ float f = pow(1.0-clamp(dot(vN, normalize(cameraPosition-vW)), 0.0, 1.0), 3.0); gl_FragColor = vec4(uC*f, f); }`;
const P_VERT = `attribute float size; attribute vec3 color; varying vec3 vC; uniform float uE, uPR; void main(){ vC = color; vec4 mv = modelViewMatrix*vec4(position, 1.0); gl_PointSize = size*(300.0/-mv.z)*uPR*(1.0+uE); gl_Position = projectionMatrix*mv; }`;
const P_FRAG = `varying vec3 vC; uniform float uB; void main(){ float d = length(gl_PointCoord-0.5); float g = exp(-d*10.0); gl_FragColor = vec4(vC*g*uB, g*uB); }`;

export default function Nobojiclizer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState('main');
    const [isPlaying, setIsPlaying] = useState(false);
    const [config, setConfig] = useState(configDefaults);
    const [stats, setStats] = useState({ bpm: 120, energy: 0, bar: 0 });
    const engineRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const w = container.clientWidth, h = 750;
        const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setSize(w, h);
        container.appendChild(renderer.domElement);
        const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000); camera.position.z = 45;
        const bgScene = new THREE.Scene(); const bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const bgUniforms = { uTime: { value: 0 }, uEnergy: { value: 0 }, uPulse: { value: 0 }, uBg: { value: new THREE.Color(config.colorBg) }, uA: { value: new THREE.Color(config.colorPrimary) }, uB: { value: new THREE.Color(config.colorSecondary) } };
        bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: bgUniforms, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0,1); }`, fragmentShader: BG_FRAG, depthTest: false })));
        const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(bgScene, bgCam));
        const mainPass = new RenderPass(scene, camera); mainPass.clear = false; composer.addPass(mainPass);
        const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), config.bloomStrength, config.bloomRadius, 0.1); composer.addPass(bloom);
        const analyzer = new AudioAnalyzer(); const audioEl = new Audio(); audioEl.crossOrigin = "anonymous";
        const engine: any = { renderer, scene, camera, composer, analyzer, bgUniforms, audioEl, meshes: {}, vertexData: [], lastT: 0, pulse: 0, swell: 0 };
        engineRef.current = engine;

        const build = (cfg: typeof configDefaults) => {
            Object.values(engine.meshes).forEach((m: any) => scene.remove(m));
            let geom: THREE.BufferGeometry;
            if (cfg.form === 'torus') geom = new THREE.TorusGeometry(8, 3, 16, 48);
            else if (cfg.form === 'sphere') geom = new THREE.SphereGeometry(10, 32, 32);
            else if (cfg.form === 'octahedron') geom = new THREE.OctahedronGeometry(11, cfg.density);
            else geom = new THREE.IcosahedronGeometry(10, cfg.density);
            const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geom), new THREE.LineBasicMaterial({ color: cfg.colorPrimary, transparent: true, opacity: 0.2 }));
            if (cfg.showWireframe) scene.add(wire); engine.meshes.wire = wire;
            const rim = new THREE.Mesh(geom, new THREE.ShaderMaterial({ uniforms: { uC: { value: new THREE.Color(cfg.colorPrimary) } }, vertexShader: RIM_VERT, fragmentShader: RIM_FRAG, transparent: true, blending: THREE.AdditiveBlending }));
            scene.add(rim); engine.meshes.rim = rim;
            const vData: any[] = []; const pos = geom.attributes.position.array;
            for (let i = 0; i < pos.length; i += 3) vData.push({ b: new THREE.Vector3(pos[i], pos[i + 1], pos[i + 2]), c: new THREE.Vector3(pos[i], pos[i + 1], pos[i + 2]), band: Math.floor(Math.random() * 64) });
            engine.vertexData = vData;
            const pGeom = new THREE.BufferGeometry(); const pPos = new Float32Array(vData.length * 3), pCol = new Float32Array(vData.length * 3), pSize = new Float32Array(vData.length);
            vData.forEach((d, i) => { pPos[i * 3] = d.b.x; pPos[i * 3 + 1] = d.b.y; pPos[i * 3 + 2] = d.b.z; pCol[i * 3] = 1; pCol[i * 3 + 1] = 1; pCol[i * 3 + 2] = 1; pSize[i] = 0.2; });
            pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pGeom.setAttribute('color', new THREE.BufferAttribute(pCol, 3)); pGeom.setAttribute('size', new THREE.BufferAttribute(pSize, 1));
            const points = new THREE.Points(pGeom, new THREE.ShaderMaterial({ uniforms: { uE: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uB: { value: cfg.particleBrightness } }, vertexShader: P_VERT, fragmentShader: P_FRAG, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
            if (cfg.showParticles) scene.add(points); engine.meshes.points = points;
        };
        build(config); engine.rebuild = build;

        let frameId: number;
        const loop = (t: number) => {
            const dt = Math.min((t - engine.lastT) / 1000, 0.05); engine.lastT = t;
            if (engine.analyserNode && isPlaying) {
                engine.analyserNode.getByteFrequencyData(engine.freqData); const beat = engine.analyzer.analyze(engine.freqData, dt);
                if (beat) engine.pulse = 1.0; engine.pulse = lerp(engine.pulse, 0, dt * 5); engine.swell = lerp(engine.swell, engine.analyzer.energy, dt * 2);
                setStats({ bpm: Math.round(engine.analyzer.bpm), energy: Math.floor(engine.analyzer.energy * 1000), bar: engine.analyzer.barCount });
            }
            engine.bgUniforms.uTime.value = t / 1000; engine.bgUniforms.uEnergy.value = engine.swell; engine.bgUniforms.uPulse.value = engine.pulse;
            if (engine.meshes.wire) { engine.meshes.wire.rotation.y += dt * 0.3 * config.cameraSpeed; const s = 1.0 + engine.pulse * 0.1 + engine.swell * 0.1; engine.meshes.wire.scale.setScalar(s); engine.meshes.points.rotation.copy(engine.meshes.wire.rotation); engine.meshes.points.scale.copy(engine.meshes.wire.scale); engine.meshes.points.material.uniforms.uE.value = engine.swell; engine.meshes.rim.rotation.copy(engine.meshes.wire.rotation); engine.meshes.rim.scale.copy(engine.meshes.wire.scale); }
            if (engine.vertexData.length && engine.meshes.points) {
                const p = engine.meshes.points.geometry.attributes.position.array; const c = engine.meshes.points.geometry.attributes.color.array;
                const c1 = new THREE.Color(config.colorPrimary), c2 = new THREE.Color(config.colorSecondary);
                engine.vertexData.forEach((d: any, i: number) => { const f = engine.analyzer.bandValues[d.band]; const target = d.b.clone().multiplyScalar(1.0 + f * config.sensitivity); d.c.lerp(target, 0.1); p[i * 3] = d.c.x; p[i * 3 + 1] = d.c.y; p[i * 3 + 2] = d.c.z; const cl = c1.clone().lerp(c2, f); c[i * 3] = cl.r; c[i * 3 + 1] = cl.g; c[i * 3 + 2] = cl.b; });
                engine.meshes.points.geometry.attributes.position.needsUpdate = true; engine.meshes.points.geometry.attributes.color.needsUpdate = true;
            }
            engine.composer.render(); frameId = requestAnimationFrame(loop);
        };
        frameId = requestAnimationFrame(loop);
        return () => { cancelAnimationFrame(frameId); container.removeChild(renderer.domElement); renderer.dispose(); audioEl.pause(); };
    }, [isPlaying]);

    const handleFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const file = ev.target.files?.[0]; if (!file) return; const engine = engineRef.current;
        if (!engine.audioCtx) {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); const src = ctx.createMediaElementSource(engine.audioEl);
            const an = ctx.createAnalyser(); an.fftSize = 2048; const gn = ctx.createGain(); src.connect(an); an.connect(gn); gn.connect(ctx.destination);
            engine.audioCtx = ctx; engine.analyserNode = an; engine.freqData = new Uint8Array(an.frequencyBinCount); engine.analyzer.bpm = 120;
        }
        engine.audioEl.src = URL.createObjectURL(file); engine.audioEl.play().then(() => setIsPlaying(true));
    };

    return (
        <div className="box">
            <div ref={containerRef} className="canvas" />
            <div className="hud">
                <div className="st"><span>BPM</span>{stats.bpm}</div>
                <div className="st"><span>POWER</span>{stats.energy}%</div>
                <div className="st"><span>BAR</span>{stats.bar}</div>
            </div>
            <div className="ui">
                <div className="tabs">
                    {['main', 'color', 'form'].map(t => <button key={t} className={`t-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t.toUpperCase()}</button>)}
                </div>
                <div className="panel">
                    {activeTab === 'main' && (
                        <div className="grid">
                            <div className="item"><label>SENSITIVITY</label><input type="range" min="0.1" max="3" step="0.1" value={config.sensitivity} onChange={e => setConfig({ ...config, sensitivity: parseFloat(e.target.value) })} /></div>
                            <div className="item"><label>SMOOTHNESS</label><input type="range" min="0" max="1" step="0.01" value={config.smoothness} onChange={e => setConfig({ ...config, smoothness: parseFloat(e.target.value) })} /></div>
                        </div>
                    )}
                    {activeTab === 'color' && (
                        <div className="t-grid">
                            {Object.keys(COLOR_THEMES).map(t => <button key={t} className={`t-btn ${config.colorTheme === t ? 'active' : ''}`} onClick={() => { const th = COLOR_THEMES[t]; setConfig({ ...config, colorTheme: t, colorPrimary: th.primary, colorSecondary: th.secondary, colorBg: th.bg }); }}>{t}</button>)}
                        </div>
                    )}
                    {activeTab === 'form' && (
                        <div className="t-grid">
                            {['icosahedron', 'sphere', 'torus', 'octahedron'].map(f => <button key={f} className={`t-btn ${config.form === f ? 'active' : ''}`} onClick={() => { setConfig({ ...config, form: f }); if (engineRef.current) engineRef.current.rebuild({ ...config, form: f }); }}>{f}</button>)}
                        </div>
                    )}
                </div>
                <div className="ctrls">
                    <label className="c-btn"><Upload size={20} /><input type="file" onChange={handleFile} hidden /></label>
                    <button className="c-btn play" onClick={() => { const el = engineRef.current.audioEl; if (isPlaying) el.pause(); else el.play(); setIsPlaying(!isPlaying); }}>{isPlaying ? <Pause size={24} /> : <Play size={24} />}</button>
                    <button className="c-btn" onClick={() => { const ths = Object.keys(COLOR_THEMES); const t = ths[Math.floor(Math.random() * ths.length)]; const th = COLOR_THEMES[t]; setConfig({ ...config, colorTheme: t, colorPrimary: th.primary, colorSecondary: th.secondary, colorBg: th.bg, sensitivity: Math.random() * 2 + 0.5 }); }}><Shuffle size={20} /></button>
                </div>
            </div>
            <style jsx>{`
                .box { position: relative; width: 100%; height: 750px; background: #000; border-radius: 2.5rem; overflow: hidden; font-family: 'Inter', sans-serif; border: 1px solid rgba(255,255,255,0.1); }
                .canvas { width: 100%; height: 100%; }
                .hud { position: absolute; top: 2.5rem; right: 2.5rem; display: flex; flex-direction: column; gap: 1rem; text-align: right; pointer-events: none; }
                .st { color: #fff; font-size: 0.8rem; font-weight: 800; letter-spacing: 0.2em; }
                .st span { display: block; font-size: 0.5rem; color: rgba(255,255,255,0.3); }
                .ui { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; background: linear-gradient(transparent, rgba(0,0,0,0.9)); }
                .tabs { display: flex; gap: 6px; padding: 6px; background: rgba(255,255,255,0.05); border-radius: 100px; backdrop-filter: blur(20px); }
                .t-btn { padding: 0.6rem 2rem; border: none; background: transparent; color: rgba(255,255,255,0.4); font-size: 0.75rem; font-weight: 800; border-radius: 100px; cursor: pointer; transition: 0.4s; }
                .t-btn.active { background: var(--surface); color: #000; }
                .panel { width: 100%; max-width: 550px; background: rgba(0,0,0,0.7); backdrop-filter: blur(50px); border: 1px solid rgba(255,255,255,0.1); border-radius: 2rem; padding: 2rem; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .item { display: flex; flex-direction: column; gap: 0.75rem; }
                .item label { color: rgba(255,255,255,0.3); font-size: 0.6rem; font-weight: 800; }
                .t-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem; }
                .ctrls { display: flex; align-items: center; gap: 1.5rem; }
                .c-btn { width: 56px; height: 56px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.4s; }
                .c-btn.play { width: 72px; height: 72px; background: var(--surface); color: #000; border: none; }
                input[type="range"] { -webkit-appearance: none; background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; }
                input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: var(--surface); border-radius: 50%; cursor: pointer; }
            `}</style>
        </div>
    );
}
