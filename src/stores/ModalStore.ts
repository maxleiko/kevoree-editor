import { observable, computed, action } from 'mobx';

import { DefaultModalProps, ConfirmModalProps } from '../components/modal';
import { uid } from '../utils/random';

export interface Modal {
    type: 'default' | 'confirm';
    props: DefaultModalProps | ConfirmModalProps;
}

export class ModalStore {
    @observable private _modals: Map<string, Modal> = new Map();

    @action confirm(props: ConfirmModalProps) {
        const id = uid();
        this._modals.set(id, { type: 'confirm', props: { id, ...props } });
        return id;
    }

    @action remove(id: string) {
        return this._modals.delete(id);
    }

    @computed get modals(): Modal[] {
        return Array.from(this._modals.values());
    }
}