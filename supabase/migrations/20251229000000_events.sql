-- ============================================
-- EVENTS SYSTEM FOR PRODUCT BEERS
-- Gestión de eventos con soporte para Fourvenues
-- ============================================

-- Tabla principal de eventos
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Información básica
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,

  -- Fechas
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,

  -- Ubicación
  location_name TEXT,
  location_address TEXT,
  location_city TEXT DEFAULT 'Valencia',
  location_maps_url TEXT,

  -- Media
  image_url TEXT,

  -- Registro
  registration_url TEXT,
  max_attendees INT,

  -- Sincronización con Fourvenues
  fourvenues_id TEXT UNIQUE,
  fourvenues_slug TEXT,
  last_synced_at TIMESTAMPTZ,

  -- Estado y metadata
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'fourvenues')),
  featured BOOLEAN DEFAULT false,

  -- Auditoría
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Tabla de ponentes
CREATE TABLE speakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  bio TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de sponsors
CREATE TABLE sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  tier TEXT DEFAULT 'standard' CHECK (tier IN ('platinum', 'gold', 'silver', 'standard', 'community')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Relación eventos-ponentes (many-to-many)
CREATE TABLE event_speakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  speaker_id UUID REFERENCES speakers(id) ON DELETE CASCADE NOT NULL,
  role_in_event TEXT DEFAULT 'speaker' CHECK (role_in_event IN ('speaker', 'host', 'panelist', 'moderator')),
  talk_title TEXT,
  talk_description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (event_id, speaker_id)
);

-- Relación eventos-sponsors (many-to-many)
CREATE TABLE event_sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE NOT NULL,
  tier_override TEXT CHECK (tier_override IN ('platinum', 'gold', 'silver', 'standard', 'community')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (event_id, sponsor_id)
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_fourvenues_id ON events(fourvenues_id);
CREATE INDEX idx_events_featured ON events(featured) WHERE featured = true;
CREATE INDEX idx_event_speakers_event ON event_speakers(event_id);
CREATE INDEX idx_event_speakers_speaker ON event_speakers(speaker_id);
CREATE INDEX idx_event_sponsors_event ON event_sponsors(event_id);
CREATE INDEX idx_event_sponsors_sponsor ON event_sponsors(sponsor_id);

-- ============================================
-- RLS (Row Level Security)
-- ============================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sponsors ENABLE ROW LEVEL SECURITY;

-- Eventos: Lectura pública para eventos publicados
CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  USING (status = 'published');

-- Eventos: Admins pueden todo
CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

-- Ponentes: Lectura pública
CREATE POLICY "Public can view speakers"
  ON speakers FOR SELECT
  USING (true);

-- Ponentes: Admins pueden gestionar
CREATE POLICY "Admins can manage speakers"
  ON speakers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

-- Sponsors: Lectura pública para activos
CREATE POLICY "Public can view active sponsors"
  ON sponsors FOR SELECT
  USING (is_active = true);

-- Sponsors: Admins pueden gestionar
CREATE POLICY "Admins can manage sponsors"
  ON sponsors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

-- Event_speakers: Lectura pública
CREATE POLICY "Public can view event speakers"
  ON event_speakers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_speakers.event_id
      AND events.status = 'published'
    )
  );

-- Event_speakers: Admins pueden gestionar
CREATE POLICY "Admins can manage event speakers"
  ON event_speakers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

-- Event_sponsors: Lectura pública
CREATE POLICY "Public can view event sponsors"
  ON event_sponsors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_sponsors.event_id
      AND events.status = 'published'
    )
  );

-- Event_sponsors: Admins pueden gestionar
CREATE POLICY "Admins can manage event sponsors"
  ON event_sponsors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND 'admin' = ANY(profiles.user_flags)
    )
  );

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at para events
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at para speakers
CREATE TRIGGER update_speakers_updated_at
  BEFORE UPDATE ON speakers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at para sponsors
CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON sponsors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCIÓN HELPER: Generar slug único
-- ============================================

CREATE OR REPLACE FUNCTION generate_event_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 0;
BEGIN
  -- Convertir a minúsculas y reemplazar espacios/caracteres especiales
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);

  final_slug := base_slug;

  -- Verificar unicidad y añadir sufijo si es necesario
  WHILE EXISTS (SELECT 1 FROM events WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE events IS 'Eventos de Product Beers - sincronizables con Fourvenues';
COMMENT ON TABLE speakers IS 'Ponentes que participan en eventos';
COMMENT ON TABLE sponsors IS 'Patrocinadores de eventos';
COMMENT ON TABLE event_speakers IS 'Relación many-to-many entre eventos y ponentes';
COMMENT ON TABLE event_sponsors IS 'Relación many-to-many entre eventos y sponsors';
COMMENT ON COLUMN events.fourvenues_id IS 'ID del evento en Fourvenues para sincronización';
COMMENT ON COLUMN events.source IS 'manual = creado en admin, fourvenues = importado de API';
