import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { session } from '@/lib/session';

const authOption: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ], 
  callbacks: {
    redirect: ({url, baseUrl} : any ) => {
        return `${baseUrl}/chat`;
    },
     async signIn({account, profile}){
        if(!profile?.email){
            throw new Error('No Profile')
        }

        await prisma.user.upsert({
            where:{
                email: profile.email,
            },
            create: {
                email: profile.email,
                name: profile.name ?? "Anonymous",
                image: profile.image
              },
              update: {
                ...(profile.name && { name: profile.name }),
                image: profile.image
              }
              
        })
        return true
     },
     session,
     async jwt({token, user, account, profile}) {
        if(profile){
            const user = await prisma.user.findUnique({
                where: {
                    email: profile.email,
                },
            })
            if(!user){
                throw new Error('No user found')
            }
            token.id = user.id;
        }
        return token
     }
  }
};

const handler = NextAuth(authOption)
export {handler as GET, handler as POST} 
