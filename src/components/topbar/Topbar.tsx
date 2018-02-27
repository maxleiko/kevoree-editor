import * as React from 'react';
import { toast } from 'react-toastify';
import { observer, inject } from 'mobx-react';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap';

import { KevoreeService } from '../../services/KevoreeService';
import { FileService } from '../../services/FileService';

import './Topbar.css';

export interface TopbarProps {
  kevoreeService?: KevoreeService;
  fileService?: FileService;
}

interface TopbarState {
  isOpen: boolean;
}

@inject('kevoreeService', 'fileService')
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
        (file) => this.props.kevoreeService!.deserialize(file.data),
        (err) => toast.error(`Unable to load file ${err.filename}`));
  }

  onSave() {
    const model = this.props.kevoreeService!.serialize();
    this.props.fileService!.save(model);
  }

  render() {
    const kevoreeService = this.props.kevoreeService!;
    const node = kevoreeService.nodeView;

    return (
      <Navbar className="Topbar" color="faded" dark={true} expand="md">
        <NavbarBrand>{node ? `Node View: ${node.instance!.name}` : 'Model View'}</NavbarBrand>
        <NavbarToggler onClick={() => this.toggle()} />
        <Collapse isOpen={this.state.isOpen} navbar={true}>
          <Nav className="ml-auto" navbar={true}>
            {node && (
              <NavLink className="Topbar-link" href="#" onClick={() => kevoreeService.openModelView()}>
                <i className="fa fa-arrow-circle-left" />Model View
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