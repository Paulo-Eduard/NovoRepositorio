
/* ==================================================
   PATAS QUE TRANSFORMAM
   Arquivo: js/adocao.js
   Funcionalidades da página de adoção
================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Localiza os filtros e os cartões dos animais
    const filterButtons = document.querySelectorAll(".filter-btn");
    const petCards = document.querySelectorAll(".pet-card[data-species]");
    const noPetsMessage = document.querySelector("#no-pets-message");
    const petCount = document.querySelector("#pet-count");

    // Se a página não possuir filtros, encerra a execução
    if (filterButtons.length === 0 || petCards.length === 0) {
        return;
    }

    // 2. Filtra os animais de acordo com a espécie selecionada
    function filterPets(selectedFilter) {
        let visiblePets = 0;

        petCards.forEach((card) => {
            const species = card.dataset.species;

            const matchesFilter =
                selectedFilter === "todos" ||
                species === selectedFilter;

            // Oculta os animais que não correspondem ao filtro
            card.hidden = !matchesFilter;

            if (matchesFilter) {
                visiblePets++;
            }
        });

        // 3. Atualiza o estado visual e acessível dos botões
        filterButtons.forEach((button) => {
            const isActive = button.dataset.filter === selectedFilter;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        // 4. Exibe uma mensagem se nenhum animal corresponder
        if (noPetsMessage) {
            noPetsMessage.hidden = visiblePets > 0;
        }

        // 5. Atualiza a quantidade de animais visíveis, se existir
        if (petCount) {
            petCount.textContent =
                visiblePets === 1
                    ? "1 animal encontrado"
                    : `${visiblePets} animais encontrados`;
        }
    }

    // 6. Adiciona o evento de clique aos filtros
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedFilter = button.dataset.filter;

            filterPets(selectedFilter);
        });
    });

    // 7. Inicia a página mostrando todos os animais
    filterPets("todos");

    console.log("Patas que Transformam: filtros de adoção carregados! 🐶🐱");
});
