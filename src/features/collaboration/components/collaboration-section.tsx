'use client';

import { useTranslations } from 'next-intl';
import { Building2, MapPin, Sparkles, Users, Megaphone, Heart } from 'lucide-react';
import { FadeIn, BeerBubbles, BorderBeam } from '@/shared/components/magic-ui';
import { CollaborationForm } from './collaboration-form';

export function CollaborationSection() {
  const t = useTranslations('collaboration');

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
      {/* Background */}
      <BeerBubbles quantity={15} minSize={3} maxSize={10} className="z-0 opacity-40" />

      {/* Decoración de fondo */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-x-1/2" />

      <div className="container relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              {t('section.label')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {t('section.title')}
            </h2>
            <p className="text-lg text-gray-400">
              {t('section.description')}
            </p>
          </div>
        </FadeIn>

        {/* Cards de tipos de colaboración */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {/* Sponsor Card */}
          <FadeIn delay={0.1}>
            <div className="relative group p-8 rounded-3xl bg-[#141414] border border-[#2a2a2a] hover:border-primary/50 transition-all duration-500 overflow-hidden h-full">
              <BorderBeam size={300} duration={12} colorFrom="#eab308" colorTo="#f59e0b" />

              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{t('types.sponsor.title')}</h3>
                <p className="text-gray-400 mb-6">{t('types.sponsor.description')}</p>

                {/* Mini benefits */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Megaphone className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-gray-300">{t('sponsor.benefit1')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-gray-300">{t('sponsor.benefit2')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-gray-300">{t('sponsor.benefit3')}</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Hoster Card */}
          <FadeIn delay={0.2}>
            <div className="relative group p-8 rounded-3xl bg-[#141414] border border-[#2a2a2a] hover:border-primary/50 transition-all duration-500 overflow-hidden h-full">
              <BorderBeam size={300} duration={15} colorFrom="#eab308" colorTo="#f59e0b" />

              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{t('types.hoster.title')}</h3>
                <p className="text-gray-400 mb-6">{t('types.hoster.description')}</p>

                {/* Mini benefits */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-gray-300">{t('hoster.benefit1')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Heart className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-gray-300">{t('hoster.benefit2')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Megaphone className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-gray-300">{t('hoster.benefit3')}</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Formulario */}
        <FadeIn delay={0.3}>
          <div className="max-w-lg mx-auto">
            <CollaborationForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
