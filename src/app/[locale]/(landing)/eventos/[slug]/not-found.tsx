'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CalendarX } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export default function EventNotFound() {
  const t = useTranslations('eventos-[slug].notFound');

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center max-w-md mx-auto">
        <CalendarX className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground mb-8">{t('description')}</p>
        <Button asChild>
          <Link href="/eventos">{t('cta')}</Link>
        </Button>
      </div>
    </div>
  );
}
