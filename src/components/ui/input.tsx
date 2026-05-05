import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="bg-[#D7E2FF] rounded-[8px]">

      <input
        type={type}
        data-slot="input"
        className={cn(
          " w-full bg-transparent px-3 py-2 text-[16px] text-[#737685] placeholder:text-[#737685] placeholder:font-main outline-none border-none  h-12",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }


