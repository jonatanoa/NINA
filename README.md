# 🎓 Centro de Estimulación y Aprendizaje NINA — Proyecto Web

## 📁 Estructura del Proyecto

```
NINA V10/
│
├── index.html                  ← Página principal (única)
│
├── css/
│   ├── variables.css           ← Variables, estilos base, fondo por sección
│   ├── nav.css                 ← Navegación desktop + mobile
│   ├── hero.css                ← Sección hero y slider de imágenes
│   ├── sections.css            ← Nosotros, Programas, Galería, Testimonios,
│   │                              Ubicación, Contacto, WhatsApp, Footer, Lightbox
│   ├── games.css               ← Juegos: Memoria, Atrapa, Cohete, Simón
│   └── responsive.css          ← Media queries (1024px, 900px, 480px, 360px)
│
├── js/
│   ├── main.js                 ← Nav, Scroll Reveal, Typing, Fondo por sección,
│   │                              Smooth scroll, Videos
│   ├── slider.js               ← Hero slider + Slider de testimonios
│   ├── contact.js              ← Formulario de contacto con EmailJS
│   ├── lightbox.js             ← Visor de imágenes y videos
│   │
│   └── games/
│       ├── manager.js          ← Gestor de juegos: modal, apertura y cierre
│       ├── memory.js           ← Juego de Memoria
│       ├── catch.js            ← Juego Atrapa la Fruta
│       ├── rocket.js           ← Juego Matemáticas Cohete
│       └── simon.js            ← Juego Secuencias (Simón)
│
└── img/
    ├── logo.png                ← Logo del centro (nav y footer)
    ├── hero/                   ← hero1.png, hero2.jpg … hero9.jpg
    ├── galeria/                ← galeria1.jpg … galeria12.jpg
    ├── testimonios/            ← testimonios1.jpg … testimonios4.jpg/.png
    └── videos/                 ← video1.mp4 … video5.mp4
```

---

## ⚙️ Configuración

### EmailJS (formulario de contacto)

El formulario usa EmailJS. Las claves ya están configuradas en el proyecto:

- **`index.html`** — inicialización:
  ```js
  emailjs.init({ publicKey: "_v6kOtYesapmy5fTe" });
  ```
- **`js/contact.js`** — envío:
  ```js
  emailjs.send('service_j289d5s', 'template_afwmo49', templateParams)
  ```

> Si cambias de cuenta de EmailJS, actualiza esos dos IDs.

---

## ✏️ Guía rápida de edición

| Qué quieres cambiar | Archivo a editar |
|---|---|
| Colores / fuentes globales | `css/variables.css` |
| Colores de fondo por sección | `js/main.js` → objeto `sectionColors` |
| Menú de navegación | `css/nav.css` + `index.html` |
| Hero / slider de fotos | `css/hero.css` + `index.html` |
| Textos de cualquier sección | `index.html` |
| Estilos de secciones | `css/sections.css` |
| Estilos de juegos | `css/games.css` |
| Lógica juego Memoria | `js/games/memory.js` |
| Lógica juego Atrapa | `js/games/catch.js` |
| Lógica juego Cohete | `js/games/rocket.js` |
| Lógica juego Simón | `js/games/simon.js` |
| Formulario de contacto | `js/contact.js` |
| Responsive / móvil | `css/responsive.css` |

---

## 🎨 Colores de fondo por sección

El fondo cambia de color suavemente al hacer scroll. Para modificarlos, edita el objeto `sectionColors` en `js/main.js`:

```js
const sectionColors = {
    'inicio':      '#FFB3D1',   // rosa
    'nosotros':    '#FFD49A',   // durazno
    'programas':   '#A8EDCC',   // menta
    'galeria':     '#C9B8FF',   // lavanda
    'testimonios': '#FFB89A',   // coral
    'ubicacion':   '#A8D8FF',   // celeste
    'contacto':    '#D8B8FF',   // violeta
    'juego':       '#FFE680',   // amarillo
};
```

---

## 🗺️ SEO y Datos del Negocio

Los datos del centro están en el `<head>` de `index.html` en el bloque `application/ld+json`. Si cambia algún dato (dirección, teléfono, horario), actualízalo ahí también.

---

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (versiones modernas)
- ✅ Escritorio, tablet y móvil
- ✅ Touch en juegos y galería

---

*Diseñado y desarrollado por **Jonathan Osorio Arcila***
