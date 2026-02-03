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
        <div className="w-[160px] min-h-[600px] bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg">
            <div style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                color: '#94a3b8',
                margin: '4px 0',
                textAlign: 'center',
                fontFamily: 'sans-serif',
            }}>
                Advertisement
            </div>

            {/* <!-- Kinetix_Vertical_Ad --> */}
            {/* <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-7993314093599705"
                data-ad-slot="4826677960"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins> */}

        </div>
    );
};
