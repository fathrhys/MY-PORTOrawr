-- AlterTable
ALTER TABLE `project` ADD COLUMN `category` ENUM('WEB', 'CTF', 'AI', 'GAME', 'TOOLS', 'OTHER') NOT NULL DEFAULT 'WEB';
