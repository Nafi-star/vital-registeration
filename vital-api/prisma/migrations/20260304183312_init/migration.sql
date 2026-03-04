-- CreateTable
CREATE TABLE "Birth" (
    "id" TEXT NOT NULL,
    "birth_regno" TEXT NOT NULL,
    "child_name" TEXT NOT NULL,
    "mother_name" TEXT NOT NULL,
    "father_name" TEXT NOT NULL,
    "date_of_birth" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "kebele" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "registration_date" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "Birth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Death" (
    "id" TEXT NOT NULL,
    "death_regno" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date_of_birth" TEXT NOT NULL,
    "date_of_death" TEXT NOT NULL,
    "cause_of_death" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "kebele" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "registration_date" TEXT NOT NULL,
    "birth_regno" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "Death_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marriage" (
    "id" TEXT NOT NULL,
    "marriage_regno" TEXT NOT NULL,
    "husband_name" TEXT NOT NULL,
    "husband_age" INTEGER NOT NULL,
    "husband_nationality" TEXT NOT NULL,
    "wife_name" TEXT NOT NULL,
    "wife_age" INTEGER NOT NULL,
    "wife_nationality" TEXT NOT NULL,
    "date_of_marriage" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "kebele" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "registration_date" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "Marriage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Divorce" (
    "id" TEXT NOT NULL,
    "divorce_regno" TEXT NOT NULL,
    "husband_name" TEXT NOT NULL,
    "husband_age" INTEGER NOT NULL,
    "husband_nationality" TEXT NOT NULL,
    "wife_name" TEXT NOT NULL,
    "wife_age" INTEGER NOT NULL,
    "wife_nationality" TEXT NOT NULL,
    "date_of_divorce" TEXT NOT NULL,
    "requester" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "kebele" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "registration_date" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "Divorce_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Birth_birth_regno_key" ON "Birth"("birth_regno");

-- CreateIndex
CREATE UNIQUE INDEX "Death_death_regno_key" ON "Death"("death_regno");

-- CreateIndex
CREATE UNIQUE INDEX "Marriage_marriage_regno_key" ON "Marriage"("marriage_regno");

-- CreateIndex
CREATE UNIQUE INDEX "Divorce_divorce_regno_key" ON "Divorce"("divorce_regno");
