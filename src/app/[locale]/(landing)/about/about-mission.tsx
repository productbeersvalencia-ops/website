'use client';

import { useTranslations } from 'next-intl';
import { Target, Zap, Heart } from 'lucide-react';
import { FadeIn } from '@/shared/components/magic-ui';

const values = [
  {
    icon: Target,
    key: 'mission',
  },
  {
    icon: Zap,
    key: 'vision',
  },
  {
    icon: Heart,
    key: 'values',
  },
];

export function AboutMission() {
  const t = useTranslations('about.mission');

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((item, index) => (
            <FadeIn key={item.key} delay={index * 0.1}>
              <div className="group text-center p-8 rounded-3xl bg-[#141414] border border-[#2a2a2a] hover:border-primary/50 transition-all duration-500">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {t(`${item.key}.title`)}
                </h3>
                <p className="text-gray-400">
                  {t(`${item.key}.description`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
