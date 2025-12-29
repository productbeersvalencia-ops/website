import { z } from 'zod';

/**
 * Collaboration Request Types
 */

export const collaborationTypeSchema = z.enum(['sponsor', 'hoster']);
export type CollaborationType = z.infer<typeof collaborationTypeSchema>;

export const collaborationStatusSchema = z.enum(['pending', 'contacted', 'accepted', 'rejected']);
export type CollaborationStatus = z.infer<typeof collaborationStatusSchema>;

export const collaborationRequestSchema = z.object({
  type: collaborationTypeSchema,
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  company: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

export type CollaborationRequestInput = z.infer<typeof collaborationRequestSchema>;

export interface CollaborationRequest {
  id: string;
  type: CollaborationType;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: CollaborationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const updateCollaborationStatusSchema = z.object({
  id: z.string().uuid(),
  status: collaborationStatusSchema,
  notes: z.string().optional(),
});

export type UpdateCollaborationStatusInput = z.infer<typeof updateCollaborationStatusSchema>;
