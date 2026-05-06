// INITIALISATION GLOBALE DE SUPABASE
const SUPABASE_URL = 'https://aytyetcwfzliikljlhhz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KV2wU4WAzWJgRVlgIoioWA_MnLEtnCz'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", function() {
    // 1. Injection de la Navbar
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            highlightCurrentPage();
            initNavbarScroll();
        });

    // 2. Injection du Footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });

    // 3. Charger le contenu dynamique (CMS)
    chargerContenuGeneral();
});

// FONCTION : LIEN ACTIF EN ROUGE
function highlightCurrentPage() {
    let currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "" || currentPage === "/") currentPage = "index.html"; 
    let navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    navLinks.forEach(link => {
        link.classList.remove("active-link");
        let linkHref = link.getAttribute("href");
        if (linkHref && linkHref.includes(currentPage)) {
            link.classList.add("active-link");
        }
    });
}

// FONCTION : NAVBAR CACHÉE AU SCROLL
function initNavbarScroll() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar-custom');
    if(!navbar) return;
    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > lastScrollTop && currentScroll > 100) {
            navbar.classList.add('navbar-hidden');
        } else {
            navbar.classList.remove('navbar-hidden');
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
}

// FONCTION : CHARGEMENT CMS (Fixé pour l'éditeur Word)
async function chargerContenuGeneral() {
    const { data, error } = await _supabase.from('contenu_site').select('*');
    if (!error && data) {
        data.forEach(item => {
            const el = document.getElementById(item.cle_position);
            if (el && item.valeur) {
                if (item.type === 'texte' || item.type === 'html') {
                    // On injecte directement le HTML généré par Quill (Gras, sauts de ligne, etc.)
                    el.innerHTML = item.valeur; 
                } else if (item.type === 'image_url') {
                    el.src = item.valeur;
                }
            }
        });
    }
}
