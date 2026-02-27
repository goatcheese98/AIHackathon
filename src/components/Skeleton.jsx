import React from 'react';
import { clsx } from 'clsx';

export function Skeleton({ className, ...props }) {
    return (
        <div
            className={clsx(
                "animate-pulse bg-surface-highlight rounded",
                className
            )}
            {...props}
        />
    );
}

export function PromptCardSkeleton() {
    return (
        <div className="glass-panel p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div>
                        <Skeleton className="h-5 w-40 mb-2" />
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-surface-highlight rounded-lg p-4 mb-6 flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg ml-auto" />
                <Skeleton className="w-20 h-8 rounded-lg" />
            </div>
        </div>
    );
}

export function PromptCardSkeletonGrid({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <PromptCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function TableRowSkeleton({ columns = 4 }) {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-border">
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1" />
            ))}
        </div>
    );
}

export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-panel p-4">
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                </div>
            ))}
        </div>
    );
}
