/*
  Warnings:

  - The values [em endamento] on the enum `consulta_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `consulta` MODIFY `hora_inicio` VARCHAR(10) NOT NULL,
    MODIFY `hora_fim` VARCHAR(10) NOT NULL,
    MODIFY `status` ENUM('em espera', 'em andamento', 'finalizado') NOT NULL;
