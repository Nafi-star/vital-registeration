-- Structured name fields (CBTP attribute sets); legacy composite columns retained for search/display.

ALTER TABLE "Birth" ADD COLUMN "child_first_name" TEXT;
ALTER TABLE "Birth" ADD COLUMN "child_middle_name" TEXT;
ALTER TABLE "Birth" ADD COLUMN "child_last_name" TEXT;
ALTER TABLE "Birth" ADD COLUMN "mother_first_name" TEXT;
ALTER TABLE "Birth" ADD COLUMN "mother_middle_name" TEXT;
ALTER TABLE "Birth" ADD COLUMN "mother_last_name" TEXT;
ALTER TABLE "Birth" ADD COLUMN "father_first_name" TEXT;
ALTER TABLE "Birth" ADD COLUMN "father_middle_name" TEXT;
ALTER TABLE "Birth" ADD COLUMN "father_last_name" TEXT;

ALTER TABLE "Death" ADD COLUMN "deceased_first_name" TEXT;
ALTER TABLE "Death" ADD COLUMN "deceased_middle_name" TEXT;
ALTER TABLE "Death" ADD COLUMN "deceased_last_name" TEXT;

ALTER TABLE "Marriage" ADD COLUMN "husband_first_name" TEXT;
ALTER TABLE "Marriage" ADD COLUMN "husband_middle_name" TEXT;
ALTER TABLE "Marriage" ADD COLUMN "husband_last_name" TEXT;
ALTER TABLE "Marriage" ADD COLUMN "wife_first_name" TEXT;
ALTER TABLE "Marriage" ADD COLUMN "wife_middle_name" TEXT;
ALTER TABLE "Marriage" ADD COLUMN "wife_last_name" TEXT;

ALTER TABLE "Divorce" ADD COLUMN "husband_first_name" TEXT;
ALTER TABLE "Divorce" ADD COLUMN "husband_middle_name" TEXT;
ALTER TABLE "Divorce" ADD COLUMN "husband_last_name" TEXT;
ALTER TABLE "Divorce" ADD COLUMN "wife_first_name" TEXT;
ALTER TABLE "Divorce" ADD COLUMN "wife_middle_name" TEXT;
ALTER TABLE "Divorce" ADD COLUMN "wife_last_name" TEXT;
