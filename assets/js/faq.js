/* ==========================================
   ASCEND PRIME
   FAQ.JS
========================================== */

/* ==========================================
   FAQ ACCORDION
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {

        const question = item.querySelector(".faq-question");

        if (!question) return;

        question.addEventListener("click", () => {

            const isActive = item.classList.contains("active");

            // Fecha todos
            faqItems.forEach(faq => {

                faq.classList.remove("active");

                const answer = faq.querySelector(".faq-answer");

                if (answer) {

                    answer.style.maxHeight = null;

                }

            });

            // Se estava fechado, abre
            if (!isActive) {

                item.classList.add("active");

                const answer = item.querySelector(".faq-answer");

                if (answer) {

                    answer.style.maxHeight =
                        answer.scrollHeight + "px";

                }

            }

        });

    });

});


/* ==========================================
   ABRIR PRIMEIRA PERGUNTA
========================================== */

window.addEventListener("load", () => {

    const firstFaq = document.querySelector(".faq-item");

    if (!firstFaq) return;

    firstFaq.classList.add("active");

    const answer = firstFaq.querySelector(".faq-answer");

    if (answer) {

        answer.style.maxHeight =
            answer.scrollHeight + "px";

    }

});


/* ==========================================
   ACESSIBILIDADE
========================================== */

document.querySelectorAll(".faq-question").forEach(button => {

    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {

        const expanded =
            button.getAttribute("aria-expanded") === "true";

        document.querySelectorAll(".faq-question").forEach(btn => {

            btn.setAttribute("aria-expanded", "false");

        });

        if (!expanded) {

            button.setAttribute("aria-expanded", "true");

        }

    });

});


/* ==========================================
   ANIMAÇÃO DO ÍCONE
========================================== */

document.querySelectorAll(".faq-question").forEach(button => {

    button.addEventListener("click", () => {

        const icon = button.querySelector("i");

        if (!icon) return;

        icon.style.transition = "transform .3s ease";

    });

});


/* ==========================================
   EFEITO HOVER
========================================== */

document.querySelectorAll(".faq-item").forEach(item => {

    item.addEventListener("mouseenter", () => {

        item.style.transform = "translateY(-2px)";

    });

    item.addEventListener("mouseleave", () => {

        item.style.transform = "translateY(0)";

    });

});


/* ==========================================
   TECLADO (ENTER E ESPAÇO)
========================================== */

document.querySelectorAll(".faq-question").forEach(button => {

    button.addEventListener("keydown", (event) => {

        if (event.key === "Enter" || event.key === " ") {

            event.preventDefault();

            button.click();

        }

    });

});


/* ==========================================
   LOG
========================================== */

console.log("FAQ.js carregado com sucesso.");