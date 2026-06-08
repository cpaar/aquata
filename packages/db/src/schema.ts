import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const rounds = pgTable("rounds", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 120 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("draft"),
  tickLengthMinutes: integer("tick_length_minutes").notNull().default(30),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
