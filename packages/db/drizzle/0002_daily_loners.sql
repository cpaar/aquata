CREATE TABLE "scan_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"round_id" uuid NOT NULL,
	"scanner_player_id" uuid NOT NULL,
	"target_station_id" uuid,
	"tick_number" integer NOT NULL,
	"type" varchar(32) NOT NULL,
	"report" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fleets" ADD COLUMN "station_ticks" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "fleets" ADD COLUMN "station_ticks_remaining" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "fleets" ADD COLUMN "recalled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "scan_reports" ADD CONSTRAINT "scan_reports_round_id_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."rounds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scan_reports" ADD CONSTRAINT "scan_reports_scanner_player_id_players_id_fk" FOREIGN KEY ("scanner_player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scan_reports" ADD CONSTRAINT "scan_reports_target_station_id_stations_id_fk" FOREIGN KEY ("target_station_id") REFERENCES "public"."stations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "scan_reports_round_scanner_idx" ON "scan_reports" USING btree ("round_id","scanner_player_id");--> statement-breakpoint
CREATE INDEX "scan_reports_target_idx" ON "scan_reports" USING btree ("target_station_id");