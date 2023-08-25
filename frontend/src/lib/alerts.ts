import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';


// Simple Alert
export function salert(title: string, body: string = "") {
  const SimpleAlert: ModalSettings = {
    type: 'alert',
    title: title,
    body: body,
    buttonTextCancel: 'OK'
  };
  modalStore.trigger(SimpleAlert);
}

// Function Alert
export function falert(title: string, fn: () => void) {
  const FunctionAlert: ModalSettings = {
    type: 'alert',
    title: title,
    response: fn,
    buttonTextCancel: 'OK'
  }
  modalStore.trigger(FunctionAlert);
}

// Proompt
export function proompt(title: string, fn: (r: string) => void) {
  const Proompt: ModalSettings = {
    type: 'prompt',
    title: title,
    valueAttr: {
      'type': 'text',
      'required': true
    },
    response: fn
  };
  modalStore.trigger(Proompt);
}

// Yes No Question
export function askbool(title: string, fn: (r: boolean) => void) {
  const AskBool: ModalSettings = {
    type: 'confirm',
    title: title,
    response: fn,
    buttonTextConfirm: 'Yes!',
    buttonTextCancel: 'No!'
  }
  modalStore.trigger(AskBool);
} 