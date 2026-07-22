// ==========================================
// SECCIÓN: VARIABLES GLOBALES Y SELECTORES
// ==========================================
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('.nav-item');

let lastScrollTop = 0;
let navbarOffset = 0; // Controla la posición exacta de la navbar al scrollear

// ==========================================
// FUNCIÓN: SCROLL DINÁMICO DE NAVBAR (EFECTO ANCLADO)
// ==========================================
window.addEventListener('scroll', () => {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    let delta = currentScroll - lastScrollTop;
    const navbarHeight = navbar.offsetHeight;

    // Eliminamos la animación de entrada de CSS al hacer el primer scroll 
    // para que no interfiera con los cálculos de JavaScript
    if (navbar.style.animation !== 'none') {
        navbar.style.animation = 'none';
    }

    // Evita comportamientos extraños si el usuario hace scroll más arriba del tope (ej. en Mac o móviles)
    if (currentScroll <= 0) {
        navbar.style.transform = `translateY(0px)`;
        navbarOffset = 0;
        lastScrollTop = currentScroll;
        return;
    }

    // LÓGICA DE SCROLL HACIA ABAJO
    if (delta > 0) {
        // Quitamos la transición para que el movimiento sea inmediato y se sienta "anclado" al scroll
        navbar.style.transition = 'none'; 
        navbarOffset -= delta;
        
        // Ponemos un tope para que no suba más allá de su propia altura
        if (navbarOffset < -navbarHeight) {
            navbarOffset = -navbarHeight;
        }
        
        navbar.style.transform = `translateY(${navbarOffset}px)`;
        
        // Cerramos menú móvil si se está scrolleando hacia abajo
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    } 
    // LÓGICA DE SCROLL HACIA ARRIBA
    else if (delta < 0) {
        // Regresamos la transición suave para que aparezca de forma fluida
        navbar.style.transition = 'transform 0.4s ease-out';
        navbarOffset = 0;
        navbar.style.transform = `translateY(0px)`;
    }

    lastScrollTop = currentScroll;
});

// ==========================================
// FUNCIÓN: MENÚ DESPLEGABLE MÓVIL
// ==========================================
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// ==========================================
// FUNCIÓN: CERRAR MENÚ MÓVIL AL SELECCIONAR PESTAÑA
// ==========================================
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// ==========================================
// SECCIÓN: CARRUSEL HERO Y ANIMACIONES
// ==========================================
const carouselInner = document.getElementById('carousel-inner');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

let currentSlide = 0;
const totalSlides = slides.length;

// ==========================================
// 1. PREPARAR ANIMACIÓN DE TÍTULOS (Letra por Letra)
// ==========================================
// Seleccionamos todos los títulos que llevarán la animación
const animateTitles = document.querySelectorAll('.animate-title');

animateTitles.forEach(title => {
    const text = title.textContent;
    title.textContent = ''; // Limpiamos el texto original en el HTML
    
    // Identificamos si es la segunda línea para darle un retraso base
    // Si es la línea 2, esperará 0.6 segundos antes de empezar a caer
    let baseDelay = 0;
    if (title.classList.contains('title-line-2')) {
        baseDelay = 0.6; 
    }
    
    // Dividimos el texto en un array de caracteres
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        // Si es un espacio, usamos el código de espacio de no separación, sino el caracter normal
        span.textContent = char === ' ' ? '\u00A0' : char; 
        span.className = 'char';
        
        // Sumamos el retraso base al retraso individual de cada letra
        span.style.transitionDelay = `${baseDelay + (index * 0.03)}s`; 
        
        title.appendChild(span);
    });
});

// ==========================================
// 2. LÓGICA DE NAVEGACIÓN DEL CARRUSEL
// ==========================================
function goToSlide(index) {
    // 1. Quitamos la clase 'active' de la slide y el punto actual (resetea la animación)
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // 2. Actualizamos el índice de la slide
    currentSlide = index;
    
    // 3. Lógica de ciclo infinito (si pasa de la 5 va a la 1, si baja de la 1 va a la 5)
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    // 4. Movemos físicamente el contenedor interno del carrusel
    // Se multiplica el índice por 100 para desplazar 0%, -100%, -200%, etc.
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // 5. Añadimos la clase 'active' a la nueva slide (esto dispara las animaciones nuevamente)
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// ==========================================
// 3. EVENTOS DE LOS CONTROLES
// ==========================================
// Eventos para las flechas
btnNext.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
});

btnPrev.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
});

// Eventos para los puntos indicadores (dots)
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        // Solo ejecuta si no estamos ya en esa slide
        if (currentSlide !== index) {
            goToSlide(index);
        }
    });
});