import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// --- FALLBACK INTELLIGENCE SYSTEM --- //
// Este sistema reemplaza a Gemini cuando la API no tiene cuota
// Analiza palabras clave y genera respuestas contextuales ricas

const getSmartResponse = (message: string, userName: string): { text: string, preferences: string[], triggerOutfit: boolean } => {
    const lowerMsg = message.toLowerCase()
    let responseText = ''
    let detectedPrefs: string[] = []
    let triggerOutfit = false

    // Detectar intención y estilo
    if (lowerMsg.includes('anime') || lowerMsg.includes('manga') || lowerMsg.includes('otaku') || lowerMsg.includes('attack on titan')) {
        detectedPrefs.push('anime')
        responseText = `¡Me encanta el estilo Anime! 🎌 Es una tendencia súper fuerte.\n\nPara ti, ${userName}, recomendaría combinar:\n- Camisetas con estampados gráficos (tipo Attack on Titan o Naruto)\n- Pantalones cargo oscuros o joggers\n- Una chaqueta tipo bomber o hoodie oversized\n\n¿Te gustaría que arme un outfit completo con este estilo ahora?`
        triggerOutfit = true // Sugerir outfit
    }
    else if (lowerMsg.includes('street') || lowerMsg.includes('urbano') || lowerMsg.includes('oversize')) {
        detectedPrefs.push('streetwear')
        responseText = `El Streetwear es pura actitud. 🔥\n\nTe sugiero buscar:\n- Hoodies oversized (clave para el look)\n- Pantalones anchos o 'baggy'\n- Sneakers llamativos\n- Accesorios como gorras o cadenas\n\nHe encontrado algunas prendas en la tienda que te quedarían genial. ¿Las vemos?`
        triggerOutfit = true
    }
    else if (lowerMsg.includes('formal') || lowerMsg.includes('elegante') || lowerMsg.includes('boda') || lowerMsg.includes('reunion')) {
        detectedPrefs.push('formal')
        responseText = `Entiendo, buscas algo más sofisticado. 👔\n\nLa clave está en el ajuste y los colores neutros:\n- Una camisa bien entallada\n- Pantalones chinos o de vestir\n- Zapatos limpios (oxford o mocasines)\n- Un blazer si la ocasión lo amerita\n\n¿Quieres que busque opciones elegantes en nuestro catálogo?`
        triggerOutfit = true
    }
    else if (lowerMsg.includes('casual') || lowerMsg.includes('relax') || lowerMsg.includes('diario') || lowerMsg.includes('universidad')) {
        detectedPrefs.push('casual')
        responseText = `Para el día a día, la comodidad es lo primero, pero sin perder estilo. ✨\n\nUn buen combo sería:\n- Jeans de corte recto o slim\n- Una camiseta básica de buena calidad\n- Una sobrecamisa o chaqueta ligera\n- Tenis cómodos\n\nEs un look versátil que nunca falla. ¿Te armo una propuesta?`
    }
    else if (lowerMsg.includes('color') || lowerMsg.includes('tono') || lowerMsg.includes('piel')) {
        responseText = `Sobre los colores: Si me subes una foto puedo analizar tu colorimetría exacta con IA. 📸\n\nPero como regla general:\n- Pieles cálidas: Dorados, naranjas, rojos, tierras.\n- Pieles frías: Azules, plateados, rosas, grises.\n\n¿Tienes alguna prenda específica que quieras combinar?`
    }
    else {
        // Respuesta genérica amigable
        responseText = `¡Hola ${userName}! Soy UNIX AI, tu estilista personal. 🤖✨\n\nPuedo ayudarte a:\n1. Crear outfits completos\n2. Definir tu estilo (Anime, Streetwear, Casual...)\n3. Combinar prendas de tu closet\n\nCuéntame, ¿qué estilo te llama más la atención hoy?`
    }

    return { text: responseText, preferences: detectedPrefs, triggerOutfit }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { message } = body

        // 1. Obtener usuario
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        // 2. Generar respuesta "inteligente" (Fallback)
        const analysis = getSmartResponse(message || '', user?.name || 'Amigo')

        // 3. Guardar preferencias si se detectaron
        if (analysis.preferences.length > 0) {
            const currentPrefs = user?.styleType ? user.styleType.split(',') : []
            const newPrefs = [...new Set([...currentPrefs, ...analysis.preferences])]
            await prisma.user.update({
                where: { id: session.user.id },
                data: { styleType: newPrefs.join(',') }
            })
        }

        logger.info('AI chat response (Fallback)', {
            context: 'AI_CHAT',
            metadata: { userId: session.user.id, analysis }
        })

        return NextResponse.json({
            response: analysis.text,
            shouldGenerateOutfit: analysis.text.includes('¿Te gustaría que arme') || analysis.text.includes('¿Las vemos?') || analysis.triggerOutfit,
            detectedPreferences: analysis.preferences,
            userStyleType: user?.styleType,
            usingFallback: true // Flag para debug
        })

    } catch (error) {
        logger.error('Error in AI chat', error)
        return NextResponse.json({
            response: '¡Hola! Estoy renovando mis neuronas digitales. ¿Podrías preguntarme de nuevo en un momento? 🤖🔧'
        }, { status: 200 })
    }
}
