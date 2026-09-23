"use server";

import { db } from "../prisma/db";

type CreateCategoryInput = {
  catAr: string;
  catEn: string;
};

export async function createCategory({ catAr, catEn }: CreateCategoryInput) {
  try {
    const category = await db.category.create({
      data: {
        nameAr: catAr,
        nameEn: catEn,
      },
    });

    return { success: true, data: category };
  } catch {
    return {
      success: false,
      error: "common.errorOccurred",
    };
  }
}

type CreateMenuItemInput = {
  nameAr: string;
  nameEn: string;
  descAr?: string;
  descEn?: string;
  price: number;
  image?: string;
  available?: boolean;
  categoryId: number;
};

export async function createMenuItem(input: CreateMenuItemInput) {
  try {
    const menuItem = await db.menuItem.create({
      data: {
        nameAr: input.nameAr,
        nameEn: input.nameEn,
        descAr: input.descAr,
        descEn: input.descEn,
        price: input.price,
        categoryId: input.categoryId,
      },
    });

    return { success: true, data: menuItem };
  } catch {
    return {
      success: false,
      error: "common.errorOccurred",
    };
  }
}

export async function deleteCategory({ categoryId }: { categoryId: number }) {
  try {
    const category = await db.category.delete({
      where: { id: categoryId },
    });

    return { success: true, data: category };
  } catch {
    return {
      success: false,
      error: "common.errorOccurred",
    };
  }
}
export async function deleteItem({ itemId }: { itemId: number }) {
  try {
    const item = await db.menuItem.delete({
      where: { id: itemId },
    });

    return { success: true, data: item };
  } catch {
    return {
      success: false,
      error: "common.errorOccurred",
    };
  }
}
