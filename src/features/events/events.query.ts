import { createClientServer } from '@/shared/database/supabase';
import type { Event, Speaker, Sponsor } from './types';

// ============================================
// EVENTS QUERIES
// ============================================

/**
 * Obtener todos los eventos publicados (público)
 */
export async function getPublishedEvents(): Promise<{
  data: Event[] | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('events')
    .select(
      `
      *,
      event_speakers(
        *,
        speaker:speakers(*)
      ),
      event_sponsors(
        *,
        sponsor:sponsors(*)
      )
    `
    )
    .eq('status', 'published')
    .order('date', { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapEvents(data), error: null };
}

/**
 * Obtener próximos eventos publicados
 */
export async function getUpcomingEvents(limit?: number): Promise<{
  data: Event[] | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  let query = supabase
    .from('events')
    .select(
      `
      *,
      event_speakers(
        *,
        speaker:speakers(*)
      ),
      event_sponsors(
        *,
        sponsor:sponsors(*)
      )
    `
    )
    .eq('status', 'published')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapEvents(data), error: null };
}

/**
 * Obtener eventos pasados
 */
export async function getPastEvents(limit?: number): Promise<{
  data: Event[] | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  let query = supabase
    .from('events')
    .select(
      `
      *,
      event_speakers(
        *,
        speaker:speakers(*)
      ),
      event_sponsors(
        *,
        sponsor:sponsors(*)
      )
    `
    )
    .eq('status', 'published')
    .lt('date', new Date().toISOString())
    .order('date', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapEvents(data), error: null };
}

/**
 * Obtener evento por slug (público)
 */
export async function getEventBySlug(slug: string): Promise<{
  data: Event | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('events')
    .select(
      `
      *,
      event_speakers(
        *,
        speaker:speakers(*)
      ),
      event_sponsors(
        *,
        sponsor:sponsors(*)
      )
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapEvent(data), error: null };
}

/**
 * Obtener próximo evento destacado
 */
export async function getNextFeaturedEvent(): Promise<{
  data: Event | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('events')
    .select(
      `
      *,
      event_speakers(
        *,
        speaker:speakers(*)
      ),
      event_sponsors(
        *,
        sponsor:sponsors(*)
      )
    `
    )
    .eq('status', 'published')
    .eq('featured', true)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data ? mapEvent(data) : null, error: null };
}

// ============================================
// ADMIN QUERIES (requieren autenticación)
// ============================================

/**
 * Obtener todos los eventos (admin)
 */
export async function getAllEvents(): Promise<{
  data: Event[] | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('events')
    .select(
      `
      *,
      event_speakers(count),
      event_sponsors(count)
    `
    )
    .order('date', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapEvents(data), error: null };
}

/**
 * Obtener evento por ID (admin)
 */
export async function getEventById(id: string): Promise<{
  data: Event | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('events')
    .select(
      `
      *,
      event_speakers(
        *,
        speaker:speakers(*)
      ),
      event_sponsors(
        *,
        sponsor:sponsors(*)
      )
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapEvent(data), error: null };
}

// ============================================
// SPEAKERS QUERIES
// ============================================

/**
 * Obtener todos los speakers
 */
export async function getAllSpeakers(): Promise<{
  data: Speaker[] | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('speakers')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapSpeakers(data), error: null };
}

/**
 * Obtener speaker por ID
 */
export async function getSpeakerById(id: string): Promise<{
  data: Speaker | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase.from('speakers').select('*').eq('id', id).single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapSpeaker(data), error: null };
}

// ============================================
// SPONSORS QUERIES
// ============================================

/**
 * Obtener todos los sponsors
 */
export async function getAllSponsors(): Promise<{
  data: Sponsor[] | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .order('tier', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapSponsors(data), error: null };
}

/**
 * Obtener sponsors activos
 */
export async function getActiveSponsors(): Promise<{
  data: Sponsor[] | null;
  error: string | null;
}> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .eq('is_active', true)
    .order('tier', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapSponsors(data), error: null };
}

// ============================================
// MAPPERS (snake_case -> camelCase)
// ============================================

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapEvent(data: any): Event {
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    shortDescription: data.short_description,
    date: new Date(data.date),
    endDate: data.end_date ? new Date(data.end_date) : null,
    locationName: data.location_name,
    locationAddress: data.location_address,
    locationCity: data.location_city || 'Valencia',
    locationMapsUrl: data.location_maps_url,
    imageUrl: data.image_url,
    registrationUrl: data.registration_url,
    maxAttendees: data.max_attendees,
    fourvenuesId: data.fourvenues_id,
    fourvenuesSlug: data.fourvenues_slug,
    lastSyncedAt: data.last_synced_at ? new Date(data.last_synced_at) : null,
    status: data.status,
    source: data.source,
    featured: data.featured,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    createdBy: data.created_by,
    speakers: data.event_speakers?.map(mapEventSpeaker),
    sponsors: data.event_sponsors?.map(mapEventSponsor),
  };
}

function mapEvents(data: any[]): Event[] {
  return data.map(mapEvent);
}

function mapSpeaker(data: any): Speaker {
  return {
    id: data.id,
    name: data.name,
    role: data.role,
    company: data.company,
    bio: data.bio,
    photoUrl: data.photo_url,
    linkedinUrl: data.linkedin_url,
    twitterUrl: data.twitter_url,
    websiteUrl: data.website_url,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

function mapSpeakers(data: any[]): Speaker[] {
  return data.map(mapSpeaker);
}

function mapSponsor(data: any): Sponsor {
  return {
    id: data.id,
    name: data.name,
    logoUrl: data.logo_url,
    websiteUrl: data.website_url,
    description: data.description,
    tier: data.tier,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

function mapSponsors(data: any[]): Sponsor[] {
  return data.map(mapSponsor);
}

function mapEventSpeaker(data: any): any {
  return {
    id: data.id,
    eventId: data.event_id,
    speakerId: data.speaker_id,
    roleInEvent: data.role_in_event,
    talkTitle: data.talk_title,
    talkDescription: data.talk_description,
    orderIndex: data.order_index,
    createdAt: new Date(data.created_at),
    speaker: data.speaker ? mapSpeaker(data.speaker) : undefined,
  };
}

function mapEventSponsor(data: any): any {
  return {
    id: data.id,
    eventId: data.event_id,
    sponsorId: data.sponsor_id,
    tierOverride: data.tier_override,
    createdAt: new Date(data.created_at),
    sponsor: data.sponsor ? mapSponsor(data.sponsor) : undefined,
  };
}
