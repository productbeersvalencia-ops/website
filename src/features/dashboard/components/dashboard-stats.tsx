'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Users, Calendar, CalendarClock, CalendarCheck, Mic2, Building2, Plus } from 'lucide-react';
import type { DashboardStats } from '../types';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsProps) {
  const locale = useLocale();

  const statCards = [
    {
      label: 'Miembros',
      value: stats.totalUsers?.toLocaleString() || '0',
      icon: Users,
      description: 'Usuarios registrados',
    },
    {
      label: 'Eventos totales',
      value: stats.totalEvents?.toLocaleString() || '0',
      icon: Calendar,
      description: 'Todos los eventos',
      href: `/${locale}/dashboard/eventos`,
    },
    {
      label: 'Próximos eventos',
      value: stats.upcomingEvents?.toLocaleString() || '0',
      icon: CalendarClock,
      description: 'Eventos programados',
      href: `/${locale}/dashboard/eventos`,
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
      href: `/${locale}/dashboard/ponentes`,
    },
    {
      label: 'Sponsors',
      value: stats.totalSponsors?.toLocaleString() || '0',
      icon: Building2,
      description: 'Sponsors activos',
      href: `/${locale}/dashboard/sponsors`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button asChild>
          <Link href={`/${locale}/dashboard/eventos/nuevo`}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo evento
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const cardContent = (
            <Card className={stat.href ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
          );

          if (stat.href) {
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="block transition-transform hover:scale-[1.02]"
              >
                {cardContent}
              </Link>
            );
          }

          return <div key={stat.label}>{cardContent}</div>;
        })}
      </div>
    </div>
  );
}
