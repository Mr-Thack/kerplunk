import type { ModalStore, ModalSettings } from '@skeletonlabs/skeleton';



export default class Alerter {
    modalStore: ModalStore;
    
    Proompt: ModalSettings = {
        type: 'prompt',
        valueAttr: {
            'type': 'text',
            'required': true
        }
    };

    SimpleAlert: ModalSettings = {
        type: 'alert',
        buttonTextCancel: 'OK'
    }; 


    FunctionAlert: ModalSettings = {
        type: 'alert',
        buttonTextCancel: 'OK'
    }

    AskBool: ModalSettings = {
        type: 'confirm',
        buttonTextConfirm: 'Yes!',
        buttonTextCancel: 'No!'
    }

    constructor(ms: ModalStore) {
        this.modalStore = ms;
    }

    proompt(title: string, fn: (r: string) => void) {
        const clone = structuredClone(this.Proompt);
        clone.title = title;
        clone.response = fn;
        this.modalStore.trigger(clone);
    }

    salert(title: string, body: string = "") {
        const clone = structuredClone(this.SimpleAlert);
        clone.title = title;
        clone.body = body;
        this.modalStore.trigger(clone);
    }

    falert(title: string, fn: () => void) {
        const clone = structuredClone(this.FunctionAlert);
        clone.title = title;
        clone.response = fn;
        this.modalStore.trigger(clone);
    }

    askbool(title: string, fn: (r: boolean) => void) {
        const clone = structuredClone(this.AskBool);
        clone.title = title;
        clone.response = fn;
        this.modalStore.trigger(clone);
    }
}
