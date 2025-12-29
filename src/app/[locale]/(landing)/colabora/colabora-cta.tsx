'use client';

import { useTranslations } from 'next-intl';
import { FadeIn, BorderBeam } from '@/shared/components/magic-ui';
import { CollaborationForm } from '@/features/collaboration/components/collaboration-form';

export function ColaboraCTA() {
  const t = useTranslations('colabora');

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-gray-400">
              {t('cta.description')}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative max-w-lg mx-auto p-8 rounded-3xl bg-[#141414] border border-[#2a2a2a]">
            <BorderBeam size={350} duration={20} colorFrom="#eab308" colorTo="#f59e0b" />
            <CollaborationForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
