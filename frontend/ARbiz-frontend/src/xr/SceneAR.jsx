// xr/SceneAR.jsx
import { useEffect, useRef, useState } from 'react';

/**
 * Renders a flat business-card plane in WebXR.
 * Fixed version with proper error handling and user activation requirements.
 *
 * Props
 *  ─ data:    card data returned by the API
 *  ─ onFail:  optional callback – called when AR fails so parent can fall back
 */
export default function SceneAR({ data, onFail }) {
    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cardRef = useRef(null);
    const sessionRef = useRef(null);
    const [phase, setPhase] = useState('init');   // init | ready | starting-ar | ar-active | error
    const [msg, setMsg] = useState('');
    const [arSupported, setArSupported] = useState(false);

    useEffect(() => {
        let THREE, renderer, scene, camera;
        let isCleanedUp = false;

        (async () => {
            try {
                setMsg('Checking AR support...');

                /* 1 ─ Check WebXR Support ─────────────────────────────────── */
                if (!navigator.xr) {
                    throw new Error('WebXR not supported on this browser');
                }

                // Check for AR support with better error handling
                let supported = false;
                try {
                    supported = await navigator.xr.isSessionSupported('immersive-ar');
                } catch (e) {
                    console.warn('Error checking AR support:', e);
                    throw new Error('Cannot detect AR capabilities on this device');
                }

                if (!supported) {
                    throw new Error('AR not available - please use Chrome on Android with ARCore support');
                }

                setArSupported(true);
                setMsg('Loading AR experience...');

                /* 2 ─ Dynamic imports ─────────────────────────────────────── */
                THREE = await import('three');

                /* 3 ─ Basic scene / renderer ──────────────────────────────── */
                scene = new THREE.Scene();
                sceneRef.current = scene;

                camera = new THREE.PerspectiveCamera(
                    75,
                    window.innerWidth / window.innerHeight,
                    0.01,
                    1000
                );

                renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                });
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.xr.enabled = true;
                renderer.setClearColor(0x000000, 0);
                rendererRef.current = renderer;

                if (mountRef.current && !isCleanedUp) {
                    mountRef.current.appendChild(renderer.domElement);
                }

                /* 4 ─ Create Business Card ────────────────────────────────── */
                await createBusinessCard(THREE, scene, data);

                /* 5 ─ Lighting ────────────────────────────────────────────── */
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
                scene.add(ambientLight);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
                directionalLight.position.set(0, 1, 1);
                scene.add(directionalLight);

                /* 6 ─ AR Session Event Handlers ───────────────────────────── */
                renderer.xr.addEventListener('sessionstart', () => {
                    console.log('AR session started');
                    setPhase('ar-active');

                    // Position card in front of user when AR starts
                    if (cardRef.current) {
                        positionCardInAR(cardRef.current);
                    }
                });

                renderer.xr.addEventListener('sessionend', () => {
                    console.log('AR session ended');
                    setPhase('ready');
                    sessionRef.current = null;
                });

                /* 7 ─ Render loop ─────────────────────────────────────────── */
                function animate() {
                    if (!isCleanedUp && renderer) {
                        renderer.render(scene, camera);
                    }
                }

                renderer.setAnimationLoop(animate);

                /* 8 ─ Setup complete - show start button ──────────────────── */
                setMsg('Tap "Start AR" to view your business card');
                setPhase('ready');

            } catch (err) {
                console.error('AR init failed:', err);
                setMsg(err.message);
                setPhase('error');
                onFail?.();
            }
        })();

        /* 9 ─ Cleanup ─────────────────────────────────────────────────── */
        return () => {
            isCleanedUp = true;

            // End XR session if active
            if (sessionRef.current) {
                try {
                    sessionRef.current.end().catch(e => console.warn('Error ending session:', e));
                } catch (e) {
                    console.warn('Error accessing XR session:', e);
                }
            }

            if (rendererRef.current) {
                try {
                    rendererRef.current.setAnimationLoop(null);
                    if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode) {
                        rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
                    }
                    rendererRef.current.dispose();
                } catch (e) {
                    console.warn('Error disposing renderer:', e);
                }
            }
        };
    }, [data, onFail]);

    /* ─ Start AR Session Function ─────────────────────────────────────── */
    async function startARSession() {
        if (!rendererRef.current) return;

        try {
            setPhase('starting-ar');
            setMsg('Starting AR session...');

            // Minimal session configuration to avoid reference space issues
            const sessionConfig = {
                requiredFeatures: [],
                optionalFeatures: ['local-floor', 'bounded-floor', 'hit-test']
            };

            // Create AR session
            const session = await navigator.xr.requestSession('immersive-ar', sessionConfig);
            sessionRef.current = session;

            // Set up reference space with fallback chain
            let referenceSpace;
            const spaceTypes = ['local-floor', 'local', 'viewer'];

            for (const spaceType of spaceTypes) {
                try {
                    referenceSpace = await session.requestReferenceSpace(spaceType);
                    console.log(`Using reference space: ${spaceType}`);
                    break;
                } catch (e) {
                    console.warn(`${spaceType} reference space not supported:`, e);
                    continue;
                }
            }

            if (!referenceSpace) {
                throw new Error('No suitable reference space found');
            }

            // Set up the session with THREE.js
            await rendererRef.current.xr.setSession(session);

            return session;
        } catch (error) {
            console.error('AR session failed:', error);
            setMsg('AR not supported on this device. Try a different browser or device.');
            setPhase('error');
            sessionRef.current = null;
            onFail?.();
            throw error;
        }
    }

    /* ─ Create Business Card with Better Error Handling ───────────────── */
    async function createBusinessCard(THREE, scene, cardData) {
        try {
            const cardWidth = 0.12;  // Reduced size for better AR visibility
            const cardHeight = cardWidth / 1.75;

            const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
            let material;

            // Create custom card material with proper image handling
            console.log('Creating business card material');
            material = await createCustomCardMaterial(THREE, cardData);

            const card = new THREE.Mesh(geometry, material);
            cardRef.current = card;

            // Better initial positioning - closer to camera
            card.position.set(0, 0, -0.25);
            scene.add(card);

            return card;
        } catch (err) {
            console.error('Failed to create business card:', err);
            throw new Error('Failed to create business card');
        }
    }

    /* ─ Create Custom Card Material with Proper Image Handling ────────── */
    async function createCustomCardMaterial(THREE, cardData) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;  // Higher resolution
        canvas.height = 585;  // Business card ratio (1.75:1)
        const ctx = canvas.getContext('2d');

        try {
            // Step 1: Draw background
            await drawBackground(ctx, canvas, cardData);

            // Step 2: Try to draw logo (with proper error handling)
            await drawLogo(ctx, cardData);

            // Step 3: Draw text content
            drawCardText(ctx, canvas, cardData);

        } catch (error) {
            console.warn('Error creating custom card, using fallback:', error);
            drawSimpleFallback(ctx, canvas, cardData);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.flipY = false; // Important for proper texture orientation

        return new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
    }

    /* ─ Draw Background with Proper Image Loading ──────────────────────── */
    async function drawBackground(ctx, canvas, cardData) {
        // Always start with solid background as base
        drawSolidBackground(ctx, canvas, cardData.themeColor);

        // Try to load background image if it exists and is accessible
        if (cardData.backgroundImage && isAccessibleUrl(cardData.backgroundImage)) {
            try {
                const bgImg = await loadImageWithProxy(cardData.backgroundImage);
                // Draw background image with overlay blend for better text readability
                ctx.globalAlpha = 0.7;
                ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1.0;

                // Add subtle overlay for text readability
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, 'rgba(0,0,0,0.1)');
                gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } catch (bgError) {
                console.warn('Failed to load background image:', bgError);
                // Solid background already drawn as fallback
            }
        }
    }

    /* ─ Draw Logo with Proper Error Handling ──────────────────────────── */
    async function drawLogo(ctx, cardData) {
        if (cardData.logo && isAccessibleUrl(cardData.logo)) {
            try {
                const logoImg = await loadImageWithProxy(cardData.logo);
                const logoSize = 120;
                const logoX = 50;
                const logoY = 50;

                // Add white background circle for logo
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.beginPath();
                ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 10, 0, Math.PI * 2);
                ctx.fill();

                ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
            } catch (logoError) {
                console.warn('Failed to load logo:', logoError);
                drawPlaceholderLogo(ctx);
            }
        } else {
            console.warn('Logo URL not accessible or localhost detected, drawing placeholder');
            drawPlaceholderLogo(ctx);
        }
    }

    /* ─ Load Image with Proxy/CORS Handling ───────────────────────────── */
    function loadImageWithProxy(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            // Try with CORS first
            img.crossOrigin = 'anonymous';

            const timeout = setTimeout(() => {
                reject(new Error('Image loading timeout'));
            }, 10000);

            img.onload = () => {
                clearTimeout(timeout);
                resolve(img);
            };

            img.onerror = (error) => {
                clearTimeout(timeout);
                console.warn('Direct image load failed, trying without CORS:', error);

                // Try without CORS as fallback
                const fallbackImg = new Image();
                fallbackImg.onload = () => resolve(fallbackImg);
                fallbackImg.onerror = () => reject(new Error('Failed to load image'));
                // Remove crossOrigin for fallback
                fallbackImg.src = url;
            };

            img.src = url;
        });
    }

    /* ─ Check if URL is accessible (not localhost) ────────────────────── */
    function isAccessibleUrl(url) {
        if (!url) return false;
        try {
            const urlObj = new URL(url);
            // Check if it's a local URL that won't be accessible from phone
            const isLocal = urlObj.hostname === 'localhost' ||
                urlObj.hostname === '127.0.0.1' ||
                urlObj.hostname.includes('ngrok') ||
                urlObj.protocol === 'file:';

            return !isLocal;
        } catch {
            // If URL parsing fails, check for common local patterns
            return !(url.includes('localhost') ||
                url.includes('127.0.0.1') ||
                url.includes('ngrok') ||
                url.startsWith('file://') ||
                url.startsWith('blob:'));
        }
    }

    /* ─ Draw Placeholder Logo ─────────────────────────────────────────── */
    function drawPlaceholderLogo(ctx) {
        const logoSize = 120;
        const logoX = 50;
        const logoY = 50;

        // Draw white background circle
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 10, 0, Math.PI * 2);
        ctx.fill();

        // Draw placeholder logo rectangle
        ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
        ctx.fillRect(logoX, logoY, logoSize, logoSize);

        ctx.strokeStyle = 'rgba(150, 150, 150, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(logoX, logoY, logoSize, logoSize);

        // Add "LOGO" text
        ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LOGO', logoX + logoSize / 2, logoY + logoSize / 2 + 7);
    }

    /* ─ Draw Solid Background ─────────────────────────────────────────── */
    function drawSolidBackground(ctx, canvas, themeColor) {
        const bgColor = themeColor || '#6366f1';

        // Create gradient background for more visual appeal
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, bgColor);
        gradient.addColorStop(1, adjustBrightness(bgColor, -20));

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    /* ─ Adjust Color Brightness ───────────────────────────────────────── */
    function adjustBrightness(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /* ─ Draw Card Text Content ────────────────────────────────────────── */
    function drawCardText(ctx, canvas, cardData) {
        // Set text properties with better contrast
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 2;
        ctx.textAlign = 'left';

        // Name (large, prominent)
        if (cardData.fullName) {
            ctx.font = `bold 48px ${getSafeFont(cardData.fontStyle)}`;
            const nameY = cardData.logo ? 220 : 120;
            ctx.strokeText(cardData.fullName, 50, nameY);
            ctx.fillText(cardData.fullName, 50, nameY);
        }

        // Designation
        if (cardData.designation) {
            ctx.font = `32px ${getSafeFont(cardData.fontStyle)}`;
            const titleY = cardData.fullName ? (cardData.logo ? 270 : 170) : 120;
            ctx.strokeText(cardData.designation, 50, titleY);
            ctx.fillText(cardData.designation, 50, titleY);
        }

        // Company name
        if (cardData.companyName) {
            ctx.font = `bold 36px ${getSafeFont(cardData.fontStyle)}`;
            const companyY = cardData.designation ? (cardData.logo ? 320 : 220) : 170;
            ctx.strokeText(cardData.companyName, 50, companyY);
            ctx.fillText(cardData.companyName, 50, companyY);
        }

        // Contact information (right side)
        ctx.font = '24px Arial';
        ctx.textAlign = 'right';
        const rightX = canvas.width - 50;
        let contactY = canvas.height - 150;

        if (cardData.phone) {
            ctx.strokeText(`📞 ${cardData.phone}`, rightX, contactY);
            ctx.fillText(`📞 ${cardData.phone}`, rightX, contactY);
            contactY += 35;
        }

        if (cardData.email) {
            ctx.strokeText(`✉️ ${cardData.email}`, rightX, contactY);
            ctx.fillText(`✉️ ${cardData.email}`, rightX, contactY);
            contactY += 35;
        }

        if (cardData.website) {
            ctx.strokeText(`🌐 ${cardData.website}`, rightX, contactY);
            ctx.fillText(`🌐 ${cardData.website}`, rightX, contactY);
            contactY += 35;
        }

        if (cardData.address) {
            ctx.font = '20px Arial';
            const addressLines = wrapText(ctx, cardData.address, 300);
            addressLines.forEach((line, index) => {
                if (index === 0) {
                    ctx.strokeText(`📍 ${line}`, rightX, contactY);
                    ctx.fillText(`📍 ${line}`, rightX, contactY);
                } else {
                    ctx.strokeText(line, rightX, contactY);
                    ctx.fillText(line, rightX, contactY);
                }
                contactY += 25;
            });
        }
    }

    /* ─ Get Safe Font (fallback to Arial if font not available) ────────── */
    function getSafeFont(fontStyle) {
        // List of common web-safe fonts
        const safeFonts = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana'];
        return safeFonts.includes(fontStyle) ? fontStyle : 'Arial';
    }

    /* ─ Simple Fallback Drawing ───────────────────────────────────────── */
    function drawSimpleFallback(ctx, canvas, cardData) {
        // Simple gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, cardData.themeColor || '#6366f1');
        gradient.addColorStop(1, '#4f46e5');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Simple white text
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = 'bold 48px Arial';
        ctx.fillText(cardData.fullName || 'Business Card', canvas.width / 2, canvas.height / 2);

        if (cardData.companyName) {
            ctx.font = '32px Arial';
            ctx.fillText(cardData.companyName, canvas.width / 2, canvas.height / 2 + 60);
        }
    }

    /* ─ Wrap Text Helper ──────────────────────────────────────────────── */
    function wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    /* ─ Position Card in AR Space - FIXED POSITIONING ──────────────────── */
    function positionCardInAR(card) {
        // Better positioning - right in front of camera
        card.position.set(0, -0.02, -0.15);  // Closer to camera, slightly below eye level
        card.rotation.x = -Math.PI / 12;      // Slight tilt for better viewing angle
        card.rotation.y = 0;
        card.rotation.z = 0;

        // Make sure card is visible
        card.visible = true;

        console.log('Card positioned at:', card.position);
    }

    /* ─ Handle Exit AR ────────────────────────────────────────────────── */
    function handleExitAR() {
        if (sessionRef.current) {
            sessionRef.current.end().catch(e => console.warn('Error ending session:', e));
        }
    }

    /* ─ Render UI based on phase ──────────────────────────────────────── */
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

    if (phase === 'starting-ar') {
        return <Fallback title="Starting AR..." msg="Please allow camera access when prompted" spinner />;
    }

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

            {phase === 'ready' && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    zIndex: 999
                }}>
                    <button
                        onClick={startARSession}
                        style={{
                            padding: '16px 32px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = '#059669';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = '#10b981';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        🚀 Start AR Experience
                    </button>
                    <p style={{
                        marginTop: '16px',
                        color: '#666',
                        fontSize: '14px',
                        maxWidth: '300px'
                    }}>
                        View {data?.fullName || 'your'}'s business card in augmented reality
                    </p>
                </div>
            )}

            {phase === 'ar-active' && (
                <>
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
                        zIndex: 998
                    }}>
                        📱 AR Active - Business card should appear in front of you
                    </div>

                    <button
                        onClick={handleExitAR}
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '12px 24px',
                            background: 'rgba(239, 68, 68, 0.9)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            zIndex: 998
                        }}
                    >
                        Exit AR
                    </button>
                </>
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