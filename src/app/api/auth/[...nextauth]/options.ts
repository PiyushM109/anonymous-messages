import { NextAuthOptions, User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(
        credentials: Record<string, string> | undefined
      ): Promise<User | null> {
        await dbConnect();
        try {
          if (!credentials) {
            throw new Error("No credentials provided");
          }
          const existingUser = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!existingUser || !existingUser._id) {
            throw new Error("No user found with this email");
          }

          if (!existingUser.isVerified) {
            throw new Error("Please verify your account first");
          }

          const isMatch = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );

          if (!isMatch) {
            throw new Error("Password doesn't match");
          }
          console.log({ existingUser });
          const user: User = {
            _id: existingUser._id.toString(),
            isVerified: existingUser.isVerified,
            isAcceptingMessage: existingUser.isAcceptingMessage,
            username: existingUser.username,
            email: existingUser.email,
            id: "",
          };

          return user;
        } catch (error) {
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
