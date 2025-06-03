import React, { useEffect, useRef, useState } from 'react';

export default function SceneAR({ data }) {
    const mountRef = useRef();
    const [error, setError] = useState(null);
    const [arSupported, setArSupported] = useState(false);

    useEffect(() => {
        let renderer, scene, camera;

        const initAR = async () => {
            try {
                // Dynamic import of Three.js modules
                const THREE = await import('three');

                // Check WebXR support
                if (!navigator.xr) {
                    throw new Error('WebXR not supported');
                }

                const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
                if (!isSupported) {
                    throw new Error('AR not supported on this device');
                }

                setArSupported(true);

                // Create scene
                scene = new THREE.Scene();
                camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.xr.enabled = true;

                if (mountRef.current) {
                    mountRef.current.appendChild(renderer.domElement);
                }

                // Create AR button
                const { ARButton } = await import('three/examples/jsm/webxr/ARButton.js');
                const arButton = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] });
                document.body.appendChild(arButton);

                // Create business card plane
                const geometry = new THREE.PlaneGeometry(0.09, 0.05);

                // Load texture
                const textureLoader = new THREE.TextureLoader();
                const texture = await new Promise((resolve, reject) => {
                    textureLoader.load(
                        data.cardImage || data.textureUrl || '/default-card.png',
                        resolve,
                        undefined,
                        reject
                    );
                });

                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true
                });

                const mesh = new THREE.Mesh(geometry, material);
                mesh.rotation.x = -Math.PI / 2; // Lay flat
                scene.add(mesh);

                // Add lighting
                const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
                scene.add(ambientLight);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
                directionalLight.position.set(0, 1, 0);
                scene.add(directionalLight);

                // Render loop
                const animate = () => {
                    renderer.setAnimationLoop(animate);
                    renderer.render(scene, camera);
                };
                animate();

            } catch (err) {
                console.error('AR initialization failed:', err);
                setError(err.message);
            }
        };

        initAR();

        // Cleanup
        return () => {
            if (renderer) {
                renderer.dispose();
                if (mountRef.current && renderer.domElement) {
                    mountRef.current.removeChild(renderer.domElement);
                }
            }

            // Remove AR button
            const arButton = document.querySelector('#ar-button');
            if (arButton) {
                arButton.remove();
            }
        };
    }, [data]);

    if (error) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: '20px',
                textAlign: 'center'
            }}>
                <h3>AR Not Available</h3>
                <p>{error}</p>
                <p>Please try on a device that supports WebXR AR</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

            {!arSupported && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <p>Initializing AR...</p>
                </div>
            )}
        </div>
    );
}