import * as React from 'react';
import * as cx from 'classnames';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import './Editable.css';

export interface EditableProps {
  value: string;
  onCommit: (val: string) => void;

  className?: string;
  validate?: (val: string) => boolean;
}

@observer
export class Editable extends React.Component<EditableProps> {

  private _elem: HTMLInputElement;
  @observable private _editing: boolean = false;
  @observable private _invalid: boolean = false;

  @action
  startEditing(event: React.MouseEvent<HTMLSpanElement>) {
    event.stopPropagation();
    this._editing = true;
  }

  @action
  finishEditing() {
    let valid = true;
    if (this.props.validate) {
      valid = this.props.validate(this._elem.value);
    }
    if (valid) { 
      this.props.onCommit(this._elem.value);
      this._editing = false;
      this._invalid = false;
    } else {
      this._invalid = true;
    }
  }

  @action
  cancelEditing() {
    this._editing = false;
    this._invalid = false;
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

  componentDidUpdate() {
    if (this._editing) {
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
        onDoubleClick={(event) => event.stopPropagation()}
      >
        {this.props.value}
      </span>
    );
  }

  renderEditable() {
    const style = this._invalid
      ? { backgroundColor: 'rgba(255, 0, 0, 0.2)' }
      : { backgroundColor: 'inherit' };

    return (
      <input
        className={cx('Editable-input', this.props.className)}
        ref={(elem) => this._elem = elem!}
        type="text"
        defaultValue={this.props.value}
        onKeyDown={(event) => this.onKeyDown(event)}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={(event) => event.stopPropagation()}
        onBlur={() => this.cancelEditing()}
        style={style}
      />
    );
  }

  render() {
    return this._editing ? this.renderEditable() : this.renderStatic();
  }
}