import { ApiError } from "@/types"

export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(" ")
}

import { ToastInstance } from "@/types"

export const handleError = (toast: ToastInstance, err: Error) => {
  const errDetail = (err as ApiError).response?.data.msg
  const errorMessage = errDetail || err.message || "Something went wrong."

  toast.error(errorMessage)
}
