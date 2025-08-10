CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO tickets (id, title, description, status) VALUES
('11111111-1111-4111-8111-111111111111', 'Test ticket 1', 'Sample', 'New'),
('22222222-2222-4222-9222-222222222222', 'Test ticket 2', 'Sample 2', 'Solved');
