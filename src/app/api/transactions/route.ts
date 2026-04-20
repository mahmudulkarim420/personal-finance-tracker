import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Transactions API placeholder." });
}

export async function POST() {
  return NextResponse.json({ message: "Create transaction placeholder." });
}
