import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const {userId}  = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing 'userId' parameter" },
        { status: 400 }
      );
    }
    const unreadNotifications = await prisma.notification.findMany({
      where: {
        userId: userId,
        read: false
      },
      select:{
        id: true,
        content: true,
        createdAt: true,
        message: {
          select: {
            sender: {
              select:{
                name: true,
                image: true
              },
            },
          },
        },
      },
    });

    const result = unreadNotifications.map((notification) => ({
      id: notification.id,
      content: notification.content,
      createdAt: notification.createdAt,
      sender: notification.message?.sender || null,
    }));

    return NextResponse.json({ success: true, list: result }, {status : 200});
  } catch (error) {
    console.error("Error fetching unread message : ", JSON.stringify(error));
    return NextResponse.json(
      { success: false, message: "Error in fetching unread message" },
      { status: 500 }
    );
  }
}
