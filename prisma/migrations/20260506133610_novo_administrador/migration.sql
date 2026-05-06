/*
  Warnings:

  - A unique constraint covering the columns `[ADM_NOME]` on the table `administrador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ADM_EMAIL]` on the table `administrador` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ADM_ATIVO` on table `administrador` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `administrador` MODIFY `ADM_ATIVO` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `administrador_ADM_NOME_key` ON `administrador`(`ADM_NOME`);

-- CreateIndex
CREATE UNIQUE INDEX `administrador_ADM_EMAIL_key` ON `administrador`(`ADM_EMAIL`);
