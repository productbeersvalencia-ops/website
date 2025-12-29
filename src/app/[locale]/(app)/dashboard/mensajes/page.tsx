import { useTranslations } from 'next-intl';
import { requireUser } from '@/shared/auth';
import { getCollaborationRequests, CollaborationList } from '@/features/collaboration';

interface MensajesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MensajesPage({ params }: MensajesPageProps) {
  const { locale } = await params;
  await requireUser(locale);

  const { data: requests } = await getCollaborationRequests();

  return <MensajesContent requests={requests} />;
}

function MensajesContent({
  requests,
}: {
  requests: Awaited<ReturnType<typeof getCollaborationRequests>>['data'];
}) {
  const t = useTranslations('messages');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <CollaborationList requests={requests} />
    </div>
  );
}
