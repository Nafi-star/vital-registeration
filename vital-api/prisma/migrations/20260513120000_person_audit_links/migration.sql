-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "person_public_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "date_of_birth" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "kebele" TEXT NOT NULL,
    "house_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actor" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_person_public_id_key" ON "Person"("person_public_id");

-- AlterTable
ALTER TABLE "Birth" ALTER COLUMN "house_number" DROP NOT NULL;
ALTER TABLE "Birth" ADD COLUMN     "child_person_id" TEXT;

-- AlterTable
ALTER TABLE "Death" ALTER COLUMN "house_number" DROP NOT NULL;
ALTER TABLE "Death" ADD COLUMN     "deceased_person_id" TEXT;

-- AlterTable
ALTER TABLE "Marriage" ALTER COLUMN "house_number" DROP NOT NULL;
ALTER TABLE "Marriage" ADD COLUMN     "husband_person_id" TEXT,
ADD COLUMN     "wife_person_id" TEXT;

-- AlterTable
ALTER TABLE "Divorce" ALTER COLUMN "house_number" DROP NOT NULL;
ALTER TABLE "Divorce" ADD COLUMN     "husband_person_id" TEXT,
ADD COLUMN     "wife_person_id" TEXT,
ADD COLUMN     "marriage_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Birth_child_person_id_key" ON "Birth"("child_person_id");

-- CreateIndex
CREATE UNIQUE INDEX "Death_deceased_person_id_key" ON "Death"("deceased_person_id");

-- AddForeignKey
ALTER TABLE "Birth" ADD CONSTRAINT "Birth_child_person_id_fkey" FOREIGN KEY ("child_person_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Death" ADD CONSTRAINT "Death_deceased_person_id_fkey" FOREIGN KEY ("deceased_person_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marriage" ADD CONSTRAINT "Marriage_husband_person_id_fkey" FOREIGN KEY ("husband_person_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marriage" ADD CONSTRAINT "Marriage_wife_person_id_fkey" FOREIGN KEY ("wife_person_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Divorce" ADD CONSTRAINT "Divorce_husband_person_id_fkey" FOREIGN KEY ("husband_person_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Divorce" ADD CONSTRAINT "Divorce_wife_person_id_fkey" FOREIGN KEY ("wife_person_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Divorce" ADD CONSTRAINT "Divorce_marriage_id_fkey" FOREIGN KEY ("marriage_id") REFERENCES "Marriage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
