import { requireAdmin } from '@/shared/auth';
import { getAllCollaborators } from '@/features/admin/admin.query';
import { CollaboratorsAdmin } from './collaborators-admin';

export default async function AdminCollaboratorsPage() {
  await requireAdmin();

  const collaborators = await getAllCollaborators();

  return <CollaboratorsAdmin initialCollaborators={collaborators} />;
}
