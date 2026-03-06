import { z } from "zod";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// We keep a simple table to satisfy any DB requirements, e.g., saving user preferences later
export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  theme: text("theme").default("light"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const priceEventSchema = z.object({
  item_id: z.string(),
  nameAr: z.string(),
  category: z.string(),
  unit: z.string(),
  date: z.string(),
  price: z.number(),
  description: z.string().optional(),
});

export type PriceEvent = z.infer<typeof priceEventSchema>;
