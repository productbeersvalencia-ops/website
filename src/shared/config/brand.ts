/**
 * Brand Configuration
 *
 * Centralizes all brand-related settings including SEO and GEO optimization.
 * Modify this file to customize your SaaS identity.
 *
 * This is the single source of truth for:
 * - Brand identity (name, logo, colors)
 * - SEO metadata (titles, descriptions, Open Graph)
 * - GEO optimization (schemas, AI bot access)
 * - Social presence
 */

export const brand = {
  // ═══════════════════════════════════════════════════════════════════
  // APP IDENTITY
  // ═══════════════════════════════════════════════════════════════════

  /** Your product/company name */
  name: 'Product Beers',

  /** Short tagline (appears in hero, metadata) */
  tagline: 'La comunidad de producto de Valencia',

  // ═══════════════════════════════════════════════════════════════════
  // CONTACT & URLS
  // ═══════════════════════════════════════════════════════════════════

  /** Production website URL (used for canonical URLs, sitemap, schemas) */
  website: 'https://productbeers.com',

  /** Support email address */
  support: 'hola@productbeers.com',

  // ═══════════════════════════════════════════════════════════════════
  // ASSETS (place files in /public/)
  // ═══════════════════════════════════════════════════════════════════

  /** Logo for header/navigation */
  logo: '/beer.png',

  /** Small icon for favicon context */
  icon: '/beer.png',

  /** Browser favicon */
  favicon: '/beer.png',

  // ═══════════════════════════════════════════════════════════════════
  // TYPOGRAPHY
  // To change font: see README.md in this folder for instructions
  // ═══════════════════════════════════════════════════════════════════

  font: {
    family: 'Poppins',
    package: '@fontsource/poppins',
    weights: [400, 500, 600, 700],
  },

  // ═══════════════════════════════════════════════════════════════════
  // UI THEME
  // ═══════════════════════════════════════════════════════════════════

  theme: {
    /**
     * Theme Variant
     *
     * Choose the visual style for your entire SaaS.
     * This affects colors, typography spacing, and overall feel.
     *
     * Available variants:
     * - 'standard': Modern, friendly, approachable
     * - 'luxury': Premium, exclusive, prestigious
     * - 'corporate': Professional, enterprise-ready
     * - 'productbeers': Custom theme for Product Beers (dark + yellow/gold)
     */
    variant: 'productbeers' as const,

    /** Enable glassmorphism effect (backdrop-blur, transparency) */
    glass: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SEO & GEO CONFIGURATION
  // This section controls metadata, Open Graph, and AI optimization
  // ═══════════════════════════════════════════════════════════════════

  seo: {
    /** Title template for pages. %s is replaced with page title */
    titleTemplate: '%s | Product Beers',

    /** Default title when no page title is set */
    defaultTitle: 'Product Beers - La comunidad de producto de Valencia',

    /** Default meta description (max 160 characters recommended) */
    defaultDescription:
      'Comunidad de Product Managers, Product Designers y entusiastas del producto en Valencia. Eventos, networking y aprendizaje compartido.',

    /** Keywords for meta tags (comma-separated) */
    keywords: ['product management', 'comunidad producto', 'valencia', 'product beers', 'eventos producto', 'networking'],

    /** Default Open Graph image (1200x630 recommended) */
    ogImage: '/og-image.png',

    /** Twitter/X handle for Twitter Cards (include @) */
    twitterHandle: '@productbeers',

    /** Site verification codes (leave empty if not using) */
    verification: {
      google: '', // Google Search Console
      bing: '', // Bing Webmaster
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOCIAL LINKS
  // Used in footer, schemas, and social proof
  // ═══════════════════════════════════════════════════════════════════

  social: {
    /** Twitter/X profile URL */
    twitter: '',

    /** GitHub repository or organization URL */
    github: 'https://github.com/productbeersvalencia-ops/website',

    /** LinkedIn company page URL */
    linkedin: 'https://www.linkedin.com/company/valencia-product-beers/',

    /** YouTube channel URL */
    youtube: '',

    /** Discord server invite URL */
    discord: '',

    /** Telegram group URL */
    telegram: 'https://t.me/valenciaproductbeers',
  },

  // ═══════════════════════════════════════════════════════════════════
  // ORGANIZATION INFO (for Schema.org markup)
  // Helps search engines and AI understand your company
  // ═══════════════════════════════════════════════════════════════════

  organization: {
    /** Organization type for schema.org */
    type: 'Organization' as const,

    /** Year company was founded */
    foundingDate: '2024',

    /** Founder names (for schema) */
    founders: ['Carlos Miguel Corada'] as string[],

    /** Physical address (optional, for LocalBusiness) */
    address: {
      street: '',
      city: 'Valencia',
      state: 'Comunidad Valenciana',
      postalCode: '',
      country: 'España',
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // CRAWLER & AI BOT CONFIGURATION
  // Controls robots.txt generation and AI search optimization (GEO)
  // ═══════════════════════════════════════════════════════════════════

  crawlers: {
    /**
     * Allow AI bots to crawl your site (recommended for GEO)
     * Includes: GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, etc.
     */
    allowAIBots: true,

    /**
     * Paths to disallow in robots.txt
     * Protected routes are automatically excluded
     */
    disallowPaths: ['/app/', '/auth/', '/api/', '/checkout/'],

    /**
     * Additional paths to allow (overrides disallow)
     * Example: ['/api/public/']
     */
    allowPaths: [] as string[],
  },

  // ═══════════════════════════════════════════════════════════════════
  // LEGAL PAGES
  // ═══════════════════════════════════════════════════════════════════

  legal: {
    terms: '/terms',
    privacy: '/privacy',
  },

  // ═══════════════════════════════════════════════════════════════════
  // AUTH PAGES CONFIGURATION
  // Customize the appearance of login, register, and other auth pages
  // ═══════════════════════════════════════════════════════════════════

  auth: {
    /** Show branding panel on desktop (split-screen layout) */
    showBrandingPanel: true,

    /** Gradient for branding panel background */
    gradient: 'from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]',

    /** Show animated background pattern */
    showPattern: true,

    /** Show testimonial in branding panel */
    showTestimonial: false,

    /** Testimonial content (if showTestimonial is true) */
    testimonial: {
      quote: 'Product Beers ha sido clave para conectar con la comunidad de producto en Valencia.',
      author: 'Miembro de la comunidad',
      role: 'Product Manager',
    },

    /** Features to highlight in branding panel */
    features: [
      'Eventos únicos de producto',
      'Networking con profesionales',
      'Conocimiento compartido',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════════════════════════════

  /** Copyright notice in footer */
  copyright: `© ${new Date().getFullYear()} Product Beers. Hecho con 🍺 en Valencia.`,
};

export type Brand = typeof brand;
