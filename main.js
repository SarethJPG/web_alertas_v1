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

// ==========================================
// SECCIÓN: ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
// ==========================================

// 1. Seleccionamos todos los elementos que tienen la clase de animación inicial
const fadeUpElements = document.querySelectorAll('.animate-fade-up');

// 2. Configuramos las opciones del observador
const observerOptions = {
    root: null, // null significa que usará la ventana del navegador (viewport)
    rootMargin: '0px', // Sin márgenes extra
    threshold: 0.2 // Se activará cuando el 20% del elemento sea visible en pantalla
};

// 3. Creamos el observador
const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // Comprobamos si el elemento ya cruzó el umbral para ser visible
        if (entry.isIntersecting) {
            // Agregamos la clase '.visible' que cambia la opacidad y posición en CSS
            entry.target.classList.add('visible');
            
            // Dejamos de observarlo para que la animación se ejecute una sola vez
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 4. Le indicamos al observador que comience a vigilar cada elemento de la matriz
fadeUpElements.forEach(element => {
    fadeObserver.observe(element);
});

// 5. Seleccionamos y vigilamos las nuevas imágenes con fade-in (Efecto 3D)
const fadeInElements = document.querySelectorAll('.animate-fade-in');
fadeInElements.forEach(element => fadeObserver.observe(element));

// ==========================================
// SECCIÓN: CARRUSEL DE EQUIPOS (2 CARDS)
// ==========================================
const equiposInner = document.getElementById('equipos-carousel-inner');
const equiposBtnPrev = document.getElementById('equipos-btn-prev');
const equiposBtnNext = document.getElementById('equipos-btn-next');
const equipoCards = document.querySelectorAll('.equipo-card');

let equiposCurrentIndex = 0;

function updateEquiposCarousel() {
    // Si no estamos en la página de equipos, evitamos errores
    if (!equiposInner || equipoCards.length === 0) return;

    // Detectamos si es móvil (1 card) o escritorio (2 cards)
    const isMobile = window.innerWidth <= 768;
    const cardsVisible = isMobile ? 1 : 2;
    const maxIndex = equipoCards.length - cardsVisible;

    // Protecciones de límites
    if (equiposCurrentIndex < 0) equiposCurrentIndex = 0;
    if (equiposCurrentIndex > maxIndex) equiposCurrentIndex = maxIndex;

    // Calculamos el ancho real de la tarjeta más el gap
    const cardWidth = equipoCards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(equiposInner).gap) || 0;
    
    // Distancia total a mover
    const moveAmount = (cardWidth + gap) * equiposCurrentIndex;
    equiposInner.style.transform = `translateX(-${moveAmount}px)`;

    // Lógica para mostrar/ocultar flechas de forma intuitiva
    if (equiposCurrentIndex === 0) {
        equiposBtnPrev.style.display = 'none';
    } else {
        equiposBtnPrev.style.display = 'flex';
    }

    if (equiposCurrentIndex >= maxIndex) {
        equiposBtnNext.style.display = 'none';
    } else {
        equiposBtnNext.style.display = 'flex';
    }
}

// Inicializamos eventos de flechas
if(equiposBtnNext && equiposBtnPrev) {
    equiposBtnNext.addEventListener('click', () => {
        equiposCurrentIndex++;
        updateEquiposCarousel();
    });

    equiposBtnPrev.addEventListener('click', () => {
        equiposCurrentIndex--;
        updateEquiposCarousel();
    });

    // Aseguramos que se recalcule si el usuario gira el celular o cambia el tamaño de la ventana
    window.addEventListener('resize', () => {
        // Al cambiar pantalla, reiniciamos al inicio para evitar bugs visuales
        equiposCurrentIndex = 0; 
        updateEquiposCarousel();
    });
    
    // Arrancamos el carrusel para configurar las flechas de inicio
    updateEquiposCarousel();
}