import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  category: varchar("category", { length: 255 }),
  price: integer("price"),
  quantity: integer("quantity"),
  imageUrl: varchar("image_url", { length: 500 }),
  createAt: timestamp("create_At").notNull().defaultNow(),
  updatedAt: timestamp("updated_At").notNull().defaultNow().$onUpdate(()=>new Date()),
});
