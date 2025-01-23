import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const {friendEmail} = await request.json();

        if(!friendEmail){
            return NextResponse.json({success: false, message: 'All fields are mandatory'}, {status: 400});
        }

        const newFriendDetails = await prisma.user.findUnique({
            where: {
                email: friendEmail
            },
            select :{
                id: true,
                name: true,
                email: true,
                image: true
            }
        });

        return NextResponse.json({success: true, data: newFriendDetails}, {status: 200});
        
    } catch (error) {
        console.error("Error getting new friend user details : ", error);
        return NextResponse.json({success: false, message: 'Error getting new friend user details'}, {status: 500});
    }
};
