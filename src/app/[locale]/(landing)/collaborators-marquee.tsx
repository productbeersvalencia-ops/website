import { getActiveCollaborators } from '@/features/admin/admin.query';
import { CollaboratorsMarqueeClient } from './collaborators-marquee-client';

export async function CollaboratorsMarquee() {
  const collaborators = await getActiveCollaborators();

  if (collaborators.length === 0) {
    return null;
  }

  return <CollaboratorsMarqueeClient collaborators={collaborators} />;
}
