-- Add Course.closingColumn for the end-of-course motivational column and
-- remove the now-unused motivational_messages app setting (superseded by it).
ALTER TABLE "Course" ADD COLUMN "closingColumn" TEXT NOT NULL DEFAULT '';

DELETE FROM "AppSetting" WHERE "key" = 'motivational_messages';
