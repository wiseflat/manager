import { Component, Event, EventEmitter, Prop, Watch, h } from "@stencil/core";

@Component({
  tag: "button-clicker",
  shadow: true
})
export class Clicker {
  @Prop() type: string;

  @Prop() count: number = 0;

  @Prop() callback: Function;

  @Watch("count")
  watchCount(newValue: number, oldValue: number): void {
    console.log(`The count has updated from ${oldValue} to ${newValue}`);
  }

  @Event() clickEvent: EventEmitter;
  increaseCount(): void {
    this.count = this.count + 1;
    this.clickEvent.emit({ value: "Stencil Button has been clicked" });
  }

  componentDidLoad() {
    console.log("Allo le monde");
  }

  render() {
    return (
      <slot-example innerFunction={this.callback}>
        <button
          class="oui-button oui-button-primary"
          type="button"
          onClick={() => this.increaseCount()}
        >
          You clicked : {this.count} times / {this.type}
        </button>
      </slot-example>
    );
  }
}
