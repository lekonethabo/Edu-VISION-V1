import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id, name, code, relationId } = body as {
      type: string;
      id: string;
      name: string;
      code?: string | null;
      relationId?: string | null;
    };

    if (!id) {
      return NextResponse.json({ success: false, error: "Record id is required." }, { status: 400 });
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });
    }

    switch (type) {
      case "district":
        await prisma.district.update({ data: { name: name.trim(), code: code?.trim() || null }, where: { id } });
        break;
      case "education_region":
        await prisma.educationRegion.update({ data: { name: name.trim(), code: code?.trim() || null }, where: { id } });
        break;
      case "region":
        await prisma.region.update({ data: { name: name.trim(), code: code?.trim() || null }, where: { id } });
        break;
      case "subregion":
        if (!relationId) {
          return NextResponse.json({ success: false, error: "Parent region is required for subregions." }, { status: 400 });
        }
        await prisma.subRegion.update({ data: { name: name.trim(), code: code?.trim() || null, regionId: relationId }, where: { id } });
        break;
      default:
        return NextResponse.json({ success: false, error: "Invalid setup type." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("EMIS setup update error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update setup item." }, { status: 500 });
  }
}
