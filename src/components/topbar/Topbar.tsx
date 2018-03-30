import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Model, Instance } from 'kevoree-ts-model';

import { DiagramStore, ModalStore, KevoreeStore } from '../../stores';
import { FileService } from '../../services';
import { InstanceHeader } from '../kevoree';

const logo = require('../../assets/kevoree.png');

import './Topbar.scss';

export interface TopbarProps {
  diagramStore?: DiagramStore;
  modalStore?: ModalStore;
  fileService?: FileService;
  kevoreeStore?: KevoreeStore;
}

@inject('diagramStore', 'modalStore', 'kevoreeStore', 'fileService')
@observer
export class Topbar extends React.Component<TopbarProps> {

  render() {
    const diagramStore = this.props.diagramStore!;
    const { currentElem } = this.props.kevoreeStore!;

    return (
      <div className="Topbar">
        <a className="left" href="/">
          <img className="logo" src={logo} />
        </a>
        <div className="right">
          <div className="nav">
            <InstanceHeader
              className="header"
              instance={currentElem as Model | Instance}
              hoverable={false}
              editable={false}
            />
          </div>
          {diagramStore.previousPath && (
            <div className="nav fit">
              <a href="#" onClick={() => diagramStore.previousView()}>
                <i className="fa fa-arrow-circle-left" />Model
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}