// Aquí exportaremos las imágenes cuando las tengamos
// Por ahora no tenemos imágenes reales, así que definimos algunas constantes para usar como placeholders

// Colores y gradientes para diseños
export const GRADIENTS = {
  // Constantes para gradientes
  BLUE_CARD: {
    colors: ['#26318A', '#344190', '#3F4B9F'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Puedes agregar más gradientes aquí
};

// Exportamos las imágenes de la aplicación
export const IMAGES = {
  CARD_BACKGROUND: require('./card.png'),
  LOGO: require('./logo.png'),
  // Otras imágenes que puedas necesitar en el futuro
}; 