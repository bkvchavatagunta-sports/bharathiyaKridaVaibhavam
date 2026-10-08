import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: "295123522674137",
  api_secret: "Mp9FCsg6MHBWSFGjL_Z7JBWt5yc",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      "Mp9FCsg6MHBWSFGjL_Z7JBWt5yc"
    );

    return NextResponse.json({ signature });
  } catch (error) {
    return NextResponse.json({ error: "Failed to sign" }, { status: 500 });
  }
}
