-- =============================================
-- Add is_read field to collaboration_requests
-- =============================================
-- Para tracking de mensajes leídos/no leídos en el dashboard

ALTER TABLE collaboration_requests
  ADD COLUMN is_read BOOLEAN DEFAULT false;

-- Índice para filtrar por leídos/no leídos
CREATE INDEX idx_collaboration_requests_is_read ON collaboration_requests(is_read);

-- Comentario para documentación
COMMENT ON COLUMN collaboration_requests.is_read IS 'Whether the message has been read by an admin';
