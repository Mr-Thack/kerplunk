import { modalStore } from '@skeletonlabs/skeleton';
import type { ModalSettings } from '@skeletonlabs/skeleton';








// Simple Alert
export function salert(title: string) {
  const SimpleAlert: ModalSettings = {
    type: 'alert',
    title: title
  };
  modalStore.trigger(SimpleAlert)
}

// Function Alert
export function falert(title: string, fn: () => void) {
  const FunctionAlert: ModalSettings = {
    type: 'alert',
    title: title,
    response: fn
  }
  modalStore.trigger(FunctionAlert)
}