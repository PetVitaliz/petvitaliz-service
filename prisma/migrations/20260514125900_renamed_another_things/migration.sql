/*
  Warnings:

  - The values [Veterinario,Tosador] on the enum `funcionario_especialidade` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `funcionario` MODIFY `especialidade` ENUM('veterinario', 'tosador') NOT NULL;
