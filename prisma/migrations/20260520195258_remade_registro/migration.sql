/*
  Warnings:

  - A unique constraint covering the columns `[registro]` on the table `funcionario` will be added. If there are existing duplicate values, this will fail.
  - Made the column `registro` on table `funcionario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `funcionario` MODIFY `registro` VARCHAR(500) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `funcionario_registro_key` ON `funcionario`(`registro`);
