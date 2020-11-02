export default class ComponentWrapper {
  constructor($element, $scope) {
    this.$element = $element;
    this.$scope = $scope;
  }

  $onInit() {
    [this.angularComponent] = this.$element;

    this.webComponent = this.angularComponent.firstChild;

    // Binding complex object to @Prop() (prop must be different from a basic type)
    this.webComponent.items = this.items;

    // Listening @Event() to call passed method
    this.webComponent.addEventListener('buttonClick', () => {
      this.clickCallback();
    });

    // Listening @Event() to get value change
    this.webComponent.addEventListener('valueChange', (event) => {
      this.model = event.detail;
      this.$scope.$apply();
    });

    // Attach webComponent @Method to a two-way binded value,
    // to be able to call the method from elsewhere
    this.exposedMethod = () => this.webComponent.resetSelectionCount();
  }
}
