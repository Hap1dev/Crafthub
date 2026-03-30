import { prisma } from '../src/lib/prisma.js';
import bcrypt from "bcrypt";

async function main() {
  const users = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "ADMIN"
    },
    {
      name: "Seller User",
      email: "seller@example.com",
      password: "seller123",
      role: "SELLER"
    },
    {
      name: "Customer User",
      email: "customer@example.com",
      password: "customer123",
      role: "CUSTOMER"
    }
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role
      }
    });
  }

  console.log("✅ Seed data inserted");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });