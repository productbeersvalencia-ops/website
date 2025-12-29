'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  ExternalLink,
  Users,
  Share2,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import { useState } from 'react';
import { FadeIn } from '@/shared/components/magic-ui';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { brand } from '@/shared/config/brand';
import type { Event } from '@/features/events/types';
import { isUpcoming, isPast } from '@/features/events/types';

interface EventDetailProps {
  event: Event;
}

export function EventDetail({ event }: EventDetailProps) {
  const t = useTranslations('eventos-[slug]');
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  const upcoming = isUpcoming(event);
  const past = isPast(event);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${event.title} - ${brand.name}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <FadeIn>
        <Link
          href="/eventos"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Link>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <FadeIn>
            <div>
              {/* Status badge */}
              <div className="flex items-center gap-3 mb-4">
                {upcoming && (
                  <Badge variant="default">{t('status.upcoming')}</Badge>
                )}
                {past && (
                  <Badge variant="secondary">{t('status.past')}</Badge>
                )}
                {event.status === 'cancelled' && (
                  <Badge variant="destructive">{t('status.cancelled')}</Badge>
                )}
                {event.featured && upcoming && (
                  <Badge variant="outline">Destacado</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {event.title}
              </h1>

              {event.shortDescription && (
                <p className="text-lg text-muted-foreground">
                  {event.shortDescription}
                </p>
              )}
            </div>
          </FadeIn>

          {/* Image */}
          {event.imageUrl && (
            <FadeIn delay={0.1}>
              <div className="rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </FadeIn>
          )}

          {/* Description */}
          {event.description && (
            <FadeIn delay={0.2}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    {t('description.label')}
                  </h2>
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{event.description}</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          )}

          {/* Speakers */}
          {event.speakers && event.speakers.length > 0 && (
            <FadeIn delay={0.3}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-6">
                    {t('speakers.label')}
                  </h2>
                  <div className="space-y-6">
                    {event.speakers.map((eventSpeaker) => (
                      <div
                        key={eventSpeaker.id}
                        className="flex gap-4"
                      >
                        {eventSpeaker.speaker?.photoUrl && (
                          <div className="flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={eventSpeaker.speaker.photoUrl}
                              alt={eventSpeaker.speaker.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">
                            {eventSpeaker.speaker?.name}
                          </h3>
                          {eventSpeaker.speaker?.role && (
                            <p className="text-sm text-muted-foreground">
                              {eventSpeaker.speaker.role}
                              {eventSpeaker.speaker.company &&
                                ` @ ${eventSpeaker.speaker.company}`}
                            </p>
                          )}
                          {eventSpeaker.talkTitle && (
                            <p className="text-sm text-primary mt-1">
                              {t('speakers.talkTitle')}: {eventSpeaker.talkTitle}
                            </p>
                          )}
                          {eventSpeaker.speaker?.linkedinUrl && (
                            <a
                              href={eventSpeaker.speaker.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-muted-foreground hover:text-primary mt-2"
                            >
                              <Linkedin className="h-3 w-3 mr-1" />
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          )}

          {/* Sponsors */}
          {event.sponsors && event.sponsors.length > 0 && (
            <FadeIn delay={0.4}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-6">
                    {t('sponsors.label')}
                  </h2>
                  <div className="flex flex-wrap gap-6">
                    {event.sponsors.map((eventSponsor) => (
                      <a
                        key={eventSponsor.id}
                        href={eventSponsor.sponsor?.websiteUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        {eventSponsor.sponsor?.logoUrl && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={eventSponsor.sponsor.logoUrl}
                            alt={eventSponsor.sponsor.name}
                            className="h-8 w-auto object-contain"
                          />
                        )}
                        <span className="font-medium">
                          {eventSponsor.sponsor?.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info Card */}
          <FadeIn delay={0.2}>
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                {/* Date & Time */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('date.label')}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      <span className="capitalize">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>
                        {formatTime(event.date)}
                        {event.endDate && ` - ${formatTime(event.endDate)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                {event.locationName && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {t('location.label')}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">{event.locationName}</p>
                          {event.locationAddress && (
                            <p className="text-sm text-muted-foreground">
                              {event.locationAddress}
                            </p>
                          )}
                          {event.locationCity && (
                            <p className="text-sm text-muted-foreground">
                              {event.locationCity}
                            </p>
                          )}
                        </div>
                      </div>
                      {event.locationMapsUrl && (
                        <a
                          href={event.locationMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {t('location.viewMap')}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Attendees info */}
                {event.maxAttendees && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Users className="h-5 w-5" />
                    <span>
                      {event.maxAttendees} {t('registration.spotsLeft')}
                    </span>
                  </div>
                )}

                {/* Register button */}
                {upcoming && event.registrationUrl && (
                  <Button className="w-full" size="lg" asChild>
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('registration.register')}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}

                {/* Share */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    {t('share.label')}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={shareOnTwitter}
                      title={t('share.twitter')}
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={shareOnLinkedIn}
                      title={t('share.linkedin')}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                      title={copied ? t('share.copied') : t('share.copy')}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <LinkIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
