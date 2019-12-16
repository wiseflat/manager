export default class OrderController {
  $onInit() {
    this.bindings = {
      onFinish: this.onFinish,
    };
  }
}
