import { requireAdmin } from '@/shared/auth';
import { AdminLayout } from '@/features/admin';
import { getAdminStats } from '@/features/admin';

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  const stats = await getAdminStats();

  return (
    <AdminLayout user={{ id: user.id, email: user.email }}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Panel de administración de Product Beers
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Miembros"
            value={stats.totalUsers}
            description="Usuarios registrados"
          />
          <StatCard
            title="Eventos"
            value={stats.totalEvents}
            description="Eventos totales"
          />
          <StatCard
            title="Próximos"
            value={stats.upcomingEvents}
            description="Eventos programados"
          />
          <StatCard
            title="Sponsors"
            value={stats.totalSponsors}
            description="Colaboradores activos"
          />
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
          <div className="flex flex-wrap gap-2">
            <a
              href="/admin/collaborators"
              className="inline-flex items-center rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              Gestionar colaboradores
            </a>
            <a
              href="/dashboard/mensajes"
              className="inline-flex items-center rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              Ver mensajes
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
