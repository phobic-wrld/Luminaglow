CREATE TABLE `perfumes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`category` enum('women','men','unisex') NOT NULL,
	`type` enum('arabic','designer') NOT NULL,
	`imageUrl` text,
	`imageKey` varchar(512),
	`inStock` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `perfumes_id` PRIMARY KEY(`id`)
);
