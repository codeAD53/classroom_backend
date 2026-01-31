
import { relations } from "drizzle-orm";
import { pgTable,integer,varchar,timestamp, pgEnum, text, jsonb, index, unique } from "drizzle-orm/pg-core";
import { user } from "./auth";


// SCHEDULE TYPE FOR CLASS
export type Schedule = {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    startTime: string; // "HH:MM"
    endTime: string; // "HH:MM"
}

const timestamps = {
    createdAt: timestamp('created_At').defaultNow().notNull(),
    updateAt: timestamp('update_At').defaultNow().$onUpdate(()=>new Date()).notNull()
}
export const Departments = pgTable('Departments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    code: varchar('code', {length: 100}).notNull().unique(),
    name: varchar('name', {length: 200}).notNull(),
    description: varchar('description',{length:300}),
    ...timestamps
})

export const Subjects = pgTable('Subjects', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    departmentID: integer('department_id').references(()=>Departments.id, {onDelete: 'restrict'}),
    code: varchar('code', {length: 100}).notNull().unique(),
    name: varchar('name', {length: 200}).notNull(),
    description: varchar('description',{length:300}),
    ...timestamps
})

// CLASS STATUS ENUM
export const classStatusEnum = pgEnum('class_status', ['active', 'inactive', 'archived']);

// CLASSES TABLE
export const Classes = pgTable('classes', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    subjectID: integer('subject_id').notNull().references(() => Subjects.id, { onDelete: 'cascade' }),
    teacherID: text('teacher_id').notNull().references(() => user.id, { onDelete: 'restrict' }),
    inviteCode: varchar('invite_code', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    bannerCldPubId: text('bannerCldPubId'),
    bannerUrl: text('bannerUrl'),
    description: text('description'),
    capacity: integer('capacity').default(50).notNull(),
    status: classStatusEnum('status').default('active').notNull(),
    schedules: jsonb('schedules').$type<Schedule[]>(),
    ...timestamps
}, (table) => ({
    subjectIdx: index('subject_id_idx').on(table.subjectID),
    teacherIdx: index('teacher_id_idx').on(table.teacherID),
}));

// ENROLLMENTS TABLE
export const Enrollments = pgTable('enrollments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    studentID: text('student_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    classID: integer('class_id').notNull().references(() => Classes.id, { onDelete: 'cascade' }),
    ...timestamps
}, (table) => ({
    studentIdx: index('student_id_idx').on(table.studentID),
    classIdx: index('class_id_idx').on(table.classID),
    uniqueEnrollment: unique('unique_enrollment_idx').on(table.studentID, table.classID),
}));



export const DepartmentsRelations = relations(Departments, ({many})=>({Subjects: many(Subjects)}))
export const SubjectsRelations = relations(Subjects, ({one,many})=>({
    Departments: one(Departments,{
        fields: [Subjects.departmentID],
        references: [Departments.id]
    }),
    Classes: many(Classes)
}));

export const ClassesRelations = relations(Classes, ({ one, many }) => ({
    subject: one(Subjects, {
        fields: [Classes.subjectID],
        references: [Subjects.id]
    }),
    teacher: one(user, {
        fields: [Classes.teacherID],
        references: [user.id]
    }),
    enrollments: many(Enrollments)
}));

export const EnrollmentsRelations = relations(Enrollments, ({ one }) => ({
    student: one(user, {
        fields: [Enrollments.studentID],
        references: [user.id]
    }),
    class: one(Classes, {
        fields: [Enrollments.classID],
        references: [Classes.id]
    })
}));

export type Department = typeof Departments.$inferSelect
export type NewDepartment = typeof Departments.$inferInsert

export type Subject = typeof Subjects.$inferSelect
export type NewSubject = typeof Subjects.$inferInsert

export type Class = typeof Classes.$inferSelect;
export type NewClass = typeof Classes.$inferInsert;

export type Enrollment = typeof Enrollments.$inferSelect;
export type NewEnrollment = typeof Enrollments.$inferInsert;
