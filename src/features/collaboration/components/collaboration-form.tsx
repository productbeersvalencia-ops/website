'use client';

import { useActionState, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, Send, Building2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { submitCollaborationAction } from '../collaboration.actions';
import type { CollaborationType } from '../types';

interface CollaborationFormProps {
  defaultType?: CollaborationType;
}

export function CollaborationForm({ defaultType = 'sponsor' }: CollaborationFormProps) {
  const t = useTranslations('collaboration');
  const [selectedType, setSelectedType] = useState<CollaborationType>(defaultType);
  const [state, formAction, pending] = useActionState(submitCollaborationAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(t('form.successTitle'), {
        description: t('form.successDescription'),
      });
      // Reset form
      const form = document.getElementById('collaboration-form') as HTMLFormElement;
      form?.reset();
    }
    if (state?.error) {
      toast.error(t('form.errorTitle'), {
        description: state.error,
      });
    }
  }, [state, t]);

  return (
    <Card className="max-w-lg mx-auto bg-[#141414] border-[#2a2a2a]">
      <CardHeader>
        <CardTitle className="text-white">{t('form.title')}</CardTitle>
        <CardDescription className="text-gray-400">{t('form.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="collaboration-form" action={formAction} className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-3">
            <Label className="text-gray-300">{t('form.typeLabel')}</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedType('sponsor')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  selectedType === 'sponsor'
                    ? 'border-primary bg-primary/10'
                    : 'border-[#2a2a2a] hover:border-primary/50 bg-[#1a1a1a]'
                }`}
              >
                <Building2 className={`h-6 w-6 ${selectedType === 'sponsor' ? 'text-primary' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${selectedType === 'sponsor' ? 'text-primary' : 'text-gray-400'}`}>
                  {t('form.typeSponsor')}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('hoster')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  selectedType === 'hoster'
                    ? 'border-primary bg-primary/10'
                    : 'border-[#2a2a2a] hover:border-primary/50 bg-[#1a1a1a]'
                }`}
              >
                <MapPin className={`h-6 w-6 ${selectedType === 'hoster' ? 'text-primary' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${selectedType === 'hoster' ? 'text-primary' : 'text-gray-400'}`}>
                  {t('form.typeHoster')}
                </span>
              </button>
            </div>
            <input type="hidden" name="type" value={selectedType} />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">{t('form.name')}</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder={t('form.namePlaceholder')}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">{t('form.email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder={t('form.emailPlaceholder')}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-500"
            />
          </div>

          {/* Company (optional) */}
          <div className="space-y-2">
            <Label htmlFor="company" className="text-gray-300">
              {t('form.company')} <span className="text-gray-500 text-xs">({t('form.optional')})</span>
            </Label>
            <Input
              id="company"
              name="company"
              placeholder={t('form.companyPlaceholder')}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-500"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-300">{t('form.message')}</Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder={selectedType === 'sponsor' ? t('form.messagePlaceholderSponsor') : t('form.messagePlaceholderHoster')}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-500"
            />
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('form.sending')}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {t('form.submit')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
