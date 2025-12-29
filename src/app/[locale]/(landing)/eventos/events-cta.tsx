'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FadeIn, BorderBeam, BeerBubbles } from '@/shared/components/magic-ui';
import { Button } from '@/shared/components/ui/button';
import { brand } from '@/shared/config/brand';

export function EventsCTA() {
  const t = useTranslations('eventos.cta');

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-t from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Fondo dramático */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" />
      </div>
      <BeerBubbles quantity={15} minSize={4} maxSize={12} className="z-0 opacity-40" />

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-[#141414] border border-[#2a2a2a] p-8 md:p-12 text-center max-w-4xl mx-auto">
            <BorderBeam size={400} duration={20} colorFrom="#eab308" colorTo="#f59e0b" />

            {/* JK pequeño */}
            <Image
              src="/jk.svg"
              alt="JK mascota"
              width={80}
              height={80}
              className="mx-auto mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]"
            />

            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              {t('title')}
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              {t('description')}
            </p>
            <Button size="lg" className="rounded-xl shadow-xl shadow-primary/20" asChild>
              <a
                href={brand.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('button')}
              </a>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
