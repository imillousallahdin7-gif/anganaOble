import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-stone-900/60 rounded-3xl p-5 border border-stone-800/60 shadow-xl flex flex-col justify-between h-full animate-pulse select-none">
      <div>
        {/* Product Image Shimmer Box */}
        <div className="w-full aspect-square rounded-2xl bg-stone-800/60 relative overflow-hidden mb-4 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-stone-700/40" />
        </div>
        
        {/* Category Pill Skeleton */}
        <div className="w-16 h-4 rounded-full bg-stone-800/80 mb-3" />
        
        {/* Title Lines Skeleton */}
        <div className="w-3/4 h-5 rounded-lg bg-stone-800/80 mb-2" />
        <div className="w-1/2 h-4 rounded-lg bg-stone-800/50 mb-4" />
      </div>

      <div>
        {/* Price & Action Button Skeleton */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-800/50">
          <div className="space-y-1.5">
            <div className="w-20 h-5 rounded-lg bg-stone-800/80" />
            <div className="w-14 h-3 rounded bg-stone-800/50" />
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20" />
        </div>
      </div>
    </div>
  );
}
