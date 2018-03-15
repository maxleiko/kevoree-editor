import * as React from 'react';
import { toast } from 'react-toastify';
import { observer, inject } from 'mobx-react';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap';

import { DiagramStore, ModalStore } from '../../stores';
import { KevoreeService, FileService } from '../../services';

import './Topbar.css';

export interface TopbarProps {
  diagramStore?: DiagramStore;
  modalStore?: ModalStore;
  fileService?: FileService;
  kevoreeService?: KevoreeService;
}

interface TopbarState {
  isOpen: boolean;
}

@inject('diagramStore', 'modalStore', 'kevoreeService', 'fileService')
@observer
export class Topbar extends React.Component<TopbarProps, TopbarState> {

  constructor(props: TopbarProps) {
    super(props);
    this.state = { isOpen: false };
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  onLoad() {
    this.props.fileService!.load()
      .then(
        (file) => {
          this.props.modalStore!.confirm({
            header: 'Load model',
            body: (
              <div>
                <p>Are you sure you want to load the model from:</p>
                <ul>
                  <li><strong>{file.name}</strong></li>
                </ul>
                <p className="alert alert-warning">Any unsaved work in the current model will be lost.</p>
              </div>
            ),
            onConfirm: () => this.props.kevoreeService!.deserialize(file.data)
          });
        },
        (err) => toast.error(`Unable to load file ${err.filename}`));
  }

  onSave() {
    const model = this.props.kevoreeService!.serialize();
    this.props.fileService!.save(model);
  }

  render() {
    const diagramStore = this.props.diagramStore!;

    return (
      <Navbar className="Topbar" color="faded" dark={true} expand="md">
        <NavbarBrand>{`Diagram: ${diagramStore.path}`}</NavbarBrand>
        <NavbarToggler onClick={() => this.toggle()} />
        <Collapse isOpen={this.state.isOpen} navbar={true}>
          <Nav className="ml-auto" navbar={true}>
            {diagramStore.previousPath && (
              <NavLink className="Topbar-link" href="#" onClick={() => diagramStore.previousView()}>
                <i className="fa fa-arrow-circle-left" />Previous view
              </NavLink>
            )}
            <NavItem>
              <NavLink className="Topbar-link" href="#" onClick={() => this.onLoad()}>
                <i className="fa fa-upload" />Load
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="Topbar-link" href="#" onClick={() => this.onSave()}>
                <i className="fa fa-download" />Save
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}