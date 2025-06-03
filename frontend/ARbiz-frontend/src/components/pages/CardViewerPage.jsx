import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cardService } from '../services/cardService';

export default function CardViewerPage() {
    const { cardId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load card data
    useEffect(() => {
        if (!cardId) {
            setError('No card ID provided');
            setLoading(false);
            return;
        }

        console.log('Loading card with ID:', cardId);

        const loadCard = async () => {
            try {
                const cardData = await cardService.getCardByPublicId(cardId);
                console.log('Received card data:', cardData);
                setData(cardData);
            } catch (err) {
                console.error('Failed to load card:', err);
                setError(err.message || 'Failed to load card');
            } finally {
                setLoading(false);
            }
        };

        loadCard();
    }, [cardId]);

    // Update analytics
    useEffect(() => {
        if (!cardId || !data) return;

        console.log('Updating analytics for cardId:', cardId);
        cardService.updateAnalytics(cardId);
    }, [cardId, data]);

    // Show loading state
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                background: '#f5f5f5'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '3px solid #ddd',
                        borderTop: '3px solid #6366f1',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    Loading your business card...
                    <div style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
                        Card ID: {cardId}
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                color: '#e74c3c',
                padding: '20px',
                textAlign: 'center',
                background: '#f5f5f5'
            }}>
                <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>Oops! Something went wrong</h3>
                <p>{error}</p>
                <div style={{ fontSize: '12px', marginTop: '10px', color: '#666', background: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                    <strong>Debug Info:</strong><br />
                    Card ID: {cardId}<br />
                    URL: {window.location.href}<br />
                    Check browser console for detailed logs
                </div>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Show message if no data
    if (!data) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                background: '#f5f5f5'
            }}>
                No card data found
            </div>
        );
    }

    // Card display
    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
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
                {/* Debug info - remove in production */}
                <div style={{
                    background: '#f8f9fa',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '20px',
                    fontSize: '12px',
                    textAlign: 'left'
                }}>
                    <strong>Debug Info:</strong><br />
                    Card ID: {cardId}<br />
                    Has Data: {data ? 'Yes' : 'No'}<br />
                    Data Type: {typeof data}<br />
                    Data Keys: {data ? Object.keys(data).join(', ') : 'None'}<br />
                    {data && `Name: ${data.fullName || 'Not set'}`}<br />
                    {data && `Company: ${data.companyName || 'Not set'}`}
                </div>

                {/* Show card image if available */}
                {data.cardImage && (
                    <img
                        src={data.cardImage}
                        alt="Business Card"
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '10px',
                            marginBottom: '20px'
                        }}
                        onError={(e) => {
                            console.log('Card image failed to load:', data.cardImage);
                            e.target.style.display = 'none';
                        }}
                    />
                )}

                {/* Card content */}
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
                            onError={(e) => {
                                console.log('Logo failed to load:', data.logo);
                                e.target.style.display = 'none';
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

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}