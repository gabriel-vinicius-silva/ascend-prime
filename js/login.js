
// =========================================================
// ASCEND PRIME — SISTEMA DE AUTENTICAÇÃO
// Arquivo: js/login.js
//
// Funcionalidades:
// - Alternar entre login e cadastro
// - Abrir recuperação de senha
// - Mostrar e ocultar senhas
// - Validar os formulários
// - Lembrar o e-mail opcionalmente
//
// IMPORTANTE:
// A autenticação real será implementada futuramente com PHP
// e MySQL. Este arquivo ainda não cria contas nem faz login.
// =========================================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    configurarAbas();
    configurarNavegacaoAutenticacao();
    configurarVisualizacaoSenhas();
    configurarFormularioLogin();
    configurarFormularioCadastro();
    configurarRecuperacaoSenha();
    configurarLembrarEmail();
});


// =========================================================
// PAINÉIS DE AUTENTICAÇÃO
// =========================================================

const seletoresAuth = {
    login: "#painel-login",
    cadastro: "#painel-cadastro",
    recuperar: "#painel-recuperar"
};

function mostrarPainel(nomePainel) {
    const seletor = seletoresAuth[nomePainel];
    const painelDesejado = seletor
        ? document.querySelector(seletor)
        : null;

    if (!painelDesejado) {
        console.warn(
            `Painel não encontrado: ${nomePainel}. Confira o ID no HTML.`
        );

        return;
    }

    Object.entries(seletoresAuth).forEach(([nome, painelSeletor]) => {
        const painel = document.querySelector(painelSeletor);

        if (painel) {
            painel.hidden = nome !== nomePainel;
        }
    });

    atualizarAbas(nomePainel);
    limparFeedbacks();

    const primeiroCampo = painelDesejado.querySelector(
        "input:not([type='checkbox']), select, textarea"
    );

    if (primeiroCampo) {
        primeiroCampo.focus();
    }
}


// =========================================================
// ABAS DE LOGIN E CADASTRO
// =========================================================

function configurarAbas() {
    const abas = document.querySelectorAll("[data-auth-tab]");

    abas.forEach((aba) => {
        aba.addEventListener("click", () => {
            const destino = aba.dataset.authTab;

            if (destino === "login" || destino === "cadastro") {
                mostrarPainel(destino);
            }
        });
    });
}

function atualizarAbas(painelAtivo) {
    const abaAtiva = painelAtivo === "recuperar"
        ? "login"
        : painelAtivo;

    document.querySelectorAll("[data-auth-tab]").forEach((aba) => {
        const selecionada = aba.dataset.authTab === abaAtiva;

        aba.classList.toggle("active", selecionada);
        aba.setAttribute("aria-selected", String(selecionada));
        aba.tabIndex = selecionada ? 0 : -1;
    });
}


// =========================================================
// NAVEGAÇÃO ENTRE OS PAINÉIS
// =========================================================

function configurarNavegacaoAutenticacao() {
    document.querySelectorAll("[data-open-auth]").forEach((botao) => {
        botao.addEventListener("click", (evento) => {
            evento.preventDefault();

            const destino = botao.dataset.openAuth;

            if (Object.prototype.hasOwnProperty.call(
                seletoresAuth,
                destino
            )) {
                mostrarPainel(destino);
            }
        });
    });
}


// =========================================================
// MOSTRAR OU OCULTAR SENHA
// Compatível com data-password-toggle e password-toggle
// =========================================================

function configurarVisualizacaoSenhas() {
    const botoes = document.querySelectorAll(
        "[data-password-toggle], .password-toggle"
    );

    botoes.forEach((botao) => {
        // Evita registrar o mesmo evento duas vezes.
        if (botao.dataset.passwordToggleConfigured === "true") {
            return;
        }

        botao.dataset.passwordToggleConfigured = "true";

        botao.addEventListener("click", () => {
            const idCampo = botao.dataset.passwordToggle;
            const campo = idCampo
                ? document.getElementById(idCampo)
                : botao.parentElement?.querySelector("input");

            if (!campo || campo.tagName !== "INPUT") {
                console.warn(
                    "Campo de senha não encontrado para o botão."
                );

                return;
            }

            const mostrar = campo.type === "password";

            campo.type = mostrar ? "text" : "password";

            const textoBotao = botao.querySelector(
                "span, .password-toggle-text"
            );

            if (textoBotao) {
                textoBotao.textContent = mostrar
                    ? "Ocultar"
                    : "Mostrar";
            } else if (
                botao.childElementCount === 0 ||
                botao.textContent.trim() !== ""
            ) {
                botao.textContent = mostrar
                    ? "Ocultar"
                    : "Mostrar";
            }

            botao.setAttribute(
                "aria-label",
                mostrar ? "Ocultar senha" : "Mostrar senha"
            );

            botao.setAttribute(
                "aria-pressed",
                String(mostrar)
            );

            campo.focus();
        });
    });
}


// =========================================================
// MENSAGENS DE FEEDBACK
// =========================================================

function mostrarFeedback(idElemento, mensagem, tipo = "info") {
    const elemento = document.getElementById(idElemento);

    if (!elemento) {
        console.warn(
            `Elemento de feedback não encontrado: ${idElemento}`
        );

        return;
    }

    elemento.textContent = mensagem;
    elemento.className = `auth-feedback ${tipo}`;

    elemento.setAttribute(
        "role",
        tipo === "error" ? "alert" : "status"
    );

    elemento.setAttribute("aria-live", "polite");
}

function limparFeedbacks() {
    [
        "login-feedback",
        "cadastro-feedback",
        "recuperar-feedback"
    ].forEach((id) => {
        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = "";
            elemento.className = "auth-feedback";
        }
    });
}


// =========================================================
// VALIDAÇÕES
// =========================================================

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function normalizarEmail(email) {
    return email.trim().toLowerCase();
}

function senhaValida(senha) {
    return senha.length >= 8;
}


// =========================================================
// LOGIN
// =========================================================

function configurarFormularioLogin() {
    const formulario = document.getElementById("login-form");

    if (!formulario) {
        console.warn("Formulário #login-form não encontrado.");
        return;
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        limparFeedbacks();

        const campoEmail = document.getElementById("login-email");
        const campoSenha = document.getElementById("login-senha");

        if (!campoEmail || !campoSenha) {
            mostrarFeedback(
                "login-feedback",
                "Não foi possível localizar os campos de login. Confira os IDs no HTML.",
                "error"
            );

            return;
        }

        const email = normalizarEmail(campoEmail.value);
        const senha = campoSenha.value;

        if (!emailValido(email)) {
            mostrarFeedback(
                "login-feedback",
                "Digite um endereço de e-mail válido.",
                "error"
            );

            campoEmail.focus();
            return;
        }

        if (!senha) {
            mostrarFeedback(
                "login-feedback",
                "Digite sua senha para continuar.",
                "error"
            );

            campoSenha.focus();
            return;
        }

        // FUTURO:
        // Enviar os dados para a API PHP.
        // O servidor deverá validar a senha e iniciar uma sessão.
        // Não guardar a senha no localStorage ou sessionStorage.

        mostrarFeedback(
            "login-feedback",
            "Os campos foram validados. O login real estará disponível quando conectarmos o sistema ao PHP e ao banco de dados.",
            "info"
        );
    });
}


// =========================================================
// CADASTRO
// =========================================================

function configurarFormularioCadastro() {
    const formulario = document.getElementById("cadastro-form");

    if (!formulario) {
        console.warn("Formulário #cadastro-form não encontrado.");
        return;
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        limparFeedbacks();

        const campoNome = document.getElementById("cadastro-nome");
        const campoEmail = document.getElementById("cadastro-email");
        const campoSenha = document.getElementById("cadastro-senha");
        const campoConfirmacao = document.getElementById("confirmar-senha");
        const campoTermos = document.getElementById("aceitar-termos");

        if (
            !campoNome ||
            !campoEmail ||
            !campoSenha ||
            !campoConfirmacao
        ) {
            mostrarFeedback(
                "cadastro-feedback",
                "Um ou mais campos do cadastro não foram encontrados. Confira os IDs no HTML.",
                "error"
            );

            return;
        }

        const nome = campoNome.value.trim();
        const email = normalizarEmail(campoEmail.value);
        const senha = campoSenha.value;
        const confirmacao = campoConfirmacao.value;

        if (nome.length < 2) {
            mostrarFeedback(
                "cadastro-feedback",
                "Digite seu nome com pelo menos 2 caracteres.",
                "error"
            );

            campoNome.focus();
            return;
        }

        if (!emailValido(email)) {
            mostrarFeedback(
                "cadastro-feedback",
                "Digite um endereço de e-mail válido.",
                "error"
            );

            campoEmail.focus();
            return;
        }

        if (!senhaValida(senha)) {
            mostrarFeedback(
                "cadastro-feedback",
                "A senha precisa ter pelo menos 8 caracteres.",
                "error"
            );

            campoSenha.focus();
            return;
        }

        if (senha !== confirmacao) {
            mostrarFeedback(
                "cadastro-feedback",
                "As senhas digitadas não são iguais.",
                "error"
            );

            campoConfirmacao.focus();
            return;
        }

        if (campoTermos && !campoTermos.checked) {
            mostrarFeedback(
                "cadastro-feedback",
                "Você precisa aceitar os termos para continuar.",
                "error"
            );

            campoTermos.focus();
            return;
        }

        // FUTURO:
        // Enviar os dados ao cadastro.php.
        // A validação definitiva será feita no servidor.
        // O PHP deverá armazenar a senha usando password_hash().

        mostrarFeedback(
            "cadastro-feedback",
            "Cadastro validado no navegador. Para criar sua conta, ainda precisamos conectar o formulário ao PHP e ao banco de dados.",
            "info"
        );
    });
}


// =========================================================
// RECUPERAÇÃO DE SENHA
// =========================================================

function configurarRecuperacaoSenha() {
    const formulario = document.getElementById("recuperar-form");

    if (!formulario) {
        console.warn("Formulário #recuperar-form não encontrado.");
        return;
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        limparFeedbacks();

        const campoEmail = document.getElementById("recuperar-email");

        if (!campoEmail) {
            mostrarFeedback(
                "recuperar-feedback",
                "O campo de e-mail não foi encontrado. Confira o HTML.",
                "error"
            );

            return;
        }

        const email = normalizarEmail(campoEmail.value);

        if (!emailValido(email)) {
            mostrarFeedback(
                "recuperar-feedback",
                "Digite um endereço de e-mail válido.",
                "error"
            );

            campoEmail.focus();
            return;
        }

        // FUTURO:
        // Enviar para recuperar-senha.php.
        // O servidor deverá gerar um token seguro, temporário,
        // de uso único, e enviar o link de recuperação por e-mail.

        mostrarFeedback(
            "recuperar-feedback",
            "O e-mail foi validado. A recuperação real de senha precisa ser conectada ao servidor.",
            "info"
        );
    });
}


// =========================================================
// LEMBRAR E-MAIL
// Compatível com o ID #lembrar-login do seu HTML
// =========================================================

function configurarLembrarEmail() {
    const campoEmail = document.getElementById("login-email");

    const checkbox =
        document.getElementById("lembrar-login") ||
        document.getElementById("lembrar-email");

    if (!campoEmail || !checkbox) {
        return;
    }

    // Tenta recuperar somente o e-mail salvo.
    // A senha nunca é armazenada no navegador.

    try {
        const emailSalvo = localStorage.getItem(
            "ascend-prime-email"
        );

        if (emailSalvo) {
            campoEmail.value = emailSalvo;
            checkbox.checked = true;
        }
    } catch (erro) {
        console.warn(
            "O navegador não permitiu acessar o armazenamento local."
        );
    }

    checkbox.addEventListener("change", () => {
        if (!checkbox.checked) {
            try {
                localStorage.removeItem("ascend-prime-email");
            } catch (erro) {
                console.warn("Não foi possível remover o e-mail salvo.");
            }
        }
    });

    // Salva apenas o e-mail quando o formulário for enviado.
    // O envio do formulário não significa que o login foi aprovado.

    const formulario = document.getElementById("login-form");

    if (!formulario) {
        return;
    }

    formulario.addEventListener("submit", () => {
        const email = normalizarEmail(campoEmail.value);

        try {
            if (checkbox.checked && emailValido(email)) {
                localStorage.setItem(
                    "ascend-prime-email",
                    email
                );
            } else {
                localStorage.removeItem("ascend-prime-email");
            }
        } catch (erro) {
            console.warn("Não foi possível salvar a preferência.");
        }
    });
}
