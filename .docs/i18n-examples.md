# Ejemplos de Actualización de Páginas con i18n

## Ejemplo 1: Actualizar Home Page

### Antes (texto hardcoded):
```tsx
<h1 className="text-5xl font-black">
  Selected for You
</h1>
<p className="text-lg text-slate-400">
  Discover our curated collection...
</p>
```

### Después (con i18n):
```tsx
import { useLanguage } from '@/context/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  
  return (
    <h1 className="text-5xl font-black">
      {t('home.featured.title')}
    </h1>
    <p className="text-lg text-slate-400">
      {t('home.featured.subtitle')}
    </p>
  )
}
```

---

## Ejemplo 2: Actualizar Carrito con Contadores

### Antes:
```tsx
<h1>Carrito de Compras</h1>
<p>{itemCount} artículos</p>
```

### Después:
```tsx
const { t } = useLanguage()

<h1>{t('cart.title')}</h1>
<p>{t('cart.items', { count: itemCount })}</p>
```

---

## Ejemplo 3: Actualizar Mensajes de Error

### Antes:
```tsx
toast.error('Producto agotado')
```

### Después:
```tsx
const { t } = useLanguage()

toast.error(t('notifications.error.outOfStock'))
```

---

## Ejemplo 4: Actualizar Formularios

### Antes:
```tsx
<label>Nombre Completo</label>
<input placeholder="Ingresa tu nombre" />
{errors.name && <p>El nombre es requerdo</p>}
```

### Después:
```tsx
const { t } = useLanguage()

<label>{t('checkout.shipping.name')}</label>
<input placeholder={t('checkout.shipping.name')} />
{errors.name && <p>{t('checkout.errors.requiredName')}</p>}
```

---

## Ejemplo 5: Actualizar Botones

### Antes:
```tsx
<button>Agregar al Carrito</button>
<button>Ver Detalles</button>
<button>Continuar comprando</button>
```

### Después:
```tsx
const { t } = useLanguage()

<button>{t('products.addToCart')}</button>
<button>{t('products.viewDetails')}</button>
<button>{t('cart.continueShopping')}</button>
```

---

## Ejemplo 6: Estados Vacíos

### Antes:
```tsx
<EmptyState
  icon={ShoppingCart}
  title="Carrito Vacío"
  description="Tu carrito está vacío..."
  actionLabel="Explorar Productos"
/>
```

### Después:
```tsx
const { t } = useLanguage()

<EmptyState
  icon={ShoppingCart}
  title={t('cart.empty')}
  description={t('cart.emptyDesc')}
  actionLabel={t('home.hero.explore')}
/>
```

---

## Ejemplo 7: Filtros de Productos

### Antes:
```tsx
const SORT_OPTIONS = [
  { value: 'newest', label: '✨ Más Nuevos' },
  { value: 'price-low', label: '💰 Precio: Menor a Mayor' },
]
```

### Después:
```tsx
const { t } = useLanguage()

const SORT_OPTIONS = [
  { value: 'newest', label: t('products.sort.newest') },
  { value: 'price-low', label: t('products.sort.priceLow') },
]
```

---

## Ejemplo 8: Notificaciones Toast

### Antes:
```tsx
toast.success('✅ Producto agregado al carrito')
toast.error('❌ Error al agregar al carrito')
toast.success('✅ Cupón aplicado correctamente')
```

### Después:
```tsx
const { t } = useLanguage()

toast.success(t('notifications.success.productAdded'))
toast.error(t('notifications.error.addToCartFailed'))
toast.success(t('cart.coupon.success'))
```

---

## Ejemplo 9: Tabla de Órdenes

### Antes:
```tsx
<th>Orden #</th>
<th>Fecha</th>
<th>Estado</th>
<th>Total</th>
```

### Después:
```tsx
const { t } = useLanguage()

<th>{t('orders.orderNumber')}</th>
<th>{t('orders.date')}</th>
<th>{t('orders.status')}</th>
<th>{t('orders.total')}</th>
```

---

## Ejemplo 10: Footer

### Antes:
```tsx
<p>Elevando el estilo con diseños exclusivos...</p>
<h3>Explorar</h3>
<h3>Ayuda</h3>
```

### Después:
```tsx
const { t } = useLanguage()

<p>{t('footer.description')}</p>
<h3>{t('footer.explore')}</h3>
<h3>{t('footer.help')}</h3>
```

---

## Patrón Común de Refactorización:

1. **Importar el hook:**
```tsx
import { useLanguage } from '@/context/LanguageContext'
```

2. **Extraer la función `t`:**
```tsx
const { t } = useLanguage()
```

3. **Reemplazar strings:**
   - Busca todos los strings literales
   - Verifica en `/i18n/messages/es.json` la clave correspondiente
   - Usa `t('clave.anidada.aqui')`

4. **Para plurales y contadores:**
```tsx
// No uses condicionales, usa parámetros
{t('cart.items', { count: itemCount })}
```

---

## Verificación Final:

Después de actualizar una página:

1. Cambia el idioma en el selector
2. Verifica que todos los textos cambien
3. Revisa la consola por warnings de traducciones faltantes
4. Prueba casos especiales (contadores, plurales, etc.)
