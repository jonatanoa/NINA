# 🎓 Centro de Estimulación y Aprendizaje NINA — Proyecto Web

## 📁 Estructura del Proyecto

```
nina-centro-educativo/
│
├── index.html              ← Página principal
│
├── css/
│   ├── variables.css       ← Variables CSS, estilos base, parallax, partículas
│   ├── nav.css             ← Navegación (desktop + mobile)
│   ├── hero.css            ← Sección hero, slider de imágenes, botones
│   ├── sections.css        ← Nosotros, Programas, Galería, Testimonios, Mapa,
│   │                          Contacto, WhatsApp, Footer, Lightbox
│   ├── games.css           ← Todos los juegos (Memoria, Atrapa, Cohete, Simón)
│   └── responsive.css      ← Media queries (1024px, 900px, 480px, 360px)
│
├── js/
│   ├── main.js             ← Nav, Parallax, Partículas, Scroll Reveal,
│   │                          Typing animation, Burbujas, Smooth scroll
│   ├── slider.js           ← Hero slider + Slider de testimonios
│   ├── contact.js          ← Formulario de contacto con EmailJS
│   ├── lightbox.js         ← Visor de imágenes de galería
│   │
│   └── games/
│       ├── manager.js      ← Gestor de juegos: openGame, closeGame,
│       │                      switchGameTab, overlay compartido
│       ├── memory.js       ← Juego de Memoria
│       ├── catch.js        ← Juego Atrapa la Fruta
│       ├── rocket.js       ← Juego Matemáticas Cohete
│       └── simon.js        ← Juego Secuencias (Simon)
│
└── img/
    ├── logo.png            ← Logo del centro (nav y footer)
    ├── videos/             ← Coloca aquí: video1.mp4 ... video5.mp4
    ├── hero/               ← Fotos del slider principal (hero1.jpg ... hero10.jpg)
    ├── galeria/            ← Fotos de la galería (galeria1.jpg ... galeria8.jpg)
    └── testimonios/        ← Fotos de perfil (testimonio1.jpg ... testimonio4.jpg)
```

---

## 🖼️ Cómo reemplazar las imágenes por archivos locales

Actualmente las imágenes se cargan desde internet (imgbb.com).
Para usar imágenes guardadas en tu computador, sigue estos pasos:

### Paso 1 — Crea las carpetas

Dentro de `nina-centro-educativo/`, crea esta estructura de carpetas:

```
img/
├── logo.png
├── hero/
│   ├── hero1.jpg  →  hero2.jpg  →  ...  →  hero10.jpg
├── galeria/
│   ├── galeria1.jpg  →  galeria2.jpg  →  ...  →  galeria8.jpg
├── testimonios/
│   ├── testimonio1.jpg  →  testimonio2.jpg  →  testimonio3.jpg  →  testimonio4.jpg
└── videos/
    ├── video1.mp4  →  video2.mp4  →  ...  →  video5.mp4
```

### Paso 2 — Reemplaza las rutas en index.html

Abre `index.html` con un editor de texto (VS Code, Notepad++, etc.)
y usa **Buscar y Reemplazar** (Ctrl+H) para cambiar cada URL.

---

### 🔷 LOGO — aparece 2 veces (nav y footer)

Busca esta URL (las 2 veces):
```
https://i.ibb.co/5gFFrnw1/Adobe-Express-file.png
```
Reemplaza por:
```
img/logo.png
```

---

### 🔷 HERO SLIDER — 10 fotos del slider principal

| # | URL actual (busca esto) | Reemplaza por |
|---|------------------------|---------------|
| 1 | `https://i.ibb.co/BhFtD65/Picsart-26-02-26-09-40-37-910.png` | `img/hero/hero1.jpg` |
| 2 | `https://i.ibb.co/TDjRLtXt/IMG-20260225-WA0071.jpg` | `img/hero/hero2.jpg` |
| 3 | `https://i.ibb.co/B252sz5N/IMG-20260225-WA0052.jpg` | `img/hero/hero3.jpg` |
| 4 | `https://i.ibb.co/mrMKjYpc/IMG-20260225-WA0050.jpg` | `img/hero/hero4.jpg` |
| 5 | `https://i.ibb.co/GvrJJSZ3/IMG-20260225-WA0049.jpg` | `img/hero/hero5.jpg` |
| 6 | `https://i.ibb.co/R4C2QBc9/IMG-20260224-WA0053.jpg` | `img/hero/hero6.jpg` |
| 7 | `https://i.ibb.co/d460C2xs/IMG-20260224-WA0049.jpg` | `img/hero/hero7.jpg` |
| 8 | `https://i.ibb.co/ZpjCH3sn/IMG-20260224-WA0041.jpg` | `img/hero/hero8.jpg` |
| 9 | `https://i.ibb.co/hNw9dkc/IMG-20260224-WA0040.jpg` | `img/hero/hero9.jpg` |
| 10 | `https://i.ibb.co/4n92grdw/IMG-20260224-WA0035.jpg` | `img/hero/hero10.jpg` |

---

### 🔷 GALERÍA — 8 fotos

| # | URL actual (busca esto) | Reemplaza por |
|---|------------------------|---------------|
| 1 | `https://i.ibb.co/HDBbNDkF/IMG-20260225-WA0057.jpg` | `img/galeria/galeria1.jpg` |
| 2 | `https://i.ibb.co/zWTnnZ4X/IMG-20260224-WA0039.jpg` | `img/galeria/galeria2.jpg` |
| 3 | `https://i.ibb.co/Bmm2g93/IMG-20260224-WA0038.jpg` | `img/galeria/galeria3.jpg` |
| 4 | `https://i.ibb.co/b52FFP86/IMG-20260225-WA0032.jpg` | `img/galeria/galeria4.jpg` |
| 5 | `https://i.ibb.co/39PrCBSQ/IMG-20260224-WA0057.jpg` | `img/galeria/galeria5.jpg` |
| 6 | `https://i.ibb.co/rCvKJR8/IMG-20260224-WA0033.jpg` | `img/galeria/galeria6.jpg` |
| 7 | `https://i.ibb.co/wrLvqcZn/IMG-20260225-WA0034.jpg` | `img/galeria/galeria7.jpg` |
| 8 | `https://i.ibb.co/3mFGpwgS/IMG-20260224-WA0054.jpg` | `img/galeria/galeria8.jpg` |

---

### 🔷 TESTIMONIOS — 4 fotos de perfil

| Testimonio | URL actual (busca esto) | Reemplaza por |
|-----------|------------------------|---------------|
| Cristian & Laura | `https://i.ibb.co/7J8QL2Bx/Picsart-26-02-27-11-15-02-452.png` | `img/testimonios/testimonio1.jpg` |
| Cristian & Yuri  | `https://i.ibb.co/dJ7hWB6L/Picsart-26-03-03-09-58-08-652.png` | `img/testimonios/testimonio2.jpg` |
| Stefany & Mateo  | `https://i.ibb.co/dYpnh9k`                                      | `img/testimonios/testimonio3.jpg` |
| Angie Viviana    | `https://i.ibb.co/C5PHydqh/file-0000000064f471f5b4590f8063ed8719.png` | `img/testimonios/testimonio4.jpg` |

---

### 🔷 VIDEOS DE GALERÍA — 5 videos

Coloca tus archivos en `img/videos/` con estos nombres exactos:

| Video | Nombre del archivo |
|-------|--------------------|
| Video 1 | `video1.mp4` |
| Video 2 | `video2.mp4` |
| Video 3 | `video3.mp4` |
| Video 4 | `video4.mp4` |
| Video 5 | `video5.mp4` |

> Los videos ya están configurados en el código.
> Solo necesitas colocar los archivos con esos nombres exactos en `img/videos/`.

---

### ✅ Verificación final

Después de hacer los cambios, abre `index.html` en tu navegador y revisa
que todas las imágenes y videos carguen correctamente.

> ⚠️ **Nota:** Si abres el archivo directamente desde el disco y los videos
> no cargan, usa la extensión **Live Server** en VS Code, o sube el proyecto
> a tu hosting (Netlify, etc.).

---

## ⚙️ Configuración

### EmailJS (formulario de contacto)
En `index.html`:
```js
emailjs.init({ publicKey: "_v6kOtYesapmy5fTe" });
```
En `js/contact.js`:
```js
emailjs.send('service_j289d5s', 'template_afwmo49', templateParams)
```
Cambia los IDs si actualizas tu cuenta de EmailJS.

---

## ✏️ Guía rápida de edición

| Qué quieres cambiar | Archivo a editar |
|---|---|
| Colores / fuentes globales | `css/variables.css` |
| Menú de navegación | `css/nav.css` + `index.html` |
| Hero / slider de fotos | `css/hero.css` + `index.html` |
| Textos de secciones | `index.html` |
| Estilos de secciones | `css/sections.css` |
| Estilos de juegos | `css/games.css` |
| Lógica juego Memoria | `js/games/memory.js` |
| Lógica juego Atrapa | `js/games/catch.js` |
| Lógica juego Cohete | `js/games/rocket.js` |
| Lógica juego Simón | `js/games/simon.js` |
| Formulario de contacto | `js/contact.js` |
| Responsive / móvil | `css/responsive.css` |

---

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (modernos)
- ✅ Móvil y tablet
- ✅ Touch controls en juegos

---

*Diseñado y desarrollado por **Jonathan Osorio Arcila***
