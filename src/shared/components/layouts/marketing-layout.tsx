'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { LinkedinIcon, Send } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { SkipLink } from '@/shared/components/ui/skip-link';
import { brand } from '@/shared/config';
import { useConsent } from '@/features/consent/hooks/use-consent';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  const t = useTranslations('layouts');
  const tConsent = useTranslations('consent');
  const locale = useLocale();
  const { openPreferences, isEnabled } = useConsent();

  return (
    <>
      <SkipLink />
      <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
        <header className="sticky top-0 z-50 w-full border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/80">
          <div className="container flex h-16 items-center">
            <div className="mr-4 flex flex-1 items-center">
              <Link href={`/${locale}`} className="mr-6 flex items-center space-x-3">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={40}
                  height={40}
                  className="rounded-lg brightness-0 invert"
                />
                <span className="hidden font-bold text-white sm:inline-block">
                  {brand.name}
                </span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                <Link
                  href={`/${locale}/eventos`}
                  className="text-gray-400 transition-colors duration-200 hover:text-white"
                >
                  {t('events')}
                </Link>
                <Link
                  href={`/${locale}/about`}
                  className="text-gray-400 transition-colors duration-200 hover:text-white"
                >
                  {t('about')}
                </Link>
                <Link
                  href={`/${locale}/colabora`}
                  className="text-gray-400 transition-colors duration-200 hover:text-white"
                >
                  {t('collaborate')}
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10" asChild>
                <a
                  href={brand.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Telegram</span>
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10" asChild>
                <a
                  href={brand.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <LinkedinIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
              </Button>
            </div>
          </div>
        </header>
        <main id="main-content" className="flex-1">{children}</main>
        <footer className="border-t border-[#1a1a1a] py-6 md:py-0 bg-[#0a0a0a]">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
            <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
              {brand.copyright}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}/colabora`}
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                {t('collaborate')}
              </Link>
              <Link
                href={`/${locale}/privacy`}
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                {tConsent('footer.privacy')}
              </Link>
              {isEnabled && (
                <button
                  onClick={openPreferences}
                  className="text-sm text-gray-500 hover:text-white transition-colors"
                >
                  {tConsent('footer.manageCookies')}
                </button>
              )}
              <Link
                href={`/${locale}/login`}
                className="text-sm text-gray-600 hover:text-white transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
