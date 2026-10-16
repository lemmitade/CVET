import { PrismaClient } from "@prisma/client";
import { DEFAULT_ATS_RULES, DEFAULT_AI_PROMPTS, DEFAULT_PRICING_PLANS, DEFAULT_WEBSITE_SETTINGS, DEFAULT_PAYMENT_ACCOUNTS } from "../src/lib/default-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Neon database...");

  // 1. Seed Admin User
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@cvet.et";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: "$2a$10$rCvhG9uHwV3l93B0s4wzQe8aTzDq6Z6vY57Yl0pYI1W.vU/kY6fCe", // AdminPassword2026!
        name: "CVET System Admin",
        phone: "+251911234567",
        role: "ADMIN",
        status: "ACTIVE",
      },
    });
    console.log("Super Admin seeded in Neon.");
  }

  // 2. Seed ATS Rules
  for (const rule of DEFAULT_ATS_RULES) {
    await prisma.atsRule.upsert({
      where: { code: rule.code },
      update: {
        title: rule.title,
        weight: rule.weight,
        enabled: rule.enabled,
        severity: rule.severity,
        description: rule.description,
        recommendationTemplate: rule.recommendationTemplate,
      },
      create: {
        code: rule.code,
        title: rule.title,
        category: rule.category,
        weight: rule.weight,
        enabled: rule.enabled,
        severity: rule.severity,
        description: rule.description,
        recommendationTemplate: rule.recommendationTemplate,
      },
    });
  }
  console.log("ATS Rules seeded in Neon.");

  // 3. Seed AI Prompts
  for (const prompt of DEFAULT_AI_PROMPTS) {
    await prisma.aiPrompt.upsert({
      where: { name: prompt.name },
      update: {
        promptText: prompt.promptText,
        model: prompt.model,
        temperature: prompt.temperature,
        maxTokens: prompt.maxTokens,
        description: prompt.description,
        isDefault: prompt.isDefault,
      },
      create: {
        name: prompt.name,
        promptText: prompt.promptText,
        model: prompt.model,
        temperature: prompt.temperature,
        maxTokens: prompt.maxTokens,
        description: prompt.description,
        isDefault: prompt.isDefault,
      },
    });
  }
  console.log("AI Prompts seeded in Neon.");

  // 4. Seed Pricing Plans
  for (const plan of DEFAULT_PRICING_PLANS) {
    await prisma.pricingPlan.upsert({
      where: { name: plan.name },
      update: {
        description: plan.description,
        priceEtb: plan.priceEtb,
        features: JSON.stringify(plan.features),
        isPopular: plan.isPopular,
      },
      create: {
        name: plan.name,
        description: plan.description,
        priceEtb: plan.priceEtb,
        features: JSON.stringify(plan.features),
        isPopular: plan.isPopular,
      },
    });
  }
  console.log("ETB Pricing Plans seeded in Neon.");

  // 5. Seed App Settings
  await prisma.appSetting.upsert({
    where: { key: "paymentAccounts" },
    update: { value: JSON.stringify(DEFAULT_PAYMENT_ACCOUNTS) },
    create: {
      key: "paymentAccounts",
      value: JSON.stringify(DEFAULT_PAYMENT_ACCOUNTS),
      description: "Ethiopian mobile banking recipient details (Telebirr, CBE, Awash)",
    },
  });

  await prisma.appSetting.upsert({
    where: { key: "heroHeadline" },
    update: { value: DEFAULT_WEBSITE_SETTINGS.heroHeadline },
    create: {
      key: "heroHeadline",
      value: DEFAULT_WEBSITE_SETTINGS.heroHeadline,
      description: "Homepage hero headline",
    },
  });

  console.log("Neon database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
