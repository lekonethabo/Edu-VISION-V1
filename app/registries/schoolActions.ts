"use server";

import { prisma } from "../../lib/db";
import { SchoolType } from "../../generated/prisma/enums";

export async function getSchoolsAction(
  toolType: string,
  userRole?: string,
  schoolId?: string | null,
) {
  try {
    const baseFilter: any = { toolType };

    const schoolFilter = userRole && ["PRIMARY", "JUNIOR", "UNIFIED", "EARLY", "SPED"].includes(userRole)
      ? { id: schoolId }
      : {};

    const schools = await prisma.school.findMany({
      where: {
        ...baseFilter,
        ...schoolFilter,
      },
      orderBy: { createdAt: "desc" },
      include: {
        fields: true,
      },
    });

    // Map SchoolField records into the flattened school object because the frontend expects column keys
    return {
      success: true,
      data: schools.map((s) => {
        const flattened: Record<string, any> = {
          id: s.id,
          name: s.name,
          toolType: s.toolType,
          createdById: s.createdById,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        };

        s.fields?.forEach((field) => {
          flattened[field.column] = field.value ?? "";
        });

        return flattened;
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

    const fieldEntries = Object.entries(dataFields).filter(([key]) => /^[A-Z]{1,2}$/.test(key));

    const nameField = fieldEntries.find(([key]) => key.toUpperCase() === "A");
    const name = nameField ? String(nameField[1]) : "Unnamed School";

    await prisma.school.create({
      data: {
        id,
        name,
        toolType: toolType as SchoolType,
        fields: {
          create: fieldEntries.map(([column, value]) => ({
            fieldName: column,
            column,
            value: value === undefined || value === null ? null : String(value),
          })),
        },
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

    const fieldEntries = Object.entries(dataFields).filter(([key]) => /^[A-Z]{1,2}$/.test(key));

    const nameField = fieldEntries.find(([key]) => key.toUpperCase() === "A");
    const name = nameField ? String(nameField[1]) : "Unnamed School";

    await prisma.school.update({
      where: { id },
      data: {
        name,
        toolType: toolType as SchoolType,
        fields: {
          deleteMany: {},
          create: fieldEntries.map(([column, value]) => ({
            fieldName: column,
            column,
            value: value === undefined || value === null ? null : String(value),
          })),
        },
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
    await prisma.schoolField.deleteMany({
      where: { schoolId: id },
    });
    await prisma.school.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("deleteSchoolAction error:", error);
    return { success: false, error: "Failed to delete school profile from database." };
  }
}
