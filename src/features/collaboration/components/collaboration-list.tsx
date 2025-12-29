'use client';

import { useActionState, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Mail, Building2, Calendar, MessageSquare, MoreHorizontal, Trash2, Check, X, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import type { CollaborationRequest, CollaborationStatus } from '../types';
import { updateCollaborationStatusAction, deleteCollaborationAction } from '../collaboration.actions';

interface CollaborationListProps {
  requests: CollaborationRequest[];
}

const statusConfig: Record<CollaborationStatus, { color: string; icon: React.ReactNode }> = {
  pending: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: <Clock className="w-3 h-3" /> },
  contacted: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: <Mail className="w-3 h-3" /> },
  accepted: { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: <XCircle className="w-3 h-3" /> },
};

export function CollaborationList({ requests: initialRequests }: CollaborationListProps) {
  const t = useTranslations('messages');
  const [requests, setRequests] = useState(initialRequests);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updateState, updateAction, isPendingUpdate] = useActionState(updateCollaborationStatusAction, null);
  const [deleteState, deleteAction, isPendingDelete] = useActionState(deleteCollaborationAction, null);

  useEffect(() => {
    if (updateState?.success) {
      toast.success(t('statusUpdated'));
    } else if (updateState?.error) {
      toast.error(updateState.error);
    }
  }, [updateState, t]);

  useEffect(() => {
    if (deleteState?.success) {
      toast.success(t('deleted'));
      setRequests(prev => prev.filter(r => r.id !== deleteId));
      setDeleteId(null);
    } else if (deleteState?.error) {
      toast.error(deleteState.error);
    }
  }, [deleteState, deleteId, t]);

  const handleStatusChange = (id: string, status: CollaborationStatus) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('status', status);
    updateAction(formData);

    // Optimistic update
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const formData = new FormData();
    formData.append('id', deleteId);
    deleteAction(formData);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageSquare className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('empty.title')}</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            {t('empty.description')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id} className="relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${request.type === 'sponsor' ? 'bg-primary' : 'bg-blue-500'}`} />

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={request.type === 'sponsor' ? 'border-primary/30 text-primary' : 'border-blue-500/30 text-blue-500'}>
                      {t(`type.${request.type}`)}
                    </Badge>
                    <Badge variant="outline" className={statusConfig[request.status].color}>
                      {statusConfig[request.status].icon}
                      <span className="ml-1">{t(`status.${request.status}`)}</span>
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{request.name}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <a href={`mailto:${request.email}`} className="hover:underline">{request.email}</a>
                    </span>
                    {request.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {request.company}
                      </span>
                    )}
                  </CardDescription>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">{t('actions')}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange(request.id, 'contacted')} disabled={isPendingUpdate}>
                      <Mail className="w-4 h-4 mr-2" />
                      {t('markContacted')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(request.id, 'accepted')} disabled={isPendingUpdate}>
                      <Check className="w-4 h-4 mr-2" />
                      {t('markAccepted')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(request.id, 'rejected')} disabled={isPendingUpdate}>
                      <X className="w-4 h-4 mr-2" />
                      {t('markRejected')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setDeleteId(request.id)} className="text-destructive focus:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{request.message}</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {formatDate(request.created_at)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirm.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteConfirm.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('deleteConfirm.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPendingDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isPendingDelete ? t('deleteConfirm.deleting') : t('deleteConfirm.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
