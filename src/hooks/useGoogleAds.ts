import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const useGoogleAdsPageView = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'AW-17852831911', {
        page_path: location.pathname + location.search,
      });
      console.log('📊 Google Ads page view:', location.pathname);
    }
  }, [location]);
};

export const trackConversion = (conversionLabel: string, value?: number, currency: string = 'BRL') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `AW-17852831911/${conversionLabel}`,
      'value': value || 1.0,
      'currency': currency
    });
    console.log('✅ Conversão rastreada:', conversionLabel);
  }
};
