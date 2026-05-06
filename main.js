// INITIALISATION SUPABASE GLOBALE
const SUPABASE_URL = 'https://aytyetcwfzliikljlhhz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KV2wU4WAzWJgRVlgIoioWA_MnLEtnCz'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. CHARGER LA NAVBAR (Fichier à la racine)
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            highlightCurrentPage(); // Activer le lien rouge
            initNavbarScroll(); // Activer l'effet de scroll
        });

    // 2. CHARGER LE FOOTER (Fichier à la racine)
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });

    // 3. CHARGER LE CONTENU DU CMS (Logo, slogan, textes...)
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

// FONCTION : NAVBAR QUI SE CACHE AU SCROLL
function initNavbarScroll() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar-custom');
    if (!navbar) return;
    
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

// FONCTION : CMS GLOBAL
async function chargerContenuGeneral() {
    const { data, error } = await _supabase.from('contenu_site').select('*');
    if (!error && data) {
        data.forEach(item => {
            const elementHtml = document.getElementById(item.cle_position);
            if (elementHtml) {
                if (item.type === 'texte' || item.type === 'html') {
                    elementHtml.innerHTML = item.valeur;
                } else if (item.type === 'image_url') {
                    elementHtml.src = item.valeur;
                }
            }
        });
    }
}
