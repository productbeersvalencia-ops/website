import { createClientServer } from '@/shared/database/supabase';
import type { CollaborationRequest, CollaborationStatus, CollaborationType } from './types';

/**
 * Get all collaboration requests (admin only)
 */
export async function getCollaborationRequests(filters?: {
  type?: CollaborationType;
  status?: CollaborationStatus;
  is_read?: boolean;
}): Promise<{ data: CollaborationRequest[]; error: string | null }> {
  const supabase = await createClientServer();

  let query = supabase
    .from('collaboration_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.is_read !== undefined) {
    query = query.eq('is_read', filters.is_read);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching collaboration requests:', error);
    return { data: [], error: error.message };
  }

  return { data: data as CollaborationRequest[], error: null };
}

/**
 * Get collaboration request by ID (admin only)
 */
export async function getCollaborationRequestById(
  id: string
): Promise<{ data: CollaborationRequest | null; error: string | null }> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('collaboration_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching collaboration request:', error);
    return { data: null, error: error.message };
  }

  return { data: data as CollaborationRequest, error: null };
}

/**
 * Get count of unread requests (for dashboard badge)
 */
export async function getUnreadRequestsCount(): Promise<number> {
  const supabase = await createClientServer();

  const { count, error } = await supabase
    .from('collaboration_requests')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  if (error) {
    console.error('Error counting unread requests:', error);
    return 0;
  }

  return count || 0;
}
