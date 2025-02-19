import type React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-gray-800", className)} {...props} />
}

export function AIModalSkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-gray-700" />
        <Skeleton className="h-4 w-[200px] bg-gray-700" />
      </div>
      <Skeleton className="h-[250px] w-full bg-gray-700" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-gray-700" />
        <Skeleton className="h-4 w-[200px] bg-gray-700" />
        <Skeleton className="h-4 w-[150px] bg-gray-700" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-gray-700" />
        <Skeleton className="h-20 w-full bg-gray-700" />
        <Skeleton className="h-20 w-full bg-gray-700" />
        <Skeleton className="h-20 w-full bg-gray-700" />
      </div>
    </div>
  )
}

