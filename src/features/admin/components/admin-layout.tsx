'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Info,
  ArrowLeft,
  Users,
  Shield,
  MessageSquare,
  Calendar,
  FileText,
  Image,
  Mic2,
  Building2,
  UsersRound,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

interface AdminLayoutProps {
  children: ReactNode;
  user: { id: string; email?: string };
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Eventos', href: '/admin/eventos', icon: Calendar },
  { name: 'Contenido', href: '/admin/contenido', icon: FileText },
  { name: 'Galería', href: '/admin/galeria', icon: Image },
  { name: 'Ponentes', href: '/admin/ponentes', icon: Mic2 },
  { name: 'Sponsors', href: '/admin/sponsors', icon: Building2 },
  { name: 'Equipo', href: '/admin/equipo', icon: UsersRound },
  { name: 'Comunidades', href: '/admin/comunidades', icon: Users },
  { name: 'Info-Bar', href: '/admin/info-bar', icon: Info },
  { name: 'Support', href: '/admin/support', icon: MessageSquare },
];

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-primary/5 backdrop-blur-sm">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-primary/10 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Admin Panel</h2>
            </div>
            <Badge variant="secondary" className="text-xs">
              {user.email}
            </Badge>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-primary/10'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Back to Dashboard */}
          <div className="border-t border-primary/10 p-4">
            <Button variant="ghost" asChild className="w-full justify-start hover:bg-primary/10">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to App
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
