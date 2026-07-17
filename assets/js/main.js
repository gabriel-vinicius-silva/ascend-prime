/* ==========================================
   ASCEND PRIME
   MAIN.JS
========================================== */

/* ==========================================
   PRELOADER
========================================== */

window.addEventListener("load", () => {

    const preloader = document.getElementById("preloader");

    if (preloader) {

        preloader.style.opacity = "0";
        preloader.style.visibility = "hidden";

        setTimeout(() => {

            preloader.remove();

        }, 500);

    }

});


/* ==========================================
   HEADER AO ROLAR
========================================== */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 50) {

        header.style.background = "rgba(13,13,13,.97)";
        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";
        header.style.borderBottom = "1px solid rgba(212,175,55,.15)";

    } else {

        header.style.background = "rgba(13,13,13,.90)";
        header.style.boxShadow = "none";
        header.style.borderBottom = "1px solid rgba(255,255,255,.05)";

    }

});


/* ==========================================
   MENU MOBILE
========================================== */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");
        menuToggle.classList.toggle("active");

    });

}


/* ==========================================
   FECHAR MENU AO CLICAR
========================================== */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        if (navLinks) {

            navLinks.classList.remove("active");

        }

        if (menuToggle) {

            menuToggle.classList.remove("active");

        }

    });

});


/* ==========================================
   SCROLL SUAVE
========================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const id = this.getAttribute("href");

        if (id === "#") return;

        const target = document.querySelector(id);

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({

            behavior: "smooth",
            block: "start"

        });

    });

});


/* ==========================================
   ANIMAÇÃO DE ENTRADA
========================================== */

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: 0.15

});


document.querySelectorAll(

    ".section, .service-card, .pillar-card, .method-card, .value-card, .testimonial-card"

).forEach(el => {

    el.classList.add("hidden-animation");

    observer.observe(el);

});


/* ==========================================
   CONTADOR (caso exista)
========================================== */

const counters = document.querySelectorAll(".counter");

const animateCounter = (counter) => {

    const target = Number(counter.dataset.target);

    let current = 0;

    const increment = target / 100;

    const timer = setInterval(() => {

        current += increment;

        if (current >= target) {

            current = target;

            clearInterval(timer);

        }

        counter.innerText = Math.floor(current);

    }, 20);

};

const counterObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            animateCounter(entry.target);

            counterObserver.unobserve(entry.target);

        }

    });

});

counters.forEach(counter => {

    counterObserver.observe(counter);

});


/* ==========================================
   EFEITO PARALLAX HERO
========================================== */

const hero = document.querySelector(".hero");

window.addEventListener("scroll", () => {

    if (!hero) return;

    const offset = window.pageYOffset;

    hero.style.backgroundPositionY = offset * 0.4 + "px";

});


/* ==========================================
   EFEITO BOTÕES
========================================== */

document.querySelectorAll(".btn-primary").forEach(button => {

    button.addEventListener("mouseenter", () => {

        button.style.transform = "translateY(-3px) scale(1.02)";

    });

    button.addEventListener("mouseleave", () => {

        button.style.transform = "translateY(0) scale(1)";

    });

});


/* ==========================================
   LOG
========================================== */

console.log("%cASCEND PRIME", "color:#D4AF37;font-size:22px;font-weight:bold;");
console.log("%cAscenda. Evolua. Domine.", "color:white;font-size:14px;");