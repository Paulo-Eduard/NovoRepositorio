/* Testes estáticos do site (sem dependências externas).
 * Executar: node tests/test-site.js
 * Valida: arquivos obrigatórios, links/recursos locais (case-sensitive, como no
 * GitHub Pages), estrutura básica das páginas e práticas de segurança do HTML.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const paginas = ["index.html", "sobre.html", "adocao.html", "como-ajudar.html", "contato.html"];
const obrigatorios = [...paginas, "css/style.css", "css/animations.css",
    "js/main.js", "js/forms.js", "js/adocao.js", "assets/icons/pata.png"];

let falhas = 0;
let total = 0;

function check(ok, msg) {
    total++;
    if (ok) {
        console.log(`  ✔ ${msg}`);
    } else {
        falhas++;
        console.error(`  ✘ ${msg}`);
    }
}

// Verifica existência respeitando maiúsculas/minúsculas (Linux/GitHub Pages)
function existeExato(rel) {
    const partes = rel.split("/");
    let dir = root;
    for (const p of partes) {
        if (!fs.existsSync(dir) || !fs.readdirSync(dir).includes(p)) return false;
        dir = path.join(dir, p);
    }
    return true;
}

console.log("\n[1] Arquivos obrigatórios");
obrigatorios.forEach((f) => check(existeExato(f), f));

console.log("\n[2] Páginas HTML");
paginas.forEach((pagina) => {
    if (!existeExato(pagina)) return;
    const html = fs.readFileSync(path.join(root, pagina), "utf8");
    console.log(` ${pagina}`);

    check(/<!doctype html>/i.test(html), "possui doctype");
    check(/<html[^>]*\blang="[^"]+"/i.test(html), "html com atributo lang");
    check(/<title>[^<]{3,}<\/title>/i.test(html), "possui <title>");
    check(/<meta[^>]+name="viewport"/i.test(html), "possui meta viewport");
    check(/<meta[^>]+name="description"/i.test(html), "possui meta description");
    check((html.match(/<h1[\s>]/gi) || []).length === 1, "exatamente um <h1>");

    // Segurança básica
    check(!/\beval\s*\(|document\.write\s*\(/.test(html), "sem eval/document.write inline");
    check(!/\son[a-z]+\s*=\s*["']/i.test(html), "sem handlers inline (onclick=...)");
    const blank = html.match(/<a\b[^>]*target="_blank"[^>]*>/gi) || [];
    check(blank.every((a) => /rel="[^"]*noopener/i.test(a)),
        "links target=_blank usam rel=noopener");
    const http = html.match(/(?:src|href)="http:\/\//gi) || [];
    check(http.length === 0, "sem recursos via http:// (apenas https)");

    // Recursos e links locais
    const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/gi)].map((m) => m[1])
        .filter((r) => !/^(https?:|mailto:|tel:|#|\/\/|data:)/i.test(r))
        .map((r) => r.split("#")[0].split("?")[0])
        .filter(Boolean);
    [...new Set(refs)].forEach((r) => check(existeExato(r), `recurso local existe: ${r}`));
});

console.log("\n[3] JavaScript");
["js/main.js", "js/forms.js", "js/adocao.js"].forEach((f) => {
    if (!existeExato(f)) return;
    const src = fs.readFileSync(path.join(root, f), "utf8");
    try {
        new Function(src); // valida a sintaxe sem executar
        check(true, `${f}: sintaxe válida`);
    } catch (e) {
        check(false, `${f}: erro de sintaxe (${e.message})`);
    }
    check(!/\beval\s*\(|new Function\s*\(|\.innerHTML\s*=/.test(src),
        `${f}: sem eval/new Function/innerHTML`);
});

console.log(`\nResultado: ${total - falhas}/${total} verificações aprovadas.`);
process.exit(falhas === 0 ? 0 : 1);
