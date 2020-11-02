import { Component, Event, EventEmitter, Host, Listen, Prop, h } from '@stencil/core';

@Component({
  tag: 'test-checkbox',
  shadow: true,
})
export class TestCheckbox {
  @Prop({ mutable: true }) isChecked: boolean;

  @Event()
  valueChange: EventEmitter;

  @Listen('onWindowEvent', { target: 'window' })
  onWindowEvent(event: any) {
    console.log(event);
  }

  onChangeHandler = ({ target }) => {
    this.isChecked = target.checked;
    this.valueChange.emit(this.isChecked);
  };

  render() {
    return (
      <Host>
        <input type="checkbox" onChange={this.onChangeHandler} checked={this.isChecked} />
      </Host>
    );
  }
}
