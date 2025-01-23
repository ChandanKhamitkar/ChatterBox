import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function POST(request: NextRequest) {
    try {
        const { notifyId } = await request.json();

        if (!notifyId) {
            return NextResponse.json(
                { success: false, message: "Notification id is required are required" },
                { status: 400 }
            );
        }

        const messages = await prisma.notification.update({
            where:{
                id: notifyId
            },
            data: {
                read: true
            }
        });

        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating notification status: ", JSON.stringify(error));
        return NextResponse.json(
            { success: false, message: "Error updating notification status" },
            { status: 500 }
        );
    }
}
