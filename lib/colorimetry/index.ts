/**
 * 🎨 Servicio de Colorimetría para UNIX
 * Maneja la lógica de análisis de colores y recomendaciones sin IA
 */

export type SkinTone = 'warm' | 'cool' | 'neutral'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type Undertone = 'golden' | 'pink' | 'olive'

export interface ColorPalette {
    hex: string
    name: string
    category: 'best' | 'good' | 'avoid'
}

/**
 * Paletas de colores por tono de piel
 */
export const COLOR_PALETTES: Record<SkinTone, {
    bestColors: ColorPalette[]
    goodColors: ColorPalette[]
    avoidColors: ColorPalette[]
}> = {
    warm: {
        bestColors: [
            { hex: '#D4AF37', name: 'Dorado', category: 'best' },
            { hex: '#8B4513', name: 'Marrón', category: 'best' },
            { hex: '#FF8C00', name: 'Naranja', category: 'best' },
            { hex: '#DC143C', name: 'Rojo Cálido', category: 'best' },
            { hex: '#FFD700', name: 'Amarillo Dorado', category: 'best' },
            { hex: '#CD853F', name: 'Caramelo', category: 'best' },
            { hex: '#F0E68C', name: 'Beige Amarillo', category: 'best' },
            { hex: '#228B22', name: 'Verde Oliva', category: 'best' },
        ],
        goodColors: [
            { hex: '#FFA07A', name: 'Salmón', category: 'good' },
            { hex: '#FFDEAD', name: 'Crema', category: 'good' },
            { hex: '#DEB887', name: 'Beige', category: 'good' },
            { hex: '#D2691E', name: 'Chocolate', category: 'good' },
        ],
        avoidColors: [
            { hex: '#C0C0C0', name: 'Plateado', category: 'avoid' },
            { hex: '#4169E1', name: 'Azul Frío', category: 'avoid' },
            { hex: '#FF69B4', name: 'Rosa Chicle', category: 'avoid' },
            { hex: '#000080', name: 'Azul Marino Frío', category: 'avoid' },
        ],
    },
    cool: {
        bestColors: [
            { hex: '#C0C0C0', name: 'Plateado', category: 'best' },
            { hex: '#4169E1', name: 'Azul Royal', category: 'best' },
            { hex: '#FF69B4', name: 'Rosa', category: 'best' },
            { hex: '#9370DB', name: 'Púrpura', category: 'best' },
            { hex: '#708090', name: 'Gris Pizarra', category: 'best' },
            { hex: '#00CED1', name: 'Turquesa', category: 'best' },
            { hex: '#E6E6FA', name: 'Lavanda', category: 'best' },
            { hex: '#B0E0E6', name: 'Azul Pastel', category: 'best' },
        ],
        goodColors: [
            { hex: '#FFFFFF', name: 'Blanco Puro', category: 'good' },
            { hex: '#000000', name: 'Negro', category: 'good' },
            { hex: '#87CEEB', name: 'Azul Cielo', category: 'good' },
            { hex: '#DDA0DD', name: 'Ciruela', category: 'good' },
        ],
        avoidColors: [
            { hex: '#D4AF37', name: 'Dorado', category: 'avoid' },
            { hex: '#FF8C00', name: 'Naranja', category: 'avoid' },
            { hex: '#8B4513', name: 'Marrón Cálido', category: 'avoid' },
            { hex: '#F0E68C', name: 'Amarillo Cálido', category: 'avoid' },
        ],
    },
    neutral: {
        bestColors: [
            { hex: '#F5F5DC', name: 'Beige', category: 'best' },
            { hex: '#696969', name: 'Gris', category: 'best' },
            { hex: '#2F4F4F', name: 'Gris Pizarra Oscuro', category: 'best' },
            { hex: '#FFFFF0', name: 'Marfil', category: 'best' },
            { hex: '#800020', name: 'Borgoña', category: 'best' },
            { hex: '#008080', name: 'Verde Azulado', category: 'best' },
            { hex: '#800080', name: 'Púrpura Medio', category: 'best' },
            { hex: '#556B2F', name: 'Verde Oliva Oscuro', category: 'best' },
        ],
        goodColors: [
            { hex: '#F0E68C', name: 'Khaki', category: 'good' },
            { hex: '#4682B4', name: 'Azul Acero', category: 'good' },
            { hex: '#CD5C5C', name: 'Rojo Indio', category: 'good' },
            { hex: '#8FBC8F', name: 'Verde Mar Oscuro', category: 'good' },
            { hex: '#D4AF37', name: 'Oro', category: 'good' },
            { hex: '#C0C0C0', name: 'Plata', category: 'good' },
        ],
        avoidColors: [
            { hex: '#FF00FF', name: 'Magenta Brillante', category: 'avoid' },
            { hex: '#00FF00', name: 'Verde Neón', category: 'avoid' },
            { hex: '#FFFF00', name: 'Amarillo Neón', category: 'avoid' },
        ],
    },
}

/**
 * Recomendaciones de metales según tono de piel
 */
export const METAL_RECOMMENDATIONS: Record<SkinTone, string[]> = {
    warm: ['Oro', 'Bronce', 'Cobre', 'Oro rosa'],
    cool: ['Plata', 'Platino', 'Oro blanco', 'Acero'],
    neutral: ['Oro', 'Plata', 'Oro rosa', 'Cualquier metal'],
}

/**
 * Recomendaciones de patrones según temporada
 */
export const PATTERN_RECOMMENDATIONS: Record<Season, string[]> = {
    spring: ['Florales pequeños', 'Rayas delgadas', 'Lunares pequeños', 'Estampados delicados'],
    summer: ['Florales suaves', 'Rayas medianas', 'Acuarelas', 'Estampados frescos'],
    autumn: ['Florales grandes', 'Rayas anchas', 'Cuadros', 'Estampados terrosos'],
    winter: ['Geométricos', 'Rayas contrastantes', 'Animal print', 'Estampados audaces'],
}

/**
 * Recomendaciones de telas según temporada
 */
export const FABRIC_RECOMMENDATIONS: Record<Season, string[]> = {
    spring: ['Algodón ligero', 'Lino fino', 'Seda', 'Telas fluidas'],
    summer: ['Lino', 'Algodón', 'Rayón', 'Telas transpirables'],
    autumn: ['Lana fina', 'Algodón grueso', 'Punto', 'Telas de peso medio'],
    winter: ['Lana', 'Cachemira', 'Terciopelo', 'Telas gruesas'],
}

/**
 * Determina la temporada según el tono de piel y subtono
 */
export function determineSeason(skinTone: SkinTone, undertone?: Undertone): Season {
    if (skinTone === 'warm') {
        if (undertone === 'golden') return 'spring'
        return 'autumn'
    } else if (skinTone === 'cool') {
        if (undertone === 'pink') return 'summer'
        return 'winter'
    } else {
        // neutral puede ser cualquiera, defaulteamos a summer
        return 'summer'
    }
}

/**
 * Obtiene recomendaciones personalizadas basadas en el análisis
 */
export function getColorimetryRecommendations(
    skinTone: SkinTone,
    season: Season,
    undertone?: Undertone
): {
    metals: string[]
    patterns: string[]
    fabrics: string[]
    generalTips: string[]
} {
    const metals = METAL_RECOMMENDATIONS[skinTone]
    const patterns = PATTERN_RECOMMENDATIONS[season]
    const fabrics = FABRIC_RECOMMENDATIONS[season]

    const generalTips: string[] = []

    // Tips según tono de piel
    if (skinTone === 'warm') {
        generalTips.push('Los colores tierra y cálidos resaltan tu belleza natural')
        generalTips.push('Evita los colores muy fríos como el azul eléctrico')
        generalTips.push('Los dorados te favorecen más que los plateados')
    } else if (skinTone === 'cool') {
        generalTips.push('Los colores fríos y vibrantes realzan tu tono de piel')
        generalTips.push('El blanco puro te queda mejor que el crema')
        generalTips.push('Los metales plateados complementan tu piel perfectamente')
    } else {
        generalTips.push('Tienes la ventaja de poder usar casi cualquier color')
        generalTips.push('Experimenta con contrastes para encontrar tu estilo ideal')
        generalTips.push('Tanto metales dorados como plateados te favorecen')
    }

    // Tips según temporada
    if (season === 'spring') {
        generalTips.push('Los colores claros y frescos son ideales para ti')
        generalTips.push('Busca tonos con un toque de amarillo')
    } else if (season === 'summer') {
        generalTips.push('Los colores suaves y apagados te quedan mejor que los muy vibrantes')
        generalTips.push('Los tonos pastel son perfectos para ti')
    } else if (season === 'autumn') {
        generalTips.push('Los colores ricos y profundos son tu mejor opción')
        generalTips.push('Los tonos terrosos te favorecen especialmente')
    } else {
        generalTips.push('Los colores audaces y contrastantes son ideales')
        generalTips.push('No temas a los tonos muy oscuros o muy brillantes')
    }

    return {
        metals,
        patterns,
        fabrics,
        generalTips,
    }
}

/**
 * Analiza si un color es recomendado para un tono de piel
 */
export function isColorRecommended(color: string, skinTone: SkinTone): {
    recommended: boolean
    category: 'best' | 'good' | 'avoid' | 'neutral'
    reason: string
} {
    const palette = COLOR_PALETTES[skinTone]
    const colorLower = color.toLowerCase()

    // Buscar en mejores colores
    const bestMatch = palette.bestColors.find(
        (c) => c.name.toLowerCase().includes(colorLower) || colorLower.includes(c.name.toLowerCase())
    )
    if (bestMatch) {
        return {
            recommended: true,
            category: 'best',
            reason: `El ${bestMatch.name} es uno de tus mejores colores`,
        }
    }

    // Buscar en buenos colores
    const goodMatch = palette.goodColors.find(
        (c) => c.name.toLowerCase().includes(colorLower) || colorLower.includes(c.name.toLowerCase())
    )
    if (goodMatch) {
        return {
            recommended: true,
            category: 'good',
            reason: `El ${goodMatch.name} te queda bien`,
        }
    }

    // Buscar en colores a evitar
    const avoidMatch = palette.avoidColors.find(
        (c) => c.name.toLowerCase().includes(colorLower) || colorLower.includes(c.name.toLowerCase())
    )
    if (avoidMatch) {
        return {
            recommended: false,
            category: 'avoid',
            reason: `El ${avoidMatch.name} puede no favorecerte tanto`,
        }
    }

    return {
        recommended: true,
        category: 'neutral',
        reason: 'Este color puede funcionarte',
    }
}

/**
 * Obtiene la paleta completa de colores para un tono de piel
 */
export function getColorPalette(skinTone: SkinTone) {
    return COLOR_PALETTES[skinTone]
}

/**
 * Convierte hex a nombre de color aproximado
 */
export function hexToColorName(hex: string): string {
    const colorMap: Record<string, string> = {
        '#FF0000': 'Rojo',
        '#00FF00': 'Verde',
        '#0000FF': 'Azul',
        '#FFFF00': 'Amarillo',
        '#FF00FF': 'Magenta',
        '#00FFFF': 'Cian',
        '#000000': 'Negro',
        '#FFFFFF': 'Blanco',
        '#808080': 'Gris',
        '#FFA500': 'Naranja',
        '#800080': 'Púrpura',
        '#FFC0CB': 'Rosa',
        '#A52A2A': 'Marrón',
        '#F5F5DC': 'Beige',
        '#FFD700': 'Dorado',
        '#C0C0C0': 'Plateado',
    }

    return colorMap[hex.toUpperCase()] || hex
}

export default {
    COLOR_PALETTES,
    METAL_RECOMMENDATIONS,
    PATTERN_RECOMMENDATIONS,
    FABRIC_RECOMMENDATIONS,
    determineSeason,
    getColorimetryRecommendations,
    isColorRecommended,
    getColorPalette,
    hexToColorName,
}
