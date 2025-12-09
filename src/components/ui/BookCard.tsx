import { Book } from '../../types/book';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  variant?: 'default' | 'mobile';
}

export default function BookCard({ book, onClick, variant = 'default' }: BookCardProps) {
  // Mobile variant - Grid layout (same as desktop, responsive)
  if (variant === 'mobile') {
    return (
      <div
        onClick={onClick}
        className="w-full cursor-pointer group bg-white"
      >
        {/* Book Cover - Responsive aspect ratio */}
        <div className="relative w-full aspect-[3/4] bg-neutral-100 rounded overflow-hidden mb-2">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Book Info */}
        <div className="space-y-1">
          {/* Author - Above Title */}
          <p className="text-xs text-neutral-500 font-['Poppins',sans-serif] line-clamp-1">
            {book.author}
          </p>

          {/* Title - 2 lines max */}
          <h3 className="text-sm font-bold text-neutral-900 line-clamp-1 font-['Poppins',sans-serif]">
            {book.title}
          </h3>

          {/* Price */}
          <p className="text-sm font-bold text-[#22C55E] font-['Poppins',sans-serif]">
            {book.priceFormatted}
          </p>
        </div>
      </div>
    );
  }

  // Default variant - Grid layout (4 columns desktop, 2 columns mobile)
  return (
    <div
      onClick={onClick}
      className="w-full cursor-pointer group bg-white"
    >
      {/* Book Cover - Responsive aspect ratio */}
      <div className="relative w-full aspect-[3/4] bg-neutral-100 rounded overflow-hidden mb-2">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Book Info */}
      <div className="space-y-1">
        {/* Author - Above Title */}
        <p className="text-sm text-neutral-500 font-['Poppins',sans-serif] line-clamp-1">
          {book.author}
        </p>

        {/* Title - 2 lines max */}
        <h3 className="text-lg font-bold text-neutral-900 line-clamp-1 leading-[1.4] font-['Poppins',sans-serif]">
          {book.title}
        </h3>

        {/* Price */}
        <p className="text-base font-bold text-[#22C55E] font-['Poppins',sans-serif]">
          {book.priceFormatted}
        </p>
      </div>
    </div>
  );
}
