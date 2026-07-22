// ==========================================
// SECCIÓN: VARIABLES GLOBALES Y SELECTORES
// ==========================================
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('.nav-item');

// Variable para rastrear la posición anterior del scroll
let lastScrollTop = 0; 

// ==========================================
// FUNCIÓN: MOSTRAR / OCULTAR NAVBAR CON SCROLL
// ==========================================
window.addEventListener('scroll', () => {
    // Obtiene la posición actual del scroll vertical
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Si bajamos en la página (scroll hacia abajo)
    if (currentScroll > lastScrollTop) {
        // Oculta la barra añadiendo la clase definida en CSS
        navbar.classList.add('hidden-scroll');
        
        // Si el menú móvil está abierto mientras bajamos, lo cerramos
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    } 
    // Si subimos en la página (scroll hacia arriba)
    else {
        // Muestra la barra quitando la clase
        navbar.classList.remove('hidden-scroll');
    }

    // Actualizamos la posición anterior (evita valores negativos en el tope)
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// ==========================================
// FUNCIÓN: MENÚ DESPLEGABLE MÓVIL
// ==========================================
// Activa o desactiva el menú al hacer clic en el botón hamburguesa
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// ==========================================
// FUNCIÓN: CERRAR MENÚ MÓVIL AL SELECCIONAR PESTAÑA
// ==========================================
// Mejora de usabilidad: cierra el menú cuando el usuario elige una opción
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});