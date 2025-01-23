import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const {msg, senderId, receiverId} = await request.json();

        if(!msg || !senderId || !receiverId){
            return NextResponse.json({success: false, message: 'All fields are mandatory'}, {status: 400});
        }

        const addResponse = await prisma.message.create({
            data:{
                msg,
                senderId,
                receiverId
            },
            select:{
                id: true
            }
        });

        const notifyResponse = await prisma.notification.create({
            data: {
                messageId: addResponse.id,
                content: msg,
                read: false,
                userId: receiverId
            },
            select: {
                id: true
            }
        });

        return NextResponse.json({success: true, notifyId: notifyResponse.id, msgId: addResponse.id}, {status: 200});
        
    } catch (error) {
        console.error("Error saving new message : ", error);
        return NextResponse.json({success: false, message: 'Error in adding to DB'}, {status: 500});
    }
};
