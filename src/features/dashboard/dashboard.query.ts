import { getAdminStats } from '@/features/admin/admin.query';
import type { DashboardStats } from './types';

/**
 * Get dashboard statistics
 * Uses the same stats as admin (Product Beers specific: events, speakers, sponsors)
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  return getAdminStats();
}
