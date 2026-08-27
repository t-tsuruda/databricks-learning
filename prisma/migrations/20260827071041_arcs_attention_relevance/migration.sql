-- Split Lesson.introText into ARCS-aligned attentionText + relevanceText (see docs/prd.md 19-2).
-- Existing content is backfilled from introText; the seed script overwrites it with
-- the real Attention/Relevance split on the next `db:seed` run.
ALTER TABLE "Lesson" ADD COLUMN "attentionText" TEXT;
ALTER TABLE "Lesson" ADD COLUMN "relevanceText" TEXT;

UPDATE "Lesson" SET "attentionText" = "introText", "relevanceText" = "introText";

ALTER TABLE "Lesson" ALTER COLUMN "attentionText" SET NOT NULL;
ALTER TABLE "Lesson" ALTER COLUMN "relevanceText" SET NOT NULL;

ALTER TABLE "Lesson" DROP COLUMN "introText";
