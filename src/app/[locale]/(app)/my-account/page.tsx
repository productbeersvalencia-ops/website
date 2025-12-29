import { getTranslations } from 'next-intl/server';
import { ProfileForm, getProfileAction } from '@/features/my-account';
import { requireUser } from '@/shared/auth';

interface MyAccountPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MyAccountPage({ params }: MyAccountPageProps) {
  const { locale } = await params;
  const t = await getTranslations('myAccount');
  await requireUser(locale);
  const { profile } = await getProfileAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
      </div>

      {/* Profile Section */}
      <ProfileForm profile={profile} />
    </div>
  );
}
