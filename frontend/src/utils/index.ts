import { ApiError } from "@/types"
import { ToastInstance } from "@/types"

export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(" ")
}

export const handleError = (toast: ToastInstance, err: Error) => {
  const errDetail = (err as ApiError).response?.data.msg
  const errorMessage = errDetail || err.message || "Something went wrong."

  toast.error(errorMessage)
}

export const baseName = import.meta.env.VITE_BASE_URL || ""

export const getImageUrl = (path: string) => {
  return `${baseName}${path}`
}
