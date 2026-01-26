
import { relations } from "drizzle-orm";
import { pgTable,integer,varchar,timestamp } from "drizzle-orm/pg-core";


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

export const DepartmentsRelations = relations(Departments, ({many})=>({Subjects: many(Subjects)}))
export const SubjectsRelations = relations(Subjects, ({one,many})=>({
    Departments: one(Departments,{
        fields: [Subjects.departmentID],
        references: [Departments.id]
    })}));

export type Department = typeof Departments.$inferSelect
export type NewDepartment = typeof Departments.$inferInsert

export type Subject = typeof Subjects.$inferSelect
export type NewSubject = typeof Subjects.$inferInsert

