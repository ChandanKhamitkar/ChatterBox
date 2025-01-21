import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const userSession = await getUserSession();
  const { id, email, name, image } = userSession;
  return NextResponse.json(
    { success: true, sessionData: { id, email, image, name } },
    {status : 200}
  );
}
