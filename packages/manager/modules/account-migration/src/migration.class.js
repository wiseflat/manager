import { find } from 'lodash';

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

  hasNicPending() {
    const nic = find(this.steps, (step) => step.name === 'NIC');
    return nic.status !== 'OK';
  }

  hasContractsPending() {
    const contracts = find(this.steps, (step) => step.name === 'CONTRACTS');
    return contracts.status !== 'OK';
  }
}
