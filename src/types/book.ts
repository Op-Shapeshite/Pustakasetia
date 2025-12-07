// Book Categories based on Figma design
export type BookCategory = 
  | "Teknologi" 
  | "Komunikasi" 
  | "Hukum Islam" 
  | "Ilmu Sosial" 
  | "Ekonomi"
  | "Bahasa"
  | "Agama"
  | "Sastra"
  | "Pendidikan"
  | "Lainnya";

// Complete Book interface matching Figma detail specs
export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  priceFormatted: string; // e.g., "Rp42.000"
  image: string;
  
  // Detail information (visible in detail modal)
  pages: number;
  size: string; // e.g., "16 x 24 cm"
  edition: string; // e.g., "Ke-1. 2025"
  isbn: string; // e.g., "978-979-076-799-1"
  paperType: string; // e.g., "HVS", "Art Paper"
  synopsis: string;
  
  // Category and metadata
  category: BookCategory;
  tags?: string[];
  stock: number;
  bestseller?: boolean;
  featured?: boolean;
  publishYear: number;
}

// Cart item with quantity
export interface CartItem {
  book: Book;
  quantity: number;
  addedAt: string; // ISO date string
}

// Customer order form
export interface OrderForm {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  notes?: string;
}

// Price summary for cart
export interface PriceSummary {
  subtotal: number;
  subtotalFormatted: string;
  shipping: number;
  shippingFormatted: string;
  total: number;
  totalFormatted: string;
}

// Filter and sort options
export interface ProductFilters {
  category: BookCategory | "all";
  searchQuery: string;
  sortBy: "newest" | "price-low" | "price-high" | "title-az" | "bestseller";
  priceRange?: {
    min: number;
    max: number;
  };
}

// Pagination state
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
