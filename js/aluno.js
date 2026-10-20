
/* =========================================================
   ASCEND PRIME — ÁREA DO ALUNO
   Arquivo: js/aluno.js

   Funcionalidades:
   - Adicionar objetivos
   - Selecionar um dos quatro pilares
   - Marcar objetivos como concluídos
   - Excluir objetivos
   - Atualizar indicadores automaticamente
   - Salvar objetivos no localStorage
   - Exibir mensagens de feedback
   - Atualizar o ano do rodapé
========================================================= */

"use strict";

/* =========================================================
   1. CONFIGURAÇÕES
========================================================= */

const CONFIG_ALUNO = {
    chaveObjetivos: "ascend_prime_objetivos",
    limiteObjetivos: 100,
    tamanhoMaximoObjetivo: 160
};

const PILARES_ALUNO = {
    mindset: {
        nome: "Mindset"
    },
    performance: {
        nome: "Performance"
    },
    spiritual: {
        nome: "Spiritual"
    },
    prosperity: {
        nome: "Prosperity"
    }
};

/* =========================================================
   2. ELEMENTOS DO HTML
========================================================= */

const elementosAluno = {
    formulario: document.getElementById("objetivo-form"),
    campoObjetivo: document.getElementById("objetivo-texto"),
    campoPilar: document.getElementById("objetivo-pilar"),

    listaObjetivos: document.getElementById("objetivos-lista"),
    objetivoVazio: document.getElementById("objetivos-vazio"),
    feedback: document.getElementById("objetivos-feedback"),

    totalObjetivos: document.getElementById("total-objetivos"),
    objetivosConcluidos: document.getElementById("objetivos-concluidos"),
    contagemObjetivos: document.getElementById("objetivos-contagem"),

    nomeAlunoSidebar: document.getElementById("aluno-nome-sidebar"),
    anoAtual: document.getElementById("current-year"),

    menuToggle: document.getElementById("menu-toggle"),
    menuPrincipal: document.getElementById("main-nav")
};

/* =========================================================
   3. ESTADO DA PÁGINA
========================================================= */

let objetivosAluno = [];
let temporizadorFeedback = null;

/* =========================================================
   4. IDENTIFICADORES
========================================================= */

function gerarIdObjetivo() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 12)
    );
}

/* =========================================================
   5. ARMAZENAMENTO LOCAL
========================================================= */

function carregarObjetivos() {
    try {
        const dadosSalvos = localStorage.getItem(
            CONFIG_ALUNO.chaveObjetivos
        );

        if (!dadosSalvos) {
            objetivosAluno = [];
            return;
        }

        const dados = JSON.parse(dadosSalvos);

        if (!Array.isArray(dados)) {
            objetivosAluno = [];
            return;
        }

        objetivosAluno = dados
            .filter((objetivo) => {
                return (
                    objetivo &&
                    typeof objetivo.id === "string" &&
                    typeof objetivo.texto === "string" &&
                    typeof objetivo.pilar === "string" &&
                    Object.prototype.hasOwnProperty.call(
                        PILARES_ALUNO,
                        objetivo.pilar
                    ) &&
                    typeof objetivo.concluido === "boolean"
                );
            })
            .slice(0, CONFIG_ALUNO.limiteObjetivos)
            .map((objetivo) => ({
                id: objetivo.id,
                texto: objetivo.texto.slice(
                    0,
                    CONFIG_ALUNO.tamanhoMaximoObjetivo
                ),
                pilar: objetivo.pilar,
                concluido: objetivo.concluido
            }));
    } catch (erro) {
        console.error(
            "Não foi possível carregar os objetivos:",
            erro
        );

        objetivosAluno = [];

        mostrarFeedback(
            "Não foi possível carregar os objetivos salvos. Verifique as configurações do navegador.",
            "error"
        );
    }
}

function salvarObjetivos() {
    try {
        localStorage.setItem(
            CONFIG_ALUNO.chaveObjetivos,
            JSON.stringify(objetivosAluno)
        );

        return true;
    } catch (erro) {
        console.error(
            "Não foi possível salvar os objetivos:",
            erro
        );

        mostrarFeedback(
            "Não foi possível salvar as alterações. Verifique o armazenamento disponível no navegador.",
            "error"
        );

        return false;
    }
}

/* =========================================================
   6. MENSAGENS DE FEEDBACK
========================================================= */

function mostrarFeedback(mensagem, tipo = "success") {
    const elemento = elementosAluno.feedback;

    if (!elemento) {
        return;
    }

    if (temporizadorFeedback) {
        clearTimeout(temporizadorFeedback);
        temporizadorFeedback = null;
    }

    elemento.textContent = mensagem;

    elemento.classList.remove("success", "error");

    if (tipo === "success") {
        elemento.classList.add("success");
    } else if (tipo === "error") {
        elemento.classList.add("error");
    }

    temporizadorFeedback = setTimeout(() => {
        elemento.textContent = "";
        elemento.classList.remove("success", "error");
        temporizadorFeedback = null;
    }, 5000);
}

/* =========================================================
   7. CRIAR ELEMENTOS HTML COM SEGURANÇA
========================================================= */

function criarElemento(tag, classe, texto = "") {
    const elemento = document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }

    if (texto !== "") {
        elemento.textContent = texto;
    }

    return elemento;
}

/* =========================================================
   8. CONTAGEM DOS OBJETIVOS
========================================================= */

function atualizarIndicadores() {
    const total = objetivosAluno.length;

    const concluidos = objetivosAluno.filter((objetivo) => {
        return objetivo.concluido;
    }).length;

    if (elementosAluno.totalObjetivos) {
        elementosAluno.totalObjetivos.textContent = total;
    }

    if (elementosAluno.objetivosConcluidos) {
        elementosAluno.objetivosConcluidos.textContent =
            concluidos;
    }

    if (elementosAluno.contagemObjetivos) {
        elementosAluno.contagemObjetivos.textContent =
            total === 1
                ? "1 objetivo"
                : `${total} objetivos`;
    }
}

/* =========================================================
   9. CRIAR UM OBJETIVO NA LISTA
========================================================= */

function criarCartaoObjetivo(objetivo) {
    const item = criarElemento(
        "li",
        objetivo.concluido
            ? "objective-item completed"
            : "objective-item"
    );

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.className = "objective-checkbox";
    checkbox.checked = objetivo.concluido;
    checkbox.setAttribute(
        "aria-label",
        `Marcar "${objetivo.texto}" como concluído`
    );

    checkbox.addEventListener("change", () => {
        alternarConclusaoObjetivo(objetivo.id);
    });

    const conteudo = criarElemento(
        "div",
        "objective-item-content"
    );

    const titulo = criarElemento(
        "span",
        "objective-item-title",
        objetivo.texto
    );

    const pilar = criarElemento(
        "span",
        "objective-item-pillar",
        PILARES_ALUNO[objetivo.pilar].nome
    );

    const botaoExcluir = criarElemento(
        "button",
        "objective-delete",
        "×"
    );

    botaoExcluir.type = "button";
    botaoExcluir.setAttribute(
        "aria-label",
        `Excluir o objetivo: ${objetivo.texto}`
    );
    botaoExcluir.title = "Excluir objetivo";

    botaoExcluir.addEventListener("click", () => {
        excluirObjetivo(objetivo.id);
    });

    conteudo.append(titulo, pilar);

    item.append(
        checkbox,
        conteudo,
        botaoExcluir
    );

    return item;
}

/* =========================================================
   10. RENDERIZAR A LISTA
========================================================= */

function renderizarObjetivos() {
    const lista = elementosAluno.listaObjetivos;

    if (!lista) {
        return;
    }

    lista.replaceChildren();

    if (objetivosAluno.length === 0) {
        const vazio = criarElemento(
            "li",
            "objectives-empty"
        );

        const icone = criarElemento(
            "span",
            "empty-icon",
            "◎"
        );

        icone.setAttribute("aria-hidden", "true");

        const titulo = criarElemento(
            "strong",
            "",
            "Nenhum objetivo registrado"
        );

        const descricao = criarElemento(
            "p",
            "",
            "Adicione seu primeiro objetivo e comece a organizar sua jornada."
        );

        vazio.append(icone, titulo, descricao);
        lista.appendChild(vazio);

        atualizarIndicadores();
        return;
    }

    const fragmento = document.createDocumentFragment();

    objetivosAluno.forEach((objetivo) => {
        fragmento.appendChild(
            criarCartaoObjetivo(objetivo)
        );
    });

    lista.appendChild(fragmento);

    atualizarIndicadores();
}

/* =========================================================
   11. ADICIONAR OBJETIVO
========================================================= */

function adicionarObjetivo(evento) {
    evento.preventDefault();

    const campoTexto = elementosAluno.campoObjetivo;
    const campoPilar = elementosAluno.campoPilar;

    if (!campoTexto || !campoPilar) {
        return;
    }

    const texto = campoTexto.value.trim();
    const pilar = campoPilar.value;

    if (!texto) {
        mostrarFeedback(
            "Digite uma descrição para o seu objetivo.",
            "error"
        );

        campoTexto.focus();
        return;
    }

    if (texto.length > CONFIG_ALUNO.tamanhoMaximoObjetivo) {
        mostrarFeedback(
            `O objetivo deve ter no máximo ${CONFIG_ALUNO.tamanhoMaximoObjetivo} caracteres.`,
            "error"
        );

        campoTexto.focus();
        return;
    }

    if (!Object.prototype.hasOwnProperty.call(
        PILARES_ALUNO,
        pilar
    )) {
        mostrarFeedback(
            "Selecione um dos quatro pilares disponíveis.",
            "error"
        );

        campoPilar.focus();
        return;
    }

    if (
        objetivosAluno.length >=
        CONFIG_ALUNO.limiteObjetivos
    ) {
        mostrarFeedback(
            `Você atingiu o limite de ${CONFIG_ALUNO.limiteObjetivos} objetivos.`,
            "error"
        );

        return;
    }

    const objetivoDuplicado = objetivosAluno.some(
        (objetivo) => {
            return (
                objetivo.texto.toLocaleLowerCase("pt-BR") ===
                    texto.toLocaleLowerCase("pt-BR") &&
                objetivo.pilar === pilar
            );
        }
    );

    if (objetivoDuplicado) {
        mostrarFeedback(
            "Você já registrou esse objetivo neste pilar.",
            "error"
        );

        campoTexto.focus();
        return;
    }

    const novoObjetivo = {
        id: gerarIdObjetivo(),
        texto: texto,
        pilar: pilar,
        concluido: false
    };

    objetivosAluno.unshift(novoObjetivo);

    if (!salvarObjetivos()) {
        objetivosAluno.shift();
        return;
    }

    renderizarObjetivos();

    campoTexto.value = "";
    campoPilar.value = "mindset";

    mostrarFeedback(
        "Objetivo adicionado com sucesso!",
        "success"
    );

    campoTexto.focus();
}

/* =========================================================
   12. MARCAR OU DESMARCAR CONCLUSÃO
========================================================= */

function alternarConclusaoObjetivo(id) {
    const indice = objetivosAluno.findIndex((objetivo) => {
        return objetivo.id === id;
    });

    if (indice === -1) {
        return;
    }

    objetivosAluno[indice].concluido =
        !objetivosAluno[indice].concluido;

    if (!salvarObjetivos()) {
        objetivosAluno[indice].concluido =
            !objetivosAluno[indice].concluido;

        renderizarObjetivos();
        return;
    }

    renderizarObjetivos();

    const objetivo = objetivosAluno[indice];

    mostrarFeedback(
        objetivo.concluido
            ? "Parabéns! Objetivo marcado como concluído."
            : "Objetivo voltou para a lista de pendências.",
        "success"
    );
}

/* =========================================================
   13. EXCLUIR OBJETIVO
========================================================= */

function excluirObjetivo(id) {
    const indice = objetivosAluno.findIndex((objetivo) => {
        return objetivo.id === id;
    });

    if (indice === -1) {
        return;
    }

    const objetivoRemovido = objetivosAluno[indice];

    objetivosAluno.splice(indice, 1);

    if (!salvarObjetivos()) {
        objetivosAluno.splice(indice, 0, objetivoRemovido);

        renderizarObjetivos();
        return;
    }

    renderizarObjetivos();

    mostrarFeedback(
        "Objetivo excluído com sucesso.",
        "success"
    );
}

/* =========================================================
   14. MENU RESPONSIVO
========================================================= */

function configurarMenuResponsivo() {
    const botao = elementosAluno.menuToggle;
    const menu = elementosAluno.menuPrincipal;

    if (!botao || !menu) {
        return;
    }

    botao.addEventListener("click", () => {
        const aberto =
            botao.getAttribute("aria-expanded") === "true";

        botao.setAttribute(
            "aria-expanded",
            String(!aberto)
        );

        botao.setAttribute(
            "aria-label",
            aberto ? "Abrir menu" : "Fechar menu"
        );

        menu.classList.toggle("active", !aberto);
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            botao.setAttribute("aria-expanded", "false");
            botao.setAttribute("aria-label", "Abrir menu");
            menu.classList.remove("active");
        });
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            botao.setAttribute("aria-expanded", "false");
            botao.setAttribute("aria-label", "Abrir menu");
            menu.classList.remove("active");
        }
    });
}

/* =========================================================
   15. ANO AUTOMÁTICO NO RODAPÉ
========================================================= */

function atualizarAnoRodape() {
    if (elementosAluno.anoAtual) {
        elementosAluno.anoAtual.textContent =
            new Date().getFullYear();
    }
}

/* =========================================================
   16. NAVEGAÇÃO LATERAL
========================================================= */

function configurarNavegacaoLateral() {
    const links = document.querySelectorAll(".sidebar-link");

    links.forEach((link) => {
        const destino = link.getAttribute("href");

        if (!destino || !destino.startsWith("#")) {
            return;
        }

        link.addEventListener("click", () => {
            links.forEach((outroLink) => {
                outroLink.classList.remove("active");
                outroLink.removeAttribute("aria-current");
            });

            link.classList.add("active");
            link.setAttribute("aria-current", "location");
        });
    });
}

/* =========================================================
   17. INICIALIZAÇÃO
========================================================= */

function iniciarAreaAluno() {
    if (elementosAluno.formulario) {
        elementosAluno.formulario.addEventListener(
            "submit",
            adicionarObjetivo
        );
    }

    carregarObjetivos();
    renderizarObjetivos();

    configurarMenuResponsivo();
    configurarNavegacaoLateral();
    atualizarAnoRodape();
}

/* =========================================================
   18. EXECUTAR QUANDO O HTML ESTIVER PRONTO
========================================================= */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarAreaAluno
    );
} else {
    iniciarAreaAluno();
}

/* =========================================================
   FIM DO JAVASCRIPT — ÁREA DO ALUNO
========================================================= */
