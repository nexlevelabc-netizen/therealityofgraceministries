CREATE TYPE "public"."contribution_status" AS ENUM('pledged', 'checkout_started', 'paid', 'failed');--> statement-breakpoint
CREATE TYPE "public"."event_frequency" AS ENUM('daily', 'weekly', 'monthly');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"topic" varchar(64) NOT NULL,
	"message" text NOT NULL,
	"consentGiven" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contributions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" bigint,
	"reference" varchar(32) NOT NULL,
	"fund" varchar(64) NOT NULL,
	"amountPence" integer NOT NULL,
	"currency" varchar(8) DEFAULT 'gbp' NOT NULL,
	"monthly" boolean DEFAULT false NOT NULL,
	"giftAid" boolean DEFAULT false NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"status" "contribution_status" DEFAULT 'pledged' NOT NULL,
	"stripeSessionId" varchar(255),
	"consentGiven" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contributions_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"startsAt" timestamp NOT NULL,
	"frequency" "event_frequency" DEFAULT 'weekly' NOT NULL,
	"cadence" varchar(255),
	"location" varchar(255),
	"streamUrl" varchar(512),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prayer_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" bigint,
	"name" varchar(255),
	"contact" varchar(320),
	"message" text NOT NULL,
	"language" varchar(8) DEFAULT 'en' NOT NULL,
	"consentGiven" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"unionId" varchar(255) NOT NULL,
	"name" varchar(255),
	"email" varchar(320),
	"avatar" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignInAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_unionId_unique" UNIQUE("unionId")
);
