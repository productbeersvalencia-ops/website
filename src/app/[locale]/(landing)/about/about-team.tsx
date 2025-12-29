'use client';

import { useTranslations } from 'next-intl';
import { FadeIn, BorderBeam } from '@/shared/components/magic-ui';

// Team data with LinkedIn profile photos
const team = [
  {
    name: 'Carlos Miguel Corada',
    role: 'Founder & Organizador',
    linkedin: 'https://www.linkedin.com/in/cmiguelcorada/',
    company: 'Fourvenues',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQHyyaeT-6Yl9w/profile-displayphoto-scale_200_200/B4DZhCbA0tGkAY-/0/1753461034971?e=1768435200&v=beta&t=kbh2qr4dz8x--OFWKO-NHI5_oQ5gZ7ecvi6KVUyJ9NM',
  },
  {
    name: 'Carlos Moya Ortiz',
    role: 'Organizador',
    linkedin: 'https://www.linkedin.com/in/csmoya/',
    company: 'Citibox',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQFlA0E9MMqpMg/profile-displayphoto-scale_200_200/B4DZh6lhgiGsAY-/0/1754403314146?e=1768435200&v=beta&t=wzdmPHPfdN77N48oaOKhRaw9O-1fe_pJ70MfomkVRsY',
  },
  {
    name: 'Marta Cano',
    role: 'Organizadora',
    linkedin: 'https://www.linkedin.com/in/marta-cano-product/',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQGtQnOD7QAGyA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1729705858366?e=1768435200&v=beta&t=pWhk2zoMJxRkxSy4lJIYilcovOaM_VEM-8G6447C6ss',
  },
  {
    name: 'Guille Songel',
    role: 'Organizador',
    linkedin: 'https://www.linkedin.com/in/guillesongel/',
    image: 'https://media.licdn.com/dms/image/v2/C4D03AQHFMFuUDbgkVA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1594752621754?e=1768435200&v=beta&t=Qlq52X3Pjpf-ERFD0dfhYgho3cNc5AVuistKt509o2o',
  },
  {
    name: 'Maribel Fernández',
    role: 'Organizadora & Vibe Coder',
    linkedin: 'https://www.linkedin.com/in/maribel-fernandez/',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQG2Oe8vekO7kg/profile-displayphoto-scale_200_200/B4DZkFuTgiIEAY-/0/1756737650372?e=1768435200&v=beta&t=q8WOlex1ycccrIZTjCon2Cmp9gXYGqa8ploAPnYv8Ck',
  },
];

export function AboutTeam() {
  const t = useTranslations('about.team');

  return (
    <section className="py-24 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-x-1/2" />

      <div className="container mx-auto px-4 relative">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-3 tracking-wider uppercase">
              {t('label')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <FadeIn key={member.name} delay={index * 0.08}>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center"
              >
                {/* Foto circular con glow y border beam */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {/* Glow ámbar detrás */}
                  <div className="absolute inset-[-4px] rounded-full bg-primary/30 blur-lg group-hover:bg-primary/50 transition-all duration-500" />
                  {/* Container con border beam */}
                  <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-primary/40 group-hover:ring-primary/70 transition-all duration-300">
                    <BorderBeam size={120} duration={6 + index * 1.5} colorFrom="#eab308" colorTo="#fbbf24" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover relative z-10" />
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-white group-hover:text-primary transition-colors">
                  {member.name.split(' ').slice(0, 2).join(' ')}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{member.role}</p>
                {member.company && <p className="text-xs text-primary/60 mt-0.5">{member.company}</p>}
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
