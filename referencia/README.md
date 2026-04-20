# poc_automation_js_playwright

[![QA Automation Tests](https://github.com/danilomedeiros100/poc_automation_js_playwright/actions/workflows/tests.yml/badge.svg)](https://github.com/danilomedeiros100/poc_automation_js_playwright/actions/workflows/tests.yml)

Base de automação QA com **Playwright (JavaScript)** cobrindo testes de **UI e API** no mesmo projeto. Inclui Page Object Model, sistema de tags, relatórios Allure e Playwright, e pipeline CI/CD completo via GitHub Actions.

---

## Relatórios online

> Atualizados automaticamente a cada merge na `main`

| Relatório | Link | Uso |
|---|---|---|
| Landing page | [github.io/poc_automation_js_playwright](https://danilomedeiros100.github.io/poc_automation_js_playwright/) | Acesso central |
| Playwright | [/playwright/](https://danilomedeiros100.github.io/poc_automation_js_playwright/playwright/) | Debug e análise de steps |
| Allure | [/allure/](https://danilomedeiros100.github.io/poc_automation_js_playwright/allure/) | Métricas e visão gerencial |

---

## Pré-requisitos

| Ferramenta | Versão mínima | Observação |
|---|---|---|
| Node.js | 18+ | Obrigatório |
| Java | 11+ | Apenas para gerar Allure **localmente** (`brew install openjdk`) |

---

## Setup inicial

```bash
# Clona e entra no projeto
git clone https://github.com/danilomedeiros100/poc_automation_js_playwright.git
cd poc_automation_js_playwright

# Instala deps e browsers de uma vez
npm run setup

# Cria o arquivo de variáveis de ambiente
cp .env.example .env
```

O `.env` já vem com os valores do POC preenchidos. Nenhuma alteração necessária para rodar.

---

## Executando os testes

```bash
# Todos os testes
npm test

# Por escopo
npm run test:ui
npm run test:api

# Por tag / estratégia
npm run test:sanity      # testes rápidos — mesmo conjunto do PR gate
npm run test:critical    # caminhos críticos — mesmo conjunto do merge gate
npm run test:regression  # suite completa — mesmo conjunto do nightly
```

---

## Relatórios locais

```bash
# Playwright (abre no browser automaticamente)
npm run report:playwright

# Allure (requer Java instalado)
npm run report:allure          # gera + abre em um comando
npm run report:allure:generate # só gera
npm run report:allure:open     # só abre
```

---

## Estratégia de tags

Cada teste deve ter **ao menos uma tag de escopo** (`@ui` ou `@api`) e **ao menos uma tag de suíte**.

| Tag | Suíte | Disparado em |
|---|---|---|
| `@sanity` | Testes críticos rápidos | PR (gate de aprovação) |
| `@critical` | Caminhos críticos de negócio | Merge na `main` |
| `@regression` | Suite completa | Nightly (02h UTC) |
| `@smoke` | Fluxo principal (subconjunto de @sanity) | — |
| `@ui` | Escopo: testes de interface | — |
| `@api` | Escopo: testes de API | — |

---

## Estrutura do projeto

```
src/
  pages/       # Page Object Model — exclusivo para UI
  api/         # Clientes de API — exclusivo para testes de API
  fixtures/    # Setup e teardown (ui.fixture.js, api.fixture.js)
  utils/       # env.js (variáveis) e data.js (dados de teste)
  data/        # users.json, payloads.json

tests/
  ui/          # Specs de UI (login, inventory)
  api/         # Specs de API (users, posts)

.github/
  workflows/
    tests.yml  # Pipeline CI/CD
  pages-index.html  # Landing page dos relatórios
```

**Regra:** POM só para UI. Testes de API usam os clientes de `src/api/` diretamente, sem POM.

---

## Pipeline CI/CD

```
Pull Request
└── Sanity Tests ────────────────────── gate de PR

Push para main (merge)
└── Sanity Tests
    └── Critical Tests ─────────────── gate de merge
        └── Deploy GitHub Pages ─────── publica relatórios

Nightly (02h UTC)
└── Regression Tests ────────────────── suite completa
```

### Ambientes de teste

| Camada | URL |
|---|---|
| UI | https://www.saucedemo.com |
| API | https://jsonplaceholder.typicode.com |

---

## Variáveis de ambiente (GitHub Secrets)

Necessárias para o CI. Configure em `Settings → Secrets and variables → Actions`.

| Secret | Valor padrão do POC |
|---|---|
| `BASE_URL` | `https://www.saucedemo.com` |
| `API_URL` | `https://jsonplaceholder.typicode.com` |
| `UI_USER` | `standard_user` |
| `UI_PASS` | `secret_sauce` |
