import controller from './vouchers.controller';
import template from './vouchers.html';

export default {
  bindings: {
    addVoucher: '<',
    buyCredit: '<',
    balances: '<',
    goToBalanceDetails: '<',
  },
  controller,
  template,
};
