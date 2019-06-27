import get from 'lodash/get';
import {
  MIN_QUANTITY, MAX_QUANTITY, DEFAULT_AMOUNT, ORDER, ORDER_URLS,
} from './credit.constants';


// we should avoid require, but JSURL don't provide an es6 export
const { stringify } = require('jsurl');

export default class {
  /* @ngInject */
  constructor($window, coreConfig) {
    this.$window = $window;
    this.coreConfig = coreConfig;

    this.limits = {
      MIN: MIN_QUANTITY,
      MAX: MAX_QUANTITY,
    };
  }

  $onInit() {
    this.amount = DEFAULT_AMOUNT;
  }

  isAmountValid() {
    return this.amount >= MIN_QUANTITY && this.amount <= MAX_QUANTITY;
  }

  order() {
    const order = {
      ...ORDER,
      quantity: Math.floor(this.amount / this.unitaryPrice.value),
    };
    const expressUrl = get(ORDER_URLS, `${this.coreConfig.getRegion()}${this.user.subsidiary}`);
    this.$window.open(
      `${expressUrl}products=${stringify([order])}`,
      '_blank',
    );
    return this.goBack();
  }
}
