import { createClientServer } from '@/shared/database/supabase';
import type { CollaborationRequestInput, UpdateCollaborationStatusInput } from './types';

/**
 * Create a new collaboration request (public - via server action)
 */
export async function createCollaborationRequest(
  input: CollaborationRequestInput
): Promise<{ success: boolean; error: string | null }> {
  // Use server client since this runs in a server action
  const supabase = await createClientServer();

  const { error } = await supabase
    .from('collaboration_requests')
    .insert({
      type: input.type,
      name: input.name,
      email: input.email,
      company: input.company || null,
      message: input.message,
      status: 'pending',
    });

  if (error) {
    console.error('Error creating collaboration request:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Update collaboration request status (admin only)
 */
export async function updateCollaborationStatus(
  input: UpdateCollaborationStatusInput
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase
    .from('collaboration_requests')
    .update({
      status: input.status,
      notes: input.notes,
    })
    .eq('id', input.id);

  if (error) {
    console.error('Error updating collaboration request:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Delete collaboration request (admin only)
 */
export async function deleteCollaborationRequest(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase
    .from('collaboration_requests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting collaboration request:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
