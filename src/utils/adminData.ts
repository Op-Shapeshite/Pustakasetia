// Admin Dashboard Mock Data Utilities
// Uses localStorage for persistence

export interface Book {
    id: number;
    title: string;
    author: string;
    pages: number;
    size: string;
    isbn: string;
    price: number;
    category: string;
    edition: string;
    synopsis: string;
    image: string;
    createdAt: string;
}

export interface User {
    id: number;
    username: string;
    fullName: string;
    password: string;
    role: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    createdAt: string;
}

// Initial mock data
const initialBooks: Book[] = [
    {
        id: 1,
        title: "Sistem Informasi Manajemen Pendidikan",
        author: "Dr. Dadang Suhairi, S.E., M.M",
        pages: 198,
        size: "16 x 24 cm",
        isbn: "978-979-076-799-1",
        price: 42000,
        category: "Pendidikan",
        edition: "Ke-1. 2025",
        synopsis: "Buku ini membahas tentang sistem informasi manajemen dalam konteks pendidikan...",
        image: "/img/book-cover-optimized.png",
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        title: "Komunikasi Organisasi",
        author: "Dr. H. Yana Sutiana, M.Ag.",
        pages: 250,
        size: "16 x 24 cm",
        isbn: "978-979-076-800-4",
        price: 68000,
        category: "Manajemen",
        edition: "Ke-1. 2025",
        synopsis: "Membahas teori dan praktik komunikasi dalam organisasi...",
        image: "/img/book-cover-optimized.png",
        createdAt: new Date().toISOString(),
    },
    {
        id: 3,
        title: "Hukum Perkawinan Islam",
        author: "Dr. Beni Ahmad Saebani, M.Si.",
        pages: 320,
        size: "16 x 24 cm",
        isbn: "978-979-076-801-1",
        price: 78000,
        category: "Hukum",
        edition: "Ke-2. 2025",
        synopsis: "Kajian mendalam tentang hukum perkawinan dalam Islam...",
        image: "/img/book-cover-optimized.png",
        createdAt: new Date().toISOString(),
    },
];

const initialUsers: User[] = [
    {
        id: 1,
        username: "admin",
        fullName: "Administrator",
        password: "admin123",
        role: "Admin",
        status: "active",
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        username: "editor1",
        fullName: "Editor Satu",
        password: "editor123",
        role: "Editor",
        status: "active",
        createdAt: new Date().toISOString(),
    },
];

const initialRoles: Role[] = [
    { id: 1, name: "Admin", description: "Full access to all features", createdAt: new Date().toISOString() },
    { id: 2, name: "Editor", description: "Can manage books and content", createdAt: new Date().toISOString() },
    { id: 3, name: "Viewer", description: "Read-only access", createdAt: new Date().toISOString() },
];

// Storage keys
const BOOKS_KEY = 'admin_books';
const USERS_KEY = 'admin_users';
const ROLES_KEY = 'admin_roles';

// Initialize data if not exists
function initializeData<T>(key: string, initialData: T[]): void {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(initialData));
    }
}

// Generic CRUD operations
function getAll<T>(key: string, initialData: T[]): T[] {
    if (typeof window === 'undefined') return initialData;
    initializeData(key, initialData);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : initialData;
}

function getById<T extends { id: number }>(key: string, id: number, initialData: T[]): T | undefined {
    const items = getAll<T>(key, initialData);
    return items.find(item => item.id === id);
}

function create<T extends { id: number; createdAt: string }>(key: string, item: Omit<T, 'id' | 'createdAt'>, initialData: T[]): T {
    const items = getAll<T>(key, initialData);
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItem = { ...item, id: newId, createdAt: new Date().toISOString() } as unknown as T;
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
    return newItem;
}

function update<T extends { id: number }>(key: string, id: number, updates: Partial<T>, initialData: T[]): T | undefined {
    const items = getAll<T>(key, initialData);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    items[index] = { ...items[index], ...updates };
    localStorage.setItem(key, JSON.stringify(items));
    return items[index];
}

function remove<T extends { id: number }>(key: string, id: number, initialData: T[]): boolean {
    const items = getAll<T>(key, initialData);
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
}

// Book operations
export const bookService = {
    getAll: () => getAll<Book>(BOOKS_KEY, initialBooks),
    getById: (id: number) => getById<Book>(BOOKS_KEY, id, initialBooks),
    create: (book: Omit<Book, 'id' | 'createdAt'>) => create<Book>(BOOKS_KEY, book, initialBooks),
    update: (id: number, updates: Partial<Book>) => update<Book>(BOOKS_KEY, id, updates, initialBooks),
    delete: (id: number) => remove<Book>(BOOKS_KEY, id, initialBooks),
};

// User operations
export const userService = {
    getAll: () => getAll<User>(USERS_KEY, initialUsers),
    getById: (id: number) => getById<User>(USERS_KEY, id, initialUsers),
    create: (user: Omit<User, 'id' | 'createdAt'>) => create<User>(USERS_KEY, user, initialUsers),
    update: (id: number, updates: Partial<User>) => update<User>(USERS_KEY, id, updates, initialUsers),
    delete: (id: number) => remove<User>(USERS_KEY, id, initialUsers),
};

// Role operations
export const roleService = {
    getAll: () => getAll<Role>(ROLES_KEY, initialRoles),
    getById: (id: number) => getById<Role>(ROLES_KEY, id, initialRoles),
    create: (role: Omit<Role, 'id' | 'createdAt'>) => create<Role>(ROLES_KEY, role, initialRoles),
    update: (id: number, updates: Partial<Role>) => update<Role>(ROLES_KEY, id, updates, initialRoles),
    delete: (id: number) => remove<Role>(ROLES_KEY, id, initialRoles),
};
