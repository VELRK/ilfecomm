-- Phone OTP storage for login (MSG91 Flow / local verify)
CREATE TABLE IF NOT EXISTS `phone_otps` (
  `id`          INT(11) NOT NULL AUTO_INCREMENT,
  `phone`       VARCHAR(20) NOT NULL COMMENT 'Normalized mobile e.g. 917598933686',
  `otp_hash`    VARCHAR(255) NOT NULL,
  `expires_at`  DATETIME NOT NULL,
  `verified_at` DATETIME DEFAULT NULL,
  `created_at`  DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_phone_otps_phone` (`phone`),
  KEY `idx_phone_otps_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
