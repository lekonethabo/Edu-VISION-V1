import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type SetupType = "district" | "education_region" | "region" | "subregion";

type SetupPayload = Array<{
  id: string;
  name: string;
  code: string | null;
  relationName?: string;
  regionId?: string;
}>;

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type") as SetupType | null;
    if (!type || !["district", "education_region", "region", "subregion"].includes(type)) {
      return NextResponse.json({ success: false, error: "Invalid type parameter." }, { status: 400 });
    }

    let payload: SetupPayload = [];
    switch (type) {
      case "district": {
        const results = await prisma.district.findMany({ orderBy: { name: "asc" } });
        payload = results.map((row) => ({ id: row.id, name: row.name, code: row.code }));
        break;
      }
      case "education_region": {
        const results = await prisma.educationRegion.findMany({ orderBy: { name: "asc" } });
        payload = results.map((row) => ({ id: row.id, name: row.name, code: row.code }));
        break;
      }
      case "region": {
        const results = await prisma.region.findMany({ orderBy: { name: "asc" } });
        payload = results.map((row) => ({ id: row.id, name: row.name, code: row.code }));
        break;
      }
      case "subregion": {
        const results = await prisma.subRegion.findMany({ orderBy: { name: "asc" }, include: { region: true } });
        payload = results.map((row) => ({
          id: row.id,
          name: row.name,
          code: row.code,
          relationName: row.region?.name ?? "",
          regionId: row.regionId,
        }));
        break;
      }
      default:
        payload = [];
    }

    return NextResponse.json({ success: true, data: payload });
  } catch (error: any) {
    console.error("EMIS setup GET error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to retrieve setup items." }, { status: 500 });
  }
}
