const { LabelName } = require('allure-js-commons');

/**
 * Tags Gherkin `@allure.label.parentSuite:UI` viram só `tag` no Playwright;
 * o allure-playwright só omite o `parentSuite` automático (nome do projeto) se
 * existir label `parentSuite`. Este listener promove `@allure.label.*` para
 * labels Allure reais e remove as tags técnicas do relatório.
 */
const ALLURE_LABEL_TAG = /^allure\.label\.([^:]+):(.+)$/;

function allureMetadataFromBddTagsListener() {
  return {
    afterTestResultStart: (testResult) => {
      const fromTags = [];
      const kept = [];

      for (const label of testResult.labels) {
        if (label.name !== LabelName.TAG) {
          kept.push(label);
          continue;
        }
        const m = String(label.value).match(ALLURE_LABEL_TAG);
        if (m) {
          fromTags.push({ name: m[1], value: m[2] });
          continue;
        }
        kept.push(label);
      }

      testResult.labels = kept;
      for (const l of fromTags) {
        if (!testResult.labels.some((x) => x.name === l.name)) {
          testResult.labels.push(l);
        }
      }
    },
  };
}

module.exports = { allureMetadataFromBddTagsListener };
