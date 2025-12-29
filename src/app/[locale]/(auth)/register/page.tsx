import { redirect } from 'next/navigation';

interface RegisterPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  // Registration is disabled - redirect to login
  redirect(`/${locale}/login`);
}
