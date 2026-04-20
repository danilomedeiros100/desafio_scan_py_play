#!/usr/bin/env node
/**
 * Copia a pasta `history` de um relatório Allure anterior para `reports/allure-results/history`
 * antes do `allure generate`, para ativar tendências / histórico no relatório.
 *
 * Defina ALLURE_HISTORY_SOURCE com o caminho absoluto ou relativo à raiz do repo
 * (ex.: gh-pages-prev/allure/history). Se vazio ou inexistente, não faz nada.
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const raw = process.env.ALLURE_HISTORY_SOURCE || '';
const dst = path.join(root, 'reports', 'allure-results', 'history');

if (!raw.trim()) {
  console.log('[restore-allure-history] ALLURE_HISTORY_SOURCE não definido; ignorando.');
  process.exit(0);
}

const absSrc = path.isAbsolute(raw) ? raw : path.join(root, raw);
if (!fs.existsSync(absSrc)) {
  console.log('[restore-allure-history] Origem inexistente:', absSrc);
  process.exit(0);
}

fs.mkdirSync(path.dirname(dst), { recursive: true });
fs.rmSync(dst, { recursive: true, force: true });
fs.cpSync(absSrc, dst, { recursive: true });
console.log('[restore-allure-history] Copiado', path.relative(root, absSrc), '→', path.relative(root, dst));
