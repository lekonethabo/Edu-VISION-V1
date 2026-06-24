"use server";

import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";

const dbUrl = new URL(process.env.DATABASE_URL || "");

const dbAdapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: dbUrl.port ? parseInt(dbUrl.port) : 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1),
  connectTimeout: 10000,
  ssl: {
    rejectUnauthorized: false,
  },
});

const prisma = new PrismaClient({ adapter: dbAdapter });

export async function getSchoolsAction(toolType: string) {
  try {
    const schools = await prisma.school.findMany({
      where: { toolType },
      orderBy: { createdAt: "desc" },
    });

    // Map database results back to the DynamicSchool shape expected by the frontend
    return {
      success: true,
      data: schools.map((s) => {
        const parsedData = typeof s.data === "string" ? JSON.parse(s.data) : s.data;
        return {
          id: s.id,
          ...parsedData,
        };
      }),
    };
  } catch (error) {
    console.error("getSchoolsAction error:", error);
    return { success: false, error: "Failed to load school profiles from database." };
  }
}

export async function addSchoolAction(school: any, toolType: string) {
  try {
    const { id, ...dataFields } = school;

    // Check if school already exists
    const existing = await prisma.school.findUnique({
      where: { id },
    });

    if (existing) {
      return { success: false, error: `A school with Registration Number ${id} already exists.` };
    }

    const nameField = Object.entries(dataFields).find(([key, _]) => 
      key.toUpperCase() === "A" || key === "schoolName" || String(key).includes("name")
    );
    // Standard name field resolution or fallback
    const name = nameField ? String(nameField[1]) : "Unnamed School";

    await prisma.school.create({
      data: {
        id,
        name,
        toolType,
        data: dataFields,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("addSchoolAction error:", error);
    return { success: false, error: "Failed to add school profile to database." };
  }
}

export async function updateSchoolAction(school: any, toolType: string) {
  try {
    const { id, ...dataFields } = school;

    const nameField = Object.entries(dataFields).find(([key, _]) => 
      key.toUpperCase() === "A" || key === "schoolName" || String(key).includes("name")
    );
    const name = nameField ? String(nameField[1]) : "Unnamed School";

    await prisma.school.update({
      where: { id },
      data: {
        name,
        toolType,
        data: dataFields,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("updateSchoolAction error:", error);
    return { success: false, error: "Failed to update school profile in database." };
  }
}

export async function deleteSchoolAction(id: string) {
  try {
    await prisma.school.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("deleteSchoolAction error:", error);
    return { success: false, error: "Failed to delete school profile from database." };
  }
}
