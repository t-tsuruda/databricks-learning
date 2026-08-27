-- Add Lesson.questTitle for the challenge-oriented mission headline (docs/prd.md 22-1).
-- The seed script backfills real content on the next `db:seed` run.
ALTER TABLE "Lesson" ADD COLUMN "questTitle" TEXT NOT NULL DEFAULT '';
