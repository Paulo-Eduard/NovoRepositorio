
/* ==================================================
   PATAS QUE TRANSFORMAM
   Arquivo: js/forms.js
   Funcionalidades do formulário de contato
================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Localiza os elementos do formulário
    const form = document.querySelector("#contact-form");
    const assunto = document.querySelector("#assunto");
    const animalGroup = document.querySelector("#animal-group");
    const animalInput = document.querySelector("#animal");
    const status = document.querySelector("#form-status");

    // Encerra a execução se a página não possuir o formulário
    if (!form || !assunto) {
        return;
    }

    // 2. Define os assuntos permitidos
    const assuntosPermitidos = [
        "adocao",
        "voluntariado",
        "doacao",
        "lar-temporario",
        "parceria",
        "resgate",
        "duvida",
        "outro"
    ];

    // 3. Lê os parâmetros da URL
    const parametros = new URLSearchParams(window.location.search);
    const assuntoURL = parametros.get("assunto");
    const animalURL = parametros.get("animal");

    // Seleciona o assunto recebido pela URL, se for válido
    if (assuntoURL && assuntosPermitidos.includes(assuntoURL)) {
        assunto.value = assuntoURL;
    }

    // Preenche o animal quando o visitante vem da página de adoção
    if (animalURL && animalInput) {
        animalInput.value = animalURL.slice(0, 100);
        assunto.value = "adocao";
    }

    // 4. Mostra o campo do animal somente em assuntos de adoção
    function atualizarCampoAnimal() {
        const mostrarCampo = assunto.value === "adocao";

        if (animalGroup) {
            animalGroup.hidden = !mostrarCampo;
        }

        if (animalInput) {
            animalInput.required = mostrarCampo;

            if (!mostrarCampo) {
                animalInput.value = "";
            }
        }
    }

    assunto.addEventListener("change", atualizarCampoAnimal);
    atualizarCampoAnimal();

    // 5. Prepara a área de mensagens do formulário
    function mostrarMensagem(mensagem, tipo) {
        if (!status) {
            return;
        }

        status.textContent = mensagem;
        status.hidden = false;
        status.setAttribute("role", tipo === "erro" ? "alert" : "status");

        status.classList.toggle("form-status-error", tipo === "erro");
        status.classList.toggle("form-status-success", tipo === "sucesso");
    }

    // 6. Valida e processa o envio do formulário
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Validação nativa dos campos required e dos tipos de entrada
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Confere se o assunto escolhido é permitido
        if (!assuntosPermitidos.includes(assunto.value)) {
            mostrarMensagem(
                "Por favor, selecione um assunto válido.",
                "erro"
            );
            assunto.focus();
            return;
        }

        // Confere se o visitante aceitou a política de privacidade
        const privacidade = form.querySelector(
            'input[name="privacidade"]'
        );

        if (privacidade && !privacidade.checked) {
            mostrarMensagem(
                "Para continuar, confirme que leu a política de privacidade.",
                "erro"
            );
            privacidade.focus();
            return;
        }

        // A mensagem é apenas uma confirmação de validação local.
        // O envio real exige um backend ou serviço de formulários.
        mostrarMensagem(
            "Seus dados foram validados no navegador, mas a mensagem ainda não foi enviada. Para recebê-la, precisamos conectar o formulário a um serviço de envio.",
            "sucesso"
        );

        console.log(
            "Formulário validado localmente. Nenhuma mensagem foi enviada."
        );
    });

    // 7. Limpa a mensagem de status quando o visitante edita o formulário
    form.addEventListener("input", () => {
        if (status) {
            status.hidden = true;
            status.textContent = "";
        }
    });

    form.addEventListener("change", () => {
        if (status) {
            status.hidden = true;
            status.textContent = "";
        }
    });

    console.log("Patas que Transformam: formulário inicializado! 🐾");
});
