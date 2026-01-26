import { eq } from 'drizzle-orm';
import { db } from './db/db';
import { Departments } from './db/schemas/app';

async function main() {
  try {
    console.log('Performing CRUD operations on Departments...');

    // CREATE: Insert a new department
    const [newDept] = await db
      .insert(Departments)
      .values({ code: 'CS', name: 'Computer Science', description: 'Department of Computer Science' })
      .returning();

    if (!newDept) {
      throw new Error('Failed to create department');
    }

    console.log('✅ CREATE: New department created:', newDept);

    // READ: Select the department
    const foundDept = await db.select().from(Departments).where(eq(Departments.id, newDept.id));
    console.log('✅ READ: Found department:', foundDept[0]);

    // UPDATE: Change the department's name
    const [updatedDept] = await db
      .update(Departments)
      .set({ name: 'Advanced Computer Science' })
      .where(eq(Departments.id, newDept.id))
      .returning();

    if (!updatedDept) {
      throw new Error('Failed to update department');
    }

    console.log('✅ UPDATE: Department updated:', updatedDept);

    // DELETE: Remove the department
    await db.delete(Departments).where(eq(Departments.id, newDept.id));
    console.log('✅ DELETE: Department deleted.');

    console.log('\nCRUD operations completed successfully.');
  } catch (error) {
    console.error('❌ Error performing CRUD operations:', error);
    process.exit(1);
  } finally {
    // For Neon Serverless (HTTP), no pool to close
  }
}

main();