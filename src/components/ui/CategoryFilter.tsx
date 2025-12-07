import { BookCategory } from '../../types/book';

interface CategoryFilterProps {
  selectedCategory: BookCategory | 'all';
  onCategoryChange: (category: BookCategory | 'all') => void;
  variant?: 'default' | 'mobile';
}

const categories: { value: BookCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'Teknologi', label: 'Teknologi' },
  { value: 'Komunikasi', label: 'Komunikasi' },
  { value: 'Hukum Islam', label: 'Hukum Islam' },
  { value: 'Ilmu Sosial', label: 'Ilmu Sosial' },
  { value: 'Ekonomi', label: 'Ekonomi' },
  { value: 'Bahasa', label: 'Bahasa' },
  { value: 'Agama', label: 'Agama' },
  { value: 'Sastra', label: 'Sastra' },
  { value: 'Pendidikan', label: 'Pendidikan' },
  { value: 'Lainnya', label: 'Lainnya' },
];

export default function CategoryFilter({ 
  selectedCategory, 
  onCategoryChange,
  variant = 'default'
}: CategoryFilterProps) {
  
  // Mobile variant - horizontal scroll tabs
  if (variant === 'mobile') {
    return (
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4 pb-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category.value;
            
            return (
              <button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
                  transition-colors whitespace-nowrap
                  ${isActive 
                    ? 'bg-yellow-400 text-neutral-900' 
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-400'
                  }
                `}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop variant - dropdown select
  return (
    <div className="relative w-full max-w-[280px]">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value as BookCategory | 'all')}
        className="w-full h-[48px] px-4 pr-10 bg-white border border-neutral-300 rounded-lg text-base text-neutral-900 cursor-pointer hover:border-neutral-400 focus:outline-none focus:border-yellow-400 transition-colors appearance-none"
      >
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
      
      {/* Custom Dropdown Arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
