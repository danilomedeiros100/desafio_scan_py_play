#!/usr/bin/env bash
# Copia history do relatório Allure publicado antes do `allure generate` (tendências no HTML).
# Layout novo: gh-pages-prev/allure/history — legado: gh-pages-prev/history
set -euo pipefail

DST="allure-results/history"

pick_src() {
  if [[ -d gh-pages-prev/allure/history ]]; then
    echo "gh-pages-prev/allure/history"
  elif [[ -d gh-pages-prev/history ]]; then
    echo "gh-pages-prev/history"
  else
    echo ""
  fi
}

SRC="$(pick_src)"

if [[ -z "$SRC" ]]; then
  echo "[restore-allure-history] Nenhuma pasta history encontrada — primeira publicação ou gh-pages ausente."
  exit 0
fi

mkdir -p "$(dirname "$DST")"
rm -rf "$DST"
cp -r "$SRC" "$DST"
echo "[restore-allure-history] Copiado $SRC → $DST"
