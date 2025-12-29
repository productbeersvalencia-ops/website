-- =============================================
-- Speakers Table (Ponentes)
-- =============================================
-- Gestión interna de ponentes para Product Beers
-- NO se muestra públicamente por ahora, solo admin

-- Tabla principal de ponentes
CREATE TABLE speakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Datos básicos
  name TEXT NOT NULL,
  position TEXT,                    -- Puesto/cargo
  company TEXT,                     -- Empresa

  -- Contacto
  email TEXT,
  phone TEXT,

  -- Información adicional
  topics TEXT[],                    -- Array de temas que domina
  bio TEXT,                         -- Biografía corta
  photo_url TEXT,                   -- Foto del ponente
  linkedin_url TEXT,                -- Perfil de LinkedIn
  twitter_url TEXT,                 -- Perfil de Twitter/X

  -- Notas internas
  notes TEXT,

  -- Estado
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Tabla de ponencias (talks) - relaciona ponentes con eventos
CREATE TABLE speaker_talks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  speaker_id UUID REFERENCES speakers(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,  -- Puede ser null si evento aún no existe

  -- Datos de la ponencia
  title TEXT NOT NULL,              -- Título de la ponencia
  description TEXT,                 -- Descripción/resumen
  talk_date DATE,                   -- Fecha de la ponencia
  duration_minutes INT,             -- Duración estimada

  -- Estado
  status TEXT DEFAULT 'proposed' CHECK (status IN ('proposed', 'confirmed', 'completed', 'cancelled')),

  -- Notas internas
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Índices para Performance
-- =============================================

CREATE INDEX idx_speakers_active ON speakers(is_active);
CREATE INDEX idx_speakers_name ON speakers(name);
CREATE INDEX idx_speaker_talks_speaker ON speaker_talks(speaker_id);
CREATE INDEX idx_speaker_talks_event ON speaker_talks(event_id);
CREATE INDEX idx_speaker_talks_date ON speaker_talks(talk_date);
CREATE INDEX idx_speaker_talks_status ON speaker_talks(status);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaker_talks ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden ver y gestionar ponentes (no es público)
CREATE POLICY "Admins can manage speakers"
  ON speakers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND 'admin' = ANY(user_flags)
    )
  );

CREATE POLICY "Service role full access to speakers"
  ON speakers
  FOR ALL
  TO service_role
  USING (true);

-- Solo admins pueden gestionar ponencias
CREATE POLICY "Admins can manage speaker_talks"
  ON speaker_talks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND 'admin' = ANY(user_flags)
    )
  );

CREATE POLICY "Service role full access to speaker_talks"
  ON speaker_talks
  FOR ALL
  TO service_role
  USING (true);

-- =============================================
-- Triggers para updated_at
-- =============================================

CREATE TRIGGER update_speakers_updated_at
  BEFORE UPDATE ON speakers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_speaker_talks_updated_at
  BEFORE UPDATE ON speaker_talks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Comentarios para documentación
-- =============================================

COMMENT ON TABLE speakers IS 'Internal speaker management for Product Beers events';
COMMENT ON COLUMN speakers.topics IS 'Array of topics the speaker specializes in';
COMMENT ON COLUMN speakers.is_active IS 'Whether the speaker is currently available for events';

COMMENT ON TABLE speaker_talks IS 'Talks/presentations by speakers at events';
COMMENT ON COLUMN speaker_talks.status IS 'Status: proposed, confirmed, completed, cancelled';
