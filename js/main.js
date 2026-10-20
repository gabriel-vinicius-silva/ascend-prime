
/* =========================================
   ASCEND PRIME — FUNÇÕES GERAIS
   Arquivo: js/main.js
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. MENU RESPONSIVO
    ========================================= */

    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");

    if (menuToggle && mainNav) {

        function abrirMenu() {
            mainNav.classList.add("is-open");
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Fechar menu");
        }

        function fecharMenu() {
            mainNav.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menu");
        }

        menuToggle.addEventListener("click", () => {
            const menuAberto =
                mainNav.classList.contains("is-open");

            if (menuAberto) {
                fecharMenu();
            } else {
                abrirMenu();
            }
        });

        // Fecha o menu ao clicar em um link.
        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", fecharMenu);
        });

        // Fecha o menu ao pressionar ESC.
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                fecharMenu();
            }
        });

        // Fecha o menu ao clicar fora dele.
        document.addEventListener("click", (event) => {
            const clicouNoMenu =
                mainNav.contains(event.target);

            const clicouNoBotao =
                menuToggle.contains(event.target);

            if (!clicouNoMenu && !clicouNoBotao) {
                fecharMenu();
            }
        });

        // Fecha o menu ao voltar para uma tela maior.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                fecharMenu();
            }
        });
    }


    /* =========================================
       2. ANO AUTOMÁTICO NO RODAPÉ
    ========================================= */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =========================================
       3. LINKS INTERNOS COM ROLAGEM SUAVE
    ========================================= */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {
            const destino = link.getAttribute("href");

            // Ignora links vazios.
            if (!destino || destino === "#") {
                return;
            }

            const elemento = document.querySelector(destino);

            if (elemento) {
                event.preventDefault();

                elemento.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                // Atualiza o endereço da seção sem recarregar.
                history.replaceState(null, "", destino);
            }
        });
    });


    /* =========================================
       4. ANO E INICIALIZAÇÃO
    ========================================= */

    console.log("ASCEND PRIME iniciado com sucesso.");
});
