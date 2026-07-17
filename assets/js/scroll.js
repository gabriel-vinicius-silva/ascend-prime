/* ==========================================
   ASCEND PRIME
   SCROLL.JS
========================================== */

/* ==========================================
   BOTÃO VOLTAR AO TOPO
========================================== */

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (!backToTop) return;

    if (window.scrollY > 500) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

});

if (backToTop) {

    backToTop.addEventListener("click", () => {

        window.scrollTo({

            top: 0,
            behavior: "smooth"

        });

    });

}

/* ==========================================
   MENU ATIVO (SCROLL SPY)
========================================== */

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    const scrollY = window.pageYOffset;

    sections.forEach(section => {

        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 120;
        const sectionId = section.getAttribute("id");

        if (
            scrollY >= sectionTop &&
            scrollY < sectionTop + sectionHeight
        ) {

            navItems.forEach(link => {

                link.classList.remove("active");

                if (link.getAttribute("href") === "#" + sectionId) {

                    link.classList.add("active");

                }

            });

        }

    });

});

/* ==========================================
   PARALLAX SUAVE
========================================== */

const heroBackground = document.querySelector(".hero-bg");

window.addEventListener("scroll", () => {

    if (!heroBackground) return;

    const offset = window.scrollY;

    heroBackground.style.transform =
        `translateY(${offset * 0.25}px)`;

});

/* ==========================================
   REVELAR ELEMENTOS AO ROLAR
========================================== */

const revealElements = document.querySelectorAll(

    ".section-title, .mini-card, .service-card, .method-card, .pillar-card, .value-card, .testimonial-card"

);

const revealObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                revealObserver.unobserve(entry.target);

            }

        });

    },

    {

        threshold: 0.15

    }

);

revealElements.forEach(item => {

    item.classList.add("hidden-animation");

    revealObserver.observe(item);

});

/* ==========================================
   EFEITO SUAVE NOS CARDS
========================================== */

document.querySelectorAll(

    ".service-card, .method-card, .pillar-card"

).forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);

    });

});

/* ==========================================
   LOG
========================================== */

console.log("Scroll.js carregado.");