import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import express from 'express';
import { user } from '../db/schemas';
import { db } from '../db/db';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { search, role, page = 1, limit = 10 } = req.query;
        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100);

        const offset = (currentPage - 1) * limitPerPage;
        const filterConditions = [];

        // If search query exists, filter by user name OR user email
        if (search) {
            const escapedSearch = String(search).replace(/[%_\\]/g, '\\$&');
            filterConditions.push(
                or(
                    ilike(user.name, `%${escapedSearch}%`),
                    ilike(user.email, `%${escapedSearch}%`)
                )
            );
        }

        if (role) {
            filterConditions.push(eq(user.role, String(role) as any));
        }

        // Combine all filters using AND if any exists
        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db.select({ count: sql<number>`count(*)` })
            .from(user)
            .where(whereClause);

        const totalCount = countResult[0]?.count ?? 0;

        const usersList = await db.select({
            ...getTableColumns(user)
        })
            .from(user)
            .where(whereClause)
            .orderBy(desc(user.createdAt))
            .limit(limitPerPage)
            .offset(offset);

        res.status(200).json({
            data: usersList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage),
            }
        });
    } catch (e) {
        console.error(`GET /users error: ${e}`);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

export default router;
