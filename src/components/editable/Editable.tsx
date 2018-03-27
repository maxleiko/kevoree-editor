import * as React from 'react';
import * as cx from 'classnames';

import './Editable.css';

export interface EditableProps {
  value: string;
  onCommit: (val: string) => void;

  className?: string;
  validate?: (val: string) => boolean;
}

interface EditableState {
  editing: boolean;
  invalid: boolean;
}

export class Editable extends React.Component<EditableProps, EditableState> {

  private _elem: HTMLInputElement;

  constructor(props: EditableProps) {
    super(props);
    this.state = { editing: false, invalid: false };
  }

  startEditing(event: React.MouseEvent<HTMLSpanElement>) {
    event.stopPropagation();
    this.setState({ editing: true });
  }

  finishEditing() {
    let valid = true;
    if (this.props.validate) {
      valid = this.props.validate(this._elem.value);
    }
    if (valid) { 
      this.props.onCommit(this._elem.value);
      this.setState({ editing: false, invalid: false });
    } else {
      this.setState({ invalid: true });
    }
  }

  cancelEditing() {
    this.setState({ editing: false, invalid: false });
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

  stopPropagation(event: React.MouseEvent<any>) {
    event.stopPropagation();
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

  renderStatic() {
    return (
      <span
        className={cx('Editable-span', this.props.className)}
        onClick={(event) => this.startEditing(event)}
        // onTouchStart={(event) => this.startEditing(event)}
        onDoubleClick={(event) => this.stopPropagation(event)}
      >
        {this.props.value}
      </span>
    );
  }

  renderEditable() {
    const style = this.state.invalid
      ? { backgroundColor: 'rgba(255, 0, 0, 0.2)' }
      : { backgroundColor: 'inherit' };

    return (
      <input
        className={cx('Editable-input', this.props.className)}
        ref={(elem) => this._elem = elem!}
        type="text"
        defaultValue={this.props.value}
        onKeyDown={(event) => this.onKeyDown(event)}
        onMouseDown={(event) => this.stopPropagation(event)}
        onClick={(event) => this.stopPropagation(event)}
        onDoubleClick={(event) => this.stopPropagation(event)}
        onBlur={() => this.cancelEditing()}
        style={style}
      />
    );
  }

  render() {
    return this.state.editing ? this.renderEditable() : this.renderStatic();
  }
}