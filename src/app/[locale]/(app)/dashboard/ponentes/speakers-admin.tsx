'use client';

import { useState, useTransition, Fragment, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  StickyNote,
  Linkedin,
  Twitter,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import type { Speaker, SpeakerInput } from '@/features/admin/types';
import {
  createSpeakerAction,
  updateSpeakerAction,
  toggleSpeakerAction,
  deleteSpeakerAction,
} from '@/features/admin/admin.actions';

interface SpeakersAdminProps {
  initialSpeakers: Speaker[];
}

export function SpeakersAdmin({ initialSpeakers }: SpeakersAdminProps) {
  const t = useTranslations('dashboard-ponentes');
  const [speakers, setSpeakers] = useState(initialSpeakers);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [deletingSpeaker, setDeletingSpeaker] = useState<Speaker | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [topicInput, setTopicInput] = useState('');

  const [formData, setFormData] = useState<SpeakerInput>({
    name: '',
    position: '',
    company: '',
    email: '',
    phone: '',
    topics: [],
    bio: '',
    photo_url: '',
    linkedin_url: '',
    twitter_url: '',
    notes: '',
    is_active: true,
  });

  // Get all unique topics from speakers
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    speakers.forEach((s) => s.topics?.forEach((topic) => topics.add(topic)));
    return Array.from(topics).sort();
  }, [speakers]);

  // Filter speakers
  const filteredSpeakers = useMemo(() => {
    return speakers.filter((s) => {
      // Status filter
      if (filter === 'active' && !s.is_active) return false;
      if (filter === 'inactive' && s.is_active) return false;

      // Topic filter
      if (topicFilter && !s.topics?.includes(topicFilter)) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesCompany = s.company?.toLowerCase().includes(query);
        const matchesPosition = s.position?.toLowerCase().includes(query);
        const matchesTopics = s.topics?.some((topic) =>
          topic.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesCompany && !matchesPosition && !matchesTopics) {
          return false;
        }
      }

      return true;
    });
  }, [speakers, filter, topicFilter, searchQuery]);

  const hasDetailInfo = (s: Speaker) =>
    s.email || s.phone || s.bio || s.linkedin_url || s.twitter_url || s.notes;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleOpenForm = (speaker?: Speaker) => {
    if (speaker) {
      setEditingSpeaker(speaker);
      setFormData({
        name: speaker.name,
        position: speaker.position || '',
        company: speaker.company || '',
        email: speaker.email || '',
        phone: speaker.phone || '',
        topics: speaker.topics || [],
        bio: speaker.bio || '',
        photo_url: speaker.photo_url || '',
        linkedin_url: speaker.linkedin_url || '',
        twitter_url: speaker.twitter_url || '',
        notes: speaker.notes || '',
        is_active: speaker.is_active,
      });
    } else {
      setEditingSpeaker(null);
      setFormData({
        name: '',
        position: '',
        company: '',
        email: '',
        phone: '',
        topics: [],
        bio: '',
        photo_url: '',
        linkedin_url: '',
        twitter_url: '',
        notes: '',
        is_active: true,
      });
    }
    setTopicInput('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSpeaker(null);
    setTopicInput('');
  };

  const handleAddTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && topicInput.trim()) {
      e.preventDefault();
      const newTopic = topicInput.trim();
      if (!formData.topics.includes(newTopic)) {
        setFormData({ ...formData, topics: [...formData.topics, newTopic] });
      }
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter((t) => t !== topic),
    });
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        if (editingSpeaker) {
          const result = await updateSpeakerAction(editingSpeaker.id, formData);
          if (result.success) {
            setSpeakers((prev) =>
              prev.map((s) =>
                s.id === editingSpeaker.id
                  ? { ...s, ...formData, topics: formData.topics }
                  : s
              )
            );
            toast.success(t('messages.updated'));
            handleCloseForm();
          } else {
            toast.error(result.error || t('messages.error'));
          }
        } else {
          const result = await createSpeakerAction(formData);
          if (result.success && result.data) {
            setSpeakers((prev) => [
              ...prev,
              {
                ...formData,
                id: result.data.id,
                topics: formData.topics,
                position: formData.position || null,
                company: formData.company || null,
                email: formData.email || null,
                phone: formData.phone || null,
                bio: formData.bio || null,
                photo_url: formData.photo_url || null,
                linkedin_url: formData.linkedin_url || null,
                twitter_url: formData.twitter_url || null,
                notes: formData.notes || null,
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

  const handleToggleActive = (speaker: Speaker) => {
    startTransition(async () => {
      const newActive = !speaker.is_active;
      const result = await toggleSpeakerAction(speaker.id, newActive);
      if (result.success) {
        setSpeakers((prev) =>
          prev.map((s) =>
            s.id === speaker.id ? { ...s, is_active: newActive } : s
          )
        );
        toast.success(newActive ? t('messages.activated') : t('messages.deactivated'));
      } else {
        toast.error(result.error || t('messages.error'));
      }
    });
  };

  const handleDelete = () => {
    if (!deletingSpeaker) return;

    startTransition(async () => {
      const result = await deleteSpeakerAction(deletingSpeaker.id);
      if (result.success) {
        setSpeakers((prev) => prev.filter((s) => s.id !== deletingSpeaker.id));
        toast.success(t('messages.deleted'));
        setIsDeleteDialogOpen(false);
        setDeletingSpeaker(null);
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">{t('filters.all')}</TabsTrigger>
            <TabsTrigger value="active">{t('filters.active')}</TabsTrigger>
            <TabsTrigger value="inactive">{t('filters.inactive')}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('filters.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {allTopics.length > 0 && (
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('filters.topicsPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('filters.all')}</SelectItem>
                {allTopics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Table */}
      {filteredSpeakers.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <p className="text-lg font-medium">{t('empty.title')}</p>
          <p className="text-muted-foreground">{t('empty.description')}</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{t('table.photo')}</TableHead>
                <TableHead>{t('table.name')}</TableHead>
                <TableHead>{t('table.position')}</TableHead>
                <TableHead>{t('table.company')}</TableHead>
                <TableHead>{t('table.topics')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead className="text-right">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSpeakers.map((speaker) => (
                <Fragment key={speaker.id}>
                  <TableRow
                    className={`cursor-pointer ${hasDetailInfo(speaker) ? 'hover:bg-muted/50' : ''}`}
                    onClick={() => hasDetailInfo(speaker) && toggleExpand(speaker.id)}
                  >
                    <TableCell>
                      <div className="relative w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                        {speaker.photo_url ? (
                          <Image
                            src={speaker.photo_url}
                            alt={speaker.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {speaker.name}
                        {hasDetailInfo(speaker) && (
                          expandedId === speaker.id
                            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {speaker.position || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {speaker.company || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {speaker.topics?.slice(0, 2).map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {speaker.topics && speaker.topics.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{speaker.topics.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Switch
                          checked={speaker.is_active}
                          onCheckedChange={() => handleToggleActive(speaker)}
                          disabled={isPending}
                        />
                        <span className={speaker.is_active ? 'text-green-600' : 'text-muted-foreground'}>
                          {speaker.is_active ? t('status.active') : t('status.inactive')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenForm(speaker)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setDeletingSpeaker(speaker);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* Expanded Detail Row */}
                  {expandedId === speaker.id && hasDetailInfo(speaker) && (
                    <TableRow key={`${speaker.id}-details`} className="bg-muted/30">
                      <TableCell colSpan={7} className="py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {speaker.email && (
                            <div className="flex items-start gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">{t('detail.contact')}</p>
                                <a href={`mailto:${speaker.email}`} className="font-medium text-primary hover:underline">
                                  {speaker.email}
                                </a>
                              </div>
                            </div>
                          )}
                          {speaker.phone && (
                            <div className="flex items-start gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">{t('form.phone.label')}</p>
                                <a href={`tel:${speaker.phone}`} className="font-medium text-primary hover:underline">
                                  {speaker.phone}
                                </a>
                              </div>
                            </div>
                          )}
                          {(speaker.linkedin_url || speaker.twitter_url) && (
                            <div className="flex items-start gap-2">
                              <div className="flex gap-2">
                                {speaker.linkedin_url && (
                                  <a
                                    href={speaker.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80"
                                  >
                                    <Linkedin className="h-5 w-5" />
                                  </a>
                                )}
                                {speaker.twitter_url && (
                                  <a
                                    href={speaker.twitter_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80"
                                  >
                                    <Twitter className="h-5 w-5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                          {speaker.bio && (
                            <div className="flex items-start gap-2 col-span-2 md:col-span-4">
                              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">{t('detail.bio')}</p>
                                <p className="whitespace-pre-wrap">{speaker.bio}</p>
                              </div>
                            </div>
                          )}
                          {speaker.notes && (
                            <div className="flex items-start gap-2 col-span-2 md:col-span-4">
                              <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">{t('detail.notes')}</p>
                                <p className="whitespace-pre-wrap text-muted-foreground">{speaker.notes}</p>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSpeaker ? t('form.title.edit') : t('form.title.create')}
            </DialogTitle>
            <DialogDescription>
              {editingSpeaker ? editingSpeaker.name : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <p className="text-sm font-medium">{t('form.basicInfo')}</p>

              <div className="space-y-2">
                <Label htmlFor="name">{t('form.name.label')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('form.name.placeholder')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">{t('form.position.label')}</Label>
                  <Input
                    id="position"
                    value={formData.position || ''}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder={t('form.position.placeholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">{t('form.company.label')}</Label>
                  <Input
                    id="company"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={t('form.company.placeholder')}
                  />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="border-t pt-4 space-y-4">
              <p className="text-sm font-medium">{t('form.contactInfo')}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('form.email.label')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('form.email.placeholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('form.phone.label')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t('form.phone.placeholder')}
                  />
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="border-t pt-4 space-y-4">
              <p className="text-sm font-medium">{t('form.profileInfo')}</p>

              <div className="space-y-2">
                <Label htmlFor="photo_url">{t('form.photoUrl.label')}</Label>
                <Input
                  id="photo_url"
                  value={formData.photo_url || ''}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder={t('form.photoUrl.placeholder')}
                />
                <p className="text-xs text-muted-foreground">{t('form.photoUrl.help')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{t('form.bio.label')}</Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder={t('form.bio.placeholder')}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topics">{t('form.topics.label')}</Label>
                <Input
                  id="topics"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={handleAddTopic}
                  placeholder={t('form.topics.placeholder')}
                />
                <p className="text-xs text-muted-foreground">{t('form.topics.help')}</p>
                {formData.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="gap-1">
                        {topic}
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(topic)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Social Links Section */}
            <div className="border-t pt-4 space-y-4">
              <p className="text-sm font-medium">{t('form.socialLinks')}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">{t('form.linkedinUrl.label')}</Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url || ''}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder={t('form.linkedinUrl.placeholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter_url">{t('form.twitterUrl.label')}</Label>
                  <Input
                    id="twitter_url"
                    value={formData.twitter_url || ''}
                    onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                    placeholder={t('form.twitterUrl.placeholder')}
                  />
                </div>
              </div>
            </div>

            {/* Internal Notes Section */}
            <div className="border-t pt-4 space-y-4">
              <p className="text-sm font-medium">{t('form.internalNotes')}</p>

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

            {/* Status */}
            <div className="border-t pt-4">
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
