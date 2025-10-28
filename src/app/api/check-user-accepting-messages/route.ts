import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryUsername = searchParams.get("username");

    if (!queryUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username not provided",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username: queryUsername });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: user.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking user accepting messages status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking user accepting messages status",
      },
      { status: 500 }
    );
  }
}
