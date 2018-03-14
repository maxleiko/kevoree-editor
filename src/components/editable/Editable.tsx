import * as React from 'react';
import * as cx from 'classnames';

import './Editable.css';

export interface EditableProps {
  value: string;
  type?: 'text' | 'number';
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

  startEditing(event: React.MouseEvent<HTMLSpanElement>) {
    event.stopPropagation();
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

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
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
        onClick={(event) => this.startEditing(event)}
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
    let type = this.props.type!;
    if (typeof type === 'undefined') {
      type = 'text';
    }

    return (
      <input
        className={cx('Editable-input', this.props.className)}
        ref={(elem) => this._elem = elem!}
        type={type}
        defaultValue={this.props.value}
        onKeyDown={(event) => this.onKeyDown(event)}
        onBlur={() => this.cancelEditing()}
      />
    );
  }

  render() {
    return this.state.editing ? this.renderEditable() : this.renderStatic();
  }
}