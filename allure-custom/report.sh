#!/usr/bin/env bash
set -euo pipefail

# ── Caminhos ──────────────────────────────────────────────────────────────────
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
results_folder="${project_root}/allure-results"
output_folder="${project_root}/allure-report"
custom_dir="${project_root}/allure-custom"
assets_dir="${output_folder}/allure-poc-assets"
REPORT_TITLE="ScansSource QA Report"
PORT=8888

# ── Gera o relatório ──────────────────────────────────────────────────────────
echo "📊 Gerando relatório Allure..."
allure generate "$results_folder" --clean -o "$output_folder"

if [ ! -f "${output_folder}/index.html" ]; then
  echo "❌ Falha ao gerar o relatório. Execute os testes primeiro (pytest -v)."
  exit 1
fi

# ── Cria pasta de assets internos ─────────────────────────────────────────────
mkdir -p "$assets_dir"

# ── Copia e injeta custom.css ─────────────────────────────────────────────────
cp "${custom_dir}/styles.css" "${output_folder}/custom.css"

# Injeta URL do logo no custom.css (background-image da sidebar)
logo_rel="allure-poc-assets/menu-logo.svg"
if [ -f "${custom_dir}/logo.svg" ]; then
  cp "${custom_dir}/logo.svg" "${assets_dir}/menu-logo.svg"
  cat >> "${output_folder}/custom.css" << EOF

/* Logo menu (injetado por report.sh) */
.side-nav__brand {
  background: url("${logo_rel}") no-repeat center / contain !important;
}
EOF
fi

# Insere link do custom.css no <head>
sed -i '' 's|</head>|<link rel="stylesheet" type="text/css" href="custom.css">\
</head>|' "${output_folder}/index.html"

# ── Título da aba e sumário ───────────────────────────────────────────────────
sed -i '' "s|<title>Allure Report</title>|<title>${REPORT_TITLE}</title>|" \
  "${output_folder}/index.html"

summary="${output_folder}/widgets/summary.json"
if [ -f "$summary" ]; then
  sed -i '' "s/Allure Report/${REPORT_TITLE}/g" "$summary"
fi

# ── Favicon ───────────────────────────────────────────────────────────────────
if [ -f "${custom_dir}/icone-logo.svg" ]; then
  cp "${custom_dir}/icone-logo.svg" "${assets_dir}/tab-icon.svg"
  # Remove ícones existentes e insere o novo
  sed -i '' 's|<link[^>]*rel="[^"]*icon[^"]*"[^>]*>||g' "${output_folder}/index.html"
  sed -i '' 's|<head>|<head><link rel="icon" type="image/svg+xml" href="allure-poc-assets/tab-icon.svg">|' \
    "${output_folder}/index.html"
elif [ -f "${custom_dir}/favicon.ico" ]; then
  cp "${custom_dir}/favicon.ico" "${output_folder}/favicon.ico"
fi

echo "✅ Report gerado em: ${output_folder}"

# ── Servidor HTTP em background (resolve bloqueio file://) ────────────────────
# Mata qualquer servidor anterior na mesma porta
lsof -ti:${PORT} | xargs kill -9 2>/dev/null || true
sleep 0.5

nohup python3 -m http.server ${PORT} --directory "$output_folder" \
  > /tmp/allure-server.log 2>&1 &

sleep 1
echo "🌐 Abrindo report em http://localhost:${PORT}"
open "http://localhost:${PORT}"
echo "💡 Servidor rodando em background (porta ${PORT}). Para parar: lsof -ti:${PORT} | xargs kill -9"
