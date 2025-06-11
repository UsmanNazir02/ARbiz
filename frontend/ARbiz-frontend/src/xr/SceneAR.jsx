// xr/SceneAR.jsx
import { useEffect, useRef, useState } from 'react';

/* ────────────────────────────────────────────────────────────────────── */
/* SceneAR – renders an interactive business-card plane in WebXR          */
/* ────────────────────────────────────────────────────────────────────── */

export default function SceneAR({ data = {}, onFail }) {
    /* refs */
    const mountRef = useRef(null);      // div that hosts WebGL <canvas>
    const rendererRef = useRef(null);      // THREE.WebGLRenderer
    const sceneRef = useRef(null);      // THREE.Scene
    const cameraRef = useRef(null);      // THREE.PerspectiveCamera
    const cardRef = useRef(null);      // THREE.Mesh (card plane)
    const textureRef = useRef(null);      // THREE.CanvasTexture
    const sessionRef = useRef(null);      // XRSession
    const threeRef = useRef(null);      // cached THREE module
    const animationIdRef = useRef(null); // for cleanup
    const isXRActiveRef = useRef(false); // Track XR state
    const raycasterRef = useRef(null);   // For click detection
    const interactiveAreasRef = useRef([]); // Store clickable areas
    const linkQueueRef = useRef([]); // Queue links to open after session ends
    const controllerRef = useRef(null); // XR controller reference

    /* state */
    const [phase, setPhase] = useState('init');   // init | ready | starting | ar | error
    const [msg, setMsg] = useState('');
    const [ok, setOk] = useState(false);    // WebXR support

    /* ───────────────────────── initialisation ─────────────────────────── */
    useEffect(() => {
        let cleaned = false;

        (async () => {
            try {
                console.log('[SceneAR] boot');
                setMsg('Checking WebXR support …');

                /* 1 ▸ feature-detect WebXR */
                if (!navigator.xr) throw new Error('WebXR not available in this browser.');
                if (!await navigator.xr.isSessionSupported('immersive-ar'))
                    throw new Error('AR not supported on this device.');
                setOk(true);
                console.log('[SceneAR] WebXR ✔');

                /* 2 ▸ dynamic import THREE */
                const THREE = await import('three');
                threeRef.current = THREE;
                console.log('[SceneAR] THREE imported');

                /* 3 ▸ scene + renderer */
                const scene = new THREE.Scene();
                sceneRef.current = scene;

                const camera = new THREE.PerspectiveCamera(
                    75, window.innerWidth / window.innerHeight, 0.01, 1000
                );
                cameraRef.current = camera;

                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setClearColor(0x000000, 0);
                renderer.xr.enabled = true;
                rendererRef.current = renderer;

                // Initialize raycaster for click detection
                raycasterRef.current = new THREE.Raycaster();

                if (mountRef.current) {
                    mountRef.current.appendChild(renderer.domElement);
                }

                /* 4 ▸ build card + lighting */
                await buildCard(THREE, scene, data);
                addLights(THREE, scene);

                // Start regular rendering loop for non-XR mode
                startRegularRenderLoop();

                setPhase('ready');
                setMsg('Tap "Start AR"');
                console.log('[SceneAR] ready 🚀');
            } catch (err) {
                console.error('[SceneAR] init-fail', err);
                setPhase('error');
                setMsg(err.message);
                onFail?.();
            }
        })();

        /* cleanup */
        return () => {
            cleaned = true;
            try {
                if (animationIdRef.current) {
                    cancelAnimationFrame(animationIdRef.current);
                }
                rendererRef.current?.setAnimationLoop(null);
                rendererRef.current?.dispose();
                rendererRef.current?.domElement?.remove();
                sessionRef.current?.end();
            } catch { /* ignore */ }
        };
    }, [data, onFail]);

    /* ───────────────────────── render loops ─────────────────────────── */

    function startRegularRenderLoop() {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
        if (isXRActiveRef.current) return; // Don't start if XR is active

        const animate = () => {
            // Only render in regular mode if XR is not active
            if (isXRActiveRef.current) return;

            animationIdRef.current = requestAnimationFrame(animate);

            try {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            } catch (error) {
                console.warn('[SceneAR] Regular render error:', error);
            }
        };
        animate();
    }

    function startXRRenderLoop() {
        if (!rendererRef.current || !sceneRef.current) return;

        // Clear any existing animation loop first
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
        }
        rendererRef.current.setAnimationLoop(null);

        // Set the XR animation loop
        rendererRef.current.setAnimationLoop((timestamp, frame) => {
            // Only render if we have an active XR session
            if (!sessionRef.current || !isXRActiveRef.current || !frame) return;

            try {
                const THREE = threeRef.current;
                const xrCamera = rendererRef.current.xr.getCamera();

                // Position the card in front of the user
                if (cardRef.current) {
                    const pos = new THREE.Vector3();
                    xrCamera.getWorldPosition(pos);
                    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(xrCamera.quaternion);
                    cardRef.current.position.copy(pos.clone().add(dir.multiplyScalar(0.50)));
                    cardRef.current.lookAt(pos);
                }

                rendererRef.current.render(sceneRef.current, xrCamera);
            } catch (error) {
                console.warn('[SceneAR] XR render error:', error);
            }
        });
    }

    /* ───────────────────────── builders ──────────────────────────────── */

    /** create card mesh (+ texture) and add to scene */
    async function buildCard(THREE, scene, card) {
        console.log('[SceneAR] buildCard');
        const width = 0.30;                // Card width
        const height = width / 1.75;       // 3.5" × 2" aspect

        const geo = new THREE.PlaneGeometry(width, height);
        const texture = await makeTexture(THREE, card);   // may throw
        textureRef.current = texture;

        const mat = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(0, 0, -0.45);    // Position in front of camera
        mesh.frustumCulled = false;

        cardRef.current = mesh;
        scene.add(mesh);

        // Store interactive areas for click detection
        setupInteractiveAreas(card, width, height);
    }

    /** Setup clickable areas on the card */
    function setupInteractiveAreas(card, cardWidth, cardHeight) {
        const areas = [];

        // Convert card dimensions to texture coordinates
        const W = 1024, H = 585; // Texture dimensions

        // Define clickable areas based on text positions in the texture
        let y = 430; // Starting Y position for contact info (bottom section)
        const rightX = W - 60; // Right-aligned X position
        const areaHeight = 45; // Increased height for better click detection with new spacing

        if (card.phone) {
            areas.push({
                type: 'phone',
                value: card.phone,
                // Convert texture coordinates to normalized card coordinates (-0.5 to 0.5)
                bounds: {
                    left: (rightX - 250) / W - 0.5,   // Left edge of clickable area
                    right: rightX / W - 0.5,          // Right edge
                    top: -(y - areaHeight / 2) / H + 0.5,     // Top edge (Y is flipped)
                    bottom: -(y + areaHeight / 2) / H + 0.5   // Bottom edge
                }
            });
            y += 48; // Increased spacing between contact items
        }

        if (card.email) {
            areas.push({
                type: 'email',
                value: card.email,
                bounds: {
                    left: (rightX - 300) / W - 0.5,
                    right: rightX / W - 0.5,
                    top: -(y - areaHeight / 2) / H + 0.5,
                    bottom: -(y + areaHeight / 2) / H + 0.5
                }
            });
            y += 48; // Increased spacing between contact items
        }

        if (card.website) {
            areas.push({
                type: 'website',
                value: card.website,
                bounds: {
                    left: (rightX - 250) / W - 0.5,
                    right: rightX / W - 0.5,
                    top: -(y - areaHeight / 2) / H + 0.5,
                    bottom: -(y + areaHeight / 2) / H + 0.5
                }
            });
        }

        interactiveAreasRef.current = areas;
        console.log('[SceneAR] Interactive areas:', areas);
    }

    /** Setup XR controllers and interaction */
    function setupXRInteraction(session) {
        const THREE = threeRef.current;

        // Get controller
        const controller = rendererRef.current.xr.getController(0);
        controllerRef.current = controller;
        sceneRef.current.add(controller);

        // Add controller events
        controller.addEventListener('selectstart', onSelectStart);
        controller.addEventListener('selectend', onSelectEnd);
        controller.addEventListener('select', onSelect);

        // Also setup screen tap detection for mobile AR
        setupScreenTapDetection();
    }

    /** Handle XR controller/screen interactions */
    function onSelectStart(event) {
        console.log('[SceneAR] Select start');
    }

    function onSelectEnd(event) {
        console.log('[SceneAR] Select end');
    }

    function onSelect(event) {
        console.log('[SceneAR] Select triggered');
        handleXRInteraction(event);
    }

    /** Setup screen tap detection for mobile AR */
    function setupScreenTapDetection() {
        const canvas = rendererRef.current?.domElement;
        if (!canvas) return;

        // Remove existing listeners first
        canvas.removeEventListener('click', handleScreenTap);
        canvas.removeEventListener('touchend', handleScreenTap);

        // Add new listeners
        canvas.addEventListener('click', handleScreenTap, { passive: false });
        canvas.addEventListener('touchend', handleScreenTap, { passive: false });

        console.log('[SceneAR] Screen tap detection setup');
    }

    /** Handle screen tap in AR mode */
    function handleScreenTap(event) {
        if (!isXRActiveRef.current) return;

        event.preventDefault();
        event.stopPropagation();

        console.log('[SceneAR] Screen tap detected in AR mode');

        // Get tap position (center of screen for mobile AR)
        const rect = event.target.getBoundingClientRect();
        let x, y;

        if (event.type === 'touchend' && event.changedTouches?.length > 0) {
            const touch = event.changedTouches[0];
            x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        } else if (event.type === 'click') {
            x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        } else {
            // Default to center of screen
            x = 0;
            y = 0;
        }

        performRaycast(x, y);
    }

    /** Handle XR controller interaction */
    function handleXRInteraction(event) {
        console.log('[SceneAR] XR controller interaction');

        // For controller, cast ray from controller position
        if (controllerRef.current && raycasterRef.current) {
            const THREE = threeRef.current;
            const tempMatrix = new THREE.Matrix4();
            tempMatrix.identity().extractRotation(controllerRef.current.matrixWorld);

            raycasterRef.current.ray.origin.setFromMatrixPosition(controllerRef.current.matrixWorld);
            raycasterRef.current.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

            checkCardIntersection(raycasterRef.current);
        }
    }

    /** Perform raycast from screen coordinates */
    function performRaycast(x, y) {
        if (!cardRef.current || !raycasterRef.current) return;

        console.log('[SceneAR] Performing raycast at:', x, y);

        const THREE = threeRef.current;
        const camera = rendererRef.current.xr.getCamera();

        // Set ray from camera through screen coordinates
        raycasterRef.current.setFromCamera({ x, y }, camera);

        checkCardIntersection(raycasterRef.current);
    }

    /** Check if raycast intersects with card and handle clicks */
    function checkCardIntersection(raycaster) {
        const intersects = raycaster.intersectObject(cardRef.current);

        console.log('[SceneAR] Intersection check, hits:', intersects.length);

        if (intersects.length > 0) {
            const intersect = intersects[0];
            const uv = intersect.uv;

            if (!uv) {
                console.warn('[SceneAR] No UV coordinates found');
                return;
            }

            // Convert UV coordinates to card coordinates (-0.5 to 0.5)
            const cardX = uv.x - 0.5;
            const cardY = uv.y - 0.5;

            console.log('[SceneAR] Card hit at UV:', uv.x, uv.y, 'Card coords:', cardX, cardY);

            // Check which interactive area was clicked
            for (const area of interactiveAreasRef.current) {
                console.log('[SceneAR] Checking area:', area.type, area.bounds);

                if (cardX >= area.bounds.left && cardX <= area.bounds.right &&
                    cardY >= area.bounds.bottom && cardY <= area.bounds.top) {
                    console.log('[SceneAR] Interactive area HIT:', area.type, area.value);
                    handleLinkClick(area.type, area.value);
                    return;
                }
            }

            console.log('[SceneAR] No interactive area matched the click position');
        } else {
            console.log('[SceneAR] No intersection with card');
        }
    }

    /** ambient + directional light */
    function addLights(THREE, scene) {
        scene.add(new THREE.AmbientLight(0xffffff, 1));
        const dir = new THREE.DirectionalLight(0xffffff, .9);
        dir.position.set(0, 1, 1);
        scene.add(dir);
    }

    /* ───────────────────── texture generator ─────────────────────────── */

    async function makeTexture(THREE, card) {
        const W = 1024, H = 585;
        const cnv = document.createElement('canvas'); cnv.width = W; cnv.height = H;
        const ctx = cnv.getContext('2d');

        await paintBackground(ctx, W, H, card);
        await paintLogo(ctx, card);
        paintText(ctx, W, H, card);
        paintInteractiveIndicators(ctx, W, H, card); // Add visual indicators for clickable areas

        const tex = new THREE.CanvasTexture(cnv);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        return tex;
    }

    /* background (solid + image overlay) */
    async function paintBackground(ctx, W, H, card) {
        const base = card.themeColor || '#6366f1';
        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, base);
        grad.addColorStop(1, shade(base, -30));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        if (card.backgroundImage) {
            try {
                const img = await loadImageSafe(card.backgroundImage);
                ctx.globalAlpha = .75;
                ctx.drawImage(img, 0, 0, W, H);
                ctx.globalAlpha = 1;
            } catch (e) {
                console.warn('[SceneAR] background img fail', e);
            }
        }
    }

    /* logo / profile photo */
    async function paintLogo(ctx, card) {
        const src = card.logo || card.profileImage;
        if (!src) return;

        try {
            const img = await loadImageSafe(src);
            const S = 140, X = 60, Y = 60;

            ctx.save();
            ctx.beginPath();
            ctx.arc(X + S / 2, Y + S / 2, S / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, X, Y, S, S);
            ctx.restore();
        } catch (e) {
            console.warn('[SceneAR] logo img fail', e);
        }
    }

    /* draw text blocks */
    function paintText(ctx, W, H, card) {
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = 'rgba(0,0,0,.65)';
        ctx.lineWidth = 3;
        ctx.textAlign = 'left';

        let y = 260;
        if (card.fullName) {
            ctx.font = 'bold 48px Arial';
            ctx.strokeText(card.fullName, 60, y);
            ctx.fillText(card.fullName, 60, y);
            y += 45;
        }
        if (card.designation) {
            ctx.font = '32px Arial';
            ctx.strokeText(card.designation, 60, y);
            ctx.fillText(card.designation, 60, y);
            y += 40;
        }
        if (card.companyName) {
            ctx.font = 'bold 36px Arial';
            ctx.strokeText(card.companyName, 60, y);
            ctx.fillText(card.companyName, 60, y);
        }

        /* contacts right-aligned with increased spacing */
        ctx.textAlign = 'right';
        ctx.font = '26px Arial';
        let cy = H - 170;
        const X = W - 60;

        const line = t => { ctx.strokeText(t, X, cy); ctx.fillText(t, X, cy); cy += 48; }; // Increased from 38 to 48
        if (card.phone) line(`📞 ${card.phone}`);
        if (card.email) line(`✉️ ${card.email}`);
        if (card.website) line(`🔗 ${card.website}`);
    }

    /* Paint visual indicators for interactive areas */
    function paintInteractiveIndicators(ctx, W, H, card) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);

        let y = H - 170; // Same starting position as contact info
        const X = W - 60;
        const areaHeight = 48; // Updated to match new spacing

        // Draw more visible boxes around clickable contact info
        if (card.phone) {
            const width = ctx.measureText(`📞 ${card.phone}`).width + 30;
            ctx.fillRect(X - width, y - areaHeight / 2 - 8, width, areaHeight + 5);
            ctx.strokeRect(X - width, y - areaHeight / 2 - 8, width, areaHeight + 5);
            y += 48; // Updated spacing
        }

        if (card.email) {
            const width = ctx.measureText(`✉️ ${card.email}`).width + 30;
            ctx.fillRect(X - width, y - areaHeight / 2 - 8, width, areaHeight + 5);
            ctx.strokeRect(X - width, y - areaHeight / 2 - 8, width, areaHeight + 5);
            y += 48; // Updated spacing
        }

        if (card.website) {
            const width = ctx.measureText(`🔗 ${card.website}`).width + 30;
            ctx.fillRect(X - width, y - areaHeight / 2 - 8, width, areaHeight + 5);
            ctx.strokeRect(X - width, y - areaHeight / 2 - 8, width, areaHeight + 5);
        }

        ctx.setLineDash([]); // Reset line dash
    }

    /* ───────────────────────── utilities ─────────────────────────────── */
    async function loadImageSafe(url) {
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const dataURL = await new Promise(r => {
                const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob);
            });
            return await new Promise((res, rej) => {
                const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = dataURL;
            });
        } catch {
            return await new Promise((res, rej) => {
                const i = new Image(); i.crossOrigin = 'anonymous';
                i.onload = () => res(i); i.onerror = rej; i.src = url;
            });
        }
    }

    const shade = (hex, amt) => {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c.split('').map(s => s + s).join('');
        const n = parseInt(c, 16);
        const r = Math.max(0, Math.min(255, (n >> 16) + amt));
        const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
        const b = Math.max(0, Math.min(255, (n & 255) + amt));
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    };

    /* ─────────────────────── AR session stuff ────────────────────────── */

    async function startAR() {
        if (!rendererRef.current) return;
        setPhase('starting'); setMsg('Starting AR …');

        try {
            // Stop regular animation loop completely
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
            }

            const init = {
                requiredFeatures: ['local'],
                optionalFeatures: ['dom-overlay', 'local-floor'],
                domOverlay: { root: document.body }
            };

            const session = await navigator.xr.requestSession('immersive-ar', init);
            sessionRef.current = session;
            isXRActiveRef.current = true;

            await rendererRef.current.xr.setSession(session);

            // Setup XR interactions after session is established
            setupXRInteraction(session);

            // Start XR render loop
            startXRRenderLoop();

            session.addEventListener('end', () => {
                console.log('[SceneAR] XR session ended');
                sessionRef.current = null;
                isXRActiveRef.current = false;

                // Clear XR animation loop
                rendererRef.current?.setAnimationLoop(null);

                setPhase('ready');
                setMsg('Tap "Start AR"');

                // Process any queued links
                processLinkQueue();

                // Restart regular render loop after a short delay
                setTimeout(() => {
                    startRegularRenderLoop();
                }, 100);
            });

            setPhase('ar');
            setMsg('');
            console.log('[SceneAR] AR session started');
        } catch (e) {
            console.error('[SceneAR] start-fail', e);
            isXRActiveRef.current = false;
            setPhase('error');
            setMsg(e.message);
            onFail?.();

            // Restart regular render loop on error
            setTimeout(() => {
                startRegularRenderLoop();
            }, 100);
        }
    }

    function exitAR() {
        if (sessionRef.current) {
            sessionRef.current.end();
        }
    }

    // Enhanced link handling function - queue links during XR session
    const handleLinkClick = (type, value) => {
        console.log(`[SceneAR] Link clicked: ${type} - ${value}`);

        // Queue the link to open after XR session ends
        linkQueueRef.current.push({ type, value });

        // Show feedback to user
        showLinkFeedback(type, value);

        // End AR session to allow link to open
        setTimeout(() => {
            exitAR();
        }, 1500); // Give user time to see feedback
    };

    // Process queued links after XR session ends
    const processLinkQueue = () => {
        if (linkQueueRef.current.length === 0) return;

        // Process the most recent link
        const link = linkQueueRef.current.pop();
        linkQueueRef.current = []; // Clear queue

        setTimeout(() => {
            openLink(link.type, link.value);
        }, 800); // Longer delay to ensure AR session is fully ended
    };

    // Actually open the link
    const openLink = (type, value) => {
        try {
            let url;
            switch (type) {
                case 'phone':
                    url = `tel:${value.replace(/\s+/g, '')}`;
                    break;
                case 'email':
                    url = `mailto:${value}`;
                    break;
                case 'website':
                    url = value.startsWith('http') ? value : `https://${value}`;
                    break;
                default:
                    console.warn('Unknown link type:', type);
                    return;
            }

            console.log(`[SceneAR] Opening URL: ${url}`);

            // Try direct window.open first
            if (type === 'website') {
                const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
                if (!newWindow) {
                    // Fallback to location.href
                    window.location.href = url;
                }
            } else {
                // For tel: and mailto:, use location.href
                window.location.href = url;
            }

        } catch (error) {
            console.error('Error opening link:', error);
            // Show user-friendly error
            alert(`Could not open ${type}. Please try again or copy: ${value}`);
        }
    };

    // Show feedback to user when link is clicked
    const showLinkFeedback = (type, value) => {
        console.log(`[SceneAR] Queued ${type}: ${value} - Exiting AR to open...`);

        // Update the message to show feedback
        setMsg(`Opening ${type}... Exiting AR`);
    };

    /* ────────────────────────── render UI ────────────────────────────── */

    if (phase === 'init')
        return <Fallback title="Initialising …" msg={msg} spinner />;

    if (phase === 'error')
        return <Fallback title="AR unavailable" msg={msg} showRetry onRetry={() => window.location.reload()} />;

    if (phase === 'starting')
        return <Fallback title="Starting AR …" msg={msg} spinner />;

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

            {phase === 'ready' && (
                <div style={styles.center}>
                    <button style={styles.btn} onClick={startAR}>🚀 Start AR</button>
                </div>
            )}

            {phase === 'ar' && (
                <>
                    <div style={styles.instructions}>
                        <p><strong>Tap the highlighted contact areas on the card</strong></p>
                        <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>
                            📞 Phone • ✉️ Email • 🔗 Website
                        </p>
                        <p style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>
                            AR will exit automatically when opening links
                        </p>
                        {msg && <p style={{ fontSize: '12px', marginTop: '8px', color: '#4ade80' }}>{msg}</p>}
                    </div>
                    <button onClick={exitAR} style={styles.exit}>Exit AR</button>
                </>
            )}
        </div>
    );
}

/* ───────────────────── Fallback / Loading UI ───────────────────────── */
function Fallback({ title, msg = '', spinner = false, showRetry = false, onRetry }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            width: '100vw', height: '100vh', background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
            color: '#fff', textAlign: 'center'
        }}>
            {spinner && <div style={{
                width: 50, height: 50, border: '4px solid rgba(255,255,255,.3)',
                borderTop: '4px solid #fff', borderRadius: '50%',
                animation: 'spin 1s linear infinite', marginBottom: 20
            }} />}
            <h3 style={{ fontSize: 26, margin: 0 }}>{title}</h3>
            {msg && <p style={{ margin: '12px 0', maxWidth: 360 }}>{msg}</p>}
            {showRetry && (
                <button onClick={onRetry} style={{
                    background: '#fff', color: '#667eea', border: 'none',
                    borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer'
                }}>Try again</button>
            )}
            <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
        </div>
    );
}

/* ────────────────────────── inline styles ─────────────────────────── */
const styles = {
    center: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        textAlign: 'center'
    },
    btn: {
        padding: '16px 34px',
        fontSize: 18,
        fontWeight: 600,
        background: '#10b981',
        color: '#fff',
        border: 'none',
        borderRadius: 12,
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(16,185,129,.35)'
    },
    instructions: {
        position: 'fixed',
        top: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: 8,
        fontSize: 14,
        textAlign: 'center',
        zIndex: 10000,
        maxWidth: '90%'
    },
    exit: {
        position: 'fixed',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '16px 32px',
        background: 'rgba(239,68,68,.95)',
        color: '#fff',
        border: 'none',
        borderRadius: 12,
        fontWeight: 600,
        fontSize: 16,
        cursor: 'pointer',
        zIndex: 10000,
        boxShadow: '0 4px 20px rgba(239,68,68,0.4)'
    }
};