export default class {
  $onInit() {
    if (!this.rules) {
      this.goBack();
    }
  }

  primaryAction() {
    this.success();
    return this.goBack();
  }

  secondaryAction() {
    return this.goBack();
  }
}
