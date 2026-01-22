import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'Structural Glazing', 'ACP Cladding', 'Semi-Unitized', 'Spider Glazing'
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").default(false).notNull(),
  location: text("location"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export const categories = [
  "Structural Glazing",
  "ACP Cladding",
  "Semi-Unitized Glazing",
  "Spider Glazing System"
] as const;
