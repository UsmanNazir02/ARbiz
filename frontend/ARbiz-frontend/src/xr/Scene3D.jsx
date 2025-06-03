import React, { useEffect, useState } from 'react';

export default function Scene3D({ data }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Use cardImage or fallback to a generated card display
    const imageUrl = data.cardImage || data.textureUrl;

    useEffect(() => {
        if (imageUrl) {
            const img = new Image();
            img.onload = () => setImageLoaded(true);
            img.onerror = () => setImageError(true);
            img.src = imageUrl;
        }
    }, [imageUrl]);

    // Simple CSS-based card display as fallback
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                maxWidth: '400px',
                width: '100%',
                textAlign: 'center'
            }}>
                {/* Show card image if available */}
                {imageUrl && imageLoaded && !imageError && (
                    <img
                        src={imageUrl}
                        alt="Business Card"
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '10px',
                            marginBottom: '20px'
                        }}
                    />
                )}

                {/* Fallback card display with data */}
                {(!imageUrl || imageError || !imageLoaded) && (
                    <div style={{
                        background: data.themeColor || '#6366f1',
                        color: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        fontFamily: data.fontStyle || 'Arial, sans-serif'
                    }}>
                        {data.logo && (
                            <img
                                src={data.logo}
                                alt="Logo"
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'contain',
                                    marginBottom: '15px'
                                }}
                            />
                        )}

                        <h2 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>
                            {data.fullName || 'Business Card'}
                        </h2>

                        {data.designation && (
                            <p style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9 }}>
                                {data.designation}
                            </p>
                        )}

                        {data.companyName && (
                            <p style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold' }}>
                                {data.companyName}
                            </p>
                        )}
                    </div>
                )}

                {/* Contact Information */}
                <div style={{ textAlign: 'left', color: '#333' }}>
                    {data.phone && (
                        <p style={{ margin: '10px 0', fontSize: '16px' }}>
                            📞 <a href={`tel:${data.phone}`} style={{ color: '#6366f1', textDecoration: 'none' }}>
                                {data.phone}
                            </a>
                        </p>
                    )}

                    {data.email && (
                        <p style={{ margin: '10px 0', fontSize: '16px' }}>
                            ✉️ <a href={`mailto:${data.email}`} style={{ color: '#6366f1', textDecoration: 'none' }}>
                                {data.email}
                            </a>
                        </p>
                    )}

                    {data.website && (
                        <p style={{ margin: '10px 0', fontSize: '16px' }}>
                            🌐 <a href={data.website} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', textDecoration: 'none' }}>
                                {data.website}
                            </a>
                        </p>
                    )}

                    {data.address && (
                        <p style={{ margin: '10px 0', fontSize: '16px' }}>
                            📍 {data.address}
                        </p>
                    )}
                </div>

                {/* QR Code if available */}
                {data.qrCode && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <img
                            src={data.qrCode}
                            alt="QR Code"
                            style={{
                                width: '100px',
                                height: '100px',
                                border: '2px solid #eee',
                                borderRadius: '10px'
                            }}
                        />
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                            Scan to share
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}