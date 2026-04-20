#!/usr/bin/env node
/**
 * Antes do `allure generate`, copia categorias opcionais de JSON para os resultados.
 *
 * - Sem `config/allure-categories.json` (ou array vazio): o Allure usa apenas as
 *   categorias padrão (ex.: Product defects / Test defects) conforme a doc oficial.
 * - Com ficheiro: cada objeto do array segue o formato de categories.json do Allure;
 *   novas categorias = novas entradas no JSON, sem tocar em playwright.config.js.
 *
 * @see https://allurereport.org/docs/how-it-works-categories-file/
 * @see https://allurereport.org/docs/categories/
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'config', 'allure-categories.json');
const destDir = path.join(root, 'reports', 'allure-results');
const dest = path.join(destDir, 'categories.json');

if (!fs.existsSync(src)) {
  process.exit(0);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(src, 'utf8'));
} catch (e) {
  console.error('[prepare-allure-categories] JSON inválido em', src, e.message);
  process.exit(1);
}

if (!Array.isArray(data) || data.length === 0) {
  process.exit(0);
}

if (!fs.existsSync(destDir)) {
  console.warn('[prepare-allure-categories] Pasta', destDir, 'não existe; ignorando cópia.');
  process.exit(0);
}

fs.writeFileSync(dest, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log('[prepare-allure-categories] Copiado', path.relative(root, src), '→', path.relative(root, dest));
