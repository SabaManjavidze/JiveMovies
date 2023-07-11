import { type ClassValue, clsx } from 'clsx'
import { KeyboardEvent } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const handleVideoKeyDown = (e: KeyboardEvent<HTMLVideoElement>) => {
  switch (e.code) {
    case 'KeyF':
      e.currentTarget.requestFullscreen({
        navigationUI: 'hide'
      })
      break
    case 'KeyH':
      e.currentTarget.playbackRate = 2
      break
    case 'KeyG':
      e.currentTarget.playbackRate = 1.5
      break
    case 'KeyA':
      e.currentTarget.playbackRate -= 0.1
      break
    case 'KeyD':
      e.currentTarget.playbackRate += 0.1
      break
    case 'KeyR':
      e.currentTarget.playbackRate = 1
      break

    default:
      break
  }
}
