import * as React from 'react';
import * as cx from 'classnames';

import './Editable.css';

export interface EditableProps {
  value: string;
  className?: string;
  onCommit: (val: string) => void;
}

interface EditableState {
  editing: boolean;
}

export class Editable extends React.Component<EditableProps, EditableState> {

  private _elem: HTMLInputElement;

  constructor(props: EditableProps) {
    super(props);
    this.state = { editing: false };
  }

  startEditing() {
    this.setState({ editing: true });
  }

  finishEditing() {
    if (this.props.onCommit) {
      this.props.onCommit(this._elem.value);
    }
    this.setState({ editing: false });
  }

  cancelEditing() {
    this.setState({ editing: false });
  }

  onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (event.keyCode === 13) {
      // "enter"
      this.finishEditing();
    } else if (event.keyCode === 27) {
      // "esc"
      this.cancelEditing();
    }
  }

  renderStatic() {
    return (
      <span
        className={cx('Editable-span', this.props.className)}
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
          this._elem.setSelectionRange(0, this._elem.value.length, 'forward');
        }
      }
    }
  }

  renderEditable() {
    return (
      <input
        className={cx('Editable-input', this.props.className)}
        ref={(elem) => this._elem = elem!}
        type="text"
        defaultValue={this.props.value}
        onKeyUp={(event) => this.onKeyUp(event)}
        onBlur={() => this.cancelEditing()}
      />
    );
  }

  render() {
    return this.state.editing ? this.renderEditable() : this.renderStatic();
  }
}