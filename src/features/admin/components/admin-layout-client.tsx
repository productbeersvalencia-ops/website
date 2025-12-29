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
  Handshake,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Calendar,
  FileText,
  Image,
  Mic2,
  Building2,
  UsersRound,
  Users,
  MessageSquare,
  Info,
  Handshake,
};

export interface NavItem {
  name: string;
  href: string;
  icon: keyof typeof iconMap;
  badge?: number;
}

interface AdminLayoutClientProps {
  children: ReactNode;
  navigation: NavItem[];
  user: { id: string; email?: string };
  title: string;
  backLabel: string;
}

/**
 * Client Component for AdminLayout
 * - Handles pathname detection for active state
 * - Renders navigation with badges
 */
export function AdminLayoutClient({
  children,
  navigation,
  user,
  title,
  backLabel,
}: AdminLayoutClientProps) {
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
              <h2 className="text-lg font-bold">{title}</h2>
            </div>
            <Badge variant="secondary" className="text-xs">
              {user.email}
            </Badge>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = iconMap[item.icon];
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
                  {Icon && <Icon className="h-4 w-4" />}
                  <span className="flex-1">{item.name}</span>

                  {/* Badge for pending items */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className={cn(
                        "h-5 min-w-5 px-1.5 text-xs font-bold",
                        isActive && "bg-white text-primary"
                      )}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Back to Dashboard */}
          <div className="border-t border-primary/10 p-4">
            <Button variant="ghost" asChild className="w-full justify-start hover:bg-primary/10">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backLabel}
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
