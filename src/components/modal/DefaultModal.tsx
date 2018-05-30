import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { ModalStore } from '../../stores';

export interface DefaultModalProps {
  id?: string;
  header: React.ReactNode;
  body: React.ReactNode;
  className?: any;
  modalStore?: ModalStore;
}

@inject('modalStore')
@observer
export class DefaultModal extends React.Component<DefaultModalProps> {
  constructor(props: DefaultModalProps) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    this.props.modalStore!.remove(this.props.id!);
  }

  render() {
    return (
      <Modal className={this.props.className} isOpen={true} onClosed={this.onClose}>
        <ModalHeader>{this.props.header}</ModalHeader>
        <ModalBody>{this.props.body}</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
