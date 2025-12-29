-- =============================================
-- COLLABORATION REQUESTS TABLE
-- For sponsors and hosters who want to collaborate
-- =============================================

CREATE TABLE IF NOT EXISTS collaboration_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('sponsor', 'hoster')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'accepted', 'rejected')),
  notes TEXT, -- Admin notes
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (public form)
CREATE POLICY "Anyone can submit collaboration requests"
  ON collaboration_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only admins can read all requests
CREATE POLICY "Admins can read all collaboration requests"
  ON collaboration_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.user_flags @> ARRAY['admin']::text[]
        OR profiles.user_flags @> ARRAY['super_admin']::text[]
      )
    )
  );

-- Policy: Only admins can update requests
CREATE POLICY "Admins can update collaboration requests"
  ON collaboration_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.user_flags @> ARRAY['admin']::text[]
        OR profiles.user_flags @> ARRAY['super_admin']::text[]
      )
    )
  );

-- Policy: Only admins can delete requests
CREATE POLICY "Admins can delete collaboration requests"
  ON collaboration_requests FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.user_flags @> ARRAY['admin']::text[]
        OR profiles.user_flags @> ARRAY['super_admin']::text[]
      )
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_collaboration_requests_updated_at
  BEFORE UPDATE ON collaboration_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for filtering by status and type
CREATE INDEX idx_collaboration_requests_status ON collaboration_requests(status);
CREATE INDEX idx_collaboration_requests_type ON collaboration_requests(type);
CREATE INDEX idx_collaboration_requests_created_at ON collaboration_requests(created_at DESC);
