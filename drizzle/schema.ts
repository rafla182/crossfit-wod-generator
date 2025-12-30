import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * WOD (Workout of the Day) table
 * Stores generated workouts created by coaches
 */
export const wods = mysqlTable("wods", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  // Workout parameters
  strategy: varchar("strategy", { length: 100 }).notNull(), // e.g., "AMRAP", "EMOM", "For Time", "Strength"
  duration: int("duration").notNull(), // in minutes
  difficulty: varchar("difficulty", { length: 50 }).notNull(), // e.g., "Beginner", "Intermediate", "Advanced"
  
  // Workout content
  warmup: text("warmup"),
  mainWorkout: text("mainWorkout").notNull(),
  cooldown: text("cooldown"),
  
  // Metadata
  movements: text("movements"), // JSON array of movement names
  equipment: text("equipment"), // JSON array of equipment needed
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WOD = typeof wods.$inferSelect;
export type InsertWOD = typeof wods.$inferInsert;