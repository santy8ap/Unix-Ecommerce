import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { 
  CLOTHING_CATEGORIES, 
  CLOTHING_CONDITIONS, 
  SEASONS, 
  OCCASIONS, 
  COLORS,
  CLOTHING_SIZES
} from "@/lib/constants/clothing";

// Tipos para validación
type ClosetItemInput = {
  name: string;
  description?: string;
  category: string;
  brand?: string;
  color?: string;
  size?: string;
  price?: number;
  purchaseDate?: string;
  imageUrl?: string;
  isFavorite?: boolean;
  condition?: string;
  season?: string;
  occasion?: string;
  notes?: string;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const data: ClosetItemInput = await req.json();

    // Validación de campos requeridos
    if (!data.name || !data.category) {
      return NextResponse.json(
        { error: "El nombre y la categoría son obligatorios" },
        { status: 400 },
      );
    }

    // Validación de categorías y valores permitidos
    if (!CLOTHING_CATEGORIES.includes(data.category as any)) {
      return NextResponse.json(
        { error: "Categoría no válida" },
        { status: 400 },
      );
    }

    if (data.size && !CLOTHING_SIZES.includes(data.size as any)) {
      return NextResponse.json(
        { error: "Talla no válida" },
        { status: 400 },
      );
    }

    if (data.condition && !CLOTHING_CONDITIONS.includes(data.condition as any)) {
      return NextResponse.json(
        { error: "Condición no válida" },
        { status: 400 },
      );
    }

    if (data.season && !SEASONS.includes(data.season as any)) {
      return NextResponse.json(
        { error: "Temporada no válida" },
        { status: 400 },
      );
    }

    if (data.occasion && !OCCASIONS.includes(data.occasion as any)) {
      return NextResponse.json(
        { error: "Ocasión no válida" },
        { status: 400 },
      );
    }

    if (data.color && !COLORS.includes(data.color as any)) {
      return NextResponse.json(
        { error: "Color no válido" },
        { status: 400 },
      );
    }

    // Formatear fechas
    const purchaseDateValue = data.purchaseDate 
      ? new Date(data.purchaseDate)
      : null;

    // Crear el ítem
    const newItem = await prisma.closetItem.create({
      data: {
        userId,
        name: data.name.trim(),
        description: data.description?.trim(),
        category: data.category,
        brand: data.brand?.trim(),
        color: data.color,
        size: data.size,
        price: data.price,
        purchaseDate: purchaseDateValue,
        imageUrl: data.imageUrl,
        isFavorite: data.isFavorite || false,
        condition: data.condition,
        season: data.season,
        occasion: data.occasion,
        notes: data.notes?.trim(),
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Error adding closet item:", error);
    return NextResponse.json(
      { error: "Error al guardar la prenda" },
      { status: 500 },
    );
  }
}
