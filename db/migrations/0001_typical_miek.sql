CREATE TABLE "leaders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255),
	"bio" text,
	"photoMediaId" integer,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" varchar(255) NOT NULL,
	"mime" varchar(128) NOT NULL,
	"sizeBytes" integer NOT NULL,
	"data" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"speaker" varchar(255),
	"scripture" varchar(255),
	"series" varchar(255),
	"preachedAt" timestamp NOT NULL,
	"topics" text[] DEFAULT '{}' NOT NULL,
	"youtubeId" varchar(32),
	"audioMediaId" integer,
	"featured" boolean DEFAULT false NOT NULL,
	"messageOfMonth" boolean DEFAULT false NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ministries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(128) NOT NULL,
	"summary" text,
	"body" text,
	"photoMediaId" integer,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ministries_slug_unique" UNIQUE("slug")
);
