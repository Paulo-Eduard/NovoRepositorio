
/* ==================================================
   PATAS QUE TRANSFORMAM
   Arquivo: js/main.js
   Funcionalidades gerais do site
================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Seleciona os elementos do menu
    const menuToggle = document.querySelector("#menu-toggle");
    const navMenu = document.querySelector("#nav-menu");
    const navLinks = document.querySelectorAll("#nav-menu .nav-link");

    // 2. Abre e fecha o menu para dispositivos móveis
    if (menuToggle && navMenu) {
        menuToggle.setAttribute("aria-controls", "nav-menu");
        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", () => {
            const menuAberto = navMenu.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(menuAberto)
            );

            menuToggle.setAttribute(
                "aria-label",
                menuAberto ? "Fechar menu" : "Abrir menu"
            );

            // Atualiza o símbolo do botão
            menuToggle.textContent = menuAberto ? "✕" : "☰";
        });

        // 3. Fecha o menu quando um link é selecionado
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Abrir menu");
                menuToggle.textContent = "☰";
            });
        });

        // 4. Fecha o menu ao pressionar a tecla Escape
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                navMenu.classList.remove("open");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Abrir menu");
                menuToggle.textContent = "☰";
            }
        });

        // 5. Fecha o menu se a tela voltar ao tamanho de computador
        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                navMenu.classList.remove("open");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Abrir menu");
                menuToggle.textContent = "☰";
            }
        });
    }

    // 6. Atualiza automaticamente o ano do rodapé
    const yearElements = document.querySelectorAll(".current-year");

    yearElements.forEach((element) => {
        element.textContent = new Date().getFullYear();
    });

    // 7. Adiciona uma indicação visual aos links da página atual
    const currentPage = window.location.pathname
        .split("/")
        .pop() || "index.html";

    navLinks.forEach((link) => {
        const linkPage = link.getAttribute("href");

        if (!linkPage) return;

        const normalizedLink = linkPage.split("?")[0].split("#")[0];

        if (normalizedLink === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });

    // 8. Evita que links com href="#" levem a página ao topo sem necessidade
    document.querySelectorAll('a[href="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
        });
    });

    console.log("Patas que Transformam: site carregado com sucesso! 🐾");
});
