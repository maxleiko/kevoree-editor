import * as React from 'react';

export interface EditableProps {
  value: string;
  onCommit: (val: string) => void;
}

interface EditableState {
  editing: boolean;
  value: string;
}

export class Editable extends React.Component<EditableProps & React.HTMLAttributes<HTMLSpanElement>, EditableState> {

  private _elem: HTMLInputElement;

  constructor(props: EditableProps) {
    super(props);
    this.state = {
      editing: false,
      value: this.props.value
    };
  }

  startEditing() {
    this.setState({ editing: true });
  }

  finishEditing() {
    if (this.props.onCommit) {
      this.props.onCommit(this.state.value);
    }
    this.setState({ editing: false });
  }

  cancelEditing() {
    this.setState({ editing: false });
  }

  updateValue(event: React.ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();
    this.setState({ value: event.target.value });
  }

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    event.stopPropagation();
    event.preventDefault();
    if (event.keyCode === 13) {
      this.finishEditing();
    }
  }

  renderStatic() {
    return (
      <span
        {...this.props}
        onDoubleClick={() => this.startEditing()}
      >
        {this.props.value}
      </span>
    );
  }

  componentDidUpdate() {
    if (this.state.editing) {
      if (this._elem) {
        this._elem.focus();
        if (this._elem.setSelectionRange) {
          this._elem.setSelectionRange(0, this._elem.value.length);
        }
      }
    }
  }

  renderEditable() {
    return (
      <input
        {...this.props}
        ref={(elem) => this._elem = elem!}
        type="text"
        value={this.state.value}
        onChange={(event) => this.updateValue(event)}
        onKeyDown={(event) => this.onKeyDown(event)}
        onBlur={() => this.cancelEditing()}
      />
    );
  }

  render() {
    return this.state.editing ? this.renderEditable() : this.renderStatic();
  }
}