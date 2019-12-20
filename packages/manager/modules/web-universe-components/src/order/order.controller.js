import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';

import {
  ISO_DURATION_FORMAT,
  ORDER_TYPE,
} from './order.constants';

export default class OrderController {
  /* @ngInject */
  constructor($translate, WucOrderCartService) {
    this.$translate = $translate;
    this.WucOrderCartService = WucOrderCartService;

    this.currentIndex = 0;
  }

  $onInit() {
    if (!this.cartId) {
      throw new Error('WucOrderComponent requires a cart id');
    }

    if (!this.catalog) {
      throw new Error('WucOrderComponent requires a catalog');
    }

    this.confirmation = {};

    this.bindings = {
      cartId: this.cartId,
      catatog: this.catalog,

      onFinish: this.onFinish,
    };

    this.loading = {
      checkout: false,
      durations: false,
      getCheckoutInformations: false,
    };
  }

  getPricings() {
    this.planCode = this.onConfigurationFinish();

    const catalogPricings = get(
      this.catalog.plans
        .find(({ planCode }) => planCode === this.planCode),
      'pricings',
    );

    if (!catalogPricings) {
      throw new Error(`WucOrderComponent: No pricing found for ${this.planCode}`);
    }

    this.pricings = this.computePricing(catalogPricings);

    if (this.isFreePricing()) {
      [this.pricing] = this.pricings;
      this.currentIndex += 2;
    }
  }

  computePricing(catalogPricings) {
    const pricingsOfType = OrderController
      .filterPricingsByCapacities(catalogPricings, this.type);

    let pricings = pricingsOfType;
    if (this.type === ORDER_TYPE.RENEW) {
      const pricingWithOnlyInstallationCapacity = OrderController
        .getUniqueInstallationPricing(catalogPricings);
      const pricingsWithOnlyRenewCapacity = pricingsOfType
        .filter(({ capacities }) => isEqual(capacities, [ORDER_TYPE.RENEW]));
      const pricingsWitRenewAndInstallationCapacities = pricingsOfType
        .filter(({ capacities }) => isEqual(
          capacities,
          [ORDER_TYPE.RENEW, ORDER_TYPE.INSTALLATION],
        ));

      if (!pricingWithOnlyInstallationCapacity && pricingsWithOnlyRenewCapacity) {
        throw new Error('WucOrderComponent: No installation pricing found');
      }

      pricings = pricingsWithOnlyRenewCapacity
        .map((pricing) => ({
          ...pricing,
          price: pricing.price + get(pricingWithOnlyInstallationCapacity, 'price', 0),
          tax: pricing.tax + get(pricingWithOnlyInstallationCapacity, 'tax', 0),
        })).concat(pricingsWitRenewAndInstallationCapacities);
    }

    return sortBy(pricings, 'price');
  }

  isFreePricing() {
    if (this.pricings && this.pricings.length === 1) {
      const [freePricing] = this.pricings;

      return freePricing.price === 0;
    }

    return false;
  }

  setCurrentState() {
    const currentState = {
      isLoading: some(Object.values(this.loading), (value) => value),
    };

    return currentState;
  }

  prepareCheckout() {
    this.loading.getCheckoutInformations = true;
    this.getCurrentState({ state: this.setCurrentState() });
    const pricing = this.pricing || this.pricings[0];
    const isoDurationFormat = pricing.intervalUnit.toUpperCase();
    const iso8601Unit = ISO_DURATION_FORMAT[isoDurationFormat];

    if (!iso8601Unit) {
      throw new Error(`WucOrderComponent: Unknown duration ${isoDurationFormat}`);
    }

    const checkoutInformations = {
      product: {
        duration: moment.duration(pricing.interval, iso8601Unit)
          .toISOString(),
        planCode: this.planCode,
        pricingMode: pricing.mode,
        quantity: 1,
      },
      configuration: this.onGetConfiguration(),
    };

    return this.WucOrderCartService.deleteAllItems(this.cartId)
      .then(() => this.WucOrderCartService.addProductToCart(
        this.cartId,
        this.productName,
        checkoutInformations.product,
      ))
      .then(({ itemId }) => Promise.all(
        checkoutInformations.configuration
          .map(({ label, value }) => this.WucOrderCartService
            .addConfigurationItem(this.cartId, itemId, label, value)),
      ))
      .then(() => this.WucOrderCartService.getCheckoutInformations(this.cartId))
      .then(({ contracts, prices }) => {
        this.confirmation = {
          contracts,
          prices,
        };
      })
      .catch((error) => (!this.onError || this.onError({ error })
        ? Promise.reject(error)
        : error))
      .finally(() => {
        this.loading.getCheckoutInformations = false;
        this.getCurrentState({ state: this.setCurrentState() });
      });
  }

  static buildError(errorMessage) {
    const error = { errorMessage };
    return error;
  }

  static getUniqueInstallationPricing(pricings) {
    return pricings
      .find(({ capacities }) => capacities.includes(ORDER_TYPE.INSTALLATION)
      && capacities.length === 1);
  }

  static filterPricingsByCapacities(pricings, capacityType) {
    return pricings
      .filter(({ capacities }) => capacities.includes(capacityType));
  }
}
