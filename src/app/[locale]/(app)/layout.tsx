import { AppLayout } from '@/shared/components/layouts';
import { AppProvider } from '@/shared/providers';
import { getUser, isAdmin } from '@/shared/auth';
import { PageTracker } from '@/features/analytics/page-tracker';
import { getUnreadRequestsCount } from '@/features/collaboration';

export default async function AppRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // Get unread messages count (only for admins)
  let unreadMessagesCount = 0;
  if (user) {
    const userIsAdmin = await isAdmin();
    if (userIsAdmin) {
      unreadMessagesCount = await getUnreadRequestsCount();
    }
  }

  return (
    <AppProvider
      initialState={{
        user: user
          ? {
              id: user.id,
              email: user.email,
              avatar_url: user.avatar,
            }
          : null,
        subscription: null,
        credits: 0,
      }}
    >
      <AppLayout
        user={{
          email: user?.email,
          avatar_url: user?.avatar,
        }}
        unreadMessagesCount={unreadMessagesCount}
      >
        <PageTracker userId={user?.id} />
        {children}
      </AppLayout>
    </AppProvider>
  );
}
