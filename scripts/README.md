# SQL Migrations

Run these files **in order** by pasting each into the Supabase SQL Editor.

| File | Description |
|------|-------------|
| `001_enums.sql` | Create all ENUM types first |
| `002_tables.sql` | Create all tables |
| `003_indexes.sql` | Performance indexes |
| `004_rls.sql` | Row Level Security policies |
| `005_functions.sql` | Triggers and helper functions |
| `006_seed.sql` | Seed data (projects, blog, settings) |

## Notes

- Each file is idempotent where possible (`ON CONFLICT DO NOTHING`).
- All admin writes use `SUPABASE_SERVICE_ROLE_KEY` (server-side only) which bypasses RLS.
- Public reads (anon key) are allowed on all tables.
- `get_project_full(slug)` returns a complete project as JSON in a single query.
