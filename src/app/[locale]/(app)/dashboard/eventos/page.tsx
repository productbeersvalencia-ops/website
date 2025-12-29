import { requireUser } from '@/shared/auth';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface EventosPageProps {
  params: Promise<{ locale: string }>;
}

export default async function EventosPage({ params }: EventosPageProps) {
  const { locale } = await params;
  await requireUser(locale);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
          <p className="text-muted-foreground">
            Gestiona los eventos de Product Beers
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/dashboard/eventos/nuevo`}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo evento
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">
          No hay eventos todavía. Crea el primero.
        </p>
      </div>
    </div>
  );
}
