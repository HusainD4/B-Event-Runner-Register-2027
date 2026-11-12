CREATE TABLE `qr_tokens` (
    `token` CHAR(10) NOT NULL,
    `participantId` VARCHAR(191) NULL,
    `orderId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `qr_tokens_participantId_key`(`participantId`),
    UNIQUE INDEX `qr_tokens_orderId_key`(`orderId`),
    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `qr_tokens`
ADD CONSTRAINT `qr_tokens_participantId_fkey`
FOREIGN KEY (`participantId`) REFERENCES `participants`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `qr_tokens`
ADD CONSTRAINT `qr_tokens_orderId_fkey`
FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;
