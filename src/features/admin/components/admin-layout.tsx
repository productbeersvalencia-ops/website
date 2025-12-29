/**
 * AdminLayout - Server Component
 *
 * Re-exports from admin-layout-server.tsx for clean imports.
 * This is the main entry point - use this for new admin pages.
 *
 * Features:
 * - Translated navigation (EN/ES)
 * - Badge for pending messages
 * - Server-side data fetching
 *
 * Usage:
 * ```tsx
 * import { AdminLayout } from '@/features/admin';
 *
 * export default async function AdminPage() {
 *   const user = await requireAdmin();
 *   return (
 *     <AdminLayout user={user}>
 *       <YourContent />
 *     </AdminLayout>
 *   );
 * }
 * ```
 */
export { AdminLayout } from './admin-layout-server';
export { AdminLayoutClient } from './admin-layout-client';
export type { NavItem } from './admin-layout-client';
