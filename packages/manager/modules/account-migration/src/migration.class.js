import { find, get, set } from 'lodash';

export default class {
  constructor(migration) {
    Object.assign(this, migration);
  }

  hasOrderPending() {
    const order = find(this.steps, (step) => step.name === 'ORDERS');
    return order.status !== 'OK';
  }

  hasDebtPending() {
    const debt = find(this.steps, (step) => step.name === 'DEBT');
    return debt.status !== 'OK';
  }

  getPendingDebt() {
    const debt = find(this.steps, (step) => step.name === 'DEBT');
    return get(debt, 'debt.balanceAmount.value') > 0
      ? get(debt, 'debt.balanceAmount.text')
      : get(debt, 'debt.ovhAccountAmount.text');
  }

  hasNicPending() {
    const nic = find(this.steps, (step) => step.name === 'NIC');
    return nic.status !== 'OK';
  }

  hasContractsPending() {
    const contracts = find(this.steps, (step) => step.name === 'CONTRACTS');
    return contracts.status !== 'OK';
  }

  setContractsAsAgreed() {
    const contracts = find(this.steps, (step) => step.name === 'CONTRACTS');
    set(contracts, 'status', 'OK');
  }

  hasOnlyContractsPending() {
    return (
      this.hasContractsPending() &&
      !(this.hasOrderPending() || this.hasDebtPending() || this.hasNicPending())
    );
  }

  isMigrationPending() {
    return this.status === 'TODO';
  }
}
