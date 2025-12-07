import { ReactNode, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  children: ReactNode;
  onViewAll?: () => void;
  variant?: 'mobile' | 'desktop';
}

export default function CategorySection({ 
  title, 
  children, 
  onViewAll,
  variant = 'desktop' 
}: CategorySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Mobile variant - horizontal scroll with touch
  if (variant === 'mobile') {
    return (
      <div className="w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 px-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            {title}
          </h2>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
            >
              Lihat Semua
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>
      </div>
    );
  }

  // Desktop variant - grid with navigation arrows
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-base font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
            >
              Lihat Semua
            </button>
          )}
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 flex items-center justify-center bg-white border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-700" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 flex items-center justify-center bg-white border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-neutral-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="inline-flex gap-2.5">
          {children}
        </div>
      </div>
    </div>
  );
}
