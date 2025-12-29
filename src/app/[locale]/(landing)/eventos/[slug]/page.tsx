import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getEventBySlug } from '@/features/events';
import { EventDetail } from './event-detail';

interface EventPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'eventos-[slug]' });
  const { data: event } = await getEventBySlug(slug);

  if (!event) {
    return {
      title: t('notFound.title'),
    };
  }

  return {
    title: event.title + t('meta.titleSuffix'),
    description: event.shortDescription || event.description?.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.shortDescription || event.description?.slice(0, 160),
      images: event.imageUrl ? [event.imageUrl] : undefined,
    },
  };
}

// Dynamic rendering - events are fetched at request time
// This avoids calling cookies() outside request scope during build
export const dynamic = 'force-dynamic';

// Disable static params generation since we use dynamic rendering
// export async function generateStaticParams() {
//   const { data: events } = await getPublishedEvents();
//   return (events || []).map((event) => ({ slug: event.slug }));
// }

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const { data: event, error } = await getEventBySlug(slug);

  if (error || !event) {
    notFound();
  }

  return <EventDetail event={event} />;
}
