import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/prisma/db";

async function main() {
  console.log("🌱 Starting seed...");

  const users = [
    {
      name: "Restaurant Manager",
      email: "admin@restaurant.com",
      password: "AdminPassword123!",
      role: "ADMIN" as const,
    },
    {
      name: "Ahmad Waiter",
      email: "waiter@restaurant.com",
      password: "WaiterPassword123!",
      role: "WAITER" as const,
    },
    {
      name: "Chef Tariq",
      email: "kitchen@restaurant.com",
      password: "KitchenPassword123!",
      role: "KITCHEN" as const,
    },
  ];

  for (const u of users) {
    const existing = await db.user.findUnique({ where: { email: u.email } });

    if (existing) {
      console.log(`ℹ  ${u.role} already exists: ${u.email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(u.password, 10);

    await db.user.create({
      data: {
        name: u.name,
        email: u.email,
        emailVerified: true,
        role: u.role,
        accounts: {
          create: {
            accountId: u.email,
            providerId: "credential",
            password: hashedPassword,
          },
        },
      },
    });

    console.log(`✔  ${u.role} created: ${u.email}`);
  }

  const existingCategory = await db.category.findFirst();

  if (existingCategory) {
    console.log("ℹ  Menu already seeded, skipping.");
  } else {
    await db.category.create({
      data: {
        nameEn: "Appetizers",
        nameAr: "المقبلات",
        sortOrder: 1,
        items: {
          create: [
            {
              nameEn: "Hummus with Tahini",
              nameAr: "حمص بالطحينة",
              descEn: "Creamy chickpeas with tahini and virgin olive oil",
              descAr: "حمص كريمي مع طحينة وزيت زيتون بكر",
              price: 3.5,
              available: true,
            },
            {
              nameEn: "Fattoush Salad",
              nameAr: "فتوش",
              descEn:
                "Levantine salad with toasted pita chips and fresh vegetables",
              descAr: "سلطة شامية بقطع الخبز المقرمش والخضروات الطازجة",
              price: 4.0,
              available: true,
            },
          ],
        },
      },
    });

    await db.category.create({
      data: {
        nameEn: "Main Dishes",
        nameAr: "الأطباق الرئيسية",
        sortOrder: 2,
        items: {
          create: [
            {
              nameEn: "Mixed Grill Platter",
              nameAr: "مشاوي مشكلة",
              descEn:
                "Shish tawook, kofta, and lamb kebab with grilled vegetables",
              descAr:
                "تشكيلة من الشيش طاووق، الكفتة، وكباب الغنم مع خضار مشوية",
              price: 14.5,
              available: true,
            },
            {
              nameEn: "Grilled Chicken",
              nameAr: "دجاج مشوي",
              descEn: "Marinated whole chicken grilled over charcoal",
              descAr: "دجاج متبل مشوي على الفحم",
              price: 10.0,
              available: true,
            },
          ],
        },
      },
    });

    await db.category.create({
      data: {
        nameEn: "Drinks",
        nameAr: "المشروبات",
        sortOrder: 3,
        items: {
          create: [
            {
              nameEn: "Fresh Lemonade",
              nameAr: "ليمون عصير طازج",
              descEn: "Freshly squeezed lemonade with mint",
              descAr: "عصير ليمون طازج مع النعناع",
              price: 2.5,
              available: true,
            },
            {
              nameEn: "Arabic Coffee",
              nameAr: "قهوة عربية",
              descEn: "Traditional Arabic coffee with cardamom",
              descAr: "قهوة عربية تقليدية مع الهيل",
              price: 1.5,
              available: true,
            },
          ],
        },
      },
    });

    console.log("✔  Menu categories and items created");
  }

  console.log("✨ Seed completed successfully.");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
