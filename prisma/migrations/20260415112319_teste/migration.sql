-- CreateTable
CREATE TABLE `administrador` (
    `ADM_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ADM_NOME` VARCHAR(500) NOT NULL,
    `ADM_EMAIL` VARCHAR(500) NOT NULL,
    `ADM_SENHA` VARCHAR(500) NOT NULL,
    `ADM_ATIVO` TINYINT NULL,

    PRIMARY KEY (`ADM_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assinaturas` (
    `id_assinatura` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_produto` INTEGER NOT NULL,
    `data_assinatura` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_produto`(`id_produto`),
    PRIMARY KEY (`id_assinatura`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consulta` (
    `id_consulta` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pet` INTEGER NOT NULL,
    `id_funcionario` INTEGER NOT NULL,
    `data_consulta` DATE NOT NULL,
    `hora_inicio` TIME(0) NOT NULL,
    `hora_fim` TIME(0) NOT NULL,
    `status` ENUM('em espera', 'em endamento', 'finalizado') NOT NULL,
    `observacoes` VARCHAR(500) NOT NULL,

    INDEX `funcionario`(`id_funcionario`),
    INDEX `pet`(`id_pet`),
    PRIMARY KEY (`id_consulta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `funcionario` (
    `id_funcionario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(500) NOT NULL,
    `sobrenome` VARCHAR(500) NOT NULL,
    `especialidade` ENUM('Veterinario', 'Tosador') NOT NULL,
    `registro` VARCHAR(500) NULL,
    `ativo` TINYINT NULL,
    `carga` INTEGER NOT NULL,
    `senha` VARCHAR(500) NOT NULL,

    PRIMARY KEY (`id_funcionario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet` (
    `id_pet` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `nome` VARCHAR(500) NOT NULL,
    `especie` ENUM('cachorro', 'gato') NOT NULL,
    `sexo` ENUM('M', 'F') NOT NULL,
    `data_nascimento` DATE NOT NULL,

    INDEX `dono`(`id_usuario`),
    PRIMARY KEY (`id_pet`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtos` (
    `id_produto` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `descricao` TEXT NOT NULL,
    `beneficios` TEXT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id_produto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reset_senha` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expira_em` DATETIME(0) NOT NULL,

    INDEX `usuario_reset`(`id_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(500) NOT NULL,
    `sobrenome` VARCHAR(500) NOT NULL,
    `genero` ENUM('M', 'F', 'O') NOT NULL,
    `email` VARCHAR(500) NOT NULL,
    `senha` VARCHAR(500) NOT NULL,
    `telefone` VARCHAR(500) NOT NULL,
    `data_nascimento` DATE NOT NULL,
    `CPF` VARCHAR(11) NOT NULL,

    UNIQUE INDEX `usuario_email_key`(`email`),
    UNIQUE INDEX `CPF`(`CPF`),
    INDEX `CPF_2`(`CPF`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assinaturas` ADD CONSTRAINT `assinaturas_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produtos`(`id_produto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `consulta` ADD CONSTRAINT `funcionario` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario`(`id_funcionario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `consulta` ADD CONSTRAINT `pet` FOREIGN KEY (`id_pet`) REFERENCES `pet`(`id_pet`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pet` ADD CONSTRAINT `dono` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reset_senha` ADD CONSTRAINT `usuario_reset` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE NO ACTION;
