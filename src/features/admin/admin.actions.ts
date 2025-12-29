'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/shared/auth';
import {
  handleUpdateInfoBarSettings,
  handleUpdateEmailJourneysSettings,
  handleUpdateFeatureFlags,
  handleUpdateCrossSellProducts,
  handleUpdateAffiliateProgramSettings,
  handleToggleEmailJourney,
  handleToggleFeatureFlag,
  handleUpdateUserFlags,
  handleMakeUserAdmin,
  handleRemoveUserAdmin,
} from './admin.handler';
import type { ActionResult, InfoBarSettings, EmailJourneysSettings, FeatureFlags, CrossSellProductsSettings, AffiliateProgramSettings, CollaboratorInput, Collaborator, SpeakerInput, Speaker } from './types';
import {
  createCollaborator,
  updateCollaborator,
  toggleCollaboratorActive,
  deleteCollaborator,
  createSpeaker,
  updateSpeaker,
  toggleSpeakerActive,
  deleteSpeaker,
} from './admin.command';
import { collaboratorSchema, speakerSchema } from './types';

/**
 * ==============================================
 * SETTINGS ACTIONS
 * ==============================================
 */

/**
 * Update Info Bar settings
 */
export async function updateInfoBarAction(
  prevState: any,
  formData: FormData
): Promise<ActionResult<InfoBarSettings>> {
  // Require admin authentication
  const user = await requireAdmin();

  // Parse form data
  const input = {
    enabled: formData.get('enabled') === 'on',
    mode: formData.get('mode') as 'info' | 'warning' | 'error',
    scope: formData.get('scope') as 'all' | 'authenticated' | 'unauthenticated',
    dismissible: formData.get('dismissible') === 'on',
    messages: {
      en: (formData.get('message_en') as string) || '',
      es: (formData.get('message_es') as string) || '',
    },
  };

  // Handle update
  const result = await handleUpdateInfoBarSettings(user.id, input);

  // Revalidate all pages to reflect new info bar settings
  if (result.success) {
    revalidatePath('/', 'layout');
  }

  return result;
}

/**
 * Update Email Journeys settings
 */
export async function updateEmailJourneysAction(
  input: unknown
): Promise<ActionResult<EmailJourneysSettings>> {
  const user = await requireAdmin();
  const result = await handleUpdateEmailJourneysSettings(user.id, input);

  if (result.success) {
    revalidatePath('/[locale]/admin/emails');
  }

  return result;
}

/**
 * Toggle a specific email journey on/off
 */
export async function toggleEmailJourneyAction(
  journeyKey: string,
  enabled: boolean
): Promise<ActionResult> {
  const user = await requireAdmin();
  const result = await handleToggleEmailJourney(user.id, journeyKey, enabled);

  if (result.success) {
    revalidatePath('/[locale]/admin/emails');
  }

  return result;
}

/**
 * Update Feature Flags
 */
export async function updateFeatureFlagsAction(
  input: unknown
): Promise<ActionResult<FeatureFlags>> {
  const user = await requireAdmin();
  const result = await handleUpdateFeatureFlags(user.id, input);

  if (result.success) {
    revalidatePath('/[locale]/admin/settings');
  }

  return result;
}

/**
 * Toggle a specific feature flag on/off
 */
export async function toggleFeatureFlagAction(
  flagKey: string,
  enabled: boolean
): Promise<ActionResult> {
  const user = await requireAdmin();
  const result = await handleToggleFeatureFlag(user.id, flagKey, enabled);

  if (result.success) {
    revalidatePath('/[locale]/admin/settings');
  }

  return result;
}

/**
 * Update Cross-Sell Products
 */
export async function updateCrossSellProductsAction(
  input: unknown
): Promise<ActionResult<CrossSellProductsSettings>> {
  const user = await requireAdmin();
  const result = await handleUpdateCrossSellProducts(user.id, input);

  if (result.success) {
    revalidatePath('/[locale]/admin');
  }

  return result;
}

/**
 * Update Affiliate Program settings
 */
export async function updateAffiliateProgramSettingsAction(
  input: unknown
): Promise<ActionResult<AffiliateProgramSettings>> {
  const user = await requireAdmin();
  const result = await handleUpdateAffiliateProgramSettings(user.id, input);

  if (result.success) {
    // Revalidate all pages to reflect new affiliate settings in navigation
    revalidatePath('/', 'layout');
  }

  return result;
}

/**
 * ==============================================
 * USER MANAGEMENT ACTIONS
 * ==============================================
 */

/**
 * Update user flags (roles, permissions)
 */
export async function updateUserFlagsAction(
  input: unknown
): Promise<ActionResult> {
  await requireAdmin(); // Only admins can update user flags
  const result = await handleUpdateUserFlags(input);

  if (result.success) {
    revalidatePath('/[locale]/admin/users');
  }

  return result;
}

/**
 * Make a user admin
 */
export async function makeUserAdminAction(
  userId: string
): Promise<ActionResult> {
  await requireAdmin();
  const result = await handleMakeUserAdmin(userId);

  if (result.success) {
    revalidatePath('/[locale]/admin/users');
  }

  return result;
}

/**
 * Remove admin from user
 */
export async function removeUserAdminAction(
  userId: string
): Promise<ActionResult> {
  const user = await requireAdmin();

  // Security: Prevent self-demotion
  if (user.id === userId) {
    return {
      success: false,
      data: null,
      error: 'You cannot remove your own admin privileges',
    };
  }

  const result = await handleRemoveUserAdmin(userId);

  if (result.success) {
    revalidatePath('/[locale]/admin/users');
  }

  return result;
}

/**
 * ==============================================
 * ANALYTICS DATA ACTIONS
 * ==============================================
 */

/**
 * Get UTM metrics for dashboard
 * This is a server action that wraps the query function for client components
 */
export async function getUTMMetricsAction(dateRange?: {
  start: Date;
  end: Date;
}): Promise<Record<string, {
  signups: number;
  trials: number;
  customers: number;
  revenue: number;
}>> {
  await requireAdmin();

  // Import dynamically to avoid circular dependency issues
  const { getMetricsByUTM } = await import('./admin.query');
  return getMetricsByUTM(dateRange);
}

/**
 * Get funnel metrics for dashboard
 * This is a server action that wraps the query function for client components
 */
export async function getFunnelMetricsAction(dateRange?: {
  start: Date;
  end: Date;
}): Promise<{
  funnel: {
    visits: number;
    signups: number;
    trials: number;
    customers: number;
  };
  rates: {
    visitToSignup: string;
    signupToTrial: string;
    trialToCustomer: string;
  };
}> {
  await requireAdmin();

  // Import dynamically to avoid circular dependency issues
  const { getFunnelMetrics } = await import('./admin.query');
  return getFunnelMetrics(dateRange);
}

/**
 * ==============================================
 * COLLABORATOR ACTIONS
 * ==============================================
 */

/**
 * Create a new collaborator (sponsor or hoster)
 */
export async function createCollaboratorAction(
  input: CollaboratorInput
): Promise<ActionResult<{ id: string }>> {
  const user = await requireAdmin();

  // Validate input
  const validation = collaboratorSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      data: null,
      error: validation.error.issues[0].message,
    };
  }

  const result = await createCollaborator(validation.data, user.id);

  if (result.success && result.id) {
    revalidatePath('/[locale]/admin/collaborators');
    revalidatePath('/[locale]', 'layout'); // Revalidate public pages
    return {
      success: true,
      data: { id: result.id },
      error: null,
    };
  }

  return {
    success: false,
    data: null,
    error: result.error || 'Failed to create collaborator',
  };
}

/**
 * Update an existing collaborator
 */
export async function updateCollaboratorAction(
  id: string,
  input: Partial<CollaboratorInput>
): Promise<ActionResult> {
  const user = await requireAdmin();

  const result = await updateCollaborator(id, input, user.id);

  if (result.success) {
    revalidatePath('/[locale]/admin/collaborators');
    revalidatePath('/[locale]', 'layout');
    return { success: true, data: undefined, error: null };
  }

  return { success: false, data: null, error: result.error || 'Failed to update collaborator' };
}

/**
 * Toggle collaborator active status
 */
export async function toggleCollaboratorAction(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  const user = await requireAdmin();

  const result = await toggleCollaboratorActive(id, isActive, user.id);

  if (result.success) {
    revalidatePath('/[locale]/admin/collaborators');
    revalidatePath('/[locale]', 'layout');
    return { success: true, data: undefined, error: null };
  }

  return { success: false, data: null, error: result.error || 'Failed to toggle collaborator' };
}

/**
 * Delete a collaborator
 */
export async function deleteCollaboratorAction(
  id: string
): Promise<ActionResult> {
  await requireAdmin();

  const result = await deleteCollaborator(id);

  if (result.success) {
    revalidatePath('/[locale]/admin/collaborators');
    revalidatePath('/[locale]', 'layout');
    return { success: true, data: undefined, error: null };
  }

  return { success: false, data: null, error: result.error || 'Failed to delete collaborator' };
}

/**
 * ==============================================
 * SPEAKER ACTIONS
 * ==============================================
 */

/**
 * Create a new speaker
 */
export async function createSpeakerAction(
  input: SpeakerInput
): Promise<ActionResult<{ id: string }>> {
  const user = await requireAdmin();

  // Validate input
  const validation = speakerSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      data: null,
      error: validation.error.issues[0].message,
    };
  }

  const result = await createSpeaker(validation.data, user.id);

  if (result.success && result.id) {
    revalidatePath('/[locale]/dashboard/ponentes');
    return {
      success: true,
      data: { id: result.id },
      error: null,
    };
  }

  return {
    success: false,
    data: null,
    error: result.error || 'Failed to create speaker',
  };
}

/**
 * Update an existing speaker
 */
export async function updateSpeakerAction(
  id: string,
  input: Partial<SpeakerInput>
): Promise<ActionResult> {
  const user = await requireAdmin();

  const result = await updateSpeaker(id, input, user.id);

  if (result.success) {
    revalidatePath('/[locale]/dashboard/ponentes');
    return { success: true, data: undefined, error: null };
  }

  return { success: false, data: null, error: result.error || 'Failed to update speaker' };
}

/**
 * Toggle speaker active status
 */
export async function toggleSpeakerAction(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  const user = await requireAdmin();

  const result = await toggleSpeakerActive(id, isActive, user.id);

  if (result.success) {
    revalidatePath('/[locale]/dashboard/ponentes');
    return { success: true, data: undefined, error: null };
  }

  return { success: false, data: null, error: result.error || 'Failed to toggle speaker' };
}

/**
 * Delete a speaker
 */
export async function deleteSpeakerAction(
  id: string
): Promise<ActionResult> {
  await requireAdmin();

  const result = await deleteSpeaker(id);

  if (result.success) {
    revalidatePath('/[locale]/dashboard/ponentes');
    return { success: true, data: undefined, error: null };
  }

  return { success: false, data: null, error: result.error || 'Failed to delete speaker' };
}
