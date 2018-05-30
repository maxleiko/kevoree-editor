import * as React from 'react';
import * as _ from 'lodash';
import * as Mousetrap from 'mousetrap';
import { ToastContainer, toast } from 'react-toastify';
import { observer, inject } from 'mobx-react';

import { ModalStore, KevoreeStore } from './stores';
import { FileService } from './services';
import { Topbar } from './components/topbar';
import { Sidebar } from './components/sidebar';
import { Diagram } from './components/diagram';
import { ModalContainer } from './components/modal';

import './App.css';

interface AppProps {
  modalStore?: ModalStore;
  kevoreeStore?: KevoreeStore;
  fileService?: FileService;
}

@inject('modalStore', 'kevoreeStore', 'fileService')
@observer
export default class App extends React.Component<AppProps> {

  private hkMap = {
    undo: ['ctrl+z', 'command+z'],
    redo: ['ctrl+y', 'command+y'],
    open: ['ctrl+o', 'command+o'],
    save: ['ctrl+s', 'command+s'],
    previousView:  ['backspace'],
  };

  private hkActions = {
    undo: () => toast.warn(<span><strong>undo:</strong> not implemented yet</span>),
    redo: () => toast.warn(<span><strong>redo:</strong> not implemented yet</span>),
    open: (event: any) => {
      event.preventDefault();
      this.props.fileService!.load()
          .then(
            (file) => this.askBeforeLoad(file.name, file.data),
            (err) => toast.error(`Unable to load file ${err.filename}`));
    },
    save: (event: any) => {
      event.preventDefault();
      const model = this.props.kevoreeStore!.serialize();
      this.props.fileService!.save(model);
    },
    previousView: () => this.props.kevoreeStore!.previousView(),
  };

  askBeforeLoad(filename: string, data: string) {
    this.props.modalStore!.confirm({
      header: 'Load model',
      body: [
        <p key="0">Are you sure you want to load the model from:</p>,
        <ul key="1"><li><strong>{filename}</strong></li></ul>,
        <p key="2" className="alert alert-warning">Any unsaved work in the current model will be lost.</p>
      ],
      onConfirm: () => this.props.kevoreeStore!.deserialize(data)
    });
  }

  componentDidMount() {
    _.forEach(this.hkMap, (value, key) => Mousetrap.bind(value, this.hkActions[key]));
  }

  componentWillUnmount() {
    _.forEach(this.hkMap, (value) => Mousetrap.unbind(value));
  }

  render() {
    return (
      <div className="App">
        <Topbar />
        <div className="App-content">
          <Sidebar />
          <Diagram onFileDrop={(file) => this.askBeforeLoad(file.name, file.data)} />
        </div>
        <ToastContainer
          className="Toastify"
          position={toast.POSITION.TOP_RIGHT}
        />
        <ModalContainer />
      </div>
    );
  }
}