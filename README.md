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

O workflow [`.github/workflows/e2e-allure.yml`](.github/workflows/e2e-allure.yml) roda em **push/PR** para `main` ou `master` (e **Run workflow** manual):

1. `python -m pytest -v -o addopts="--alluredir=allure-results"`
2. `bash allure-custom/report.sh` (no runner: gera `allure-report/` com CSS/logo; **não** abre navegador)

**Por que o relatório não “abre sozinho”?** No GitHub Actions não existe o equivalente ao `open`/`localhost` da sua máquina. Você vê o resultado de um destes jeitos:

### A) ZIP do artefato (sempre disponível na execução)

1. Abra a execução em **Actions** → clique no workflow **E2E e Allure**.
2. Role até **Artifacts** → baixe **`allure-report`**.
3. Extraia o ZIP. O Allure costuma funcionar melhor por HTTP do que com `file://`:
   - **PowerShell** na pasta extraída: `python -m http.server 8765`
   - No navegador: `http://localhost:8765`

### B) URL fixa no GitHub Pages (após configurar uma vez)

Em **push** para `main` ou `master`, o job **Publicar relatório no GitHub Pages** publica o mesmo conteúdo do artefato.

1. No repositório: **Settings** → **Pages** → **Build and deployment** → **Source: GitHub Actions**.
2. Após o próximo push na `main`, na execução do workflow aparece o link do ambiente **github-pages** (ou use a URL padrão `https://<usuario>.github.io/<nome-do-repo>/`, conforme o tipo do repositório).

**Pull requests** não disparam a publicação no Pages (só o ZIP em **Artifacts**).

A versão do Allure no CI está em `env.ALLURE_VERSION` no YAML.

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
