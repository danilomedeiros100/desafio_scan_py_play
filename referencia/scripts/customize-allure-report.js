#!/usr/bin/env node
/**
 * Pós-processamento do HTML do Allure: título, custom.css, logo do menu, ícone da aba,
 * widgets/summary.json.
 *
 * Imagens em allure-poc-assets/ (URLs relativos). custom.css é ligado **depois** de
 * plugin/screen-diff/styles.css para o tema e o logo ganharem à cascata.
 *
 * SVG em background-image: sem <filter> SVG interno (muitos browsers não pintam).
 *
 * ALLURE_REPORT_DIR, ALLURE_CUSTOM_DIR, ALLURE_REPORT_TITLE — ver topo do repo.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outputFolder = process.env.ALLURE_REPORT_DIR || path.join(root, 'reports', 'allure-report');
const customDir = process.env.ALLURE_CUSTOM_DIR || path.join(root, 'allure-custom');
const reportTitle = process.env.ALLURE_REPORT_TITLE || 'Quality Report';

/** Pasta dentro do relatório (URL relativo ao index.html e ao custom.css na raiz do report). */
const ASSETS_DIR_NAME = 'allure-poc-assets';

const indexPath = path.join(outputFolder, 'index.html');
const customCssOut = path.join(outputFolder, 'custom.css');

function escapeXmlTitle(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function warnIfLarge(filePath, label, maxBytes) {
  try {
    const n = fs.statSync(filePath).size;
    if (n > maxBytes) {
      console.warn(
        `[customize-allure-report] ${label}: ${Math.round(n / 1024)}KB — comprimir ou redimensionar melhora o tempo de carga.`
      );
    }
  } catch {
    /* ignore */
  }
}

function setTabIconLink(html, linkTag) {
  let out = html.replace(/<link[^>]*rel=["']shortcut icon["'][^>]*>\s*/gi, '');
  out = out.replace(/<link[^>]*rel=["']icon["'][^>]*>\s*/gi, '');
  return out.replace(/<head[^>]*>/i, (m) => `${m}\n    ${linkTag}`);
}

/** Remove <link custom.css> e bloco inline antigo; insere custom.css a seguir ao screen-diff (último CSS). */
function placeCustomCssLinkAfterScreenDiff(html) {
  let h = html.replace(/<link[^>]*href=["']custom\.css["'][^>]*>\s*/gi, '');
  h = h.replace(/<style[^>]*id=["']allure-poc-inline-logo["'][^>]*>[\s\S]*?<\/style>\s*/gi, '');
  const linkTag = '<link rel="stylesheet" type="text/css" href="custom.css">';
  const screenDiff = /(<link[^>]*href=["']plugin\/screen-diff\/styles\.css["'][^>]*>)/i;
  if (screenDiff.test(h)) {
    return h.replace(screenDiff, (m) => `${m}\n${linkTag}`);
  }
  return h.replace(/<\/head>/i, `${linkTag}\n</head>`);
}

function appendMenuLogoRules(menuAssetRelativeUrl) {
  const block = `

/* --- allure-poc: logo menu (gerado por customize-allure-report.js) --- */
.side-nav__brand {
  background: url("${menuAssetRelativeUrl}") no-repeat center / contain !important;
}
`;
  fs.appendFileSync(customCssOut, block, 'utf8');
}

function main() {
  if (!fs.existsSync(indexPath)) {
    console.error('[customize-allure-report] Falta index.html em', outputFolder);
    process.exit(1);
  }

  const assetsAbs = path.join(outputFolder, ASSETS_DIR_NAME);
  fs.mkdirSync(assetsAbs, { recursive: true });

  let html = fs.readFileSync(indexPath, 'utf8');

  html = html.replace(/<title>Allure Report<\/title>/gi, `<title>${escapeXmlTitle(reportTitle)}</title>`);

  const customStylesPath = path.join(customDir, 'styles.css');
  if (fs.existsSync(customStylesPath)) {
    fs.copyFileSync(customStylesPath, customCssOut);
  } else {
    fs.writeFileSync(customCssOut, '/* allure-poc: sem allure-custom/styles.css */\n', 'utf8');
  }

  const menuCandidates = [
    path.join(customDir, 'logo.svg'),
    path.join(customDir, 'logo.png'),
    path.join(customDir, 'neuro-logo.svg'),
    path.join(customDir, 'icone-logo.svg'),
  ];
  const menuLogoPath = menuCandidates.find((p) => fs.existsSync(p));
  if (menuLogoPath) {
    const ext = path.extname(menuLogoPath).toLowerCase();
    const destName = `menu-logo${ext}`;
    const destAbs = path.join(assetsAbs, destName);
    fs.copyFileSync(menuLogoPath, destAbs);
    warnIfLarge(destAbs, 'Logo do menu', 250 * 1024);
    const relUrl = `${ASSETS_DIR_NAME}/${destName}`.replace(/\\/g, '/');
    appendMenuLogoRules(relUrl);
  }

  html = placeCustomCssLinkAfterScreenDiff(html);

  const tabIconPrimary = path.join(customDir, 'icone-logo.svg');
  const tabIconSvgAlt = path.join(customDir, 'logo.svg');
  const tabIconPng = path.join(customDir, 'logo.png');
  const faviconIco = path.join(customDir, 'favicon.ico');
  const iconBase = ASSETS_DIR_NAME.replace(/\\/g, '/');
  if (fs.existsSync(tabIconPrimary)) {
    fs.copyFileSync(tabIconPrimary, path.join(assetsAbs, 'tab-icon.svg'));
    warnIfLarge(path.join(assetsAbs, 'tab-icon.svg'), 'Ícone da aba (SVG)', 150 * 1024);
    html = setTabIconLink(
      html,
      `<link rel="icon" type="image/svg+xml" href="${iconBase}/tab-icon.svg">`
    );
  } else if (fs.existsSync(tabIconSvgAlt)) {
    fs.copyFileSync(tabIconSvgAlt, path.join(assetsAbs, 'tab-icon.svg'));
    warnIfLarge(path.join(assetsAbs, 'tab-icon.svg'), 'Ícone da aba (SVG)', 150 * 1024);
    html = setTabIconLink(
      html,
      `<link rel="icon" type="image/svg+xml" href="${iconBase}/tab-icon.svg">`
    );
  } else if (fs.existsSync(tabIconPng)) {
    fs.copyFileSync(tabIconPng, path.join(assetsAbs, 'tab-icon.png'));
    warnIfLarge(path.join(assetsAbs, 'tab-icon.png'), 'Ícone da aba (PNG)', 150 * 1024);
    html = setTabIconLink(html, `<link rel="icon" type="image/png" href="${iconBase}/tab-icon.png">`);
  } else if (fs.existsSync(faviconIco)) {
    fs.copyFileSync(faviconIco, path.join(assetsAbs, 'tab-icon.ico'));
    html = setTabIconLink(
      html,
      `<link rel="icon" type="image/x-icon" href="${iconBase}/tab-icon.ico">`
    );
  }

  fs.writeFileSync(indexPath, html, 'utf8');

  const summaryFile = path.join(outputFolder, 'widgets', 'summary.json');
  if (fs.existsSync(summaryFile)) {
    let raw = fs.readFileSync(summaryFile, 'utf8');
    raw = raw.replace(/Allure Report/g, reportTitle);
    fs.writeFileSync(summaryFile, raw, 'utf8');
  }
}

main();
