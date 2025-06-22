import { ApiError } from "@/types"
import { ToastInstance } from "@/types"

export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(" ")
}

export const handleError = (toast: ToastInstance, err: Error) => {
  const errDetail = (err as ApiError).response?.data.msg
  let errorMessage = ""
  if (typeof errDetail === "string") {
    errorMessage = errDetail
  } else {
    errorMessage = err.message || "Something went wrong."
  }

  toast.error(errorMessage)
}
