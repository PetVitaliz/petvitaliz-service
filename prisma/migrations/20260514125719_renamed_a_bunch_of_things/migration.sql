/*
  Warnings:

  - Made the column `ativo` on table `funcionario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `funcionario` MODIFY `ativo` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `carga` INTEGER NOT NULL DEFAULT 8;
