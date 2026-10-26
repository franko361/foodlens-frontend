// Datos de ejemplo para desarrollo del frontend.
// Más adelante, esto se reemplaza con datos reales traídos de tu API (FastAPI + Supabase).

export const restaurant = {
  name: "Pardo's Chicken",
  table: 5,
  logo: '/logo.png',
}

export const dishes = [
  {
    id: 'lomo-saltado',
    name: 'Lomo Saltado',
    description: 'Carne de res salteada con cebolla, tomate, sillao y papas fritas.',
    price: 28.0,
    calories: 650,
    image: '/dishes/lomo-saltado.png',
    category: 'Fondos',
  },
  {
    id: 'aji-gallina',
    name: 'Ají de Gallina',
    description: 'Pollo deshilachado en crema de ají amarillo, servido con arroz.',
    price: 24.0,
    calories: 520,
    image: '/dishes/aji-gallina.png',
    category: 'Fondos',
  },
  {
    id: 'chicha-morada',
    name: 'Chicha Morada',
    description: 'Bebida refrescante a base de maíz morado.',
    price: 8.0,
    calories: 120,
    image: '/dishes/chicha-morada.png',
    category: 'Bebidas',
  },
]