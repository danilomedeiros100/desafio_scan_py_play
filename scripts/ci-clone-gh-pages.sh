#!/usr/bin/env bash
# Clona só a branch gh-pages para ./gh-pages-prev (histórico Allure), se existir.
# Evita um segundo `actions/checkout` no mesmo job (pode falhar com git exit 1).
set -euo pipefail

: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY em falta}"
: "${GITHUB_TOKEN:?GITHUB_TOKEN em falta}"

rm -rf gh-pages-prev

REPO_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

set +e
git ls-remote --exit-code --heads "$REPO_URL" gh-pages >/dev/null 2>&1
rc=$?
set -e

if [[ "$rc" -eq 0 ]]; then
  if git clone --depth 1 --branch gh-pages "$REPO_URL" gh-pages-prev; then
    echo "[ci-clone-gh-pages] gh-pages clonada para ./gh-pages-prev"
  else
    echo "[ci-clone-gh-pages] Aviso: clone de gh-pages falhou; segue sem histórico."
  fi
else
  echo "[ci-clone-gh-pages] Branch gh-pages indisponível (rc=${rc}); segue sem histórico Allure."
fi

exit 0
