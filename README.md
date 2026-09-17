# CourseMarket

Plataforma para crear cursos (en formato texto/artículo) y venderlos, con pagos
procesados por Stripe Checkout. Cualquier usuario registrado puede ser tanto
instructor (crea y vende sus cursos) como alumno (compra los de otros).

Stack: Next.js 16 (App Router, Server Actions) + TypeScript + Prisma 7
(SQLite) + NextAuth v5 (credenciales) + Stripe.

## Puesta en marcha

```bash
npm install
npm run db:seed   # opcional: crea un instructor, un alumno y un curso de ejemplo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

Cuentas de prueba creadas por el seed (contraseña `password123` para ambas):

- `instructor@demo.com` — tiene un curso publicado ("Introducción a Next.js")
- `alumno@demo.com` — sin compras, listo para probar el checkout

## Variables de entorno (`.env`)

Ya vienen precargadas para desarrollo local, salvo las de Stripe:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="..."                    # ya generado, podés regenerarlo con: openssl rand -base64 32
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STRIPE_SECRET_KEY=""                 # ver abajo
STRIPE_WEBHOOK_SECRET=""             # ver abajo
```

### Configurar Stripe (modo test)

Sin estas claves, el botón "Comprar" muestra un error explicativo en vez de
romper la app.

1. Creá una cuenta en [Stripe](https://dashboard.stripe.com/register) (o usá una existente).
2. Copiá tu clave secreta de **modo test** desde
   [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
   y pegala en `STRIPE_SECRET_KEY`.
3. Para que las compras se marquen como pagadas automáticamente necesitás el
   webhook. En desarrollo, con la [Stripe CLI](https://docs.stripe.com/stripe-cli):

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   Esto imprime un `whsec_...`: pegalo en `STRIPE_WEBHOOK_SECRET` y reiniciá `npm run dev`.

   > Nota: aunque no configures el webhook, el checkout igual funciona en
   > local — al volver de Stripe con el pago aprobado, la página del curso
   > confirma el pago contra la API de Stripe como respaldo. El webhook es el
   > mecanismo confiable para producción.
4. Para pagar con una tarjeta de prueba, usá `4242 4242 4242 4242`, cualquier
   fecha futura y cualquier CVC.

En producción, agregá un endpoint de webhook en el dashboard de Stripe
apuntando a `https://tu-dominio.com/api/webhooks/stripe` y usá esa clave de
firmado.

## Modelo de datos

- **User**: cualquier usuario puede crear cursos (instructor) y/o comprarlos (alumno).
- **Course**: pertenece a un instructor, tiene precio, estado publicado/borrador y lecciones.
- **Lesson**: contenido de texto ordenado dentro de un curso.
- **Purchase**: vincula alumno + curso + sesión de Stripe, con estado `PENDING`/`PAID`.

## Comandos útiles

```bash
npm run dev         # servidor de desarrollo
npm run build        # build de producción
npm run lint          # eslint
npm run db:seed      # carga de datos de ejemplo
npm run db:studio    # explorador visual de la base (Prisma Studio)
npx prisma migrate dev --name <nombre>  # nueva migración tras editar prisma/schema.prisma
```

## Flujo principal

1. Cualquiera se registra en `/register`.
2. Desde `/dashboard` puede crear un curso (`/dashboard/courses/new`), cargarle
   lecciones de texto y publicarlo (requiere al menos una lección).
3. Los cursos publicados aparecen en el catálogo (`/`) y en `/courses/[slug]`.
4. Un alumno compra con Stripe Checkout; tras el pago accede al contenido en
   `/learn/[slug]` y ve sus compras en `/my-courses`.
