// src/components/pages/CardViewerPage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { cardService } from '../services/cardService';
import '@google/model-viewer';

import SceneAR from '../../xr/SceneAR';     // WebXR
import MarkerAR from '../../xr/MarkerAR';    // AR.js
import Scene3D from '../../xr/Scene3D';     // fallback 3-D

export default function CardViewerPage() {
    const { cardId } = useParams();
    const [data, setData] = useState(null);
    const [mode, setMode] = useState('loading'); // loading | ar | marker | fallback
    const [error, setError] = useState(null);
    const sentAnalyticsRef = useRef(false);
    const modeDetectedRef = useRef(false);

    useEffect(() => {
        if (!cardId) {
            setError('Missing card id');
            return;
        }

        cardService.getCardByPublicId(cardId)
            .then((res) => setData(res.data))
            .catch((e) => setError(e?.message || 'Network error'));
    }, [cardId]);

    useEffect(() => {
        if (!cardId || !data || sentAnalyticsRef.current) return;
        sentAnalyticsRef.current = true;
        cardService.updateAnalytics(cardId).catch(() => { });
    }, [cardId, data]);

    // Mode detection with better error handling
    useEffect(() => {
        if (modeDetectedRef.current) return;
        modeDetectedRef.current = true;

        (async () => {
            try {
                // Check WebXR support first
                if (navigator.xr) {
                    try {
                        const supported = await navigator.xr.isSessionSupported('immersive-ar');
                        if (supported) {
                            console.log('WebXR AR supported, using SceneAR');
                            setMode('ar');
                            return;
                        }
                    } catch (xrError) {
                        console.warn('WebXR check failed:', xrError);
                    }
                }

                // Check if we're on a mobile device for AR.js
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

                if (isMobile) {
                    console.log('Mobile device detected, using MarkerAR');
                    setMode('marker');
                } else {
                    console.log('Desktop device, using Scene3D fallback');
                    setMode('fallback');
                }
            } catch (error) {
                console.error('Mode detection failed:', error);
                setMode('fallback');
            }
        })();
    }, []);

    /* ---------- Component handlers ---------- */
    const handleARFail = () => {
        console.log('WebXR failed, falling back to MarkerAR');
        setMode('marker');
    };

    const handleMarkerFail = () => {
        console.log('MarkerAR failed, falling back to Scene3D');
        setMode('fallback');
    };

    /* ---------- Render states ---------- */
    if (error) return <ErrorScreen msg={error} />;
    if (!data) return <LoadingScreen />;
    if (mode === 'loading') return <LoadingScreen msg="Detecting AR capabilities..." />;

    switch (mode) {
        case 'ar':
            return <SceneAR data={data} onFail={handleARFail} />;
        case 'marker':
            return <MarkerAR data={data} onFail={handleMarkerFail} />;
        default:
            return <Scene3D data={data} />;
    }
}

function LoadingScreen({ msg = "Loading..." }) {
    return (
        <div style={styles.center}>
            <div className="loader" style={styles.loader} />
            <p style={styles.loadingText}>{msg}</p>
        </div>
    );
}

function ErrorScreen({ msg }) {
    return (
        <div style={styles.center}>
            <div style={styles.errorContainer}>
                <h3 style={styles.errorTitle}>Unable to Load Card</h3>
                <p style={styles.errorMessage}>{msg}</p>
                <button
                    onClick={() => window.location.reload()}
                    style={styles.retryButton}
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}

const styles = {
    center: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    loader: {
        width: '50px',
        height: '50px',
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
    },
    loadingText: {
        color: 'white',
        fontSize: '18px',
        margin: 0
    },
    errorContainer: {
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    },
    errorTitle: {
        color: '#e53e3e',
        fontSize: '24px',
        margin: '0 0 16px 0',
        fontWeight: 'bold'
    },
    errorMessage: {
        color: '#666',
        fontSize: '16px',
        margin: '0 0 24px 0',
        lineHeight: '1.5'
    },
    retryButton: {
        background: '#667eea',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.3s ease'
    }
};

// Add global CSS for animations
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .loader {
            animation: spin 1s linear infinite;
        }
    `;
    if (!document.head.querySelector('style[data-card-viewer]')) {
        styleSheet.setAttribute('data-card-viewer', 'true');
        document.head.appendChild(styleSheet);
    }
}