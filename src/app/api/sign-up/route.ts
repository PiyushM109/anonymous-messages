import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(reqest: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await reqest.json();
    await use
  } catch (error) {
    console.log("error while registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering the user",
      },
      {
        status: 500,
      }
    );
  }
}
