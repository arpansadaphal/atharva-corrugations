import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge must know the custom font-size roles from globals.css,
// otherwise `text-copy` and `text-body` (a colour) would be treated as the
// same group and one would be dropped.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['display', 'display-md', 'display-sm', 'h2', 'h2-sm', 'h3', 'lead', 'copy', 'spec', 'value', 'label', 'ui'] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
