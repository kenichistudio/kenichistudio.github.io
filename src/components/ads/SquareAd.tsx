import React, { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export const SquareAd = () => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error(e);
        }
    }, []);

    return (
        <div style={{
            width: '100%',
            aspectRatio: '1/1',
            background: 'aliceblue',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <div style={{
                fontSize: '8px',
                textTransform: 'uppercase',
                color: 'rgba(29, 29, 29, 0.925)',
                marginBottom: '2px',
                width: '100%',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.02)',
                // backgroundColor: 'rgba(0, 0, 0, 1)',
                position: 'absolute',
                top: 0,
                left: 0
            }}>
                Advertisement
            </div>
            {/* Google AdSense */}
            <ins className="adsbygoogle"
                 style={{ display: 'block', width: '100%', height: '100%' }}
                 data-ad-client="ca-pub-7993314093599705"
                 data-ad-slot="1234567890"
                 data-ad-format="rectangle"
                 data-full-width-responsive="true"></ins>
        </div>
    );
};
