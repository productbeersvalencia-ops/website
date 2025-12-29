'use client';

import { useActionState, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { getErrorMessage } from '@/shared/errors';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { BlurFade } from '@/shared/components/ui/blur-fade';

import { loginAction, magicLinkAction } from '../auth.actions';
import { PasswordInput } from './password-input';

const MAX_LOGIN_ATTEMPTS = 2;

/**
 * Login-only component without registration tabs
 * Used when registration is disabled (e.g., admin-only access)
 */
export function LoginOnly() {
  const t = useTranslations('auth');
  const locale = useLocale();

  // Auto magic link state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [autoMagicLinkSent, setAutoMagicLinkSent] = useState(false);
  const [sendingMagicLink, setSendingMagicLink] = useState(false);

  // Login form state
  const [loginState, loginFormAction, loginPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      formData.append('locale', locale);
      const email = formData.get('email') as string;
      setLoginEmail(email);
      return loginAction(prevState as null, formData);
    },
    null
  );

  // Handle failed login attempts - send magic link after MAX_LOGIN_ATTEMPTS
  useEffect(() => {
    if (loginState?.error && loginEmail) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS && !autoMagicLinkSent) {
        setSendingMagicLink(true);
        const formData = new FormData();
        formData.append('email', loginEmail);

        magicLinkAction(null, formData).then((result) => {
          setSendingMagicLink(false);
          if (result.success) {
            setAutoMagicLinkSent(true);
          }
        });
      }
    }
  }, [loginState?.error]);

  // Reset attempts when email changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== loginEmail) {
      setFailedAttempts(0);
      setAutoMagicLinkSent(false);
    }
  };

  return (
    <BlurFade delay={0.1}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('adminLogin')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('adminLoginDescription')}
          </p>
        </div>

        <form action={loginFormAction} className="space-y-4">
          {/* Show auto magic link success message */}
          {autoMagicLinkSent && (
            <div
              className="text-sm text-green-600 bg-green-50 dark:bg-green-950/50 dark:text-green-400 p-3 rounded-md"
              role="alert"
            >
              {t('autoMagicLinkSent', { email: loginEmail })}
            </div>
          )}

          {/* Show error only if magic link wasn't sent */}
          {loginState?.error && !autoMagicLinkSent && (
            <div
              className="text-sm text-destructive bg-destructive/10 p-3 rounded-md"
              role="alert"
            >
              {getErrorMessage(loginState.error.code, locale)}
              {failedAttempts >= 1 && (
                <span className="block mt-1 text-xs">
                  {t('tryResetPassword')}{' '}
                  <Link
                    href={`/${locale}/reset-password`}
                    className="underline hover:text-primary"
                  >
                    {t('forgotPassword')}
                  </Link>
                </span>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="login-email">{t('email')}</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
              autoFocus
              onChange={handleEmailChange}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">{t('password')}</Label>
              <Link
                href={`/${locale}/reset-password`}
                className="text-xs text-muted-foreground hover:text-primary"
              >
                {t('forgotPassword')}
              </Link>
            </div>
            <PasswordInput
              id="login-password"
              name="password"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" name="remember" defaultChecked />
            <Label
              htmlFor="remember"
              className="text-sm font-normal text-muted-foreground"
            >
              {t('rememberMe')}
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loginPending || sendingMagicLink || autoMagicLinkSent}
          >
            {loginPending || sendingMagicLink ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {sendingMagicLink ? t('sendingMagicLink') : t('loggingIn')}
              </>
            ) : autoMagicLinkSent ? (
              t('checkEmail')
            ) : (
              t('login')
            )}
          </Button>

          <div className="text-center">
            <Link
              href={`/${locale}/magic-link`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {t('loginWithMagicLink')}
            </Link>
          </div>
        </form>
      </div>
    </BlurFade>
  );
}
