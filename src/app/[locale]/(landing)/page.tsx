import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import {
  Beer,
  Users,
  Lightbulb,
  Shield,
  ArrowRight,
  Send,
  Calendar,
  Sparkles,
  Zap,
  Heart,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { brand } from '@/shared/config';
import Image from 'next/image';
import { FadeIn, BorderBeam, WordRotate, BeerBubbles, AnimatedGradientText, ParallaxMascot, Marquee } from '@/shared/components/magic-ui';
import { getActiveCollaborators } from '@/features/admin/admin.query';

// LinkedIn icon component
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: 'Product Beers - La comunidad de producto de Valencia',
  description:
    'Comunidad de Product Managers, Product Designers y entusiastas del producto en Valencia. Eventos, networking y aprendizaje compartido.',
};

// Team data
const team = [
  {
    name: 'Carlos Miguel Corada',
    roleKey: 'team.members.carlos_corada.role',
    linkedin: 'https://www.linkedin.com/in/cmiguelcorada/',
    company: 'Fourvenues',
    image:
      'https://media.licdn.com/dms/image/v2/D4D03AQHyyaeT-6Yl9w/profile-displayphoto-scale_200_200/B4DZhCbA0tGkAY-/0/1753461034971?e=1768435200&v=beta&t=kbh2qr4dz8x--OFWKO-NHI5_oQ5gZ7ecvi6KVUyJ9NM',
  },
  {
    name: 'Carlos Moya Ortiz',
    roleKey: 'team.members.carlos_moya.role',
    linkedin: 'https://www.linkedin.com/in/csmoya/',
    company: 'Citibox',
    image:
      'https://media.licdn.com/dms/image/v2/D4D03AQFlA0E9MMqpMg/profile-displayphoto-scale_200_200/B4DZh6lhgiGsAY-/0/1754403314146?e=1768435200&v=beta&t=wzdmPHPfdN77N48oaOKhRaw9O-1fe_pJ70MfomkVRsY',
  },
  {
    name: 'Marta Cano',
    roleKey: 'team.members.marta.role',
    linkedin: 'https://www.linkedin.com/in/marta-cano-product/',
    image:
      'https://media.licdn.com/dms/image/v2/D4D03AQGtQnOD7QAGyA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1729705858366?e=1768435200&v=beta&t=pWhk2zoMJxRkxSy4lJIYilcovOaM_VEM-8G6447C6ss',
  },
  {
    name: 'Guille Songel',
    roleKey: 'team.members.guille.role',
    linkedin: 'https://www.linkedin.com/in/guillesongel/',
    image:
      'https://media.licdn.com/dms/image/v2/C4D03AQHFMFuUDbgkVA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1594752621754?e=1768435200&v=beta&t=Qlq52X3Pjpf-ERFD0dfhYgho3cNc5AVuistKt509o2o',
  },
  {
    name: 'Maribel Fernández',
    roleKey: 'team.members.maribel.role',
    linkedin: 'https://www.linkedin.com/in/maribel-fernandez/',
    image:
      'https://media.licdn.com/dms/image/v2/D4D03AQG2Oe8vekO7kg/profile-displayphoto-scale_200_200/B4DZkFuTgiIEAY-/0/1756737650372?e=1768435200&v=beta&t=q8WOlex1ycccrIZTjCon2Cmp9gXYGqa8ploAPnYv8Ck',
  },
];

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'landing' });
  const collaborators = await getActiveCollaborators();

  const roles = t.raw('hero.roles') as string[];

  const values = [
    { icon: Users, titleKey: 'values.community.title', descKey: 'values.community.description' },
    { icon: Lightbulb, titleKey: 'values.learning.title', descKey: 'values.learning.description' },
    { icon: Beer, titleKey: 'values.fun.title', descKey: 'values.fun.description' },
    { icon: Shield, titleKey: 'values.authenticity.title', descKey: 'values.authenticity.description' },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden relative">
      {/* Burbujas globales en toda la página */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <BeerBubbles quantity={50} minSize={6} maxSize={20} className="opacity-40" />
      </div>
      {/* ═══════════════════════════════════════════════════════════════════
          HERO - Estilo impactante con JK mascota
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
        {/* Fondo con gradientes animados - más dramáticos */}
        <div className="absolute inset-0">
          {/* Gradiente radial principal - más intenso */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/25 rounded-full blur-[150px] animate-pulse" />
          {/* Gradientes secundarios */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-yellow-600/10 rounded-full blur-[100px]" />
          {/* Overlay oscuro para más contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-28 pb-12">
          <div className="max-w-5xl mx-auto text-center">
            {/* Título principal gigante */}
            <FadeIn delay={0.1}>
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6">
                <span className="text-white">Product</span>
                <br />
                <AnimatedGradientText className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black" colorFrom="#eab308" colorTo="#f59e0b">
                  Beers
                </AnimatedGradientText>
              </h1>
            </FadeIn>

            {/* Subtítulo con roles rotativos */}
            <FadeIn delay={0.2}>
              <div className="flex flex-wrap items-center justify-center gap-x-3 text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8">
                <span>{t('hero.tagline')}</span>
                <WordRotate
                  className="text-primary font-bold"
                  words={roles}
                  duration={2000}
                />
                <span>{t('hero.taglineEnd')}</span>
              </div>
            </FadeIn>

            {/* Descripción */}
            <FadeIn delay={0.3}>
              <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                {t('hero.description')}
                <span className="text-primary font-semibold"> {t('hero.descriptionHighlight')}</span>.
              </p>
            </FadeIn>

            {/* CTAs grandes */}
            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Button size="lg" className="text-lg px-10 py-7 rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all group" asChild>
                  <a href={brand.social.telegram} target="_blank" rel="noopener noreferrer">
                    <Send className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    {t('hero.ctaTelegram')}
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl border-2 hover:bg-primary/5 transition-all" asChild>
                  <a href={brand.social.linkedin} target="_blank" rel="noopener noreferrer">
                    <LinkedInIcon className="mr-2 w-5 h-5" />
                    {t('hero.ctaLinkedin')}
                  </a>
                </Button>
              </div>
            </FadeIn>

            {/* JK Mascota con Parallax - Solo visible en desktop */}
            <FadeIn delay={0.5}>
              <div className="hidden md:block">
                <ParallaxMascot
                  src="/jk.svg"
                  alt="JK - Product Beers mascota"
                  width={380}
                  height={380}
                  className="animate-float"
                />
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PRÓXIMO EVENTO - Card destacada
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 relative bg-[#080808]">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="relative max-w-4xl mx-auto">
              {/* Card con border beam */}
              <div className="relative rounded-3xl border border-[#2a2a2a] bg-[#141414] p-8 md:p-12 overflow-hidden">
                <BorderBeam size={400} duration={15} colorFrom="#eab308" colorTo="#f59e0b" />

                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                  {/* Icono animado */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl animate-pulse" />
                      <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center">
                        <Calendar className="w-12 h-12 md:w-14 md:h-14 text-primary" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-semibold mb-3">
                      <Sparkles className="w-4 h-4" />
                      {t('nextEvent.badge')}
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-white">{t('nextEvent.title')}</h2>
                    <p className="text-gray-400 text-lg">
                      {t('nextEvent.description')}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <Button size="lg" className="rounded-2xl shadow-xl shadow-primary/20 px-8 py-6 text-lg group" asChild>
                      <a href={brand.social.telegram} target="_blank" rel="noopener noreferrer">
                        <Zap className="mr-2 w-5 h-5 group-hover:animate-pulse" />
                        {t('nextEvent.cta')}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          VALORES - Cards con hover effects
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-x-1/2" />

        <div className="container mx-auto px-4 relative">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">{t('values.title')}</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                {t('values.subtitle')}
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <FadeIn key={value.titleKey} delay={index * 0.1}>
                <div className="group relative p-8 rounded-3xl bg-[#141414] border border-[#2a2a2a] hover:border-primary/50 transition-all duration-500 text-center overflow-hidden hover:shadow-xl hover:shadow-primary/10">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{t(value.titleKey)}</h3>
                    <p className="text-gray-400 text-sm">{t(value.descKey)}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          EQUIPO - Grid moderno
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 relative bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">{t('team.title')}</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                {t('team.subtitle')}
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
                    {/* Glow ámbar detrás - más intenso */}
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
                  <p className="text-xs text-gray-500 mt-1">{t(member.roleKey)}</p>
                  {member.company && <p className="text-xs text-primary/60 mt-0.5">{member.company}</p>}
                </a>
              </FadeIn>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          COLABORADORES - Marquee de logos de sponsors y hosters
      ═══════════════════════════════════════════════════════════════════ */}
      {collaborators.length > 0 && (
        <section className="py-16 relative bg-[#080808] border-y border-[#1a1a1a]">
          <div className="container mx-auto px-4 mb-8">
            <FadeIn>
              <p className="text-center text-sm text-gray-500 uppercase tracking-wider mb-2">
                {t('collaborators.title')}
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.1}>
            <Marquee pauseOnHover className="[--duration:25s] [--gap:4rem]">
              {collaborators.map((collaborator) => (
                <a
                  key={collaborator.id}
                  href={collaborator.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-6 opacity-70 hover:opacity-100 transition-all duration-300"
                >
                  <Image
                    src={collaborator.logo_url}
                    alt={collaborator.name}
                    width={140}
                    height={50}
                    className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
                  />
                </a>
              ))}
            </Marquee>
          </FadeIn>

          <div className="container mx-auto px-4 mt-8">
            <FadeIn delay={0.2}>
              <div className="text-center">
                <Link
                  href={`/${locale}/colabora`}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
                >
                  <Heart className="w-4 h-4" />
                  {t('collaborators.cta')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          CTA FINAL - Impactante
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-t from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
        {/* Fondo dramático */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/25 rounded-full blur-[180px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white">
                {t('cta.title')} <span className="text-primary">{t('cta.titleHighlight')}</span>?
              </h2>
              <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
                {t('cta.subtitle')}
              </p>

              <Button
                size="lg"
                className="text-xl px-12 py-8 rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all group"
                asChild
              >
                <a href={brand.social.telegram} target="_blank" rel="noopener noreferrer">
                  {t('cta.button')}
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </a>
              </Button>

              <p className="mt-12 text-gray-500">
                {t('cta.footer')} <span className="text-primary font-semibold">{t('cta.footerBeer')}</span> {t('cta.footerAnd')} <span className="text-primary font-semibold">{t('cta.footerPassion')}</span>{' '}
                {t('cta.footerLocation')}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
