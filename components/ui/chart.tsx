import { ChartTooltip as TooltipPrimitive } from "recharts"
import { cn } from "@/lib/utils"

export type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

export const ChartContainer = ({
  config,
  children,
}: {
  config: ChartConfig
  children: React.ReactNode
}) => {
  return (
    <div
      style={
        Object.fromEntries(
          Object.entries(config).map(([key, value]) => [`--color-${key}`, value.color])
        ) as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}

export const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipPrimitive
      content={({ payload }) => {
        if (!payload || !payload.length) {
          return null
        }
        return children
      }}
    />
  )
}

export const ChartTooltipContent = ({
  indicator = "bullet",
  className,
  hideLabel = false,
  ...props
}: React.ComponentProps<"div"> & { indicator?: "bullet" | "dot", hideLabel?: boolean }) => {
  return (
    <div
      className={cn(
        "rounded-lg border bg-background p-2 shadow-md",
        className
      )}
      {...props}
    />
  )
}

ChartTooltipContent.Item = ({
  color,
  label,
  value,
  indicator = "bullet",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  color: string
  label: string
  value: string | number
  indicator?: "bullet" | "dot"
}) => {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      {indicator === "bullet" ? (
        <span
          className="mr-1 h-1 w-1 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      ) : (
        <span
          className="mr-1 h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="flex-1 truncate text-sm text-muted-foreground">
        {label}
      </span>
      <span className="ml-2 text-sm font-medium tabular-nums">{value}</span>
    </div>
  )
}