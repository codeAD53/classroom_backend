import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import express from 'express'
import { Departments, Subjects } from '../db/schemas';
import { db } from '../db/db';


const router = express.Router();

router.get('/', async(req,res)=>{
    try{
        const {search,department,page = 1, limit = 10} = req.query;
        const currentPage = Math.max(1,parseInt( String(page),10) || 1);
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100);

        const offset = (currentPage - 1) * limitPerPage;
        const filterConditions = [];

        //If search query exits, filter by subject name OR subject code
        if(search){
            filterConditions.push(
                or(
                    ilike(Subjects.name, `%${search}%`),
                    ilike(Subjects.code, `%${search}%`)//The ilike patterns %${search} only match values ending with the search term. For "contains" matching, use %${search}%.
                )
            );
        }
if(department){
    // filterConditions.push(
    //     ilike(Departments.name,`%${department}`),
            
        
    // )
   const escapedDept = String(department).replace(/[%_\\]/g, '\\$&');
   const deptPattern = `%${escapedDept}%`;
   filterConditions.push(ilike(Departments.name, deptPattern));
}
        

        //Combine all filters using AND if any exits
        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;
        const countResult = await db.select({count:sql<number>`count(*)`})
        .from(Subjects)
        .leftJoin(Departments, eq(Subjects.departmentID, Departments.id))
        .where(whereClause)

        const totalCount = countResult[0]?.count ?? 0;

        const subjectsList = await db.select({...getTableColumns(Subjects),
            department: {...getTableColumns(Departments)}
        }).from(Subjects).leftJoin(Departments, eq(Subjects.departmentID, Departments.id))
        .where(whereClause)
        .orderBy(desc(Subjects.createdAt))
        .limit(limitPerPage)
        .offset(offset)

        res.status(200).json({
            data: subjectsList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPage: Math.ceil(totalCount / limitPerPage),
            }
        })
    }catch(e){
        console.error('GET /subjects error: ${e}');
        res.status(500).json({error: 'Failed to get subjects'})
    }
})

export default router