/*
  Warnings:

  - Added the required column `refreshTokenIdentifier` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "session" ADD COLUMN     "refreshTokenIdentifier" VARCHAR(40) NOT NULL;
