-- Add Lesson.skillTagsJson for fine-grained skill keyword tags (docs/prd.md 21-1).
-- The seed script backfills real content on the next `db:seed` run.
ALTER TABLE "Lesson" ADD COLUMN "skillTagsJson" TEXT NOT NULL DEFAULT '[]';
