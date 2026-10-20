
/* =========================================================
   ASCEND PRIME — JAVASCRIPT DO ATENDIMENTO
   Arquivo: js/atendimento.js
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       1. ELEMENTOS DO FORMULÁRIO
    ===================================================== */

    const formulario = document.getElementById("atendimento-form");

    const campoNome = document.getElementById("atendimento-nome");
    const campoEmail = document.getElementById("atendimento-email");
    const campoAssunto = document.getElementById("atendimento-assunto");
    const campoTipo = document.getElementById("atendimento-prioridade");
    const campoMensagem = document.getElementById("atendimento-mensagem");

    const contadorMensagem = document.getElementById("mensagem-contador");
    const feedback = document.getElementById("atendimento-feedback");

    const campoAno = document.getElementById("current-year");

    if (campoAno) {
        campoAno.textContent = new Date().getFullYear();
    }

    if (!formulario) {
        return;
    }


    /* =====================================================
       2. CONTADOR DE CARACTERES
    ===================================================== */

    function atualizarContador() {
        if (!campoMensagem || !contadorMensagem) {
            return;
        }

        const quantidade = campoMensagem.value.length;
        const limite = Number(campoMensagem.maxLength) || 3000;

        contadorMensagem.textContent = `${quantidade}/${limite}`;

        if (quantidade > limite) {
            contadorMensagem.style.color = "#B42318";
        } else if (quantidade >= limite * 0.9) {
            contadorMensagem.style.color = "#C2410C";
        } else {
            contadorMensagem.style.color = "";
        }
    }

    if (campoMensagem) {
        campoMensagem.addEventListener("input", atualizarContador);
        atualizarContador();
    }


    /* =====================================================
       3. MENSAGENS DE FEEDBACK
    ===================================================== */

    function mostrarFeedback(mensagem, tipo = "info") {
        if (!feedback) {
            return;
        }

        feedback.textContent = mensagem;
        feedback.className = "atendimento-feedback";

        if (tipo) {
            feedback.classList.add(tipo);
        }
    }

    function limparFeedback() {
        if (!feedback) {
            return;
        }

        feedback.textContent = "";
        feedback.className = "atendimento-feedback";
    }


    /* =====================================================
       4. LIMPEZA DE ERROS ANTERIORES
    ===================================================== */

    const campos = [
        campoNome,
        campoEmail,
        campoAssunto,
        campoTipo,
        campoMensagem
    ].filter(Boolean);

    campos.forEach((campo) => {
        campo.addEventListener("input", () => {
            campo.removeAttribute("aria-invalid");
            limparFeedback();
        });

        campo.addEventListener("change", () => {
            campo.removeAttribute("aria-invalid");
            limparFeedback();
        });
    });


    /* =====================================================
       5. VALIDAÇÃO DOS CAMPOS
    ===================================================== */

    function validarFormulario() {
        for (const campo of campos) {
            campo.removeAttribute("aria-invalid");
        }

        const nome = campoNome.value.trim();
        const email = campoEmail.value.trim();
        const assunto = campoAssunto.value;
        const tipo = campoTipo.value;
        const mensagem = campoMensagem.value.trim();

        if (nome.length < 3) {
            campoNome.setAttribute("aria-invalid", "true");

            mostrarFeedback(
                "Digite seu nome completo, com pelo menos 3 caracteres.",
                "error"
            );

            campoNome.focus();
            return false;
        }

        if (nome.length > 120) {
            campoNome.setAttribute("aria-invalid", "true");

            mostrarFeedback(
                "O nome deve ter no máximo 120 caracteres.",
                "error"
            );

            campoNome.focus();
            return false;
        }

        if (!campoEmail.validity.valid || email.length === 0) {
            campoEmail.setAttribute("aria-invalid", "true");

            mostrarFeedback(
                "Digite um endereço de e-mail válido.",
                "error"
            );

            campoEmail.focus();
            return false;
        }

        if (email.length > 254) {
            campoEmail.setAttribute("aria-invalid", "true");

            mostrarFeedback(
                "O endereço de e-mail é muito longo.",
                "error"
            );

            campoEmail.focus();
            return false;
        }

        if (!assunto) {
            campoAssunto.setAttribute("aria-invalid", "true");

            mostrarFeedback(
                "Selecione o assunto da solicitação.",
                "error"
            );

            campoAssunto.focus();
            return false;
        }

        if (!tipo) {
            campoTipo.setAttribute("aria-invalid", "true");

            mostrarFeedback(
                "Selecione o tipo de solicitação.",
                "error"
            );

            campoTipo.focus();
            return false;
        }

        if (mensagem.length < 10) {
            campoMensagem.setAttribute("aria-invalid", "true");

            mostrarFeedback(
                "Escreva uma mensagem com pelo menos 10 caracteres.",
                "error"
            );

            campoMensagem.focus();
            return false;
        }

        if (mensagem.length > 3000) {
            campoMensagem.setAttribute("aria-invalid", "true");

            mostrarFeedback(
                "A mensagem deve ter no máximo 3000 caracteres.",
                "error"
            );

            campoMensagem.focus();
            return false;
        }

        return true;
    }


    /* =====================================================
       6. ENVIO DO FORMULÁRIO
    ===================================================== */

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        limparFeedback();

        if (!validarFormulario()) {
            return;
        }

        mostrarFeedback(
            "Os campos foram validados, mas o atendimento ainda não foi enviado. " +
            "É necessário conectar o formulário a um servidor para registrar sua solicitação.",
            "info"
        );

        if (feedback) {
            feedback.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    });


    /* =====================================================
       7. PROTEÇÃO VISUAL PARA CAMPOS INVÁLIDOS
    ===================================================== */

    const estiloValidacao = document.createElement("style");

    estiloValidacao.textContent = `
        #atendimento-form [aria-invalid="true"] {
            border-color: #B42318 !important;
            box-shadow: 0 0 0 3px rgba(180, 35, 24, 0.08);
        }
    `;

    document.head.appendChild(estiloValidacao);


    /* =====================================================
       8. INICIALIZAÇÃO
    ===================================================== */

    atualizarContador();
});
