import * as React from 'react';

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
  
    render() {
        let type = this.props.type!;
        if (typeof type === 'undefined') {
          type = 'text';
        }
    
        return (
          <input
            className="Input"
            ref={(elem) => this._elem = elem!}
            type={type}
            defaultValue={this.props.value}
            onKeyDown={(event) => this.onKeyDown(event)}
            onBlur={() => this.cancelEditing()}
          />
        );
    }
}