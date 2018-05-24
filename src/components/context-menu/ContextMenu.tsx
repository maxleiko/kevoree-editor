import * as React from 'react';
import * as cx from 'classnames';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { clickInsideElement } from '../../utils/dom-utils';

import './ContextMenu.scss';

export interface ContextMenuProps {
  contextClass: string;
  items: ContextMenuItem[];
}

export interface ContextMenuItem {
  icon: string;
  name: string;
  action: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

@observer
export class ContextMenu extends React.Component<ContextMenuProps> {

  @observable private _active: boolean = false;
  @observable private _x: number = 0;
  @observable private _y: number = 0;

  @action
  open() {
    this._active = true;
  }

  @action
  close() {
    this._active = false;
  }

  @action
  position(e: PointerEvent, contextEl: HTMLElement) {
    const { left, top } = contextEl.getBoundingClientRect();
    this._x = e.pageX - left;
    this._y = e.pageY - top;
  }

  componentDidMount() {
    document.addEventListener('contextmenu', this._contextMenuHandler);
    document.addEventListener('mousedown', this._mousedownHandler);
    document.addEventListener('keydown', this._keydownHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('contextmenu', this._contextMenuHandler);
    document.removeEventListener('mousedown', this._mousedownHandler);
    document.removeEventListener('keydown', this._keydownHandler);
  }

  render() {
    if (this.props.items.length === 0) {
      return null;
    }

    return (
      <nav
        className={cx('ContextMenu', { active: this._active })}
        style={{ left: this._x, top: this._y }}
      >
        <ul className="items">
          {this.props.items.map((item) => (
            <li key={item.name} className={cx('item')}>
              <a className="link" onMouseDown={item.action} >
                <i className={cx('icon', 'fa', item.icon)} />
                <span className="name">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  private _contextMenuHandler = (e: PointerEvent) => {
    const contextEl = clickInsideElement(e, this.props.contextClass);
    if (contextEl) {
      e.preventDefault();
      e.stopPropagation();
      this.open();
      this.position(e, contextEl);
    } else {
      this.close();
    }
  }

  private _mousedownHandler = (e: MouseEvent) => {
    if (e.button !== 2 && this._active) {
      this.close();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  private _keydownHandler = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      this.close();
    }
  }
}
