-- =============================================
-- Collaborators Table (Sponsors & Hosters)
-- =============================================
-- Gestión de sponsors y hosters de Product Beers
-- Administrables desde el panel de admin

CREATE TABLE collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sponsor', 'hoster')),
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- =============================================
-- Índices para Performance
-- =============================================

CREATE INDEX idx_collaborators_type ON collaborators(type);
CREATE INDEX idx_collaborators_active ON collaborators(is_active);
CREATE INDEX idx_collaborators_order ON collaborators(display_order);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- Política: Lectura pública para mostrar en landing
CREATE POLICY "Public can read active collaborators"
  ON collaborators
  FOR SELECT
  USING (is_active = true);

-- Política: Solo admins pueden gestionar collaborators
CREATE POLICY "Admins can manage collaborators"
  ON collaborators
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND 'admin' = ANY(user_flags)
    )
  );

-- Política: Service role tiene acceso completo
CREATE POLICY "Service role full access to collaborators"
  ON collaborators
  FOR ALL
  TO service_role
  USING (true);

-- =============================================
-- Trigger para updated_at
-- =============================================

CREATE TRIGGER update_collaborators_updated_at
  BEFORE UPDATE ON collaborators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Datos iniciales
-- =============================================

INSERT INTO collaborators (name, logo_url, website_url, type, is_active, display_order) VALUES
(
  'Escuela Escribano',
  '/colaboradores/escuela-escribano.svg',
  'https://www.escuelaescribano.com/',
  'hoster',
  true,
  1
),
(
  'NoCodeHackers',
  '/colaboradores/nocodehackers.png',
  'https://www.nocodehackers.es/',
  'hoster',
  true,
  2
);

-- Comentarios para documentación
COMMENT ON TABLE collaborators IS 'Sponsors and hosters for Product Beers events';
COMMENT ON COLUMN collaborators.type IS 'Type of collaborator: sponsor or hoster';
COMMENT ON COLUMN collaborators.is_active IS 'Whether to display this collaborator on the public site';
COMMENT ON COLUMN collaborators.display_order IS 'Order for displaying collaborators (lower first)';
