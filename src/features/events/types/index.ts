import { z } from 'zod';

// ============================================
// ENUMS
// ============================================

export const eventStatusEnum = z.enum(['draft', 'published', 'cancelled']);
export const eventSourceEnum = z.enum(['manual', 'fourvenues']);
export const speakerRoleEnum = z.enum(['speaker', 'host', 'panelist', 'moderator']);
export const sponsorTierEnum = z.enum(['platinum', 'gold', 'silver', 'standard', 'community']);

export type EventStatus = z.infer<typeof eventStatusEnum>;
export type EventSource = z.infer<typeof eventSourceEnum>;
export type SpeakerRole = z.infer<typeof speakerRoleEnum>;
export type SponsorTier = z.infer<typeof sponsorTierEnum>;

// ============================================
// SCHEMAS
// ============================================

// Schema para crear/editar evento
export const eventSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones')
    .optional(),
  description: z.string().max(5000).optional(),
  shortDescription: z.string().max(300).optional(),
  date: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  locationName: z.string().max(200).optional(),
  locationAddress: z.string().max(500).optional(),
  locationCity: z.string().max(100).default('Valencia'),
  locationMapsUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  registrationUrl: z.string().url().optional().or(z.literal('')),
  maxAttendees: z.coerce.number().positive().optional(),
  status: eventStatusEnum.default('draft'),
  featured: z.boolean().default(false),
});

export type EventInput = z.infer<typeof eventSchema>;

// Schema para speaker
export const speakerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200),
  role: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
});

export type SpeakerInput = z.infer<typeof speakerSchema>;

// Schema para sponsor
export const sponsorSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200),
  logoUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
  tier: sponsorTierEnum.default('standard'),
  isActive: z.boolean().default(true),
});

export type SponsorInput = z.infer<typeof sponsorSchema>;

// Schema para añadir speaker a evento
export const eventSpeakerSchema = z.object({
  eventId: z.string().uuid(),
  speakerId: z.string().uuid(),
  roleInEvent: speakerRoleEnum.default('speaker'),
  talkTitle: z.string().max(200).optional(),
  talkDescription: z.string().max(2000).optional(),
  orderIndex: z.number().int().min(0).default(0),
});

export type EventSpeakerInput = z.infer<typeof eventSpeakerSchema>;

// Schema para añadir sponsor a evento
export const eventSponsorSchema = z.object({
  eventId: z.string().uuid(),
  sponsorId: z.string().uuid(),
  tierOverride: sponsorTierEnum.optional(),
});

export type EventSponsorInput = z.infer<typeof eventSponsorSchema>;

// ============================================
// TYPES (para respuestas de BD)
// ============================================

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  date: Date;
  endDate: Date | null;
  locationName: string | null;
  locationAddress: string | null;
  locationCity: string;
  locationMapsUrl: string | null;
  imageUrl: string | null;
  registrationUrl: string | null;
  maxAttendees: number | null;
  fourvenuesId: string | null;
  fourvenuesSlug: string | null;
  lastSyncedAt: Date | null;
  status: EventStatus;
  source: EventSource;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  // Relaciones (opcionales, se cargan con joins)
  speakers?: EventSpeaker[];
  sponsors?: EventSponsor[];
}

export interface Speaker {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  bio: string | null;
  photoUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
  tier: SponsorTier;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventSpeaker {
  id: string;
  eventId: string;
  speakerId: string;
  roleInEvent: SpeakerRole;
  talkTitle: string | null;
  talkDescription: string | null;
  orderIndex: number;
  createdAt: Date;
  // Join con speaker
  speaker?: Speaker;
}

export interface EventSponsor {
  id: string;
  eventId: string;
  sponsorId: string;
  tierOverride: SponsorTier | null;
  createdAt: Date;
  // Join con sponsor
  sponsor?: Sponsor;
}

// ============================================
// HELPERS
// ============================================

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isUpcoming(event: Event): boolean {
  return new Date(event.date) > new Date();
}

export function isPast(event: Event): boolean {
  const endDate = event.endDate || event.date;
  return new Date(endDate) < new Date();
}
