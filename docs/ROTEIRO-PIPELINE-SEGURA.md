# Roteiro: Secure Pipeline CI/CD (SAST + DAST)

## Pipeline resultante

```
push/PR → Lint HTML → Testes → SAST (Semgrep) ┐
                              → DAST (ZAP)     ┴→ DefectDojo (opcional) → Deploy (só na main)
```

| Nó | Ferramenta | Validação (quando falha) |
|---|---|---|
| Lint HTML | html-validate | qualquer erro de HTML |
| Testes | `tests/test-site.js` | arquivo/link ausente, falta de meta/title, `eval`, `innerHTML`, `target=_blank` sem `noopener` |
| **SAST** | Semgrep (`p/default`, `p/javascript`, `p/owasp-top-ten`) | qualquer finding (`--error`) |
| **DAST** | OWASP ZAP Baseline | regras `FAIL` de `.zap/rules.tsv` |
| Bônus | DefectDojo | não bloqueia; só envia se houver secrets |
| Deploy | gh-pages | só roda se tudo acima passar |

## Passo a passo

1. **Copiar os arquivos para o repositório** (mantendo as pastas): `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `.zap/rules.tsv`, `tests/test-site.js`, `docs/`.
2. **Corrigir o ícone**: renomear `assets/icons/Pata.png` para `pata.png` (o GitHub/Linux diferencia maiúsculas).
   ```bash
   git mv assets/icons/Pata.png assets/icons/pata.png
   ```
   Se o Git não detectar a troca (Windows/macOS): `git mv assets/icons/Pata.png assets/icons/tmp.png && git mv assets/icons/tmp.png assets/icons/pata.png`
3. **Testar localmente** (opcional): `node tests/test-site.js`
4. **Criar uma branch e abrir PR** para ver a pipeline rodar sem publicar:
   ```bash
   git checkout -b feature/pipeline-segura
   git add .
   git commit -m "ci: adiciona SAST (Semgrep) e DAST (ZAP) na esteira"
   git push -u origin feature/pipeline-segura
   ```
5. No GitHub: aba **Actions** → confira os jobs `SAST (Semgrep)` e `DAST (OWASP ZAP)` e baixe os relatórios em *Artifacts* (`relatorio-sast-semgrep`, `relatorio-dast-zap` → abra o `.html`).
6. **Fazer merge na `main`**: o `deploy.yml` reaproveita o `ci.yml` e só publica se SAST e DAST passarem.
7. **Habilitar o Pages**: Settings → Pages → Branch `gh-pages` / root.
8. **Provar a validação (para a apresentação)**: crie uma branch e adicione em `js/main.js` algo como `document.body.innerHTML = location.hash;` → o teste/SAST deve falhar (job vermelho). Remova e o job volta a ficar verde.

## Bônus (+0.5): DefectDojo

1. Suba um DefectDojo (ex.: `git clone https://github.com/DefectDojo/django-DefectDojo && ./dc-build.sh && ./dc-up.sh`) acessível pela internet (o runner do GitHub precisa alcançá-lo; para teste local use ngrok/cloudflared).
2. Em Settings → Secrets and variables → Actions crie os secrets `DEFECTDOJO_URL` (ex.: `https://meu-dojo.exemplo.com`) e `DEFECTDOJO_TOKEN` (perfil → API v2 Key). Opcional: variável `DEFECTDOJO_PRODUCT`.
3. Rode a pipeline: o job `Enviar para DefectDojo` importa o `semgrep.json` ("Semgrep JSON Report") e o `zap-report.xml` ("ZAP Scan") e cria produto/engagement automaticamente.

## Observações

- Cabeçalhos HTTP (CSP, HSTS, X-Frame-Options) são avisos (WARN) no ZAP, pois o GitHub Pages não permite configurá-los. Para endurecer, é possível adicionar `<meta http-equiv="Content-Security-Policy">` nas páginas e promover as regras a FAIL em `.zap/rules.tsv`.
- O DAST roda contra o site servido localmente no runner (antes do deploy). Para varrer o site publicado, troque `-t` pela URL do Pages em um job pós-deploy.
- Próximos nós do diagrama (opcionais): Secrets Scan (Gitleaks), SCA (Dependency-Check – não há dependências neste projeto) e IaC (Trivy – não há IaC).
