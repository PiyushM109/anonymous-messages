import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
      return;
    }
    const isCodeValid = user?.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      Response.json(
        {
          success: true,
          message: "user verified successfully",
        },
        { status: 200 }
      );
      return;
    }

    if (!isCodeValid) {
      Response.json(
        {
          success: false,
          message: "invalid code",
        },
        { status: 400 }
      );
      return;
    }

    if (!isCodeNotExpired) {
      Response.json(
        {
          success: false,
          message: "code expired",
        },
        { status: 400 }
      );
      return;
    }

    Response.json(
      {
        success: false,
        message: "code validation failed",
      },
      { status: 400 }
    );
  } catch (error) {
    console.log("error validating the code", error);
    Response.json(
      {
        success: false,
        message: "Server error while validating code",
      },
      { status: 500 }
    );
  }
}
