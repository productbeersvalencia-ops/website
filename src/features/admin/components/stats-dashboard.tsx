'use client';

import { Users, Calendar, CalendarCheck, CalendarClock, Mic2, Building2 } from 'lucide-react';
import type { AdminStats } from '../types';

interface StatsDashboardProps {
  stats: AdminStats;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const statCards = [
    {
      label: 'Miembros',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: 'Usuarios registrados',
    },
    {
      label: 'Eventos totales',
      value: stats.totalEvents?.toLocaleString() || '0',
      icon: Calendar,
      description: 'Todos los eventos',
    },
    {
      label: 'Próximos eventos',
      value: stats.upcomingEvents?.toLocaleString() || '0',
      icon: CalendarClock,
      description: 'Eventos programados',
    },
    {
      label: 'Eventos pasados',
      value: stats.pastEvents?.toLocaleString() || '0',
      icon: CalendarCheck,
      description: 'Eventos realizados',
    },
    {
      label: 'Ponentes',
      value: stats.totalSpeakers?.toLocaleString() || '0',
      icon: Mic2,
      description: 'Ponentes registrados',
    },
    {
      label: 'Sponsors',
      value: stats.totalSponsors?.toLocaleString() || '0',
      icon: Building2,
      description: 'Sponsors activos',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </div>
            <stat.icon className="h-10 w-10 text-muted-foreground opacity-50" />
          </div>
        </div>
      ))}
    </div>
  );
}
