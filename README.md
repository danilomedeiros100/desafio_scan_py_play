# Automação E2E — Playwright, pytest-bdd e Allure

Testes no site [Automation Test Store](https://automationteststore.com): cadastro, carrinho e checkout. Cenários em Gherkin (português).

**Ambiente:** Windows (PowerShell para setup; **Git Bash** ou **WSL** para o script do relatório).

---

## 1. Pré-requisitos

- [Python 3.10+](https://www.python.org/downloads/) — marque **“Add Python to PATH”**.
- **Allure Commandline** no PATH ([releases](https://github.com/allure-framework/allure2/releases) — extraia o ZIP e inclua a pasta `bin` no PATH do Windows). Confira: `allure --version`.

---

## 2. Configurar o projeto

PowerShell na raiz do projeto:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Se o `Activate.ps1` for bloqueado:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

```powershell
pip install --upgrade pip
pip install -r requirements.txt
python -m playwright install chromium
```

---

## 3. Testes + relatório (fluxo que você usa)

Na raiz do projeto, com o venv ativo:

**1) Rodar os testes e gravar o Allure**

```powershell
pytest -v --alluredir=allure-results
```

(O `pytest.ini` já inclui `--alluredir=allure-results`; o comando acima deixa explícito e ativa saída verbosa.)

**2) Gerar o HTML customizado e abrir no navegador**

Em terminal **bash** (Git Bash ou WSL), ainda na raiz do projeto:

```bash
bash allure-custom/report.sh
```

Esse script roda `allure generate`, aplica CSS/logo do `allure-custom`, sobe um servidor na porta **8888** e abre o relatório.

---

## 4. Outros comandos úteis

```powershell
# Headless (o plugin não aceita --headed=false; tire o --headed do pytest.ini só nesta execução)
pytest -v -o addopts="--alluredir=allure-results"

# Só um arquivo de teste
pytest tests\test_fluxo_compras_completo.py -v --alluredir=allure-results
```

Relatório Allure “puro”, sem o `report.sh`:

```powershell
allure generate allure-results --clean -o allure-report
start allure-report\index.html
```

Dados de teste: `config.py`.

---

## 5. GitHub Actions (mesmo fluxo que no local)

O workflow [`.github/workflows/e2e-allure.yml`](.github/workflows/e2e-allure.yml) roda em **push/PR** para `main` ou `master` (e pode ser disparado manualmente em **Actions → E2E e Allure → Run workflow**):

1. `python -m pytest -v -o addopts="--alluredir=allure-results"` (sem `--headed` do `pytest.ini`: no CI o browser roda headless)
2. `bash allure-custom/report.sh` (com `CI=true` no runner: gera `allure-report/` com CSS/logo, **sem** servidor nem `open`)

No fim, baixe o artefato **`allure-report`** na execução do workflow, descompacte e abra `index.html` no navegador (ou sirva a pasta com um HTTP estático). A versão do Allure no CI está em `env.ALLURE_VERSION` no YAML.

---

## Pastas úteis

| Pasta | Conteúdo |
|--------|-----------|
| `features\` | Cenários `.feature` |
| `tests\` | Steps pytest-bdd |
| `pages\` | Page Objects |
| `allure-results\` | JSON gerados pelo pytest |
| `allure-report\` | Site do relatório (gerado pelo script ou pelo `allure generate`) |
| `allure-custom\` | `report.sh`, CSS e logos |
