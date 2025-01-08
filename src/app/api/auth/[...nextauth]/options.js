import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import CredentialProvider from "next-auth/providers/credentials";
import db from "../../../../../prisma/db";

export const options = {
    adapter: PrismaAdapter(db),
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      }),
      CredentialProvider({
        credentials: {
            email: {label: "E-mail", type: "email", placeholder: "Digite seu email"},
            password: {label: "Senha", type: "password", placeholder: "Digite sua senha"}
        }
      })
    ],

    callbacks: {
        async session({session, user }){
            if(session?.user){
                session.user.id = user.id;
            }
            return session;
        }
    }

}
