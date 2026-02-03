import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db"; // your drizzle instance
import * as schema from '../db/schemas/auth'

if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET is not set in .env file");
}

const isDev = process.env.NODE_ENV !== "production";

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    trustedOrigins: [process.env.FRONTEND_URL!, process.env.BETTER_AUTH_URL!],
    ...(isDev && {
        advanced: {
            disableCSRFCheck: true,
        },
    }),
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema,
    }),
    account: {
        fields: {
            providerId: "provider",
            accountId: "providerAccountId",
        },
    },
    session: {
        fields: {
            token: "sessionToken",
            expiresAt: "expires",
        },
    },
    emailAndPassword:{
        enabled: true,
    },
    user:{
        additionalFields:{
            role:{
                type: 'string', required: true, defaultValue: 'student', input: true,
            },
            imageCldPubId:{
                type: 'string', required: false, input: true
            }
        }
    }
});