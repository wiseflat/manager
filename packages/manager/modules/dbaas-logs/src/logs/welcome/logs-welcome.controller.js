import reduce from 'lodash/reduce';
import grafana from '../../assets/grafana.png';
import graylog from '../../assets/graylog.png';
import kibana from '../../assets/kibana.png';
import { GUIDES } from './logs-welcome.constants';

export default class LogsWelcomeCtrl {
  /* @ngInject */
  constructor(
    $state,
    LogsConstants,
    CucOrderHelperService,
    ovhDocUrl,
    coreConfig,
    $translate,
    atInternet,
  ) {
    this.$translate = $translate;
    this.$state = $state;
    this.atInternet = atInternet;
    this.region = coreConfig.getRegion();
    this.LogsConstants = LogsConstants;
    this.CucOrderHelperService = CucOrderHelperService;
    this.ovhDocUrl = ovhDocUrl;
    this.urls = {};

    this.assets = {
      grafana,
      graylog,
      kibana,
    };
  }

  $onInit() {
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
          title: this.$translate.instant(
            `logs_welcome_guides_${guide.id}_title`,
          ),
          description: '',
        },
      ],
      [],
    );

    this.urls.docsUrl = this.ovhDocUrl.getDocUrl(
      this.LogsConstants.LOGS_DOCS_NAME,
    );
    this.CucOrderHelperService.buildUrl(
      this.LogsConstants.LOGS_PRODUCT_URL,
    ).then((url) => {
      this.urls.productURL = url;
    });
    this.CucOrderHelperService.buildUrl(this.LogsConstants.ORDER_URL).then(
      (url) => {
        this.urls.orderURL = url;
      },
    );
  }

  onGuideClick(guide) {
    this.atInternet.trackClick({
      name: guide.tracker,
      type: 'action',
    });
  }

  onSubmitClick() {
    this.atInternet.trackClick({
      name: 'cloud::dbaas::logs::onboarding::suscribe',
      type: 'action',
    });
  }
}
