CREATE TABLE "Departments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Departments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" varchar(300),
	"created_At" timestamp DEFAULT now() NOT NULL,
	"update_At" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Departments_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "Subjects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Subjects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"department_id" integer,
	"code" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" varchar(300),
	"created_At" timestamp DEFAULT now() NOT NULL,
	"update_At" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Subjects_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "Subjects" ADD CONSTRAINT "Subjects_department_id_Departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."Departments"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_subject_id_Subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."Subjects"("id") ON DELETE cascade ON UPDATE no action;