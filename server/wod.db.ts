import { eq } from "drizzle-orm";
import { InsertWOD, WOD, wods } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Create a new WOD in the database
 */
export async function createWOD(wod: InsertWOD): Promise<WOD | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create WOD: database not available");
    return null;
  }

  try {
    const result = await db.insert(wods).values(wod);
    const id = (result as any).insertId;
    
    if (!id) {
      console.error("[Database] Failed to get inserted WOD ID");
      return null;
    }

    const created = await db.select().from(wods).where(eq(wods.id, id)).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create WOD:", error);
    throw error;
  }
}

/**
 * Get all WODs for a specific user
 */
export async function getUserWODs(userId: number): Promise<WOD[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get WODs: database not available");
    return [];
  }

  try {
    const result = await db.select().from(wods).where(eq(wods.userId, userId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user WODs:", error);
    throw error;
  }
}

/**
 * Get a specific WOD by ID
 */
export async function getWODById(id: number): Promise<WOD | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get WOD: database not available");
    return null;
  }

  try {
    const result = await db.select().from(wods).where(eq(wods.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get WOD:", error);
    throw error;
  }
}

/**
 * Delete a WOD by ID
 */
export async function deleteWOD(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete WOD: database not available");
    return false;
  }

  try {
    await db.delete(wods).where(eq(wods.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete WOD:", error);
    throw error;
  }
}
