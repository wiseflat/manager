export default class NestedSelectPickerController {
  /* @ngInject */
  constructor($timeout) {
    this.$timeout = $timeout;
  }

  $onInit() {
    this.isIconImgPath =
      /^data:/.test(this.icon) || /\.(gif|png|jpg|svg)$/.test(this.icon);
  }

  onValueChange(modelValue, propagateNestedValueChange) {
    if (this.onChange) {
      this.$timeout(() => this.onChange({ modelValue }));
    }
    if (propagateNestedValueChange) {
      this.nestedModel =
        this.nestedValues.length === 1 ? this.nestedValues[0] : null;
      this.onNestedValueChange();
    }
  }

  onNestedValueChange(propagateValueChange) {
    if (propagateValueChange) {
      this.model = this.value;
      this.onValueChange(this.value);
    }
    if (this.onNestedChange) {
      this.$timeout(() =>
        this.onNestedChange({ modelValue: this.nestedModel }),
      );
    }
  }
}
