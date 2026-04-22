import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const clerkId = "user_3CbrEKdsuq9Bksanwv7DWkCT99t";

  const user = await db.user.findUnique({ where: { clerkId } });

  if (!user) {
    console.error(`❌ No user found with clerkId: ${clerkId}`);
    process.exit(1);
  }

  await db.user.update({
    where: { clerkId },
    data: { role: "admin" },
  });

  console.log(`✅ User ${user.email} promoted to admin successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
