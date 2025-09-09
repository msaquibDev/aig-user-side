"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function SkeletonCard({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5 m-10">
      {Array.from({ length: count }).map((_, idx) => (
        <Card
          key={idx}
          className="flex flex-col rounded-xl overflow-hidden shadow-md border bg-white animate-pulse"
          style={{ maxWidth: "350px", height: "420px" }}
        >
          <Skeleton className="w-full h-[180px] bg-gray-200" />
          <div className="flex flex-col flex-grow px-4 py-3 space-y-2">
            <Skeleton className="h-5 w-3/4 bg-gray-200 rounded" />
            <Skeleton className="h-4 w-1/2 bg-gray-200 rounded" />
            <Skeleton className="h-4 w-1/3 bg-gray-200 rounded" />
            <Skeleton className="h-8 w-full bg-gray-300 rounded mt-auto" />
          </div>
        </Card>
      ))}
    </div>
  );
}
