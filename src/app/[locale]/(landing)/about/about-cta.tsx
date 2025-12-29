'use client';

import { useTranslations } from 'next-intl';
import { Send, LinkedinIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/shared/components/ui/button';
import { FadeIn, BorderBeam, BeerBubbles } from '@/shared/components/magic-ui';
import { brand } from '@/shared/config';

export function AboutCTA() {
  const t = useTranslations('about.cta');

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-t from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Fondo dramático */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" />
      </div>
      <BeerBubbles quantity={15} minSize={4} maxSize={12} className="z-0 opacity-40" />

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="relative rounded-3xl border border-[#2a2a2a] bg-[#141414] p-12 md:p-16 text-center overflow-hidden max-w-4xl mx-auto">
            <BorderBeam size={400} duration={25} colorFrom="#eab308" colorTo="#fbbf24" />

            {/* JK pequeño */}
            <Image
              src="/jk.svg"
              alt="JK mascota"
              width={80}
              height={80}
              className="mx-auto mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]"
            />

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="px-8 rounded-xl shadow-xl shadow-primary/20" asChild>
                <a href={brand.social.telegram} target="_blank" rel="noopener noreferrer">
                  {t('primaryButton')}
                  <Send className="ml-2 size-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="px-8 rounded-xl" asChild>
                <a href={brand.social.linkedin} target="_blank" rel="noopener noreferrer">
                  {t('secondaryButton')}
                  <LinkedinIcon className="ml-2 size-4" />
                </a>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
