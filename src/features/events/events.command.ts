import { createClientServer } from '@/shared/database/supabase';
import type { EventInput, SpeakerInput, SponsorInput } from './types';

// ============================================
// EVENTS COMMANDS
// ============================================

/**
 * Crear un nuevo evento
 */
export async function createEvent(
  userId: string,
  input: EventInput
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('events')
    .insert({
      title: input.title,
      slug: input.slug,
      description: input.description,
      short_description: input.shortDescription,
      date: input.date.toISOString(),
      end_date: input.endDate?.toISOString(),
      location_name: input.locationName,
      location_address: input.locationAddress,
      location_city: input.locationCity,
      location_maps_url: input.locationMapsUrl,
      image_url: input.imageUrl,
      registration_url: input.registrationUrl,
      max_attendees: input.maxAttendees,
      status: input.status,
      featured: input.featured,
      source: 'manual',
      created_by: userId,
    })
    .select('id')
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: { id: data.id }, error: null };
}

/**
 * Actualizar un evento existente
 */
export async function updateEvent(
  eventId: string,
  input: Partial<EventInput>
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const updateData: Record<string, unknown> = {};

  if (input.title !== undefined) updateData.title = input.title;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.shortDescription !== undefined) updateData.short_description = input.shortDescription;
  if (input.date !== undefined) updateData.date = input.date.toISOString();
  if (input.endDate !== undefined) updateData.end_date = input.endDate?.toISOString();
  if (input.locationName !== undefined) updateData.location_name = input.locationName;
  if (input.locationAddress !== undefined) updateData.location_address = input.locationAddress;
  if (input.locationCity !== undefined) updateData.location_city = input.locationCity;
  if (input.locationMapsUrl !== undefined) updateData.location_maps_url = input.locationMapsUrl;
  if (input.imageUrl !== undefined) updateData.image_url = input.imageUrl;
  if (input.registrationUrl !== undefined) updateData.registration_url = input.registrationUrl;
  if (input.maxAttendees !== undefined) updateData.max_attendees = input.maxAttendees;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.featured !== undefined) updateData.featured = input.featured;

  const { error } = await supabase.from('events').update(updateData).eq('id', eventId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Eliminar un evento
 */
export async function deleteEvent(
  eventId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase.from('events').delete().eq('id', eventId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Publicar un evento
 */
export async function publishEvent(
  eventId: string
): Promise<{ success: boolean; error: string | null }> {
  return updateEvent(eventId, { status: 'published' });
}

/**
 * Despublicar un evento (volver a draft)
 */
export async function unpublishEvent(
  eventId: string
): Promise<{ success: boolean; error: string | null }> {
  return updateEvent(eventId, { status: 'draft' });
}

/**
 * Cancelar un evento
 */
export async function cancelEvent(
  eventId: string
): Promise<{ success: boolean; error: string | null }> {
  return updateEvent(eventId, { status: 'cancelled' });
}

// ============================================
// SPEAKERS COMMANDS
// ============================================

/**
 * Crear un nuevo speaker
 */
export async function createSpeaker(
  input: SpeakerInput
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('speakers')
    .insert({
      name: input.name,
      role: input.role,
      company: input.company,
      bio: input.bio,
      photo_url: input.photoUrl,
      linkedin_url: input.linkedinUrl,
      twitter_url: input.twitterUrl,
      website_url: input.websiteUrl,
    })
    .select('id')
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: { id: data.id }, error: null };
}

/**
 * Actualizar un speaker
 */
export async function updateSpeaker(
  speakerId: string,
  input: Partial<SpeakerInput>
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const updateData: Record<string, unknown> = {};

  if (input.name !== undefined) updateData.name = input.name;
  if (input.role !== undefined) updateData.role = input.role;
  if (input.company !== undefined) updateData.company = input.company;
  if (input.bio !== undefined) updateData.bio = input.bio;
  if (input.photoUrl !== undefined) updateData.photo_url = input.photoUrl;
  if (input.linkedinUrl !== undefined) updateData.linkedin_url = input.linkedinUrl;
  if (input.twitterUrl !== undefined) updateData.twitter_url = input.twitterUrl;
  if (input.websiteUrl !== undefined) updateData.website_url = input.websiteUrl;

  const { error } = await supabase.from('speakers').update(updateData).eq('id', speakerId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Eliminar un speaker
 */
export async function deleteSpeaker(
  speakerId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase.from('speakers').delete().eq('id', speakerId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ============================================
// SPONSORS COMMANDS
// ============================================

/**
 * Crear un nuevo sponsor
 */
export async function createSponsor(
  input: SponsorInput
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('sponsors')
    .insert({
      name: input.name,
      logo_url: input.logoUrl,
      website_url: input.websiteUrl,
      description: input.description,
      tier: input.tier,
      is_active: input.isActive,
    })
    .select('id')
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: { id: data.id }, error: null };
}

/**
 * Actualizar un sponsor
 */
export async function updateSponsor(
  sponsorId: string,
  input: Partial<SponsorInput>
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const updateData: Record<string, unknown> = {};

  if (input.name !== undefined) updateData.name = input.name;
  if (input.logoUrl !== undefined) updateData.logo_url = input.logoUrl;
  if (input.websiteUrl !== undefined) updateData.website_url = input.websiteUrl;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.tier !== undefined) updateData.tier = input.tier;
  if (input.isActive !== undefined) updateData.is_active = input.isActive;

  const { error } = await supabase.from('sponsors').update(updateData).eq('id', sponsorId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Eliminar un sponsor
 */
export async function deleteSponsor(
  sponsorId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase.from('sponsors').delete().eq('id', sponsorId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ============================================
// EVENT-SPEAKER RELATIONS
// ============================================

/**
 * Añadir speaker a un evento
 */
export async function addSpeakerToEvent(
  eventId: string,
  speakerId: string,
  options?: {
    roleInEvent?: string;
    talkTitle?: string;
    talkDescription?: string;
    orderIndex?: number;
  }
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase.from('event_speakers').insert({
    event_id: eventId,
    speaker_id: speakerId,
    role_in_event: options?.roleInEvent,
    talk_title: options?.talkTitle,
    talk_description: options?.talkDescription,
    order_index: options?.orderIndex ?? 0,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Quitar speaker de un evento
 */
export async function removeSpeakerFromEvent(
  eventId: string,
  speakerId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase
    .from('event_speakers')
    .delete()
    .eq('event_id', eventId)
    .eq('speaker_id', speakerId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Actualizar relación speaker-evento
 */
export async function updateEventSpeaker(
  eventId: string,
  speakerId: string,
  options: {
    roleInEvent?: string;
    talkTitle?: string;
    talkDescription?: string;
    orderIndex?: number;
  }
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const updateData: Record<string, unknown> = {};

  if (options.roleInEvent !== undefined) updateData.role_in_event = options.roleInEvent;
  if (options.talkTitle !== undefined) updateData.talk_title = options.talkTitle;
  if (options.talkDescription !== undefined) updateData.talk_description = options.talkDescription;
  if (options.orderIndex !== undefined) updateData.order_index = options.orderIndex;

  const { error } = await supabase
    .from('event_speakers')
    .update(updateData)
    .eq('event_id', eventId)
    .eq('speaker_id', speakerId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ============================================
// EVENT-SPONSOR RELATIONS
// ============================================

/**
 * Añadir sponsor a un evento
 */
export async function addSponsorToEvent(
  eventId: string,
  sponsorId: string,
  tierOverride?: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase.from('event_sponsors').insert({
    event_id: eventId,
    sponsor_id: sponsorId,
    tier_override: tierOverride,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Quitar sponsor de un evento
 */
export async function removeSponsorFromEvent(
  eventId: string,
  sponsorId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase
    .from('event_sponsors')
    .delete()
    .eq('event_id', eventId)
    .eq('sponsor_id', sponsorId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
