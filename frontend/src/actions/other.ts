"use server";

import prisma from "@/lib/prisma";

type CreateTestResultInput = {
  testType: "ALZHEIMERS" | "PNEUMONIA" | "BRAIN_TUMOR";
  fileUrl: string;
  fileName: string;
  prediction: string;
  confidence: number;
  fullReport: string;
};

export async function createTestResult(
  userId: string,
  data: CreateTestResultInput
) {
  return await prisma.testResult.create({
    data: {
      userId,
      ...data,
    },
  });
}

type CreateTextReportInput = {
  inputType: "LAB_REPORT" | "PRESCRIPTION";
  prediction: string;
  confidence?: number;
  fullReport: string;
  fileName?: string;
  fileUrl?: string;
};

export async function createTextReport(
  userId: string,
  data: CreateTextReportInput
) {
  return await prisma.textReport.create({
    data: {
      userId,
      ...data,
    },
  });
}

export async function getTestResultsByUser(userId: string) {
  try {
    const results = await prisma.testResult.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return results;
  } catch (error) {
    console.error("Failed to fetch test results:", error);
    return [];
  }
}

export async function getTextReportsByUser(userId: string) {
  try {
    const reports = await prisma.textReport.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reports;
  } catch (error) {
    console.error("Failed to fetch text reports:", error);
    return [];
  }
}
