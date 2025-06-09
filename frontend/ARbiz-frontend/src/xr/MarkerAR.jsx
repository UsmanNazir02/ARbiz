// xr/MarkerAR.jsx
import { useEffect, useRef, useState } from 'react';

/**
 * AR.js implementation with better error handling and duplicate prevention
 */
export default function MarkerAR({ data, onFail }) {
    const mountRef = useRef(null);
    const [phase, setPhase] = useState('init');
    const [msg, setMsg] = useState('');
    const initRef = useRef(false);

    useEffect(() => {
        // Prevent multiple initializations
        if (initRef.current) return;
        initRef.current = true;

        let cleanup = () => { };

        (async () => {
            try {
                setMsg('Checking AR.js compatibility...');

                // Check if AR.js is already loaded
                if (window.AFRAME && window.AFRAME.version) {
                    console.log('A-Frame already loaded, version:', window.AFRAME.version);
                    await initializeAR();
                    return;
                }

                // Check if AR.js custom elements are already registered
                if (customElements.get('a-scene')) {
                    console.log('A-Frame custom elements already registered');
                    await initializeAR();
                    return;
                }

                setMsg('Loading AR.js library...');

                // Load AR.js with better error handling
                await loadARJS();

                // Wait a bit for AR.js to fully initialize
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (!window.AFRAME) {
                    throw new Error('AR.js failed to load properly');
                }

                await initializeAR();

            } catch (error) {
                console.error('MarkerAR initialization failed:', error);
                setMsg(error.message || 'Failed to initialize AR');
                setPhase('error');
                onFail?.();
            }
        })();

        return () => {
            cleanup();
        };
    }, [data, onFail]);

    async function loadARJS() {
        return new Promise((resolve, reject) => {
            // Check if script is already loaded
            const existingScript = document.querySelector('script[src*="ar.js"]');
            if (existingScript) {
                console.log('AR.js script already exists');
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/aframe/1.4.0/aframe.min.js';
            script.onload = () => {
                console.log('A-Frame loaded');

                // Load AR.js after A-Frame
                const arScript = document.createElement('script');
                arScript.src = 'https://cdn.jsdelivr.net/npm/ar.js@3.4.5/aframe/build/aframe-ar.min.js';
                arScript.onload = () => {
                    console.log('AR.js loaded');
                    resolve();
                };
                arScript.onerror = (error) => {
                    console.error('Failed to load AR.js:', error);
                    reject(new Error('Failed to load AR.js library'));
                };
                document.head.appendChild(arScript);
            };
            script.onerror = (error) => {
                console.error('Failed to load A-Frame:', error);
                reject(new Error('Failed to load A-Frame library'));
            };
            document.head.appendChild(script);
        });
    }

    async function initializeAR() {
        try {
            setMsg('Setting up AR scene...');

            if (!mountRef.current) {
                throw new Error('Mount reference not available');
            }

            // Create the AR scene
            const sceneHTML = createARScene(data);
            mountRef.current.innerHTML = sceneHTML;

            // Wait for scene to be ready
            const scene = mountRef.current.querySelector('a-scene');
            if (scene) {
                scene.addEventListener('loaded', () => {
                    console.log('AR scene loaded');
                    setPhase('ready');
                    setMsg('Point your camera at a flat surface');
                });

                scene.addEventListener('arError', (event) => {
                    console.error('AR Error:', event.detail);
                    setPhase('error');
                    setMsg('AR initialization failed');
                    onFail?.();
                });
            }

        } catch (error) {
            console.error('AR scene setup failed:', error);
            setPhase('error');
            setMsg('Failed to setup AR scene');
            onFail?.();
        }
    }

    function createARScene(cardData) {
        const cardTitle = cardData.fullName || 'Business Card';
        const cardContent = createCardContent(cardData);

        return `
            <a-scene 
                embedded 
                arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best;" 
                renderer="logarithmicDepthBuffer: true; precision: medium;"
                vr-mode-ui="enabled: false"
                device-orientation-permission-ui="enabled: false"
                style="width: 100%; height: 100%;"
            >
                <a-assets>
                    <a-mixin id="card-text" 
                        text="font: dejavu; anchor: center; align: center; color: white; shader: msdf">
                    </a-mixin>
                </a-assets>

                <a-camera gps-camera rotation-reader look-controls-enabled="false" arjs-look-controls="smoothingFactor: 0.1"></a-camera>

                <a-marker preset="hiro" raycaster="objects: .clickable" emitevents="true" cursor="fuse: false; rayOrigin: mouse;">
                    <!-- Business Card Plane -->
                    <a-plane 
                        position="0 0 0" 
                        rotation="-90 0 0" 
                        width="2" 
                        height="1.2" 
                        color="${cardData.themeColor || '#6366f1'}"
                        shadow="receive: true"
                        material="opacity: 0.9"
                    >
                        <!-- Card Content -->
                        ${cardContent}
                    </a-plane>
                    
                    <!-- Floating Animation -->
                    <a-animation 
                        attribute="position" 
                        to="0 0.1 0" 
                        dur="2000" 
                        direction="alternate" 
                        repeat="indefinite"
                    ></a-animation>
                </a-marker>

                <!-- Lighting -->
                <a-light type="ambient" color="#ffffff" intensity="0.8"></a-light>
                <a-light type="directional" position="0 1 0" intensity="0.5"></a-light>
            </a-scene>
        `;
    }

    function createCardContent(cardData) {
        let content = '';
        let yPos = 0.4;

        // Company Name (top)
        if (cardData.companyName) {
            content += `
                <a-text 
                    mixin="card-text"
                    value="${escapeHTML(cardData.companyName)}"
                    position="0 ${yPos} 0.01"
                    scale="0.8 0.8 1"
                    text="font: dejavu; color: white; align: center; width: 4"
                ></a-text>
            `;
            yPos -= 0.2;
        }

        // Full Name (prominent)
        if (cardData.fullName) {
            content += `
                <a-text 
                    mixin="card-text"
                    value="${escapeHTML(cardData.fullName)}"
                    position="0 ${yPos} 0.01"
                    scale="1.2 1.2 1"
                    text="font: dejavu; color: white; align: center; width: 4"
                ></a-text>
            `;
            yPos -= 0.25;
        }

        // Designation
        if (cardData.designation) {
            content += `
                <a-text 
                    mixin="card-text"
                    value="${escapeHTML(cardData.designation)}"
                    position="0 ${yPos} 0.01"
                    scale="0.6 0.6 1"
                    text="font: dejavu; color: white; align: center; width: 4"
                ></a-text>
            `;
            yPos -= 0.2;
        }

        // Contact Info
        const contactInfo = [];
        if (cardData.phone) contactInfo.push(`📞 ${cardData.phone}`);
        if (cardData.email) contactInfo.push(`✉️ ${cardData.email}`);
        if (cardData.website) contactInfo.push(`🌐 ${cardData.website}`);

        contactInfo.forEach(info => {
            content += `
                <a-text 
                    mixin="card-text"
                    value="${escapeHTML(info)}"
                    position="0 ${yPos} 0.01"
                    scale="0.4 0.4 1"
                    text="font: dejavu; color: white; align: center; width: 6"
                ></a-text>
            `;
            yPos -= 0.15;
        });

        return content;
    }

    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /* ─ Render based on phase ──────────────────────────────────────────── */
    if (phase === 'error') {
        return (
            <Fallback
                title="AR Failed"
                msg={msg}
                showRetry={true}
                onRetry={() => window.location.reload()}
            />
        );
    }

    if (phase === 'init') {
        return <Fallback title="Loading AR..." msg={msg} spinner />;
    }

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

            {phase === 'ready' && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    right: '20px',
                    background: 'rgba(16, 185, 129, 0.9)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    zIndex: 999
                }}>
                    📱 Point your camera at the Hiro marker to see the business card
                </div>
            )}
        </div>
    );
}

/* ─ Fallback Component ────────────────────────────────────────────────── */
function Fallback({ title, msg = '', spinner = false, showRetry = false, onRetry }) {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            padding: '20px',
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            {spinner && (
                <div style={{
                    width: 50,
                    height: 50,
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '4px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: 20
                }} />
            )}

            <h3 style={{
                margin: '0 0 10px 0',
                color: spinner ? 'white' : '#fef2f2',
                fontSize: '28px',
                fontWeight: 'bold'
            }}>
                {title}
            </h3>

            {msg && (
                <p style={{
                    margin: '0 0 20px 0',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                    maxWidth: '400px',
                    lineHeight: '1.5'
                }}>
                    {msg}
                </p>
            )}

            {showRetry && (
                <button
                    onClick={onRetry}
                    style={{
                        padding: '12px 24px',
                        background: 'white',
                        color: '#667eea',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    Try Again
                </button>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}