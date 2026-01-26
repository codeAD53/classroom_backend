ALTER TABLE "Subjects" DROP CONSTRAINT IF EXISTS "Subjects_id_Departments_id_fk";
--> statement-breakpoint
ALTER TABLE "Subjects" ADD COLUMN "department_id" integer;
--> statement-breakpoint
ALTER TABLE "Subjects" ADD CONSTRAINT "Subjects_department_id_Departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."Departments"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "Subjects" ALTER COLUMN "id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "Subjects" ADD CONSTRAINT "Subjects_pkey" PRIMARY KEY ("id");
--> statement-breakpoint
ALTER TABLE "Subjects" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "Subjects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);