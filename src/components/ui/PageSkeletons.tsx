'use client';

import { Skeleton } from './skeleton';

// Book card skeleton
export function BookCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <Skeleton className="aspect-[3/4] w-full rounded-none" />
            <div className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-3 w-1/2 mb-3" />
                <Skeleton className="h-5 w-24" />
            </div>
        </div>
    );
}

// Book grid skeleton
export function BookGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <BookCardSkeleton key={i} />
            ))}
        </div>
    );
}

// Hero section skeleton
export function HeroSkeleton() {
    return (
        <section className="relative w-full bg-[#F5F5F5] overflow-hidden">
            <div className="relative max-w-[1440px] mx-auto">
                <div className="flex flex-col lg:flex-row">
                    <div className="flex flex-col justify-center items-center lg:items-start space-y-6 md:space-y-8 px-4 md:px-8 lg:px-16 pt-12 pb-2 md:py-16 lg:py-20 w-full lg:w-1/2 z-10 relative bg-white lg:bg-transparent">
                        <div className="w-full max-w-[500px]">
                            <Skeleton className="h-10 md:h-14 lg:h-16 w-full mb-3" />
                            <Skeleton className="h-10 md:h-14 lg:h-16 w-3/4" />
                        </div>
                        <div className="w-full max-w-lg">
                            <Skeleton className="h-4 md:h-5 w-full mb-2" />
                            <Skeleton className="h-4 md:h-5 w-5/6 mb-2" />
                            <Skeleton className="h-4 md:h-5 w-4/6" />
                        </div>
                        <Skeleton className="h-12 md:h-14 w-48 md:w-56 rounded-full" />
                    </div>
                    <div className="relative w-full lg:w-1/2 h-[400px] lg:h-[700px] flex items-end justify-center lg:justify-end">
                        <Skeleton className="w-full h-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}

// Home page skeleton
export function HomePageSkeleton() {
    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <HeroSkeleton />
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12">
                <div className="mb-6 md:mb-8 text-center md:text-left">
                    <Skeleton className="h-8 md:h-10 w-48 mb-2 mx-auto md:mx-0" />
                    <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
                </div>
                <BookGridSkeleton count={8} />
            </div>
        </div>
    );
}

// Products page skeleton (Mobile)
export function ProductsMobileSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1440px] mx-auto py-6">
                {[1, 2, 3].map((cat) => (
                    <div key={cat} className="mb-8">
                        <div className="flex justify-between items-center mb-4 px-4">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex gap-3 px-4 overflow-hidden">
                            {[1, 2, 3].map((book) => (
                                <div key={book} className="w-[140px] flex-shrink-0">
                                    <BookCardSkeleton />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Products page skeleton (Desktop)
export function ProductsDesktopSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <Skeleton className="h-12 w-36 rounded-lg" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <BookGridSkeleton count={16} />
                <div className="flex justify-center mt-12">
                    <Skeleton className="h-10 w-48 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

// About page skeleton
export function AboutPageSkeleton() {
    return (
        <div className="w-full">
            <section className="relative w-full h-[300px] md:h-[400px] lg:h-[450px]">
                <Skeleton className="w-full h-full rounded-none" />
            </section>

            <section className="w-full py-8 md:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <div className="space-y-4 md:space-y-6">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 md:h-12 w-64" />
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                        <Skeleton className="h-[300px] md:h-[350px] lg:h-[426px] rounded-[24px]" />
                    </div>
                </div>
            </section>

            <section className="w-full py-8 md:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
                                <Skeleton className="w-32 md:w-40 h-32 md:h-40" />
                                <div className="flex-1 space-y-3 w-full">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
