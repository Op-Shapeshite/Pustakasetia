import { Book } from '../types/book';

// Single book cover image for all books (optimized to 240x350px for 120px display @ 2x retina)
const bookCover = "/img/book-cover-optimized.png";

// Base books from Figma design
export const baseBooks: Omit<Book, 'id'>[] = [
  {
    title: "Sistem Informasi Manajemen Pendidikan",
    author: "Dr. Dadang Suhairi, S.E., M.M & Dr. Cecep Wahyu Hoerudin, M.Pd.",
    price: 42000,
    priceFormatted: "Rp42.000",
    image: bookCover,
    pages: 198,
    size: "16 x 24 cm",
    edition: "Ke-1. 2025",
    isbn: "978-979-076-799-1",
    paperType: "HVS",
    synopsis: "Buku ini membahas tentang sistem informasi manajemen dalam konteks pendidikan modern. Dengan pendekatan praktis dan teoritis, buku ini cocok untuk mahasiswa, dosen, dan praktisi pendidikan yang ingin memahami bagaimana teknologi informasi dapat meningkatkan efisiensi manajemen pendidikan.",
    category: "Teknologi",
    tags: ["Sistem Informasi", "Manajemen", "Pendidikan"],
    stock: 50,
    bestseller: true,
    featured: true,
    publishYear: 2025
  },
  {
    title: "Komunikasi Organisasi",
    author: "Dr. H. Yana Sutiana, M.Ag.",
    price: 68000,
    priceFormatted: "Rp68.000",
    image: bookCover,
    pages: 256,
    size: "16 x 24 cm",
    edition: "Ke-2. 2024",
    isbn: "978-979-076-800-4",
    paperType: "HVS",
    synopsis: "Membahas konsep dan praktik komunikasi dalam organisasi modern. Buku ini mengupas berbagai teori komunikasi, strategi komunikasi efektif, dan pengelolaan konflik dalam organisasi. Dilengkapi dengan studi kasus yang relevan dengan kondisi organisasi di Indonesia.",
    category: "Komunikasi",
    tags: ["Komunikasi", "Organisasi", "Manajemen"],
    stock: 35,
    bestseller: true,
    featured: true,
    publishYear: 2024
  },
  {
    title: "Hukum Perkawinan Islam dan Isu-Isu Kontemporer Hukum Keluarga",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: 78000,
    priceFormatted: "Rp78.000",
    image: bookCover,
    pages: 324,
    size: "16 x 24 cm",
    edition: "Ke-3. 2024",
    isbn: "978-979-076-801-1",
    paperType: "HVS",
    synopsis: "Kajian mendalam tentang hukum perkawinan dalam Islam dengan perspektif kontemporer. Membahas berbagai isu aktual seperti poligami, perceraian, hak waris, dan masalah keluarga modern lainnya dengan pendekatan fiqih dan hukum positif Indonesia.",
    category: "Hukum Islam",
    tags: ["Hukum Islam", "Perkawinan", "Keluarga"],
    stock: 42,
    bestseller: true,
    featured: true,
    publishYear: 2024
  },
  {
    title: "Metode Penelitian Hukum Pendekatan Yuridis Normatif",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: 68000,
    priceFormatted: "Rp68.000",
    image: bookCover,
    pages: 288,
    size: "16 x 24 cm",
    edition: "Ke-1. 2024",
    isbn: "978-979-076-802-8",
    paperType: "HVS",
    synopsis: "Panduan lengkap untuk penelitian hukum dengan pendekatan yuridis normatif. Buku ini memberikan pemahaman tentang metodologi penelitian hukum, teknik pengumpulan data, analisis bahan hukum, dan penulisan karya ilmiah bidang hukum.",
    category: "Hukum Islam",
    tags: ["Metodologi", "Penelitian", "Hukum"],
    stock: 38,
    featured: true,
    publishYear: 2024
  },
  {
    title: "Ilmu Sosial Dasar",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: 48000,
    priceFormatted: "Rp48.000",
    image: bookCover,
    pages: 212,
    size: "16 x 24 cm",
    edition: "Ke-4. 2024",
    isbn: "978-979-076-803-5",
    paperType: "HVS",
    synopsis: "Pengantar komprehensif tentang ilmu sosial dasar yang mencakup sosiologi, antropologi, psikologi sosial, dan ekonomi. Buku ini dirancang untuk mahasiswa semester awal yang mempelajari ilmu sosial sebagai mata kuliah wajib umum.",
    category: "Ilmu Sosial",
    tags: ["Sosiologi", "Antropologi", "Ilmu Sosial"],
    stock: 60,
    bestseller: true,
    featured: true,
    publishYear: 2024
  },
  {
    title: "Fiqih Muamalah Klasik dan Kontemporer",
    author: "Prof. Dr. H. Koko Komaruddin, M.Pd.",
    price: 70000,
    priceFormatted: "Rp70.000",
    image: bookCover,
    pages: 298,
    size: "16 x 24 cm",
    edition: "Ke-2. 2024",
    isbn: "978-979-076-804-2",
    paperType: "HVS",
    synopsis: "Pembahasan lengkap tentang fiqih muamalah dari perspektif klasik dan kontemporer. Meliputi berbagai transaksi ekonomi Islam, perbankan syariah, asuransi syariah, dan isu-isu ekonomi Islam modern yang relevan dengan kehidupan masyarakat Indonesia.",
    category: "Hukum Islam",
    tags: ["Fiqih", "Muamalah", "Ekonomi Islam"],
    stock: 45,
    bestseller: true,
    featured: true,
    publishYear: 2024
  },
  {
    title: "Sosiologi Ekonomi Memaksimalkan Keuntungan dan Meminimalkan Risiko",
    author: "Dr. Dedah Jubaedah, M.Si.",
    price: 53000,
    priceFormatted: "Rp53.000",
    image: bookCover,
    pages: 234,
    size: "16 x 24 cm",
    edition: "Ke-1. 2024",
    isbn: "978-979-076-805-9",
    paperType: "HVS",
    synopsis: "Mengkaji hubungan antara struktur sosial dan perilaku ekonomi. Buku ini membahas bagaimana faktor-faktor sosial mempengaruhi keputusan ekonomi, strategi bisnis, dan manajemen risiko dalam konteks masyarakat Indonesia yang beragam.",
    category: "Ekonomi",
    tags: ["Sosiologi", "Ekonomi", "Bisnis"],
    stock: 52,
    featured: true,
    publishYear: 2024
  },
  {
    title: "EYD Pedoman Umum Ejaan Bahasa Indonesia Yang Disempurnakan",
    author: "Pustaka Setia",
    price: 25000,
    priceFormatted: "Rp25.000",
    image: bookCover,
    pages: 128,
    size: "14 x 21 cm",
    edition: "Ke-5. 2024",
    isbn: "978-979-076-806-6",
    paperType: "HVS",
    synopsis: "Panduan lengkap ejaan bahasa Indonesia yang disempurnakan (EYD). Referensi penting untuk pelajar, mahasiswa, guru, dosen, dan siapa saja yang ingin menulis dengan ejaan yang benar sesuai kaidah bahasa Indonesia yang baku.",
    category: "Bahasa",
    tags: ["EYD", "Bahasa Indonesia", "Tata Bahasa"],
    stock: 100,
    bestseller: true,
    publishYear: 2024
  }
];

// Generate additional books by variation
function generateVariations(): Book[] {
  const books: Book[] = [];
  let idCounter = 1;

  // Add base books with IDs
  baseBooks.forEach(book => {
    books.push({ ...book, id: idCounter++ });
  });

  // Generate variations for each category
  const categories = ["Teknologi", "Komunikasi", "Hukum Islam", "Ilmu Sosial", "Ekonomi", "Bahasa", "Agama", "Pendidikan"] as const;

  const authors = [
    "Dr. Dadang Suhairi, S.E., M.M",
    "Dr. H. Yana Sutiana, M.Ag.",
    "Dr. Beni Ahmad Saebani, M.Si.",
    "Prof. Dr. H. Koko Komaruddin, M.Pd.",
    "Dr. Dedah Jubaedah, M.Si.",
    "Prof. Dr. Ahmad Syafi'i, M.A.",
    "Dr. Hj. Siti Aisyah, M.Pd.",
    "Dr. Muhammad Rizki, M.M.",
  ];

  const prefixes = [
    "Pengantar", "Dasar-Dasar", "Konsep", "Teori dan Praktik", 
    "Panduan Lengkap", "Kajian", "Studi", "Analisis"
  ];

  const subjects = {
    Teknologi: ["Sistem Informasi", "Teknologi Pendidikan", "Komputer", "Internet", "Database", "Programming", "Web Development"],
    Komunikasi: ["Komunikasi Massa", "Jurnalistik", "Public Relations", "Media Sosial", "Broadcasting", "Komunikasi Bisnis"],
    "Hukum Islam": ["Fiqih", "Ushul Fiqih", "Hukum Keluarga", "Hukum Pidana Islam", "Hukum Perdata Islam", "Muamalah"],
    "Ilmu Sosial": ["Sosiologi", "Antropologi", "Psikologi Sosial", "Politik", "Administrasi", "Pembangunan"],
    Ekonomi: ["Ekonomi Mikro", "Ekonomi Makro", "Manajemen Keuangan", "Akuntansi", "Perbankan", "Ekonomi Islam"],
    Bahasa: ["Bahasa Indonesia", "Bahasa Inggris", "Bahasa Arab", "Linguistik", "Sastra", "Tata Bahasa"],
    Agama: ["Tafsir", "Hadis", "Akidah", "Akhlak", "Sejarah Islam", "Tasawuf"],
    Pendidikan: ["Kurikulum", "Pembelajaran", "Evaluasi", "Psikologi Pendidikan", "Manajemen Pendidikan", "Teknologi Pendidikan"]
  };

  // Generate 500+ books
  while (books.length < 520) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const categorySubjects = subjects[category];
    const subject = categorySubjects[Math.floor(Math.random() * categorySubjects.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    const image = bookCover; // All books use the same cover image
    
    const price = Math.floor(Math.random() * 80000) + 25000; // 25k - 105k
    const pages = Math.floor(Math.random() * 300) + 100; // 100-400 pages
    const year = Math.floor(Math.random() * 5) + 2020; // 2020-2024
    const edition = Math.floor(Math.random() * 5) + 1; // 1-5
    
    const isbn = `978-979-076-${String(idCounter).padStart(3, '0')}-${Math.floor(Math.random() * 10)}`;
    
    books.push({
      id: idCounter++,
      title: `${prefix} ${subject}`,
      author,
      price,
      priceFormatted: `Rp${price.toLocaleString('id-ID')}`,
      image,
      pages,
      size: "16 x 24 cm",
      edition: `Ke-${edition}. ${year}`,
      isbn,
      paperType: Math.random() > 0.5 ? "HVS" : "Art Paper",
      synopsis: `Buku ini membahas ${subject.toLowerCase()} secara komprehensif dengan pendekatan yang sistematis dan mudah dipahami. Cocok untuk mahasiswa, akademisi, dan praktisi yang ingin memperdalam pengetahuan tentang ${subject.toLowerCase()}.`,
      category,
      tags: [category, subject],
      stock: Math.floor(Math.random() * 80) + 20,
      bestseller: Math.random() > 0.8,
      featured: books.length < 20 && Math.random() > 0.6,
      publishYear: year
    });
  }

  return books;
}

// Export all books
export const allBooks: Book[] = generateVariations();
export const books = allBooks; // Alias for compatibility

// Get books by category
export function getBooksByCategory(category: string, limit?: number): Book[] {
  const filtered = category === "all" ? allBooks : allBooks.filter(book => book.category === category);
  return limit ? filtered.slice(0, limit) : filtered;
}

// Get featured books
export function getFeaturedBooks(limit?: number): Book[] {
  const featured = allBooks.filter(book => book.featured);
  return limit ? featured.slice(0, limit) : featured;
}

// Get bestseller books
export function getBestsellerBooks(): Book[] {
  return allBooks.filter(book => book.bestseller);
}

// Search books
export function searchBooks(query: string): Book[] {
  const lowerQuery = query.toLowerCase();
  return allBooks.filter(book => 
    book.title.toLowerCase().includes(lowerQuery) ||
    book.author.toLowerCase().includes(lowerQuery) ||
    book.isbn.toLowerCase().includes(lowerQuery) ||
    book.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Get book by ID
export function getBookById(id: number): Book | undefined {
  return allBooks.find(book => book.id === id);
}

// Get paginated books
export function getPaginatedBooks(
  category: string,
  page: number,
  itemsPerPage: number
): { books: Book[], totalPages: number, totalItems: number } {
  const filtered = getBooksByCategory(category);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    books: filtered.slice(startIndex, endIndex),
    totalPages: Math.ceil(filtered.length / itemsPerPage),
    totalItems: filtered.length
  };
}
