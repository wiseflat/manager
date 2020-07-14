import { find, get, set } from 'lodash';
import { MIGRATION_STATUS, STEP_STATES, STEP_TYPES } from './constants';

export default class {
  constructor(migration) {
    Object.assign(this, migration);
  }

  hasOrderPending() {
    const order = find(this.steps, (step) => step.name === STEP_TYPES.ORDERS);
    return order.status !== STEP_STATES.OK;
  }

  hasDebtPending() {
    const debt = find(this.steps, (step) => step.name === STEP_TYPES.DEBT);
    return debt.status !== STEP_STATES.OK;
  }

  getPendingDebt() {
    const debt = find(this.steps, (step) => step.name === STEP_TYPES.DEBT);
    return get(debt, 'debt.balanceAmount.value') > 0
      ? get(debt, 'debt.balanceAmount.text')
      : get(debt, 'debt.ovhAccountAmount.text');
  }

  hasNicPending() {
    const nic = find(this.steps, (step) => step.name === STEP_TYPES.NIC);
    return nic.status !== STEP_STATES.OK;
  }

  hasContractsPending() {
    const contracts = find(
      this.steps,
      (step) => step.name === STEP_TYPES.CONTRACTS,
    );
    return contracts.status !== STEP_STATES.OK;
  }

  hasOnlyContractsPending() {
    return (
      this.hasContractsPending() &&
      !(this.hasOrderPending() || this.hasDebtPending() || this.hasNicPending())
    );
  }

  isMigrationPending() {
    return this.status === MIGRATION_STATUS.TODO;
  }
}
