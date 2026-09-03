import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-white font-medium placeholder:text-gray-400 caret-[#6F1D1B] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F1D1B]/50 focus-visible:border-[#6F1D1B] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
