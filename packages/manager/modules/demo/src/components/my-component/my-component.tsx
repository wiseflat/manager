import { Component, Event, EventEmitter, Host, Method, Prop, Watch, h } from '@stencil/core';

export interface SimpleObject {
  key: string;
  value: string;
}

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @Event()
  valueChange: EventEmitter;

  @Event()
  buttonClick: EventEmitter;

  @Method()
  async resetSelectionCount() {
    this.selectionCount = 0;
  }

  @Prop() isActive: boolean;
  @Prop({ mutable: true }) selection: number = 0;
  @Prop() name: string;
  @Prop({ mutable: true }) selectionCount: number = 0;
  @Prop() items: any[] = [];
  @Prop() simpleObject: SimpleObject;

  @Watch('selection')
  onSelectValueChange(newValue: number, oldValue: number) {
    this.selectionCount += 1;
  }

  onSelect = ({ target }) => {
    this.selection = target.value;
    this.valueChange.emit(this.selection);
  };

  onClick = () => {
    this.simpleObject = {
      key: 'simple',
      value: 'object',
    };
    this.items = [4, 5, 6];
    this.buttonClick.emit();
  };

  render() {
    return (
      <Host>
        <h4>{this.name}</h4>
        {this.isActive ? <p>I'm active</p> : ''}
        <select onChange={this.onSelect}>
          {this.items.map(item => {
            return (
              <option value={item} selected={this.selection === item}>
                {item}
              </option>
            );
          })}
        </select>
        <button type="button" onClick={this.onClick}>
          Click
        </button>
        <p>Selection count: {this.selectionCount}</p>
      </Host>
    );
  }
}
