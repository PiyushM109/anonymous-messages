import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }
    console.log({ user });
    const userId = new mongoose.Types.ObjectId(user._id);
    console.log(userId);
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    console.log(userMessages);
    if (!userMessages || userMessages.length == 0) {
      return Response.json(
        {
          success: false,
          message: "User messages not found",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        messages: userMessages[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    Response.json(
      {
        success: false,
        message: "error occured whilte get-messages",
      },
      { status: 500 }
    );
  }
}
