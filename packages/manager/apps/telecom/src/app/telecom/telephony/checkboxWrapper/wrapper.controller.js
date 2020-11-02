export default class CheckboxWrapper {
  constructor($element, $rootScope, $scope) {
    this.$element = $element;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
  }

  $onInit() {
    [this.angularComponent] = this.$element;
    this.webComponent = this.angularComponent.firstChild;
    this.oldModel = angular.copy(this.model);

    this.webComponent.addEventListener('valueChange', (event) => {
      this.model = event.detail;
      this.$scope.$apply();
    });
  }

  $doCheck() {
    if (!angular.equals(this.model, this.oldModel)) {
      this.oldModel = this.model;
      // Updating the model from change located to another place
      this.webComponent.isChecked = this.model;
    }
  }
}
