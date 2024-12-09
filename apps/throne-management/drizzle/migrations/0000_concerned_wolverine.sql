CREATE TYPE "public"."Method" AS ENUM('GET', 'POST', 'PUT', 'DELETE');--> statement-breakpoint
CREATE TYPE "public"."ExecutionStatus" AS ENUM('processing', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."MappingType" AS ENUM('input', 'output');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "execution" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"integrationId" uuid NOT NULL,
	"executedAt" timestamp (3) DEFAULT now() NOT NULL,
	"duration" integer NOT NULL,
	"status" "ExecutionStatus" DEFAULT 'processing' NOT NULL,
	"error" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"code" varchar(128) NOT NULL,
	"name" varchar(128) NOT NULL,
	"uniqueCode" varchar(256),
	"sourceMethod" "Method" DEFAULT 'GET' NOT NULL,
	"targetMethod" "Method" DEFAULT 'GET' NOT NULL,
	"targetUrl" varchar(256),
	"description" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mapping" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"integrationId" uuid NOT NULL,
	"type" "MappingType" NOT NULL,
	"sourceSchemaId" uuid NOT NULL,
	"targetSchemaId" uuid NOT NULL,
	"mappedSchema" jsonb NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "unique_integrationId_type" UNIQUE("integrationId","type")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schema" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"integrationId" uuid NOT NULL,
	"code" varchar(128) NOT NULL,
	"name" varchar(128) NOT NULL,
	"schema" jsonb NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(60) NOT NULL,
	"code" varchar(40) NOT NULL,
	"description" varchar,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "execution" ADD CONSTRAINT "execution_integrationId_integration_id_fk" FOREIGN KEY ("integrationId") REFERENCES "public"."integration"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "integration" ADD CONSTRAINT "integration_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mapping" ADD CONSTRAINT "mapping_integrationId_integration_id_fk" FOREIGN KEY ("integrationId") REFERENCES "public"."integration"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mapping" ADD CONSTRAINT "mapping_sourceSchemaId_schema_id_fk" FOREIGN KEY ("sourceSchemaId") REFERENCES "public"."schema"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mapping" ADD CONSTRAINT "mapping_targetSchemaId_schema_id_fk" FOREIGN KEY ("targetSchemaId") REFERENCES "public"."schema"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schema" ADD CONSTRAINT "schema_integrationId_integration_id_fk" FOREIGN KEY ("integrationId") REFERENCES "public"."integration"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
