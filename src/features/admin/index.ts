/**
 * Admin Feature
 *
 * Panel de administración para gestionar la plataforma.
 * Incluye gestión de usuarios, settings, colaboradores y mensajes.
 */

// Components
export { AdminLayout, AdminLayoutClient } from './components/admin-layout';
export type { NavItem } from './components/admin-layout';

// Types
export * from './types';

// Queries (read operations)
export {
  getAllSettings,
  getSetting,
  getSettingsByCategory,
  getInfoBarSettings,
  getEmailJourneysSettings,
  getFeatureFlags,
  getMaintenanceSettings,
  getAffiliateProgramSettings,
  getCrossSellProducts,
  getAdminStats,
  getAllUsers,
  getUserById,
  searchUsers,
  getUsersWithFilters,
  getAllCollaborators,
  getActiveCollaborators,
  getCollaboratorById,
} from './admin.query';

// Commands (write operations)
export {
  updateSetting,
  updateInfoBarSettings,
  updateEmailJourneysSettings,
  toggleEmailJourney,
  updateFeatureFlags,
  toggleFeatureFlag,
  updateAffiliateProgramSettings,
  updateCrossSellProducts,
  updateUserFlags,
  addUserFlag,
  removeUserFlag,
  createCollaborator,
  updateCollaborator,
  toggleCollaboratorActive,
  deleteCollaborator,
  updateCollaboratorOrder,
} from './admin.command';

// Server Actions
export {
  updateInfoBarAction,
  updateEmailJourneysAction,
  toggleEmailJourneyAction,
  updateFeatureFlagsAction,
  updateCrossSellProductsAction,
  makeUserAdminAction,
  removeUserAdminAction,
  updateUserFlagsAction,
  createCollaboratorAction,
  updateCollaboratorAction,
  toggleCollaboratorAction,
  deleteCollaboratorAction,
} from './admin.actions';
