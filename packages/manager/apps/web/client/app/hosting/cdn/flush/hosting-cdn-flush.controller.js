import get from 'lodash/get';
import { HOSTING_CDN_ORDER_CDN_VERSION_V1 } from '../order/hosting-cdn-order.constant';

export default class HostingFlushCdnCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $rootScope,
    $stateParams,
    $translate,
    Hosting,
    HostingCdnSharedService,
    Alerter,
  ) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Hosting = Hosting;
    this.HostingCdnSharedService = HostingCdnSharedService;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.loading = false;
    this.$scope.flushCdn = () => this.flushCdn();
  }

  flushCdn() {
    const isV1CDN =
      get(this.$scope.cdnProperties, 'version', '') ===
      HOSTING_CDN_ORDER_CDN_VERSION_V1;
    const flushPromise = isV1CDN ? this.flushV1CDN() : this.flushSharedCDN();
    return flushPromise
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('hosting_dashboard_cdn_flush_success'),
          this.$scope.alerts.main,
        );
        this.$rootScope.$broadcast('hosting.cdn.flush.refresh');
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('hosting_dashboard_cdn_flush_error'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.$scope.resetAction();
      });
  }

  /**
   * Flushed all domains, stay to cover V1 CDN Client
   */
  flushV1CDN() {
    return this.Hosting.flushCdn(this.$stateParams.productId);
  }

  /**
   * Flushed by domain, implemented for CDN V2
   */
  flushSharedCDN() {
    const { serviceName } = this.$scope.hosting;
    const { domain } = this.$scope.currentActionData;
    return this.HostingCdnSharedService.flushCDNDomainCache(
      serviceName,
      domain.domain,
    );
  }
}
