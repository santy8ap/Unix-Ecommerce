import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

// Configuración para el almacenamiento en Vercel Blob
import { put } from '@vercel/blob';

// Configuración para la API de generación de imágenes (ejemplo con Replicate)
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_MODEL = "stability-ai/sdxl:2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const items = JSON.parse(formData.get('items') as string);
    const imagePrompt = formData.get('prompt') as string;
    
    if (!name || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Nombre y prendas son obligatorios" },
        { status: 400 }
      );
    }

    // Generar imagen con IA
    let imageUrl = null;
    if (imagePrompt && REPLICATE_API_TOKEN) {
      try {
        const response = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version: REPLICATE_MODEL,
            input: {
              prompt: `Fashion outfit: ${imagePrompt}. High quality, detailed, realistic.`,
              negative_prompt: "low quality, blurry, distorted, bad anatomy, text, watermark, signature",
              width: 512,
              height: 768,
              num_outputs: 1,
              num_inference_steps: 30,
            },
          }),
        });

        const prediction = await response.json();
        
        // Esperar a que la generación de la imagen termine
        let generatedImageUrl = null;
        let attempts = 0;
        const maxAttempts = 30; // Máximo 30 intentos (30 segundos)
        
        while (attempts < maxAttempts) {
          const statusResponse = await fetch(prediction.urls.get, {
            headers: {
              'Authorization': `Token ${REPLICATE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
          });
          
          const status = await statusResponse.json();
          
          if (status.status === 'succeeded') {
            generatedImageUrl = status.output[0];
            break;
          } else if (status.status === 'failed') {
            throw new Error('La generación de la imagen falló');
          }
          
          // Esperar 1 segundo antes de volver a verificar
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts++;
        }
        
        if (generatedImageUrl) {
          // Descargar la imagen y subirla a nuestro almacenamiento
          const imageResponse = await fetch(generatedImageUrl);
          const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
          
          // Subir a Vercel Blob (o tu servicio de almacenamiento preferido)
          const filename = `outfits/${uuidv4()}.png`;
          const blob = await put(filename, imageBuffer, {
            access: 'public',
            contentType: 'image/png',
          });
          
          imageUrl = blob.url;
        }
      } catch (error) {
        console.error("Error generating image:", error);
        // Continuar sin imagen si hay un error
      }
    }

    const outfit = await prisma.outfit.create({
      data: {
        userId: session.user.id,
        name,
        description,
        items,
        imageUrl,
      },
    });

    return NextResponse.json(outfit);
  } catch (error) {
    console.error("Error saving outfit:", error);
    return NextResponse.json(
      { error: "Error al guardar el outfit" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const skip = (page - 1) * limit;

    const [outfits, total] = await Promise.all([
      prisma.outfit.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.outfit.count({ where: { userId: session.user.id } })
    ]);

    return NextResponse.json({
      outfits,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("Error fetching outfits:", error);
    return NextResponse.json(
      { error: "Error al cargar los outfits" },
      { status: 500 }
    );
  }
}
