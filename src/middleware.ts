import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req : NextRequest ) {
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET})

    const pathname = req.nextUrl.pathname;

    // session = false && pathname = chat
    if(!session && pathname === '/chat'){
        return NextResponse.redirect(new URL('/', req.url));
    }

    if(session && pathname === '/'){
        return NextResponse.redirect(new URL('/chat', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/chat']
}