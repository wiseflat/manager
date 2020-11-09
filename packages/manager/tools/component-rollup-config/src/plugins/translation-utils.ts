import concat from 'lodash/concat';
import fs from 'fs';
import path from 'path';
import slash from 'slash';
import startsWith from 'lodash/startsWith';

const ALL_LANGUAGES = process.env.OVH_BUILD_LANGUAGES
  ? process.env.OVH_BUILD_LANGUAGES.split(',')
  : [
      'cs_CZ',
      'de_DE',
      'en_GB',
      'es_ES',
      'es_US',
      'fi_FI',
      'fr_CA',
      'fr_FR',
      'it_IT',
      'lt_LT',
      'pl_PL',
      'pt_PT',
    ];

const normalizePath = (p) => (startsWith(p, '.') ? slash(p) : `./${slash(p)}`);

const injectTranslationImport = (languages, trads, id, subdirectory) => {
  let code = '';
  trads.forEach((trad) => {
    const dirname = path.dirname(id);
    const fullTradPath = path.resolve(dirname, trad, subdirectory);
    const relativePath = path.relative(dirname, fullTradPath);

    // ensure directory contains translations
    if (!fs.existsSync(path.join(fullTradPath, 'Messages_fr_FR.json'))) return;

    let p = normalizePath(relativePath);
    if (p.endsWith('/')) {
      p = p.substring(0, p.length - 1);
    }

    code += `
    promises.push(
      $q.all([
        import('${p}/Messages_' + $translate.fallbackLanguage() + '.json'),
        import('${p}/Messages_' + $translate.use() + '.json').catch(() => {}),
      ]).then(([ f, t ]) => {
        return Object.assign(f.default ? f.default : f, t.default ? t.default : t);
      })
    );
    `;
  });
  return code;
};

const injectTranslationImports = (languages, trads, id, subdirectory) => `
  let promises = [];
  ${injectTranslationImport(languages, trads, id, subdirectory)}
  promises.forEach(p => asyncLoader.addTranslations(p));
  return $q.all(promises).then(() => $translate.refresh());
`;

export = {
  normalizePath,
  injectTranslationImports,
  languages: concat(ALL_LANGUAGES),
};
