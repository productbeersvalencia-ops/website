'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/shared/auth';
import type { EventInput, SpeakerInput, SponsorInput } from './types';
import {
  handleCreateEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  handlePublishEvent,
  handleUnpublishEvent,
  handleCancelEvent,
  handleCreateSpeaker,
  handleUpdateSpeaker,
  handleDeleteSpeaker,
  handleCreateSponsor,
  handleUpdateSponsor,
  handleDeleteSponsor,
  handleAddSpeakerToEvent,
  handleRemoveSpeakerFromEvent,
  handleUpdateEventSpeaker,
  handleAddSponsorToEvent,
  handleRemoveSponsorFromEvent,
} from './events.handler';

// ============================================
// EVENT ACTIONS
// ============================================

export async function createEventAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
  const user = await requireAdmin();

  const input: EventInput = {
    title: formData.get('title') as string,
    slug: (formData.get('slug') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    shortDescription: (formData.get('shortDescription') as string) || undefined,
    date: new Date(formData.get('date') as string),
    endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
    locationName: (formData.get('locationName') as string) || undefined,
    locationAddress: (formData.get('locationAddress') as string) || undefined,
    locationCity: (formData.get('locationCity') as string) || 'Valencia',
    locationMapsUrl: (formData.get('locationMapsUrl') as string) || undefined,
    imageUrl: (formData.get('imageUrl') as string) || undefined,
    registrationUrl: (formData.get('registrationUrl') as string) || undefined,
    maxAttendees: formData.get('maxAttendees')
      ? parseInt(formData.get('maxAttendees') as string)
      : undefined,
    status: (formData.get('status') as 'draft' | 'published' | 'cancelled') || 'draft',
    featured: formData.get('featured') === 'true',
  };

  const result = await handleCreateEvent(user.id, input);

  if (result.success) {
    revalidatePath('/eventos');
    revalidatePath('/admin/eventos');
  }

  return result;
}

export async function updateEventAction(
  eventId: string,
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const input: Partial<EventInput> = {};

  const title = formData.get('title');
  if (title) input.title = title as string;

  const slug = formData.get('slug');
  if (slug) input.slug = slug as string;

  const description = formData.get('description');
  if (description !== null) input.description = description as string;

  const shortDescription = formData.get('shortDescription');
  if (shortDescription !== null) input.shortDescription = shortDescription as string;

  const date = formData.get('date');
  if (date) input.date = new Date(date as string);

  const endDate = formData.get('endDate');
  if (endDate) input.endDate = new Date(endDate as string);

  const locationName = formData.get('locationName');
  if (locationName !== null) input.locationName = locationName as string;

  const locationAddress = formData.get('locationAddress');
  if (locationAddress !== null) input.locationAddress = locationAddress as string;

  const locationCity = formData.get('locationCity');
  if (locationCity !== null) input.locationCity = locationCity as string;

  const locationMapsUrl = formData.get('locationMapsUrl');
  if (locationMapsUrl !== null) input.locationMapsUrl = locationMapsUrl as string;

  const imageUrl = formData.get('imageUrl');
  if (imageUrl !== null) input.imageUrl = imageUrl as string;

  const registrationUrl = formData.get('registrationUrl');
  if (registrationUrl !== null) input.registrationUrl = registrationUrl as string;

  const maxAttendees = formData.get('maxAttendees');
  if (maxAttendees) input.maxAttendees = parseInt(maxAttendees as string);

  const status = formData.get('status');
  if (status) input.status = status as 'draft' | 'published' | 'cancelled';

  const featured = formData.get('featured');
  if (featured !== null) input.featured = featured === 'true';

  const result = await handleUpdateEvent(eventId, input);

  if (result.success) {
    revalidatePath('/eventos');
    revalidatePath('/admin/eventos');
    revalidatePath(`/admin/eventos/${eventId}`);
  }

  return result;
}

export async function deleteEventAction(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handleDeleteEvent(eventId);

  if (result.success) {
    revalidatePath('/eventos');
    revalidatePath('/admin/eventos');
  }

  return result;
}

export async function publishEventAction(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handlePublishEvent(eventId);

  if (result.success) {
    revalidatePath('/eventos');
    revalidatePath('/admin/eventos');
  }

  return result;
}

export async function unpublishEventAction(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handleUnpublishEvent(eventId);

  if (result.success) {
    revalidatePath('/eventos');
    revalidatePath('/admin/eventos');
  }

  return result;
}

export async function cancelEventAction(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handleCancelEvent(eventId);

  if (result.success) {
    revalidatePath('/eventos');
    revalidatePath('/admin/eventos');
  }

  return result;
}

// ============================================
// SPEAKER ACTIONS
// ============================================

export async function createSpeakerAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
  await requireAdmin();

  const input: SpeakerInput = {
    name: formData.get('name') as string,
    role: (formData.get('role') as string) || undefined,
    company: (formData.get('company') as string) || undefined,
    bio: (formData.get('bio') as string) || undefined,
    photoUrl: (formData.get('photoUrl') as string) || undefined,
    linkedinUrl: (formData.get('linkedinUrl') as string) || undefined,
    twitterUrl: (formData.get('twitterUrl') as string) || undefined,
    websiteUrl: (formData.get('websiteUrl') as string) || undefined,
  };

  const result = await handleCreateSpeaker(input);

  if (result.success) {
    revalidatePath('/admin/eventos');
  }

  return result;
}

export async function updateSpeakerAction(
  speakerId: string,
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const input: Partial<SpeakerInput> = {};

  const name = formData.get('name');
  if (name) input.name = name as string;

  const role = formData.get('role');
  if (role !== null) input.role = role as string;

  const company = formData.get('company');
  if (company !== null) input.company = company as string;

  const bio = formData.get('bio');
  if (bio !== null) input.bio = bio as string;

  const photoUrl = formData.get('photoUrl');
  if (photoUrl !== null) input.photoUrl = photoUrl as string;

  const linkedinUrl = formData.get('linkedinUrl');
  if (linkedinUrl !== null) input.linkedinUrl = linkedinUrl as string;

  const twitterUrl = formData.get('twitterUrl');
  if (twitterUrl !== null) input.twitterUrl = twitterUrl as string;

  const websiteUrl = formData.get('websiteUrl');
  if (websiteUrl !== null) input.websiteUrl = websiteUrl as string;

  const result = await handleUpdateSpeaker(speakerId, input);

  if (result.success) {
    revalidatePath('/admin/eventos');
  }

  return result;
}

export async function deleteSpeakerAction(
  speakerId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handleDeleteSpeaker(speakerId);

  if (result.success) {
    revalidatePath('/admin/eventos');
  }

  return result;
}

// ============================================
// SPONSOR ACTIONS
// ============================================

export async function createSponsorAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
  await requireAdmin();

  const input: SponsorInput = {
    name: formData.get('name') as string,
    logoUrl: (formData.get('logoUrl') as string) || undefined,
    websiteUrl: (formData.get('websiteUrl') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    tier: (formData.get('tier') as 'platinum' | 'gold' | 'silver' | 'standard') || 'standard',
    isActive: formData.get('isActive') !== 'false',
  };

  const result = await handleCreateSponsor(input);

  if (result.success) {
    revalidatePath('/admin/eventos');
  }

  return result;
}

export async function updateSponsorAction(
  sponsorId: string,
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const input: Partial<SponsorInput> = {};

  const name = formData.get('name');
  if (name) input.name = name as string;

  const logoUrl = formData.get('logoUrl');
  if (logoUrl !== null) input.logoUrl = logoUrl as string;

  const websiteUrl = formData.get('websiteUrl');
  if (websiteUrl !== null) input.websiteUrl = websiteUrl as string;

  const description = formData.get('description');
  if (description !== null) input.description = description as string;

  const tier = formData.get('tier');
  if (tier) input.tier = tier as 'platinum' | 'gold' | 'silver' | 'standard';

  const isActive = formData.get('isActive');
  if (isActive !== null) input.isActive = isActive !== 'false';

  const result = await handleUpdateSponsor(sponsorId, input);

  if (result.success) {
    revalidatePath('/admin/eventos');
  }

  return result;
}

export async function deleteSponsorAction(
  sponsorId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handleDeleteSponsor(sponsorId);

  if (result.success) {
    revalidatePath('/admin/eventos');
  }

  return result;
}

// ============================================
// EVENT-SPEAKER RELATION ACTIONS
// ============================================

export async function addSpeakerToEventAction(
  eventId: string,
  speakerId: string,
  options?: {
    roleInEvent?: string;
    talkTitle?: string;
    talkDescription?: string;
    orderIndex?: number;
  }
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handleAddSpeakerToEvent(eventId, speakerId, options);

  if (result.success) {
    revalidatePath('/eventos');
    revalidatePath(`/admin/eventos/${eventId}`);
  }

  return result;
}

export async function removeSpeakerFromEventAction(
  eventId: string,
  speakerId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handleRemoveSpeakerFromEvent(eventId, speakerId);

  if (result.success) {
    revalidatePath('/eventos');
    revalidatePath(`/admin/eventos/${eventId}`);
  }

  return result;
}

export async function updateEventSpeakerAction(
  eventId: string,
  speakerId: string,
  options: {
    roleInEvent?: string;
    talkTitle?: string;
    talkDescription?: string;
    orderIndex?: number;
  }
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handleUpdateEventSpeaker(eventId, speakerId, options);

  if (result.success) {
    revalidatePath('/eventos');
    revalidatePath(`/admin/eventos/${eventId}`);
  }

  return result;
}

// ============================================
// EVENT-SPONSOR RELATION ACTIONS
// ============================================

export async function addSponsorToEventAction(
  eventId: string,
  sponsorId: string,
  tierOverride?: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handleAddSponsorToEvent(eventId, sponsorId, tierOverride);

  if (result.success) {
    revalidatePath('/eventos');
    revalidatePath(`/admin/eventos/${eventId}`);
  }

  return result;
}

export async function removeSponsorFromEventAction(
  eventId: string,
  sponsorId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await handleRemoveSponsorFromEvent(eventId, sponsorId);

  if (result.success) {
    revalidatePath('/eventos');
    revalidatePath(`/admin/eventos/${eventId}`);
  }

  return result;
}
