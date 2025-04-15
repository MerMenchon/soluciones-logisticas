
import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToastType = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  open: boolean
}

const toastState = {
  toasts: [] as ToastType[]
}

// Simple toast function that doesn't take arguments but maintains compatibility
function toast() {
  return {
    id: undefined,
    dismiss: () => {},
    update: () => {}
  };
}

// Custom hook to use toast functionality
function useToast() {
  // Return a simplified version of toast state
  return {
    ...toastState,
    toast,
    dismiss: () => {}
  };
}

export { useToast, toast }
