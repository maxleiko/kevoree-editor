import * as React from 'react';

import './Input.scss';

export interface InputProps {
    value: string;
    type?: 'text' | 'number';
    onCommit: (val: string) => void;
}

interface InputState {
    editing: boolean;
}

type Props = InputProps & React.HTMLAttributes<HTMLInputElement>;

export class Input extends React.Component<Props, InputState> {
    private _elem: HTMLInputElement;

    constructor(props: Props) {
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
  
    onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      event.stopPropagation();
  
      if (event.keyCode === 13) {
        // "enter"
        this.finishEditing();
      } else if (event.keyCode === 27) {
        // "esc"
        this.cancelEditing();
      } else {
        if (!this.state.editing) {
          this.startEditing();
        }
      }
    }
  
    componentDidUpdate() {
      if (this.state.editing) {
        if (this._elem) {
          this._elem.focus();
        }
      }
    }
  
    render() {
        let type = this.props.type!;
        if (typeof type === 'undefined') {
          type = 'text';
        }

        const style = this.state.editing
          ? { backgroundColor: 'rgba(244, 163, 65, 0.2)' }
          : { backgroundColor: 'rgba(0, 0, 0, 0.2)' };
    
        return (
          <input
            className="Input"
            ref={(elem) => this._elem = elem!}
            type={type}
            defaultValue={this.props.value}
            onFocus={() => this.startEditing()}
            onKeyDown={(event) => this.onKeyDown(event)}
            onBlur={() => this.cancelEditing()}
            style={style}
          />
        );
    }
}