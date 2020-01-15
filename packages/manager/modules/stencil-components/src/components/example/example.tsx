import { Component, Host, Prop, h } from "@stencil/core";

@Component({
  tag: "slot-example",
  shadow: true
})
export class SlotExample {
  @Prop() innerFunction: Function;

  render() {
    return (
      <Host>
        <div>Test slot</div>
        <button onClick={() => this.innerFunction()}>Passed function</button>
        <slot></slot>
      </Host>
    );
  }
}
