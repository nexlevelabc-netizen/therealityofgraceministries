CREATE TABLE `contact_messages` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`topic` varchar(64) NOT NULL,
	`message` text NOT NULL,
	`consentGiven` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contributions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned,
	`reference` varchar(32) NOT NULL,
	`fund` varchar(64) NOT NULL,
	`amountPence` int NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'gbp',
	`monthly` boolean NOT NULL DEFAULT false,
	`giftAid` boolean NOT NULL DEFAULT false,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`status` enum('pledged','checkout_started','paid','failed') NOT NULL DEFAULT 'pledged',
	`stripeSessionId` varchar(255),
	`consentGiven` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contributions_id` PRIMARY KEY(`id`),
	CONSTRAINT `contributions_reference_unique` UNIQUE(`reference`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`startsAt` timestamp NOT NULL,
	`frequency` enum('daily','weekly','monthly') NOT NULL DEFAULT 'weekly',
	`cadence` varchar(255),
	`location` varchar(255),
	`streamUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prayer_requests` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned,
	`name` varchar(255),
	`contact` varchar(320),
	`message` text NOT NULL,
	`language` varchar(8) NOT NULL DEFAULT 'en',
	`consentGiven` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prayer_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`unionId` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(320),
	`avatar` text,
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	`lastSignInAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_unionId_unique` UNIQUE(`unionId`)
);
