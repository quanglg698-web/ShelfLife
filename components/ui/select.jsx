import * as React from "react";
import { cn } from "@/lib/utils";

// Native <select> styled like ShadCN inputs (keeps the required test hooks simple).
const Select = React.forwardRef(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Select.displayName = "Select";

export { Select };
