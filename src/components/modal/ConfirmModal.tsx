import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import { DefaultModalProps } from '.';

export interface ConfirmModalProps extends DefaultModalProps {
  onConfirm: () => void;
  onCancel?: () => void;
}

@inject('modalStore')
@observer
export class ConfirmModal extends React.Component<ConfirmModalProps> {
  constructor(props: ConfirmModalProps) {
    super(props);
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onConfirm() {
    this.props.onConfirm();
    this.onClose();
  }

  onCancel() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.onClose();
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
          <Button key="0" color="primary" onClick={this.onConfirm}>
            Confirm
          </Button>{' '}
          <Button key="1" color="secondary" onClick={this.onCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
