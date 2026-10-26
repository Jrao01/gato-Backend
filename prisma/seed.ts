import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Cerveza", description: "Nacionales e importadas; botellas, latas, botellones, packs y sixpacks" },
  { name: "Ron y Licor", description: "Rones añejos, licores secos, cocuy, anís" },
  { name: "Whisky", description: "Destilados de alta rotación" },
  { name: "Vino", description: "Tintos, blancos, rosados, sangrías" },
  { name: "Refrescos", description: "Agua mineral, refrescos, malta, bebidas energéticas, jugos" },
  { name: "Cigarrillos", description: "Cajetillas, tabacos, encendedores y accesorios" },
  { name: "Chucherías", description: "Galletas, chocolates, papas fritas, golosinas" },
  { name: "Hielo", description: "Bolsas de hielo, vasos plásticos" },
  { name: "Otros", description: "Artículos de menor rotación" },
];

const SUPPLIERS = [
  { name: "Distribuidora Polar", phone: "0241-1234567", rif: "J-12345678-9", address: "Valencia, Carabobo" },
  { name: "Cervecería Nacional", phone: "0212-9876543", rif: "J-98765432-1" },
  { name: "Licores de Venezuela", phone: "0241-5555555" },
  { name: "Refrescos del Centro", phone: "0241-4444444" },
];

const ENTITIES = [
  { name: "Distribuidora Polar", type: "PROVEEDOR", rifCedula: "J-12345678-9" },
  { name: "Alcaldía de Naguanagua", type: "GOBIERNO" },
  { name: "Juan Pérez", type: "TRABAJADOR", rifCedula: "V-12.345.678" },
  { name: "Propietario Local", type: "PROPIETARIO" },
];

const PRODUCTS = [
  { name: "Cerveza Polar 355ml (lata)", category: "Cerveza", unit: "LATA", costPrice: 0.35, wholesalePrice: 0.45, retailPrice: 0.55, stock: 120, minStock: 24 },
  { name: "Cerveza Polar 355ml sixpack", category: "Cerveza", unit: "SIXPACK", costPrice: 1.95, wholesalePrice: 2.55, retailPrice: 2.95, stock: 60, minStock: 12 },
  { name: "Ron Santa Teresa 750ml", category: "Ron y Licor", unit: "BOTELLA", costPrice: 7.5, wholesalePrice: 9.5, retailPrice: 11.0, stock: 25, minStock: 6 },
  { name: "Whisky Buchanan's 750ml", category: "Whisky", unit: "BOTELLA", costPrice: 22.0, wholesalePrice: 26.0, retailPrice: 30.0, stock: 12, minStock: 3 },
  { name: "Coca-Cola 2L", category: "Refrescos", unit: "BOTELLA", costPrice: 1.0, wholesalePrice: 1.25, retailPrice: 1.5, stock: 80, minStock: 24 },
  { name: "Cigarrillos Marlboro Rojo (cajetilla)", category: "Cigarrillos", unit: "PACK", costPrice: 2.0, wholesalePrice: 2.4, retailPrice: 2.75, stock: 50, minStock: 12 },
  { name: "Hielo Polar 1.5kg", category: "Hielo", unit: "BOLSA", costPrice: 0.5, wholesalePrice: 0.7, retailPrice: 0.85, stock: 40, minStock: 10 },
];

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.category.createMany({
    data: CATEGORIES,
    skipDuplicates: true,
  });

  await prisma.supplier.createMany({
    data: SUPPLIERS,
    skipDuplicates: true,
  });

  await prisma.entity.createMany({
    data: ENTITIES,
    skipDuplicates: true,
  });

  const categoryMap = new Map(
    (await prisma.category.findMany()).map((c) => [c.name, c.id]),
  );
  const supplierMap = new Map(
    (await prisma.supplier.findMany()).map((s) => [s.name, s.id]),
  );

  for (const p of PRODUCTS) {
    const categoryId = categoryMap.get(p.category);
    const supplierId = supplierMap.get("Distribuidora Polar");
    if (!categoryId) continue;

    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (existing) continue;

    await prisma.product.create({
      data: {
        name: p.name,
        categoryId,
        supplierId,
        unit: p.unit as never,
        costPrice: p.costPrice,
        wholesalePrice: p.wholesalePrice,
        retailPrice: p.retailPrice,
        stock: p.stock,
        minStock: p.minStock,
      },
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const existingRate = await prisma.exchangeRate.findUnique({ where: { date: today } });
  if (!existingRate) {
    await prisma.exchangeRate.create({
      data: {
        date: today,
        rate: 47.35,
      },
    });
  }

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
