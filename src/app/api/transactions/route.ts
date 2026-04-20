import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  await auth.protect();

  return NextResponse.json({ message: "Transactions API placeholder." });
}

export async function POST() {
  await auth.protect();

  return NextResponse.json({ message: "Create transaction placeholder." });
}
