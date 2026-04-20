# 🚀 QA Automation Base - Playwright (UI + API) + Allure + GitHub Actions

---

## 📌 Objetivo

Criar uma base de automação **enxuta, escalável e funcional** utilizando:

- Playwright (JavaScript)
- Testes de UI e API no mesmo projeto
- Page Object Model (POM)
- Tags (sanity, regression, release)
- Playwright Report (debug)
- Allure Report (gestão)
- GitHub Actions (CI/CD)

---

## 🌐 Ambientes para POC

### UI
https://www.saucedemo.com  
user: standard_user  
pass: secret_sauce  

### API
https://reqres.in  

Endpoints:
- GET /api/users
- GET /api/users/2
- POST /api/login

---

## 📁 Estrutura Completa

qa-automation/
├── .github/
│   └── workflows/
│       └── tests.yml
│
├── src/
│   ├── pages/
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   └── HomePage.js
│   │
│   ├── api/
│   │   ├── apiClient.js
│   │   ├── authApi.js
│   │   └── usersApi.js
│   │
│   ├── fixtures/
│   │   ├── ui.fixture.js
│   │   └── api.fixture.js
│   │
│   ├── utils/
│   │   ├── env.js
│   │   └── data.js
│   │
│   └── data/
│       ├── users.json
│       └── payloads.json
│
├── tests/
│   ├── ui/
│   │   └── login.spec.js
│   │
│   └── api/
│       └── users.spec.js
│
├── reports/
│   ├── allure-results/
│   ├── allure-report/
│   ├── screenshots/
│   ├── videos/
│   └── traces/
│
├── playwright.config.js
├── package.json
├── .env.example
└── README.md

---

## ⚙️ Instalação

npm init -y  
npm install -D @playwright/test  
npx playwright install  
npm install -D allure-playwright  

---

## ⚙️ Configuração

playwright.config.js:

use:
- screenshot: only-on-failure
- video: retain-on-failure
- trace: retain-on-failure

reporters:
- html
- allure

---

## 🧪 Teste UI (Login)

Cenário:
Login com sucesso

Passos:
1. Abrir site
2. Preencher usuário
3. Preencher senha
4. Clicar login
5. Validar acesso

Tags:
@ui @sanity @smoke

---

## 🌐 Teste API

Cenário:
Listar usuários

Passos:
1. GET /api/users
2. Validar status 200
3. Validar JSON
4. Validar lista

Tags:
@api @sanity

---

## 🏷️ Tags

@ui  
@api  
@sanity  
@smoke  
@regression  
@release  
@critical  

---

## ▶️ Execução

Rodar tudo:
npx playwright test  

Rodar por tag:
npx playwright test --grep @sanity  

UI:
npx playwright test tests/ui  

API:
npx playwright test tests/api  

---

## 📊 Relatórios

Playwright:
npx playwright show-report  

Allure:
npx allure generate reports/allure-results -o reports/allure-report  
npx allure open reports/allure-report  

---

## 🔍 Debug

npx playwright show-trace trace.zip  

---

## ⚙️ GitHub Actions

Pipeline:

1. checkout
2. instalar node
3. instalar dependências
4. instalar browsers
5. rodar testes
6. gerar allure
7. publicar artefato

---

## 🧠 Estratégia

PR:
@sanity

Merge:
@sanity + @critical

Noturno:
@regression

---

## 📌 Boas práticas

- Page Object só para UI
- API separada
- usar tags
- evitar duplicação
- testes independentes
- evidência em falha

---

## 🚀 Evolução

- multi-browser
- paralelismo
- histórico allure
- integração jira
- dados dinâmicos

---

## ✅ Resumo

✔ Estrutura enxuta  
✔ UI + API  
✔ Tags  
✔ Debug forte  
✔ CI/CD pronto  

