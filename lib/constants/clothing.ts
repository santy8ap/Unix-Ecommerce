export const CLOTHING_CATEGORIES = [
  'Camisetas',
  'Camisas',
  'Pantalones',
  'Jeans',
  'Vestidos',
  'Faldas',
  'Shorts',
  'Abrigos',
  'Chaquetas',
  'Suéteres',
  'Blusas',
  'Ropa interior',
  'Pijamas',
  'Trajes',
  'Ropa deportiva',
  'Baño',
  'Zapatos',
  'Zapatillas',
  'Botas',
  'Sandalias',
  'Accesorios',
  'Bolsos',
  'Cinturones',
  'Gorros',
  'Bufandas',
  'Guantes',
  'Gafas de sol',
  'Joyas',
  'Relojes',
  'Otros'
] as const;

export const CLOTHING_SIZES = [
  'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL',
  '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50',
  '28x30', '30x30', '30x32', '32x30', '32x32', '32x34', '34x30', '34x32', '34x34',
  '36x30', '36x32', '36x34', '38x30', '38x32', '38x34', '40x30', '40x32', '40x34'
] as const;

export const CLOTHING_CONDITIONS = [
  'Nuevo',
  'Como nuevo',
  'Buen estado',
  'Algún desgaste',
  'Desgaste considerable'
] as const;

export const SEASONS = [
  'Primavera',
  'Verano',
  'Otoño',
  'Invierno',
  'Todo el año'
] as const;

export const OCCASIONS = [
  'Casual',
  'Formal',
  'Deportivo',
  'Noche',
  'Playa',
  'Fiesta',
  'Trabajo',
  'Evento especial',
  'Otro'
] as const;

export const COLORS = [
  'Blanco', 'Negro', 'Gris', 'Beige', 'Marrón', 'Rojo', 'Azul',
  'Verde', 'Amarillo', 'Naranja', 'Rosa', 'Morado', 'Estampado', 'Otro'
] as const;

export type ClothingCategory = typeof CLOTHING_CATEGORIES[number];
export type ClothingSize = typeof CLOTHING_SIZES[number];
export type ClothingCondition = typeof CLOTHING_CONDITIONS[number];
export type Season = typeof SEASONS[number];
export type Occasion = typeof OCCASIONS[number];
export type Color = typeof COLORS[number];
