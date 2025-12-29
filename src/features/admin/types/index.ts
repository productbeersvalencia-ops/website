import { z } from 'zod';

/**
 * ==============================================
 * APP SETTINGS TYPES & SCHEMAS
 * ==============================================
 */

/**
 * Info Bar Configuration
 */
export const infoBarSettingsSchema = z.object({
  enabled: z.boolean(),
  scope: z.enum(['all', 'authenticated', 'unauthenticated']),
  mode: z.enum(['info', 'warning', 'error']),
  messages: z.object({
    en: z.string().min(1, 'English message is required'),
    es: z.string().min(1, 'Spanish message is required'),
  }),
  dismissible: z.boolean(),
});

export type InfoBarSettings = z.infer<typeof infoBarSettingsSchema>;

/**
 * Email Journey Configuration
 */
export const emailJourneySchema = z.object({
  enabled: z.boolean(),
  name: z.string(),
  description: z.string(),
});

export type EmailJourney = z.infer<typeof emailJourneySchema>;

export const emailJourneysSettingsSchema = z.record(
  z.string(),
  emailJourneySchema
);

export type EmailJourneysSettings = z.infer<
  typeof emailJourneysSettingsSchema
>;

/**
 * Maintenance Mode Configuration
 */
export const maintenanceSettingsSchema = z.object({
  enabled: z.boolean(),
  messages: z.object({
    en: z.string().min(1, 'English message is required'),
    es: z.string().min(1, 'Spanish message is required'),
  }),
  allowAdmins: z.boolean(),
  estimatedReturn: z.string().nullable(),
});

export type MaintenanceSettings = z.infer<typeof maintenanceSettingsSchema>;

/**
 * Feature Flags
 */
export const featureFlagsSchema = z.record(z.string(), z.boolean());

export type FeatureFlags = z.infer<typeof featureFlagsSchema>;

/**
 * Cross-Sell Product
 */
export const crossSellProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  cta: z.string(),
  url: z.string(),
  badge: z.string().nullable(),
});

export type CrossSellProduct = z.infer<typeof crossSellProductSchema>;

export const crossSellProductsSettingsSchema = z.object({
  products: z.array(crossSellProductSchema),
});

export type CrossSellProductsSettings = z.infer<
  typeof crossSellProductsSettingsSchema
>;

/**
 * Crisp Customer Support Settings
 */
export const crispSettingsSchema = z.object({
  enabled: z.boolean(),
  scope: z.enum(['all', 'authenticated', 'unauthenticated', 'subscribers_only']),
  hideOnMobile: z.boolean(),
  position: z.enum(['left', 'right']),
  locale: z.string(),
});

export type CrispSettings = z.infer<typeof crispSettingsSchema>;

/**
 * Affiliate Program Configuration
 */
export const affiliateProgramSettingsSchema = z.object({
  enabled: z.boolean(),
  display_in_header: z.boolean(),
  display_in_footer: z.boolean(),
  display_in_home: z.boolean().default(false),
  rewardful_form_url: z.string().url().optional().or(z.literal('')),
  commission_rate: z.string(),
  webhook_endpoint: z.string().readonly().default('/api/webhooks/rewardful'),
  // Calculator settings
  average_sale_price: z.number().positive().default(297),
  calculator_enabled: z.boolean().default(true),
});

export type AffiliateProgramSettings = z.infer<typeof affiliateProgramSettingsSchema>;

/**
 * Generic App Setting from Database
 */
export interface AppSetting {
  key: string;
  value: Record<string, unknown>;
  category: 'info_bar' | 'email' | 'features' | 'cross_sell' | 'general' | 'support';
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}

/**
 * ==============================================
 * ADMIN STATS TYPES
 * ==============================================
 */

export interface AdminStats {
  totalUsers: number;
  newUsersThisMonth: number;
  // Product Beers specific
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalSpeakers: number;
  totalSponsors: number;
}

/**
 * ==============================================
 * USER MANAGEMENT TYPES
 * ==============================================
 */

export interface AdminUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  user_flags: string[];
  current_organization_id: string | null;
  subscription_status: string | null;
}

export const updateUserFlagsSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  flags: z.array(z.string()).min(0, 'Flags must be an array'),
});

export type UpdateUserFlagsInput = z.infer<typeof updateUserFlagsSchema>;

/**
 * ==============================================
 * SPEAKER TYPES & SCHEMAS
 * ==============================================
 */

export const speakerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  email: z.string().email('Invalid email format').optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  topics: z.array(z.string()).default([]),
  bio: z.string().optional().nullable(),
  photo_url: z.string().url('Invalid photo URL').optional().nullable().or(z.literal('')),
  linkedin_url: z.string().url('Invalid LinkedIn URL').optional().nullable().or(z.literal('')),
  twitter_url: z.string().url('Invalid Twitter URL').optional().nullable().or(z.literal('')),
  notes: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type SpeakerInput = z.infer<typeof speakerSchema>;

export interface Speaker {
  id: string;
  name: string;
  position: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  topics: string[];
  bio: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

/**
 * ==============================================
 * ACTION RETURN TYPES
 * ==============================================
 */

export interface ActionSuccess<T = void> {
  success: true;
  data: T;
  error: null;
}

export interface ActionError {
  success: false;
  data: null;
  error: string;
}

export type ActionResult<T = void> = ActionSuccess<T> | ActionError;

/**
 * ==============================================
 * COLLABORATOR TYPES & SCHEMAS
 * ==============================================
 */

export const collaboratorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  logo_url: z.string().min(1, 'Logo URL is required'),
  website_url: z.string().url('Website URL must be a valid URL'),
  type: z.enum(['sponsor', 'hoster']),
  is_active: z.boolean().default(true),
  display_order: z.number().int().default(0),
  // Campos de contacto interno (opcionales)
  contact_name: z.string().optional().nullable(),
  contact_email: z.string().email('Invalid email format').optional().nullable().or(z.literal('')),
  contact_phone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CollaboratorInput = z.infer<typeof collaboratorSchema>;

export interface Collaborator {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  type: 'sponsor' | 'hoster';
  is_active: boolean;
  display_order: number;
  // Campos de contacto interno
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  // Audit fields
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}
