import React, { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export const VerticalAd = () => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error(e);
        }
    }, []);

    return (
        <div style={{
            width: '160px',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'center',
            backgroundColor: 'aliceblue',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            overflow: 'hidden',
            backdropFilter: 'blur(8px)',
        }}>
            <div style={{
                fontSize: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'rgb(7, 7, 7)',
                margin: '4px 0',
                fontFamily: 'sans-serif',
            }}>
                Advertisement
            </div>
            {/* AdSense Script */}
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-7993314093599705"
                 data-ad-slot="9544937585"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
    );
};
