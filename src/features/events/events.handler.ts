import {
  eventSchema,
  speakerSchema,
  sponsorSchema,
  generateSlug,
  type EventInput,
  type SpeakerInput,
  type SponsorInput,
} from './types';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  unpublishEvent,
  cancelEvent,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  addSpeakerToEvent,
  removeSpeakerFromEvent,
  updateEventSpeaker,
  addSponsorToEvent,
  removeSponsorFromEvent,
} from './events.command';
import { getEventById, getEventBySlug } from './events.query';

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handler para crear evento
 */
export async function handleCreateEvent(
  userId: string,
  input: EventInput
): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
  // Validar input
  const validation = eventSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  // Generar slug si no se proporciona
  const data = validation.data;
  if (!data.slug) {
    data.slug = generateSlug(data.title);
  }

  // Verificar que el slug no existe
  const existingEvent = await getEventBySlug(data.slug);
  if (existingEvent.data) {
    // Añadir timestamp para hacer único
    data.slug = `${data.slug}-${Date.now()}`;
  }

  // Crear evento
  const result = await createEvent(userId, data);

  if (result.error) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data! };
}

/**
 * Handler para actualizar evento
 */
export async function handleUpdateEvent(
  eventId: string,
  input: Partial<EventInput>
): Promise<{ success: boolean; error?: string }> {
  // Validar input parcial
  const validation = eventSchema.partial().safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  // Verificar que el evento existe
  const existingEvent = await getEventById(eventId);
  if (!existingEvent.data) {
    return { success: false, error: 'Evento no encontrado' };
  }

  // Si se cambia el slug, verificar que no existe
  if (input.slug && input.slug !== existingEvent.data.slug) {
    const eventWithSlug = await getEventBySlug(input.slug);
    if (eventWithSlug.data) {
      return { success: false, error: 'Ya existe un evento con ese slug' };
    }
  }

  const result = await updateEvent(eventId, validation.data);
  return { success: result.success, error: result.error || undefined };
}

/**
 * Handler para eliminar evento
 */
export async function handleDeleteEvent(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  // Verificar que el evento existe
  const existingEvent = await getEventById(eventId);
  if (!existingEvent.data) {
    return { success: false, error: 'Evento no encontrado' };
  }

  const result = await deleteEvent(eventId);
  return { success: result.success, error: result.error || undefined };
}

/**
 * Handler para publicar evento
 */
export async function handlePublishEvent(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  // Verificar que el evento existe
  const existingEvent = await getEventById(eventId);
  if (!existingEvent.data) {
    return { success: false, error: 'Evento no encontrado' };
  }

  // Verificar que tiene los campos mínimos para publicar
  if (!existingEvent.data.title || !existingEvent.data.date) {
    return {
      success: false,
      error: 'El evento necesita título y fecha para ser publicado',
    };
  }

  const result = await publishEvent(eventId);
  return { success: result.success, error: result.error || undefined };
}

/**
 * Handler para despublicar evento
 */
export async function handleUnpublishEvent(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  const existingEvent = await getEventById(eventId);
  if (!existingEvent.data) {
    return { success: false, error: 'Evento no encontrado' };
  }

  const result = await unpublishEvent(eventId);
  return { success: result.success, error: result.error || undefined };
}

/**
 * Handler para cancelar evento
 */
export async function handleCancelEvent(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  const existingEvent = await getEventById(eventId);
  if (!existingEvent.data) {
    return { success: false, error: 'Evento no encontrado' };
  }

  const result = await cancelEvent(eventId);
  return { success: result.success, error: result.error || undefined };
}

// ============================================
// SPEAKER HANDLERS
// ============================================

/**
 * Handler para crear speaker
 */
export async function handleCreateSpeaker(
  input: SpeakerInput
): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
  const validation = speakerSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const result = await createSpeaker(validation.data);

  if (result.error) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data! };
}

/**
 * Handler para actualizar speaker
 */
export async function handleUpdateSpeaker(
  speakerId: string,
  input: Partial<SpeakerInput>
): Promise<{ success: boolean; error?: string }> {
  const validation = speakerSchema.partial().safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const result = await updateSpeaker(speakerId, validation.data);
  return { success: result.success, error: result.error || undefined };
}

/**
 * Handler para eliminar speaker
 */
export async function handleDeleteSpeaker(
  speakerId: string
): Promise<{ success: boolean; error?: string }> {
  const result = await deleteSpeaker(speakerId);
  return { success: result.success, error: result.error || undefined };
}

// ============================================
// SPONSOR HANDLERS
// ============================================

/**
 * Handler para crear sponsor
 */
export async function handleCreateSponsor(
  input: SponsorInput
): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
  const validation = sponsorSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const result = await createSponsor(validation.data);

  if (result.error) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data! };
}

/**
 * Handler para actualizar sponsor
 */
export async function handleUpdateSponsor(
  sponsorId: string,
  input: Partial<SponsorInput>
): Promise<{ success: boolean; error?: string }> {
  const validation = sponsorSchema.partial().safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const result = await updateSponsor(sponsorId, validation.data);
  return { success: result.success, error: result.error || undefined };
}

/**
 * Handler para eliminar sponsor
 */
export async function handleDeleteSponsor(
  sponsorId: string
): Promise<{ success: boolean; error?: string }> {
  const result = await deleteSponsor(sponsorId);
  return { success: result.success, error: result.error || undefined };
}

// ============================================
// EVENT-SPEAKER RELATION HANDLERS
// ============================================

/**
 * Handler para añadir speaker a evento
 */
export async function handleAddSpeakerToEvent(
  eventId: string,
  speakerId: string,
  options?: {
    roleInEvent?: string;
    talkTitle?: string;
    talkDescription?: string;
    orderIndex?: number;
  }
): Promise<{ success: boolean; error?: string }> {
  // Verificar que el evento existe
  const existingEvent = await getEventById(eventId);
  if (!existingEvent.data) {
    return { success: false, error: 'Evento no encontrado' };
  }

  const result = await addSpeakerToEvent(eventId, speakerId, options);
  return { success: result.success, error: result.error || undefined };
}

/**
 * Handler para quitar speaker de evento
 */
export async function handleRemoveSpeakerFromEvent(
  eventId: string,
  speakerId: string
): Promise<{ success: boolean; error?: string }> {
  const result = await removeSpeakerFromEvent(eventId, speakerId);
  return { success: result.success, error: result.error || undefined };
}

/**
 * Handler para actualizar relación speaker-evento
 */
export async function handleUpdateEventSpeaker(
  eventId: string,
  speakerId: string,
  options: {
    roleInEvent?: string;
    talkTitle?: string;
    talkDescription?: string;
    orderIndex?: number;
  }
): Promise<{ success: boolean; error?: string }> {
  const result = await updateEventSpeaker(eventId, speakerId, options);
  return { success: result.success, error: result.error || undefined };
}

// ============================================
// EVENT-SPONSOR RELATION HANDLERS
// ============================================

/**
 * Handler para añadir sponsor a evento
 */
export async function handleAddSponsorToEvent(
  eventId: string,
  sponsorId: string,
  tierOverride?: string
): Promise<{ success: boolean; error?: string }> {
  // Verificar que el evento existe
  const existingEvent = await getEventById(eventId);
  if (!existingEvent.data) {
    return { success: false, error: 'Evento no encontrado' };
  }

  const result = await addSponsorToEvent(eventId, sponsorId, tierOverride);
  return { success: result.success, error: result.error || undefined };
}

/**
 * Handler para quitar sponsor de evento
 */
export async function handleRemoveSponsorFromEvent(
  eventId: string,
  sponsorId: string
): Promise<{ success: boolean; error?: string }> {
  const result = await removeSponsorFromEvent(eventId, sponsorId);
  return { success: result.success, error: result.error || undefined };
}
