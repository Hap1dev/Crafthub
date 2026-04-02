import { prisma } from '../src/lib/prisma.js';

async function main() {
  console.log("seeding products...");

  // 1. Ensure we have a Seller
  let seller = await prisma.user.findFirst({
    where: { role: 'SELLER' }
  });

  if (!seller) {
    console.log("no seller found, creating a default seller...");
    seller = await prisma.user.create({
      data: {
        name: "Test Seller",
        email: "testseller@example.com",
        password: "password123", // Note: In a real app, this should be hashed
        role: "SELLER"
      }
    });
  }

  // 2. Create Categories
  const categoriesData = [
    { name: "Electronics" },
    { name: "Furniture" },
    { name: "Clothing" },
    { name: "Art" }
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat
    });
    categories.push(category);
  }

  // 3. Create Products
  const productsData = [
    {
      title: "Mechanical Keyboard",
      description: "Tactile feedback and RGB lighting.",
      image: "https://example.com/kbd.jpg",
      price: 89.99,
      stock: 50,
      categoryId: categories.find(c => c.name === "Electronics").id,
      sellerId: seller.id
    },
    {
      title: "Oak Dining Table",
      description: "Solid wood 6-seater table.",
      image: "https://example.com/table.jpg",
      price: 450.00,
      stock: 5,
      categoryId: categories.find(c => c.name === "Furniture").id,
      sellerId: seller.id
    },
    {
      title: "Cotton T-Shirt",
      description: "100% organic cotton, breathable.",
      image: "https://example.com/shirt.jpg",
      price: 19.99,
      stock: 100,
      categoryId: categories.find(c => c.name === "Clothing").id,
      sellerId: seller.id
    }
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: {
        // Using title as a pseudo-unique identifier for seeding purposes
        id: (await prisma.product.findFirst({ where: { title: product.title } }))?.id || "00000000-0000-0000-0000-000000000000"
      },
      update: product,
      create: product
    });
  }

  console.log("product seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
