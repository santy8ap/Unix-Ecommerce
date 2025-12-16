/**
 * API Endpoint para Chat de Onboarding con IA
 * Maneja la conversación inteligente para descubrir el estilo del usuario
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getGeminiModel } from '@/lib/services/ai/gemini'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { message, conversationHistory, currentStep, collectedData } = await req.json()

        const model = getGeminiModel()

        // Contexto del asistente
        const systemContext = `Eres un experto asesor de moda e imagen personal. Tu trabajo es tener una conversación natural y amigable con el usuario para descubrir:

1. Su tono de piel (warm/cool/neutral)
2. Su estilo preferido (casual/formal/sporty/elegant/bohemian)
3. Sus preferencias de moda
4. Colores favoritos
5. Ocasiones para las que viste

INSTRUCCIONES:
- Sé conversacional, amigable y natural - como un amigo que ayuda
- Haz UNA pregunta a la vez
- Usa emojis ocasionalmente para ser más amigable
- Si el usuario menciona información relevante, extráela
- Cuando tengas suficiente información (después de 4-5 intercambios), genera el perfil final

DATOS RECOPILADOS HASTA AHORA:
${JSON.stringify(collectedData, null, 2)}

PASO ACTUAL: ${currentStep}/4

HISTORIAL DE CONVERSACIÓN:
${conversationHistory.map((m: any) => `${m.role}: ${m.content}`).join('\n')}

USUARIO DICE: "${message}"

RESPONDE CON UN JSON:
{
  "response": "Tu respuesta conversacional al usuario",
  "extractedData": {
    "skinTone": "warm/cool/neutral (si lo mencionó o puedes inferirlo)",
    "styleType": "casual/formal/etc (si lo mencionó)",
    "hairColor": "si lo mencionó",
    "eyeColor": "si lo mencionó",
    "favoriteColors": ["colores mencionados"],
    "occasions": ["ocasiones mencionadas"]
  },
  "nextStep": ${currentStep + 1},
  "completed": false o true (si ya tienes skinTone y styleType),
  "finalData": {
    "skinTone": "valor final",
    "styleType": "valor final",
    "allPreferences": {}
  }
}

SOLO responde con el JSON, sin  texto adicional.`

        const result = await model.generateContent(systemContext)
        const response = await result.response
        let text = response.text()

        try {
            // Limpiar markdown
            text = text.trim()
            text = text.replace(/```json\s*/gi, '')
            text = text.replace(/```\s*/g, '')

            // Extraer JSON
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (!jsonMatch) {
                throw new Error('No JSON found')
            }

            const data = JSON.parse(jsonMatch[0])

            return NextResponse.json(data)
        } catch (error) {
            console.error('Error parsing AI response:', error)
            console.error('Response:', text)

            //Fallback response
            return NextResponse.json({
                response:
                    'Interesante! Cuéntame más sobre tu estilo personal. ¿Qué tipo de ropa te gusta usar normalmente? 👕',
                extractedData: {},
                nextStep: currentStep + 1,
                completed: false,
            })
        }
    } catch (error) {
        console.error('Error in chat onboarding:', error)
        return NextResponse.json(
            { error: 'Error procesando conversación' },
            { status: 500 }
        )
    }
}
