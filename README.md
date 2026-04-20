# Automação E2E — Playwright + pytest-bdd + Allure

Testes E2E no site [Automation Test Store](https://automationteststore.com): cadastro, carrinho e checkout. Cenários em Gherkin (português), relatórios com Allure.

**Relatório publicado:** [danilomedeiros100.github.io/desafio_scan_py_play](https://danilomedeiros100.github.io/desafio_scan_py_play/)

---

## Setup local

> **Pré-requisito:** Python 3.10+. No Windows use **Git Bash** para rodar o `report.sh`.

```bash
python -m venv .venv

# Linux/macOS
source .venv/bin/activate

# Windows (PowerShell)
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
python -m playwright install chromium
```

---

## Rodar os testes

```bash
# Todos os testes (headed + grava allure-results/)
pytest -v

# Arquivo específico
pytest tests/test_fluxo_compras_outline.py -v

# Headless
pytest -v -o addopts="--alluredir=allure-results"
```

---

## Gerar o relatório Allure

Requer **Allure CLI** no PATH ([download](https://github.com/allure-framework/allure2/releases) — extraia e adicione a pasta `bin`).

```bash
# Gera HTML customizado e abre em http://localhost:8888
bash allure-custom/report.sh
```

---

## GitHub Actions

O workflow [`.github/workflows/e2e-allure.yml`](.github/workflows/e2e-allure.yml) executa automaticamente em push/PR para `main`.

**Execução manual:**
1. Abra a aba **Actions** no repositório
2. Selecione **E2E e Allure** → **Run workflow**

**Onde ver o resultado:**

| Opção | Como acessar |
|---|---|
| Relatório publicado | [danilomedeiros100.github.io/desafio_scan_py_play](https://danilomedeiros100.github.io/desafio_scan_py_play/) — atualizado a cada push na `main` |
| Download ZIP | Na execução em **Actions** → seção **Artifacts** → `allure-report` |
| Resultados brutos | Disponível em **Artifacts** → `allure-results` apenas em execuções com falha |

> Para ativar o GitHub Pages: **Settings → Pages → Source: GitHub Actions**.

---

## Estrutura

```
features/   # Cenários .feature (Gherkin)
tests/      # Steps pytest-bdd
pages/      # Page Objects
config.py   # Dados de teste (usuários, senha padrão)
allure-custom/report.sh  # Gera relatório com tema customizado
scripts/    # Scripts auxiliares de CI (histórico Allure)
```
