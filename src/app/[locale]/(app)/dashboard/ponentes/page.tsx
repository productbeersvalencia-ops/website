import { requireUser } from '@/shared/auth';
import { getAllSpeakers } from '@/features/admin/admin.query';
import { SpeakersAdmin } from './speakers-admin';

interface PonentesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PonentesPage({ params }: PonentesPageProps) {
  const { locale } = await params;
  await requireUser(locale);

  const speakers = await getAllSpeakers();

  return <SpeakersAdmin initialSpeakers={speakers} />;
}
