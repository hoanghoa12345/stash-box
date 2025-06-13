import { Skeleton } from "@/components/ui/skeleton"

const CardSkeleton = () => {
  return (
    <>
      <div role="status" className="rounded-xl border overflow-hidden">
        <Skeleton className="aspect-video overflow-hidden" />
        <div className="flex flex-col space-y-1.5 p-6 pb-2">
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CardSkeleton
