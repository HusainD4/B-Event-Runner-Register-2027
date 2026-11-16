DROP INDEX `users_email_key` ON `users`;
CREATE INDEX `users_email_idx` ON `users`(`email`);
CREATE INDEX `participants_nik_idx` ON `participants`(`nik`);

CREATE TABLE `registration_nik_locks` (
  `nik_hash` CHAR(64) NOT NULL,
  PRIMARY KEY (`nik_hash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
