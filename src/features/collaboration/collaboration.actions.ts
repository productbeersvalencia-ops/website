'use server';

import { revalidatePath } from 'next/cache';
import { collaborationRequestSchema, updateCollaborationStatusSchema } from './types';
import { createCollaborationRequest, updateCollaborationStatus, deleteCollaborationRequest } from './collaboration.command';

interface ActionState {
  success: boolean;
  error: string | null;
  messageKey?: string;
}

/**
 * Submit collaboration request (public action)
 */
export async function submitCollaborationAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const input = {
    type: formData.get('type') as string,
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    company: formData.get('company') as string || undefined,
    message: formData.get('message') as string,
  };

  const validation = collaborationRequestSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const result = await createCollaborationRequest(validation.data);

  if (result.success) {
    return {
      success: true,
      error: null,
      messageKey: 'requestSubmitted',
    };
  }

  return {
    success: false,
    error: result.error || 'Error al enviar la solicitud',
  };
}

/**
 * Update collaboration request status (admin action)
 */
export async function updateCollaborationStatusAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const input = {
    id: formData.get('id') as string,
    status: formData.get('status') as string,
    notes: formData.get('notes') as string || undefined,
  };

  const validation = updateCollaborationStatusSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const result = await updateCollaborationStatus(validation.data);

  if (result.success) {
    revalidatePath('/dashboard/mensajes');
    return {
      success: true,
      error: null,
    };
  }

  return {
    success: false,
    error: result.error || 'Error al actualizar el estado',
  };
}

/**
 * Delete collaboration request (admin action)
 */
export async function deleteCollaborationAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  const result = await deleteCollaborationRequest(id);

  if (result.success) {
    revalidatePath('/dashboard/mensajes');
    return {
      success: true,
      error: null,
    };
  }

  return {
    success: false,
    error: result.error || 'Error al eliminar la solicitud',
  };
}
