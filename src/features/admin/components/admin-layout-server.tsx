import { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { getUnreadRequestsCount } from '@/features/collaboration/collaboration.query';
import { AdminLayoutClient } from './admin-layout-client';

interface AdminLayoutProps {
  children: ReactNode;
  user: { id: string; email?: string };
}

/**
 * Server Component wrapper for AdminLayout
 * - Fetches unread messages count for badge
 * - Gets translations for navigation
 * - Passes data to client component for interactivity
 */
export async function AdminLayout({ children, user }: AdminLayoutProps) {
  const t = await getTranslations('layouts');
  const unreadCount = await getUnreadRequestsCount();

  const navigation = [
    { name: t('admin.nav.dashboard'), href: '/admin', icon: 'LayoutDashboard' as const },
    { name: t('admin.nav.events'), href: '/admin/eventos', icon: 'Calendar' as const },
    { name: t('admin.nav.content'), href: '/admin/contenido', icon: 'FileText' as const },
    { name: t('admin.nav.gallery'), href: '/admin/galeria', icon: 'Image' as const },
    { name: t('admin.nav.speakers'), href: '/admin/ponentes', icon: 'Mic2' as const },
    { name: t('admin.nav.sponsors'), href: '/admin/sponsors', icon: 'Building2' as const },
    { name: t('admin.nav.collaborators'), href: '/admin/collaborators', icon: 'Handshake' as const },
    { name: t('admin.nav.team'), href: '/admin/equipo', icon: 'UsersRound' as const },
    { name: t('admin.nav.communities'), href: '/admin/comunidades', icon: 'Users' as const },
    { name: t('admin.nav.messages'), href: '/dashboard/mensajes', icon: 'MessageSquare' as const, badge: unreadCount },
    { name: t('admin.nav.infoBar'), href: '/admin/info-bar', icon: 'Info' as const },
  ];

  return (
    <AdminLayoutClient
      navigation={navigation}
      user={user}
      title={t('admin.title')}
      backLabel={t('admin.backToApp')}
    >
      {children}
    </AdminLayoutClient>
  );
}
