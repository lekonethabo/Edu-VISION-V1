import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, code, relationId } = body as {
      type: string;
      name: string;
      code?: string | null;
      relationId?: string | null;
    };

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });
    }

    switch (type) {
      case "district":
        await prisma.district.create({ data: { name: name.trim(), code: code?.trim() || null } });
        break;
      case "education_region":
        await prisma.educationRegion.create({ data: { name: name.trim(), code: code?.trim() || null } });
        break;
      case "region":
        await prisma.region.create({ data: { name: name.trim(), code: code?.trim() || null } });
        break;
      case "subregion":
        if (!relationId) {
          return NextResponse.json({ success: false, error: "Parent region is required for subregions." }, { status: 400 });
        }
        await prisma.subRegion.create({ data: { name: name.trim(), code: code?.trim() || null, regionId: relationId } });
        break;
      default:
        return NextResponse.json({ success: false, error: "Invalid setup type." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("EMIS setup create error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create setup item." }, { status: 500 });
  }
}
