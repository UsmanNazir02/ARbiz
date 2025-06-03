import React, { useEffect, useState } from 'react';

export default function MarkerAR({ data }) {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if AR.js is already loaded
        if (window.AFRAME && window.THREEx) {
            setReady(true);
            return;
        }

        // Load A-Frame first
        const loadAFrame = () => {
            return new Promise((resolve, reject) => {
                if (window.AFRAME) {
                    resolve();
                    return;
                }

                const aframeScript = document.createElement('script');
                aframeScript.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
                aframeScript.onload = resolve;
                aframeScript.onerror = reject;
                document.head.appendChild(aframeScript);
            });
        };

        // Load AR.js after A-Frame
        const loadARJS = () => {
            return new Promise((resolve, reject) => {
                const arScript = document.createElement('script');
                arScript.src = 'https://cdn.jsdelivr.net/npm/ar.js@3/aframe/build/aframe-ar.min.js';
                arScript.onload = resolve;
                arScript.onerror = reject;
                document.head.appendChild(arScript);
            });
        };

        // Load scripts sequentially
        loadAFrame()
            .then(loadARJS)
            .then(() => {
                console.log('AR.js loaded successfully');
                setReady(true);
            })
            .catch(err => {
                console.error('Failed to load AR.js:', err);
                setError('Failed to load AR libraries');
            });
    }, []);

    if (error) {
        return (
            <div style={{
                padding: '20px',
                textAlign: 'center',
                color: 'red'
            }}>
                {error}
            </div>
        );
    }

    if (!ready) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Loading AR...
            </div>
        );
    }

    // Ensure we have the required texture/image data
    const imageUrl = data.cardImage || data.textureUrl || '/default-card.png';

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;">
                <a-marker preset="hiro">
                    <a-image
                        src={imageUrl}
                        rotation="-90 0 0"
                        width="2"
                        height="1.2"
                        position="0 0 0"
                    />
                </a-marker>
                <a-entity camera />
            </a-scene>

            {/* Instructions for users */}
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
                zIndex: 999
            }}>
                Point your camera at a Hiro marker to see the AR business card
            </div>
        </div>
    );
}