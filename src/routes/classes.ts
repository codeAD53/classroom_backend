import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import express from 'express';
import { Classes, Departments, Subjects, user } from '../db/schemas';
import { db } from '../db/db';

const classesRouter = express.Router();

classesRouter.get('/', async (req, res) => {
    try {
        const { search, subject, teacher, page = 1, limit = 10 } = req.query;
        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100);

        const offset = (currentPage - 1) * limitPerPage;
        const filterConditions = [];

        if (search) {
            const escapedSearch = String(search).replace(/[%_\\]/g, '\\$&');
            const searchPattern = `%${escapedSearch}%`;
            filterConditions.push(
                or(
                    ilike(Classes.name, searchPattern),
                    ilike(Classes.inviteCode, searchPattern)
                )
            );
        }
        if (subject) {
            const escapedSubject = String(subject).replace(/[%_\\]/g, '\\$&');
            filterConditions.push(ilike(Subjects.name, `%${escapedSubject}%`));
        }
        if (teacher) {
            const escapedTeacher = String(teacher).replace(/[%_\\]/g, '\\$&');
            filterConditions.push(ilike(user.name, `%${escapedTeacher}%`));
        }

        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(Classes)
            .leftJoin(Subjects, eq(Classes.subjectID, Subjects.id))
            .leftJoin(user, eq(Classes.teacherID, user.id))
            .where(whereClause);

        const totalCount = countResult[0]?.count ?? 0;

        const classesList = await db
            .select({
                ...getTableColumns(Classes),
                subject: { ...getTableColumns(Subjects) },
                teacher: { ...getTableColumns(user) },
            })
            .from(Classes)
            .leftJoin(Subjects, eq(Classes.subjectID, Subjects.id))
            .leftJoin(user, eq(Classes.teacherID, user.id))
            .where(whereClause)
            .orderBy(desc(Classes.createdAt))
            .limit(limitPerPage)
            .offset(offset);

        res.status(200).json({
            data: classesList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage),
            },
        });
    } catch (e) {
        console.error('GET /classes error:', e);
        res.status(500).json({ error: 'Failed to get classes' });
    }
});

//GET class details with teahcer, subject and department

classesRouter.get('/:id', async (req, res) => {
        const classId = parseInt(req.params.id);
        if(!Number.isFinite(classId)) return res.status(400).json({error: 'Invalid class ID'});

        const [classDetails] = await db
        .select({
            ...getTableColumns(Classes),
            subject: {
                ...getTableColumns(Subjects),
            },
            department: {
                ...getTableColumns(Departments),
            },
            teacher: {
                ...getTableColumns(user),
            },
        })
        .from(Classes)
        .leftJoin(Subjects, eq(Classes.subjectID, Subjects.id))
        .leftJoin(Departments, eq(Subjects.departmentID, Departments.id))
        .leftJoin(user, eq(Classes.teacherID, user.id))
        .where(eq(Classes.id, classId));

        if(!classDetails) return res.status(404).json({error: 'Class not found'});
        res.status(200).json({ data: classDetails });
});

classesRouter.post('/', async (req, res) => {
    try {
        const [createdClass] = await db
            .insert(Classes)
            .values({...req.body, inviteCode: Math.random().toString(36).substring(2, 9), schedules: []})
            .returning({ id: Classes.id });

        if(!createdClass) throw new Error('Insert failed');
        res.status(201).json({ data: createdClass });
    } catch (e) {
        console.error('POST /classes error:', e);
        res.status(500).json({ error: 'Failed to create class' });
    }
});

export default classesRouter