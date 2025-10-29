import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { success } from "zod";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  console.log({ params });
  const { messageId } = await params;
  console.log({ messageId });
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: " Not Authenticated",
        },
        { status: 401 }
      );
    }
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if (updatedResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    Response.json(
      {
        success: false,
        message: "error occured whilte delete-messages",
      },
      { status: 500 }
    );
  }
}
