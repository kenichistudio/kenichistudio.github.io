/**
 * Centralized asset path configuration
 * All asset paths should be referenced from this file
 */

export const assetPaths = {
  // Brand assets
  brand: {
    logo: 'assets/images/brand/logo.svg',
    logoMonochrome: 'assets/images/brand/logo-monochrome.svg',
    logoPWA: 'assets/images/brand/kenichi-brand-pwa.svg',
  },
  
  // Social media images
  social: {
    ogImage: 'assets/images/social/og-image.svg',
    twitterCard: 'assets/images/social/twitter-card.svg',
  },
  
  // PWA icons
  icons: {
    favicon: 'assets/icons/favicon.svg',
    icon192: 'assets/icons/icon-192.png',
    icon512: 'assets/icons/icon-512.png',
  },
  
  // Placeholders
  placeholders: {
    blog: 'assets/images/placeholders/blog-placeholder.svg',
    blue: 'assets/images/placeholders/placeholder-blue.svg',
    green: 'assets/images/placeholders/placeholder-green.svg',
    orange: 'assets/images/placeholders/placeholder-orange.svg',
    pink: 'assets/images/placeholders/placeholder-pink.svg',
  },
  
  // Other assets
  other: {
    flowLogo: 'assets/images/flow-logo.png',
  },
};

/**
 * Helper function to get full asset URL
 * Use this in Astro components where import.meta.env.BASE_URL is available
 */
export function getAssetUrl(path: string, baseUrl: string = '/'): string {
  return `${baseUrl}${path}`;
}

/**
 * Get asset path with base URL
 * For use in components: getAssetPath(assetPaths.brand.logo, import.meta.env.BASE_URL)
 */
export function getAssetPath(relativePath: string, baseUrl: string = '/'): string {
  return getAssetUrl(relativePath, baseUrl);
}
