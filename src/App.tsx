import * as React from 'react';
import * as _ from 'lodash';
import * as Mousetrap from 'mousetrap';
import { ToastContainer, toast } from 'react-toastify';
import { observer, inject } from 'mobx-react';

import { AppStore, KevoreeStore } from './stores';
import { FileService } from './services';
import { Topbar } from './components/topbar';
import { Sidebar } from './components/sidebar';
import { Diagram } from './components/diagram';
import { ViewSelector, View } from './components/view-selector';

import './App.css';

interface AppProps {
  appStore?: AppStore;
  kevoreeStore?: KevoreeStore;
  fileService?: FileService;
}

@inject('appStore', 'kevoreeStore', 'fileService')
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

  askBeforeLoad(filename: string, data: string, toastId: number = -1) {
    const confirmToast = (
      <div>
        <h5>Load model:</h5>
        <ul>
          <li><strong>{filename}</strong></li>
        </ul>
        <p className="alert alert-warning">Any unsaved work in the current model will be lost.</p>
        <button
          className="btn btn-sm btn-success pull-right"
          onClick={() => {
            this.props.kevoreeStore!.deserialize(data);
            toast.dismiss(toastId);
          }}
        >
          Confirm
        </button>
      </div>
    );

    if (toastId !== -1) {
      toast.update(toastId, { render: confirmToast });
    } else {
      toastId = toast.info(confirmToast, { autoClose: false, closeOnClick: false });
    }
  }

  componentDidMount() {
    _.forEach(this.hkMap, (value, key) => Mousetrap.bind(value, this.hkActions[key]));
  }

  componentWillUnmount() {
    _.forEach(this.hkMap, (value) => Mousetrap.unbind(value));
  }

  render() {
    const { currentView } = this.props.appStore!;

    return (
      <div className="App">
        <Topbar />
        <div className="App-content">
          <ViewSelector views={['Diagram', 'KevScript']} currentView={currentView}>
            <View name="diagram">
              <Sidebar />
              <Diagram onFileDrop={(data) => this.askBeforeLoad(data.name, data.data, data.toastId)} />
            </View>
            <View name="kevscript">
              <div style={{ flexGrow: 1, color: '#fff' }}>TODO Kevscript Editor</div>
            </View>
          </ViewSelector>
        </div>
        <ToastContainer
          className="Toastify"
          position={toast.POSITION.TOP_RIGHT}
        />
      </div>
    );
  }
}