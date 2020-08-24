import { CHOICES } from '../installation.constant';

export default class {
  /* @ngInject */
  constructor() {
    this.CHOICES = CHOICES;
  }

  $onInit() {
    this.choice = CHOICES.OVH;
  }
}
