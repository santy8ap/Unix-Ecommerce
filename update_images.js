const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const placeholderImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60", // T-shirt
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=60", // Hoodie
  "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=60", // Shirt
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=60", // Running shirt
  "https://images.unsplash.com/photo-1503342217505-b0815a046baf?w=800&auto=format&fit=crop&q=60", // Vintage
];

async function main() {
  const products = await prisma.product.findMany();

  console.log(`Found total ${products.length} products.`);

  const productsToUpdate = products.filter(
    (p) => !p.images || p.images.length === 0
  );
  console.log(`Found ${productsToUpdate.length} products with no images.`);

  for (let i = 0; i < productsToUpdate.length; i++) {
    const product = productsToUpdate[i];
    const randomImage = placeholderImages[i % placeholderImages.length];

    await prisma.product.update({
      where: { id: product.id },
      data: {
        images: [randomImage],
      },
    });
    console.log(`Updated product ${product.name} with image ${randomImage}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
