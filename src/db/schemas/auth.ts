
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


const timestamps = {
  createdAt: timestamp("created_At").defaultNow().notNull(),
  updatedAt: timestamp("update_At")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const roleEnum = pgEnum("role", ["student", "teacher", "admin"]);

export const user = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: boolean("email_Verified").default(false).notNull(),
  image: text("image"),
  role: roleEnum("role").default("student").notNull(),
  imageCldPubId: text("image_cld_pub_id"),
  ...timestamps,
});

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
}));

export const account = pgTable(
  "account",
  {
    id: text("id").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: text("account_id"),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    password: text("password"),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    ...timestamps,
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const session = pgTable("session", {
   id: text("id").primaryKey(),
  sessionToken: text("session_Token").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
  expires: timestamp("expires_at", { mode: "date" }).notNull(),
  ...timestamps,
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const verificationToken = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
