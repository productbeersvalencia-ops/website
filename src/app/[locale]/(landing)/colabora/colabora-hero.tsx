'use client';

import { useTranslations } from 'next-intl';
import { FadeIn, BeerBubbles, AnimatedGradientText } from '@/shared/components/magic-ui';

export function ColaboraHero() {
  const t = useTranslations('colabora');

  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 md:py-28 text-center overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Fondo con gradientes animados */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-yellow-600/10 rounded-full blur-[80px]" />
      </div>

      {/* Burbujas de cerveza */}
      <BeerBubbles quantity={25} minSize={6} maxSize={18} className="z-0 opacity-60" />

      <div className="container relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              {t('hero.titleStart')}{' '}
              <AnimatedGradientText className="text-4xl md:text-5xl lg:text-6xl font-bold" colorFrom="#eab308" colorTo="#f59e0b">
                {t('hero.titleHighlight')}
              </AnimatedGradientText>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              {t('hero.description')}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
