
const fs = require("node:fs");
const path = require("node:path");

const paginas = [
    "index.html",
    "adocao.html",
    "sobre.html",
    "como-ajudar.html",
    "contato.html"
];

let falhas = 0;

console.log("\n=== TESTES DO PATAS QUE TRANSFORMAM ===\n");

for (const pagina of paginas) {
    const caminho = path.join(process.cwd(), pagina);

    if (!fs.existsSync(caminho)) {
        console.error(`FALHOU: arquivo ${pagina} nao encontrado.`);
        falhas++;
        continue;
    }

    const html = fs.readFileSync(caminho, "utf8");
    const nome = pagina;

    const temDoctype = /<!doctype html>/i.test(html);
    const temIdioma = /<html\b[^>]*\blang=["']pt-BR["']/i.test(html);
    const temTitulo = /<title>[\s\S]*?<\/title>/i.test(html);

    if (!temDoctype || !temIdioma || !temTitulo) {
        console.error(`FALHOU: estrutura HTML de ${nome} incompleta.`);

        if (!temDoctype) {
            console.error("  - DOCTYPE HTML ausente.");
        }

        if (!temIdioma) {
            console.error("  - Idioma pt-BR ausente.");
        }

        if (!temTitulo) {
            console.error("  - Titulo da pagina ausente.");
        }

        falhas++;
        continue;
    }

    console.log(`OK: ${nome}`);
}

console.log("\n=== RESULTADO ===");

if (falhas > 0) {
    console.error(`${falhas} verificacao(oes) falharam.`);
    process.exitCode = 1;
} else {
    console.log("Todos os testes passaram!");
}
