CREATE TYPE "public"."report_status" AS ENUM('PENDING', 'DOWNLOADED', 'PROCESSED', 'FAILED');--> statement-breakpoint
CREATE TABLE "financial_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"report_type" text NOT NULL,
	"pdf_url" text,
	"storage_url" text,
	"status" "report_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "financial_reports" ADD CONSTRAINT "financial_reports_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "financial_report_unique" ON "financial_reports" USING btree ("company_id","year","report_type");