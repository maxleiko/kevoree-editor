import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { ModalStore } from '../../stores';
import { DefaultModal, ConfirmModal, ConfirmModalProps } from '.';

export interface ModalContainerProps {
  modalStore?: ModalStore;
}

@inject('modalStore')
@observer
export class ModalContainer extends React.Component<ModalContainerProps> {
  render() {
    return this.props.modalStore!.modals.map((modal) => {
      if (modal.type === 'confirm') {
        return <ConfirmModal key={modal.props.id} {...modal.props as ConfirmModalProps} />;
      } else {
        return <DefaultModal key={modal.props.id} {...modal.props} />;
      }
    });
  }
}
