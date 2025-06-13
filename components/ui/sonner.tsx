"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          // "--normal-bg": "hsl(var(--popover))",
          // "--normal-text": "hsl(var(--popover-foreground))",
          // "--normal-border": "hsl(var(--border))",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
