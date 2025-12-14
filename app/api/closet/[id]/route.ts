import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const params = await props.params;
    const { id } = params;

    // Verificar que el item existe y pertenece al usuario
    const item = await prisma.closetItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Prenda no encontrada" },
        { status: 404 },
      );
    }

    if (item.userId !== session.user.id) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar esta prenda" },
        { status: 403 },
      );
    }

    await prisma.closetItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Error al eliminar la prenda" },
      { status: 500 },
    );
  }
}
