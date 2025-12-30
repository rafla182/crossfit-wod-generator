CREATE TABLE `wods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`strategy` varchar(100) NOT NULL,
	`duration` int NOT NULL,
	`difficulty` varchar(50) NOT NULL,
	`warmup` text,
	`mainWorkout` text NOT NULL,
	`cooldown` text,
	`movements` text,
	`equipment` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `wods` ADD CONSTRAINT `wods_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;