-- Add Lesson.modelAnswerContent for the collapsible hands-on model answer (docs/prd.md 20-2).
-- The seed script backfills real content on the next `db:seed` run.
ALTER TABLE "Lesson" ADD COLUMN "modelAnswerContent" TEXT NOT NULL DEFAULT '';
