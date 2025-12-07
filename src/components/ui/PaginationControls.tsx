import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'default' | 'mobile';
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'default'
}: PaginationControlsProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      // Show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show current page and neighbors
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  // Mobile variant - simpler design
  if (variant === 'mobile') {
    return (
      <div className="flex items-center justify-center gap-0 bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-[30px] h-[32px] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5 text-neutral-700" />
        </button>

        {/* Page Numbers */}
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <div key={`ellipsis-${index}`} className="flex items-center justify-center w-[38px] h-[32px] text-sm text-neutral-400">
                ...
              </div>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`
                flex items-center justify-center w-[38px] h-[32px] text-sm font-medium border-l border-neutral-200
                transition-colors
                ${isActive 
                  ? 'bg-yellow-400 text-neutral-900' 
                  : 'bg-white text-neutral-700 hover:bg-neutral-50'
                }
              `}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-[39px] h-[32px] border-l border-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5 text-neutral-700" />
        </button>
      </div>
    );
  }

  // Desktop variant - matching Figma design exactly
  return (
    <div className="flex items-center justify-center gap-0">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-[48px] h-[40px] bg-white border border-neutral-300 rounded-l-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-6 h-6 text-neutral-700" />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <div key={`ellipsis-${index}`} className="flex items-center justify-center w-[48px] h-[40px] bg-white border-t border-b border-neutral-300 text-neutral-400">
              ...
            </div>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`
              flex items-center justify-center w-[48px] h-[40px] border-t border-b border-neutral-300
              font-medium transition-colors
              ${isActive 
                ? 'bg-yellow-400 text-neutral-900 border-yellow-400' 
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
              }
            `}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-[48px] h-[40px] bg-white border border-neutral-300 rounded-r-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-6 h-6 text-neutral-700" />
      </button>
    </div>
  );
}
