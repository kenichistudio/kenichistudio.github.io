import { siteConfig } from './site';

export const seoConfig = {
  siteName: siteConfig.name,
  defaultTitle: `${siteConfig.name} - ${siteConfig.tagline}`,
  defaultDescription: siteConfig.description,
  baseUrl: siteConfig.url,
  defaultImage: `${siteConfig.url}/assets/images/social/og-image.svg`,
  twitterImage: `${siteConfig.url}/assets/images/social/twitter-card.svg`,
  author: 'SimpleAryan',

  keywords: siteConfig.keywords,

  // Open Graph
  og: {
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
  },

  // Schema.org structured data
  schema: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      '@type': 'Person',
      name: 'SimpleAryan',
    },
  },
};

// Helper to generate page-specific title
export function generateTitle(pageTitle?: string): string {
  if (!pageTitle || pageTitle === seoConfig.defaultTitle) {
    return seoConfig.defaultTitle;
  }
  return `${pageTitle} | ${seoConfig.siteName}`;
}

// Helper to generate canonical URL
export function generateCanonicalUrl(pathname: string): string {
  return `${seoConfig.baseUrl}${pathname}`;
}
