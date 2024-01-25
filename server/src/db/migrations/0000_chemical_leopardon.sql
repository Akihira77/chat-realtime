CREATE TABLE IF NOT EXISTS "Messages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"message" "bytea",
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"sender_id" varchar(36) NOT NULL,
	"receiver_id" varchar(36) NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"full_name" varchar(25) NOT NULL,
	"phone_number" varchar(16) NOT NULL,
	"last_online" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "Users_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Messages" ADD CONSTRAINT "Messages_sender_id_Users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "Users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Messages" ADD CONSTRAINT "Messages_receiver_id_Users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "Users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
