import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getBackendUrl(path) {
  return `http://${import.meta.env.BACKEND_URL || "localhost"}:10000${path}`
}