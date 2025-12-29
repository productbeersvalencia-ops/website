'use client';

import { useState, useTransition, Fragment } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ExternalLink, ChevronDown, ChevronUp, User, Mail, Phone, StickyNote } from 'lucide-react';
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
import { Textarea } from '@/shared/components/ui/textarea';
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

interface SponsorsAdminProps {
  initialCollaborators: Collaborator[];
}

export function SponsorsAdmin({ initialCollaborators }: SponsorsAdminProps) {
  const t = useTranslations('dashboard-sponsors');
  const [collaborators, setCollaborators] = useState(initialCollaborators);
  const [filter, setFilter] = useState<'all' | 'sponsor' | 'hoster'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [deletingCollaborator, setDeletingCollaborator] = useState<Collaborator | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<CollaboratorInput>({
    name: '',
    logo_url: '',
    website_url: '',
    type: 'sponsor',
    is_active: true,
    display_order: 0,
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    notes: '',
  });

  const filteredCollaborators = collaborators.filter((c) =>
    filter === 'all' ? true : c.type === filter
  );

  const hasContactInfo = (c: Collaborator) =>
    c.contact_name || c.contact_email || c.contact_phone || c.notes;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
        contact_name: collaborator.contact_name || '',
        contact_email: collaborator.contact_email || '',
        contact_phone: collaborator.contact_phone || '',
        notes: collaborator.notes || '',
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
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        notes: '',
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
                c.id === editingCollaborator.id ? { ...c, ...formData } : c
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
                contact_name: formData.contact_name || null,
                contact_email: formData.contact_email || null,
                contact_phone: formData.contact_phone || null,
                notes: formData.notes || null,
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
                <Fragment key={collaborator.id}>
                  <TableRow
                    className={`cursor-pointer ${hasContactInfo(collaborator) ? 'hover:bg-muted/50' : ''}`}
                    onClick={() => hasContactInfo(collaborator) && toggleExpand(collaborator.id)}
                  >
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
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {collaborator.name}
                        {hasContactInfo(collaborator) && (
                          expandedId === collaborator.id
                            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        {new URL(collaborator.website_url).hostname}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
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
                          onClick={() => {
                            setDeletingCollaborator(collaborator);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* Expanded Contact Info Row */}
                  {expandedId === collaborator.id && hasContactInfo(collaborator) && (
                    <TableRow key={`${collaborator.id}-details`} className="bg-muted/30">
                      <TableCell colSpan={6} className="py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {collaborator.contact_name && (
                            <div className="flex items-start gap-2">
                              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">{t('form.contactName.label')}</p>
                                <p className="font-medium">{collaborator.contact_name}</p>
                              </div>
                            </div>
                          )}
                          {collaborator.contact_email && (
                            <div className="flex items-start gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">{t('form.contactEmail.label')}</p>
                                <a href={`mailto:${collaborator.contact_email}`} className="font-medium text-primary hover:underline">
                                  {collaborator.contact_email}
                                </a>
                              </div>
                            </div>
                          )}
                          {collaborator.contact_phone && (
                            <div className="flex items-start gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">{t('form.contactPhone.label')}</p>
                                <a href={`tel:${collaborator.contact_phone}`} className="font-medium text-primary hover:underline">
                                  {collaborator.contact_phone}
                                </a>
                              </div>
                            </div>
                          )}
                          {collaborator.notes && (
                            <div className="flex items-start gap-2 col-span-2 md:col-span-4">
                              <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">{t('form.notes.label')}</p>
                                <p className="whitespace-pre-wrap">{collaborator.notes}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCollaborator ? t('form.title.edit') : t('form.title.create')}
            </DialogTitle>
            <DialogDescription>
              {editingCollaborator ? editingCollaborator.name : ''}
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

            {/* Internal Contact Section */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium mb-3">{t('form.contactSection')}</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">{t('form.contactName.label')}</Label>
                  <Input
                    id="contact_name"
                    value={formData.contact_name || ''}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder={t('form.contactName.placeholder')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">{t('form.contactEmail.label')}</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email || ''}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      placeholder={t('form.contactEmail.placeholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">{t('form.contactPhone.label')}</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      value={formData.contact_phone || ''}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      placeholder={t('form.contactPhone.placeholder')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">{t('form.notes.label')}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={t('form.notes.placeholder')}
                    rows={3}
                  />
                </div>
              </div>
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

      {/* Delete Confirmation */}
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
