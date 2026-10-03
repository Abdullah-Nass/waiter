"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

import { db } from "../prisma/db";
import { hashPassword } from "better-auth/crypto";
import {
  LoginFormValues,
  loginSchema,
  StaffFormValues,
  staffSchema,
} from "../validation";
import { redirect } from "next/navigation";
import { APIError } from "better-auth";

export async function getStaff() {
  try {
    const staff = await db.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: staff };
  } catch {
    return {
      success: false,
      error: "common.errorOccurred",
    };
  }
}

async function verifyAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only administrators can manage staff.");
  }

  return session.user;
}

export async function createStaffMember(values: StaffFormValues) {
  try {
    await verifyAdmin();

    const parsed = staffSchema.safeParse(values);

    if (!parsed.success) {
      return { success: false, error: "admin.staff.errors.invalidFields" };
    }
    const { name, email, password, role } = parsed.data;

    const hashedPassword = await hashPassword(password);

    await db.user.create({
      data: {
        name,
        email,
        role,
        emailVerified: true,
        accounts: {
          create: {
            providerId: "credential",
            accountId: email,
            password: hashedPassword,
          },
        },
      },
    });

    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "admin.staff.errors.emailTaken",
      };
    }

    return {
      success: false,
      error: "common.errorOccurred",
    };
  }
}

export async function deleteStaffMember(userId: string) {
  try {
    const currentUser = await verifyAdmin();

    if (currentUser.id === userId) {
      return {
        success: false,
        error: "admin.auth.errors.ownAccount",
      };
    }

    return await db.$transaction(async (tx) => {
      const target = await tx.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!target) {
        return {
          success: false,
          error: "admin.auth.errors.staffNotFound",
        };
      }

      if (target.role === "ADMIN") {
        const adminCount = await tx.user.count({
          where: { role: "ADMIN" },
        });

        if (adminCount <= 1) {
          return {
            success: false,
            error: "admin.auth.errors.lastAdmin",
          };
        }
      }

      await tx.user.delete({
        where: { id: userId },
      });

      return { success: true };
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return {
          success: false,
          error: "hasOrders",
        };
      }

      return {
        success: false,
        error: "common.errorOccurred",
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: "common.errorOccurred",
      };
    }

    return {
      success: false,
      error: "common.errorOccurred",
    };
  }
}

export async function login(values: LoginFormValues) {
  try {
    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      return { success: false, error: "auth.invalidFields" };
    }

    const { email, password } = parsed.data;

    await auth.api.signInEmail({
      body: { email, password },
    });
  } catch (error: unknown) {
    if (error instanceof APIError && error.status === "UNAUTHORIZED") {
      return {
        success: false,
        error: "auth.invalidCredentials",
      };
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 401
    ) {
      return {
        success: false,
        error: "auth.invalidCredentials",
      };
    }

    return {
      success: false,
      error: "common.errorOccurred",
    };
  }

  redirect("/");
}
