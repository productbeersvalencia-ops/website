import { requireUser } from '@/shared/auth';
import { getAllCollaborators } from '@/features/admin/admin.query';
import { SponsorsAdmin } from './sponsors-admin';

export default async function SponsorsPage() {
  await requireUser();

  const collaborators = await getAllCollaborators();

  return <SponsorsAdmin initialCollaborators={collaborators} />;
}
