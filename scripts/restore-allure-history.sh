#!/usr/bin/env bash
# Copia a pasta history do relatório anterior (gh-pages-prev/) para allure-results/history/
# antes do `allure generate`, ativando gráficos de tendência no relatório.
set -euo pipefail

SRC="${ALLURE_HISTORY_SOURCE:-gh-pages-prev/history}"
DST="allure-results/history"

if [[ ! -d "$SRC" ]]; then
  echo "[restore-allure-history] Origem inexistente: $SRC — ignorando (primeira execução ou gh-pages ausente)."
  exit 0
fi

mkdir -p "$(dirname "$DST")"
rm -rf "$DST"
cp -r "$SRC" "$DST"
echo "[restore-allure-history] Copiado $SRC → $DST"
