import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonLoader() {
  return (
    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-8 w-28" />
    </div>
  )
}

