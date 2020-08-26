import registerFragment from '@ovh-ux/ufrontend/fragment';
import { Environment } from '@ovh-ux/manager-config';
import { getItems } from './sidebar.service';

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import App from './App.vue';

import frTranslations from './translations/Messages_fr_FR.json';
import { AppRoute } from './model/AppRoute';

Vue.config.productionTip = false;

Vue.use(VueI18n);

registerFragment('sidebar').then(({ parent, config, app }: { parent: HTMLElement, config: { universe: string, baseUrl: string, routes: any[] }, app: string }) => {
  const locale = Environment.getUserLocale();
  import(`./translations/Messages_${locale}.json`)
    .then(({ default: translations}) => translations)
    .catch(() => {})
    .then((translations) => {
      const i18n = new VueI18n({
        locale,
        messages: {
          [locale]: translations,
          fr_FR: frTranslations
        },
      });

      const universeRoutes = config.routes.filter(({universe}) => universe === config.universe).map(route => new AppRoute(route))

      return getItems(config.universe, universeRoutes, app)
        .then((sidebarConfig) => {
          return new Vue({
            i18n,
            render: (h) => h(App, { props: { universe: config.universe, config: sidebarConfig, baseUrl: config.baseUrl }}),
          }).$mount(parent);
        });
      })
});
