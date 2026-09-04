import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { getUserByEmail, getUserByPhoneNumber } from "./lib/db/users";
import { checkRateLimit, resetRateLimit } from "./lib/utils/rateLimit";

const DUMMY_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8i9wA5nBt2q0/g2n3M8/H2QwWQ4vDS";

class TooManyAttemptsError extends CredentialsSignin {
  code = "too_many_attempts";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email or mobile phone number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const identifier = (credentials.identifier as string)
          .trim()
          .toLowerCase();
        const password = credentials.password as string;

        const rateLimitKey = `login:${identifier}`;
        const { allowed } = checkRateLimit(rateLimitKey);

        if (!allowed) {
          throw new TooManyAttemptsError();
        }

        const isEmail = identifier.includes("@");
        const user = isEmail
          ? await getUserByEmail(identifier)
          : await getUserByPhoneNumber(identifier);

        const passwordMatch = await bcrypt.compare(
          password,
          user?.passwordHash ?? DUMMY_HASH,
        );

        if (!user || !passwordMatch) return null;

        resetRateLimit(rateLimitKey);

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});
