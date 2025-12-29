import { requireUser } from '@/shared/auth';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface PonentesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PonentesPage({ params }: PonentesPageProps) {
  const { locale } = await params;
  await requireUser(locale);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ponentes</h1>
          <p className="text-muted-foreground">
            Gestiona los ponentes de Product Beers
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/dashboard/ponentes/nuevo`}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo ponente
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">
          No hay ponentes todavía. Añade el primero.
        </p>
      </div>
    </div>
  );
}
