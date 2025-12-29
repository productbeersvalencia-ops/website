import { getTranslations } from 'next-intl/server';
import { getUpcomingEvents, getPastEvents } from '@/features/events';
import { EventsHero } from './events-hero';
import { EventsList } from './events-list';
import { EventsCTA } from './events-cta';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'eventos' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function EventosPage() {
  const [upcomingResult, pastResult] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(6),
  ]);

  return (
    <>
      <EventsHero />
      <EventsList
        upcomingEvents={upcomingResult.data || []}
        pastEvents={pastResult.data || []}
      />
      <EventsCTA />
    </>
  );
}
