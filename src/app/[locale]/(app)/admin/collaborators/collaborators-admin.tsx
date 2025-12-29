'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ExternalLink, Check, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
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
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import type { Collaborator, CollaboratorInput } from '@/features/admin/types';
import {
  createCollaboratorAction,
  updateCollaboratorAction,
  toggleCollaboratorAction,
  deleteCollaboratorAction,
} from '@/features/admin/admin.actions';

interface CollaboratorsAdminProps {
  initialCollaborators: Collaborator[];
}

export function CollaboratorsAdmin({ initialCollaborators }: CollaboratorsAdminProps) {
  const t = useTranslations('admin-collaborators');
  const [collaborators, setCollaborators] = useState(initialCollaborators);
  const [filter, setFilter] = useState<'all' | 'sponsor' | 'hoster'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [deletingCollaborator, setDeletingCollaborator] = useState<Collaborator | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [formData, setFormData] = useState<CollaboratorInput>({
    name: '',
    logo_url: '',
    website_url: '',
    type: 'sponsor',
    is_active: true,
    display_order: 0,
  });

  const filteredCollaborators = collaborators.filter((c) =>
    filter === 'all' ? true : c.type === filter
  );

  const handleOpenForm = (collaborator?: Collaborator) => {
    if (collaborator) {
      setEditingCollaborator(collaborator);
      setFormData({
        name: collaborator.name,
        logo_url: collaborator.logo_url,
        website_url: collaborator.website_url,
        type: collaborator.type,
        is_active: collaborator.is_active,
        display_order: collaborator.display_order,
      });
    } else {
      setEditingCollaborator(null);
      setFormData({
        name: '',
        logo_url: '',
        website_url: '',
        type: 'sponsor',
        is_active: true,
        display_order: collaborators.length,
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCollaborator(null);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        if (editingCollaborator) {
          const result = await updateCollaboratorAction(editingCollaborator.id, formData);
          if (result.success) {
            setCollaborators((prev) =>
              prev.map((c) =>
                c.id === editingCollaborator.id
                  ? { ...c, ...formData }
                  : c
              )
            );
            toast.success(t('messages.updated'));
            handleCloseForm();
          } else {
            toast.error(result.error || t('messages.error'));
          }
        } else {
          const result = await createCollaboratorAction(formData);
          if (result.success && result.data) {
            setCollaborators((prev) => [
              ...prev,
              {
                ...formData,
                id: result.data.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                created_by: null,
                updated_by: null,
              },
            ]);
            toast.success(t('messages.created'));
            handleCloseForm();
          } else {
            toast.error(result.error || t('messages.error'));
          }
        }
      } catch {
        toast.error(t('messages.error'));
      }
    });
  };

  const handleToggleActive = (collaborator: Collaborator) => {
    startTransition(async () => {
      const newActive = !collaborator.is_active;
      const result = await toggleCollaboratorAction(collaborator.id, newActive);
      if (result.success) {
        setCollaborators((prev) =>
          prev.map((c) =>
            c.id === collaborator.id ? { ...c, is_active: newActive } : c
          )
        );
        toast.success(newActive ? t('messages.activated') : t('messages.deactivated'));
      } else {
        toast.error(result.error || t('messages.error'));
      }
    });
  };

  const handleDelete = () => {
    if (!deletingCollaborator) return;

    startTransition(async () => {
      const result = await deleteCollaboratorAction(deletingCollaborator.id);
      if (result.success) {
        setCollaborators((prev) =>
          prev.filter((c) => c.id !== deletingCollaborator.id)
        );
        toast.success(t('messages.deleted'));
        setIsDeleteDialogOpen(false);
        setDeletingCollaborator(null);
      } else {
        toast.error(result.error || t('messages.error'));
      }
    });
  };

  const openDeleteDialog = (collaborator: Collaborator) => {
    setDeletingCollaborator(collaborator);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addNew')}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">{t('tabs.all')}</TabsTrigger>
          <TabsTrigger value="sponsor">{t('tabs.sponsors')}</TabsTrigger>
          <TabsTrigger value="hoster">{t('tabs.hosters')}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      {filteredCollaborators.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <p className="text-lg font-medium">{t('empty.title')}</p>
          <p className="text-muted-foreground">{t('empty.description')}</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{t('table.logo')}</TableHead>
                <TableHead>{t('table.name')}</TableHead>
                <TableHead>{t('table.type')}</TableHead>
                <TableHead>{t('table.website')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead className="text-right">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollaborators.map((collaborator) => (
                <TableRow key={collaborator.id}>
                  <TableCell>
                    <div className="relative w-10 h-10 bg-muted rounded flex items-center justify-center overflow-hidden">
                      {collaborator.logo_url ? (
                        <Image
                          src={collaborator.logo_url}
                          alt={collaborator.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No logo
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{collaborator.name}</TableCell>
                  <TableCell>
                    <Badge variant={collaborator.type === 'sponsor' ? 'default' : 'secondary'}>
                      {t(`type.${collaborator.type}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={collaborator.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {new URL(collaborator.website_url).hostname}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={collaborator.is_active}
                        onCheckedChange={() => handleToggleActive(collaborator)}
                        disabled={isPending}
                      />
                      <span className={collaborator.is_active ? 'text-green-600' : 'text-muted-foreground'}>
                        {collaborator.is_active ? t('status.active') : t('status.inactive')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenForm(collaborator)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(collaborator)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCollaborator ? t('form.title.edit') : t('form.title.create')}
            </DialogTitle>
            <DialogDescription>
              {editingCollaborator
                ? `Editing ${editingCollaborator.name}`
                : 'Add a new sponsor or hoster'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('form.name.label')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('form.name.placeholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">{t('form.logoUrl.label')}</Label>
              <Input
                id="logo_url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder={t('form.logoUrl.placeholder')}
              />
              <p className="text-xs text-muted-foreground">{t('form.logoUrl.help')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">{t('form.websiteUrl.label')}</Label>
              <Input
                id="website_url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder={t('form.websiteUrl.placeholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t('form.type.label')}</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as 'sponsor' | 'hoster' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('form.type.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sponsor">{t('type.sponsor')}</SelectItem>
                  <SelectItem value="hoster">{t('type.hoster')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">{t('form.displayOrder.label')}</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">{t('form.displayOrder.help')}</p>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                {t('form.isActive.label')}
                <span className="block text-xs text-muted-foreground">
                  {t('form.isActive.description')}
                </span>
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseForm}>
              {t('form.cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? t('form.saving') : t('form.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDelete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDelete.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('confirmDelete.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {t('confirmDelete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
