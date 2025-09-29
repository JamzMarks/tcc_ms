-- CreateEnum
CREATE TYPE "public"."Theme" AS ENUM ('LIGHT', 'DARK');

-- CreateEnum
CREATE TYPE "public"."Language" AS ENUM ('PTBR', 'EN', 'ES');

-- CreateTable
CREATE TABLE "public"."UserConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "language" "public"."Language" NOT NULL DEFAULT 'EN',
    "theme" "public"."Theme" NOT NULL DEFAULT 'LIGHT',

    CONSTRAINT "UserConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserConfig_userId_key" ON "public"."UserConfig"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserConfig" ADD CONSTRAINT "UserConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
