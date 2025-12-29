import { getTranslations } from 'next-intl/server';
import { ColaboraHero } from './colabora-hero';
import { ColaboraSponsor } from './colabora-sponsor';
import { ColaboraHoster } from './colabora-hoster';
import { ColaboraCTA } from './colabora-cta';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'colabora' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function ColaboraPage() {
  return (
    <>
      <ColaboraHero />
      <ColaboraSponsor />
      <ColaboraHoster />
      <ColaboraCTA />
    </>
  );
}
