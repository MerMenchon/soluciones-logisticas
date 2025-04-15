
import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToastProps = {
  id: string
  open: boolean
}

type Toast = {
  id?: string
  dismiss?: () => void
  update?: (props: ToastProps) => void
}

function toast(): Toast {
  return {
    id: undefined,
    dismiss: () => {},
    update: () => {}
  };
}

function useToast() {
  const [state] = React.useState({ toasts: [] });

  return {
    ...state,
    toast,
    dismiss: () => {}
  };
}

export { useToast, toast }

