'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Marquee } from '@/shared/components/magic-ui';
import type { Collaborator } from '@/features/admin/types';

interface CollaboratorsMarqueeClientProps {
  collaborators: Collaborator[];
}

export function CollaboratorsMarqueeClient({ collaborators }: CollaboratorsMarqueeClientProps) {
  const t = useTranslations('landing');

  return (
    <section className="py-12 bg-[#0a0a0a] border-y border-[#1a1a1a]">
      <div className="container mb-6">
        <p className="text-center text-sm text-gray-500 uppercase tracking-wider">
          {t('collaborators.title')}
        </p>
      </div>

      <Marquee pauseOnHover className="[--duration:30s] [--gap:3rem]">
        {collaborators.map((collaborator) => (
          <a
            key={collaborator.id}
            href={collaborator.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
          >
            <Image
              src={collaborator.logo_url}
              alt={collaborator.name}
              width={120}
              height={40}
              className="h-8 md:h-10 w-auto object-contain"
            />
          </a>
        ))}
      </Marquee>
    </section>
  );
}
