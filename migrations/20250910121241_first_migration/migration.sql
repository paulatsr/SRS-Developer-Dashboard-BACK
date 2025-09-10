-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'DEVELOPER');

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "max_people_front" INTEGER NOT NULL,
    "max_people_back" INTEGER NOT NULL,
    "technical_file" TEXT,
    "icon" TEXT,
    "budget" DECIMAL(65,30),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectAccount" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "ProjectAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "public"."Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectAccount_project_id_account_id_key" ON "public"."ProjectAccount"("project_id", "account_id");

-- AddForeignKey
ALTER TABLE "public"."ProjectAccount" ADD CONSTRAINT "ProjectAccount_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectAccount" ADD CONSTRAINT "ProjectAccount_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
