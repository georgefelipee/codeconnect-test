import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import CredentialProvider from "next-auth/providers/credentials";
import db from "../../../../../prisma/db";
import bcrypt from 'bcrypt'
export const options = {
    adapter: PrismaAdapter(db),
    session: {
      strategy: 'jwt',
      maxAge: 3000
    },
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      }),
      CredentialProvider({
        credentials: {
            email: {label: "E-mail", type: "email", placeholder: "Digite seu email"},
            password: {label: "Senha", type: "password", placeholder: "Digite sua senha"}
        },
        async authorize(credentials){
          try {
            const foundUser = await db.user.findFirst({
              where: {
                email: credentials.email
              }
            });
            if(foundUser){
              const isPasswordValid =  bcrypt.compareSync(credentials.password, foundUser.password);
              if(isPasswordValid){
                delete foundUser.password;
                return foundUser;
              }

            }
          } catch (error) {
            console.log('Errou ao autorizar um usuario', error)
          }

          return null;
        }
      })
    ],

    callbacks: {
      async jwt({token,user}){
        if(user){
            token.avatar = user.avatar
        }
        return token;
    },
        async session({session,token }){
            if(session?.user){
                session.user.id = parseInt(token.sub)
            }
            return session;
        }
    },
    pages: {
      signIn: "/signin",
    }

}
