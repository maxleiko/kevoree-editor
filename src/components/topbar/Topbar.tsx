import * as React from 'react';
import * as kevoree from 'kevoree-library';
import { observer, inject } from 'mobx-react';

import { DiagramStore, ModalStore } from '../../stores';
import { KevoreeService, FileService } from '../../services';
import { InstanceHeader } from '../kevoree';

const logo = require('../../assets/kevoree.png');

import './Topbar.scss';

export interface TopbarProps {
  diagramStore?: DiagramStore;
  modalStore?: ModalStore;
  fileService?: FileService;
  kevoreeService?: KevoreeService;
}

@inject('diagramStore', 'modalStore', 'kevoreeService', 'fileService')
@observer
export class Topbar extends React.Component<TopbarProps> {

  render() {
    const diagramStore = this.props.diagramStore!;
    const { model } = this.props.kevoreeService!;
    const instance = model.findByPath<kevoree.Instance | kevoree.Model>(diagramStore.path)!;

    return (
      <div className="Topbar">
        <a className="left" href="/">
          <img className="logo" src={logo} />
        </a>
        <div className="right">
          <div className="nav">
            <InstanceHeader className="header" instance={instance} hoverable={false} editable={false} />
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