ALTER TABLE "Subjects" DROP CONSTRAINT "Subjects_id_Departments_id_fk";
--> statement-breakpoint
ALTER TABLE "Subjects" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "Subjects" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "Subjects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "Subjects" ADD COLUMN "departmentID" integer;--> statement-breakpoint
ALTER TABLE "Subjects" ADD CONSTRAINT "Subjects_departmentID_Departments_id_fk" FOREIGN KEY ("departmentID") REFERENCES "public"."Departments"("id") ON DELETE restrict ON UPDATE no action;