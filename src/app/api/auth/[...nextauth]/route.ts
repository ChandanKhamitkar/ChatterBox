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
        console.log(url);
        return `${baseUrl}/chat`;
      },
      async signIn({account, profile}){
       console.log(account);
        if(!profile?.email){
            throw new Error('No Profile')
        }

        const profileData = profile as any;
        await prisma.user.upsert({
            where:{
                email: profile.email,
            },
            create: {
                email: profile.email,
                name: profile.name ?? "Anonymous",
                image: profileData.picture
              },
              update: {
                ...(profile.name && { name: profile.name }),
                image: profileData.picture
              }
              
        })
        return true
     },
     session,
     async jwt({token, user, account, profile}) {
      console.log(user, account);
        if(profile){
            const user = await prisma.user.findUnique({
                where: {
                    email: profile.email,
                    name: profile.name,
                    image: profile.image
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
