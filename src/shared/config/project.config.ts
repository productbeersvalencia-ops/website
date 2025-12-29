/**
 * Central Project Configuration
 * Single source of truth for all project information
 * Used by: SEO, Home, Brand, Emails, etc.
 *
 * Run 'npm run project:setup' to configure interactively
 */

export interface ProjectConfig {
  business: {
    // Basic Info
    name: string;
    domain: string;
    type: 'b2b-saas' | 'b2c-saas' | 'marketplace' | 'dev-tool' | 'ai-product' | 'other';
    industry: string;

    // Core Messaging (used everywhere)
    tagline: string; // Short, punchy (3-5 words)
    elevator_pitch: string; // One sentence value prop

    // Features (for home, SEO, marketing)
    core_features: string[]; // 3-5 main features

    // Target Market
    target_personas: string[]; // e.g., ['startups', 'developers', 'agencies']
    ideal_customer: string; // e.g., "SaaS founders who want to ship fast"

    // Positioning
    main_competitor?: string; // For alternative pages
    unique_value: string; // What makes you different

    // Growth
    pricing_model: 'freemium' | 'trial' | 'paid-only' | 'usage-based';
    starting_price?: number; // For "Starting at $X"
  };

  // Auto-generated or override
  seo?: {
    keywords?: string[];
    defaultTitle?: string;
    defaultDescription?: string;
  };

  // Preferences
  preferences: {
    auto_translate: boolean; // Auto-generate Spanish from English
    content_tone: 'professional' | 'casual' | 'playful' | 'technical';
    cta_style: 'direct' | 'benefit-focused' | 'urgency';
  };
}

// Product Beers - Comunidad de Producto de Valencia
export const projectConfig: ProjectConfig = {
  business: {
    name: 'Product Beers',
    domain: 'productbeers.com',
    type: 'other', // Community platform
    industry: 'product management',

    tagline: 'La comunidad de producto',
    elevator_pitch: 'Conectamos, enriquecemos y cultivamos el talento de producto en Valencia a través de eventos únicos y networking auténtico.',

    core_features: [
      'Eventos de producto de alto nivel',
      'Networking con profesionales',
      'Recursos y aprendizaje compartido',
      'Comunidad inclusiva y cercana',
      'Oportunidades laborales'
    ],

    target_personas: ['product managers', 'product designers', 'product owners', 'entusiastas del producto'],
    ideal_customer: 'Profesionales y entusiastas del producto en Valencia que buscan aprender, conectar y crecer',

    main_competitor: undefined,
    unique_value: 'La única comunidad de producto en Valencia que combina conocimiento de alto nivel con el ambiente cercano de unas cervezas',

    pricing_model: 'freemium', // Free community, events may have tickets
    starting_price: undefined
  },

  preferences: {
    auto_translate: true,
    content_tone: 'casual', // Friendly and approachable
    cta_style: 'benefit-focused'
  }
};

/**
 * Helper to get project info from anywhere
 */
export function getProjectInfo() {
  return projectConfig.business;
}

/**
 * Helper to get SEO defaults
 */
export function getSEODefaults() {
  const { name, tagline, elevator_pitch } = projectConfig.business;
  return {
    titleTemplate: `%s | ${name}`,
    defaultTitle: `${name} - ${tagline}`,
    defaultDescription: elevator_pitch,
    keywords: projectConfig.seo?.keywords || []
  };
}