import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id } = body as {
      type: string;
      id: string;
    };

    if (!id) {
      return NextResponse.json({ success: false, error: "Record id is required." }, { status: 400 });
    }

    switch (type) {
      case "district":
        await prisma.district.delete({ where: { id } });
        break;
      case "education_region":
        await prisma.educationRegion.delete({ where: { id } });
        break;
      case "region":
        await prisma.region.delete({ where: { id } });
        break;
      case "subregion":
        await prisma.subRegion.delete({ where: { id } });
        break;
      default:
        return NextResponse.json({ success: false, error: "Invalid setup type." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("EMIS setup delete error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to delete setup item." }, { status: 500 });
  }
}
