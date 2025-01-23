import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function POST(request: NextRequest) {
    try {
        const { currentUserId, friendUserId } = await request.json();

        if (!currentUserId || !friendUserId) {
            return NextResponse.json(
                { success: false, message: "Both currentUserId and friendUserId are required" },
                { status: 400 }
            );
        }

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUserId, receiverId: friendUserId },
                    { senderId: friendUserId, receiverId: currentUserId },
                ],
            },
            orderBy: {
                createdAt: 'asc',
            },
            select: {
                id: true,
                msg: true,
                senderId: true,
                receiverId: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            { success: true, data: messages },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching messages: ", JSON.stringify(error));
        return NextResponse.json(
            { success: false, message: "Error fetching messages" },
            { status: 500 }
        );
    }
}
