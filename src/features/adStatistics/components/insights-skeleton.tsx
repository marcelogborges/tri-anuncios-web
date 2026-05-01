import { Skeleton } from "@/components/ui/skeleton"

export const InsightsSkeleton = () => {
  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-[480px]:grid-cols-1">
        <Skeleton className="col-span-2 max-[480px]:col-span-1 h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  )
}
