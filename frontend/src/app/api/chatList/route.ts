import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { oppId : currentUserId} = await request.json();

    if (!currentUserId) {
      return NextResponse.json(
        { success: false, message: "Missing 'id' parameter" },
        { status: 400 }
      );
    }

    const chatUsers = await prisma.message.findMany({
      where: {
        OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      },
      select: {
        senderId: true,
        receiverId: true,
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
    });

    // Process the data to get unique users
    const users = new Map();
    chatUsers.forEach((message) => {
      if (message.senderId !== currentUserId) {
        users.set(message.senderId, message.sender);
      }
      if (message.receiverId !== currentUserId) {
        users.set(message.receiverId, message.receiver);
      }
    });

    // Convert the Map to an array
    const result = Array.from(users.values());

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat users:", JSON.stringify(error));
    return NextResponse.json(
      { success: false, message: "Error fetching chat users" },
      { status: 500 }
    );
  }
}
