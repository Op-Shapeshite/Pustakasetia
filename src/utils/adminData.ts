// Admin Dashboard API Services
// Uses API endpoints for data persistence with SQLite backend

// Types for API responses
export interface Book {
    id: number;
    title: string;
    author: string;
    pages: number;
    size: string;
    isbn: string;
    price: number;
    category?: string;
    categoryId: number;
    edition: string;
    paper_type: string;
    synopsis: string;
    image: string;
    stock: number;
    sold?: number;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: number;
    username: string;
    fullName: string;
    role: Role;
    roleId: number;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    _count?: { users: number };
}

export interface Category {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    _count?: { books: number };
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Helper for API calls
async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options?.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Auto-logout on 401 Unauthorized (token expired or invalid)
    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

// Book Service
export const bookService = {
    getAll: async (params?: { page?: number; limit?: number; search?: string; categoryId?: number }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());
        if (params?.search) searchParams.set('search', params.search);
        if (params?.categoryId) searchParams.set('categoryId', params.categoryId.toString());

        const url = `/api/books${searchParams.toString() ? `?${searchParams}` : ''}`;
        return apiCall<PaginatedResponse<Book>>(url);
    },

    getById: async (id: number) => {
        return apiCall<Book>(`/api/books/${id}`);
    },

    create: async (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'sold'>) => {
        return apiCall<Book>('/api/books', {
            method: 'POST',
            body: JSON.stringify(book),
        });
    },

    update: async (id: number, updates: Partial<Book>) => {
        return apiCall<Book>(`/api/books/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    delete: async (id: number) => {
        return apiCall<{ message: string }>(`/api/books/${id}`, {
            method: 'DELETE',
        });
    },
};

// User Service
export const userService = {
    getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());
        if (params?.search) searchParams.set('search', params.search);

        const url = `/api/users${searchParams.toString() ? `?${searchParams}` : ''}`;
        return apiCall<PaginatedResponse<User>>(url);
    },

    getById: async (id: number) => {
        return apiCall<User>(`/api/users/${id}`);
    },

    create: async (user: { username: string; fullName: string; password: string; roleId: number; status?: string }) => {
        return apiCall<User>('/api/users', {
            method: 'POST',
            body: JSON.stringify(user),
        });
    },

    update: async (id: number, updates: Partial<User & { password?: string }>) => {
        return apiCall<User>(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    delete: async (id: number) => {
        return apiCall<{ message: string }>(`/api/users/${id}`, {
            method: 'DELETE',
        });
    },
};

// Role Service
export const roleService = {
    getAll: async (params?: { page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());

        const url = `/api/roles${searchParams.toString() ? `?${searchParams}` : ''}`;
        return apiCall<PaginatedResponse<Role>>(url);
    },

    getById: async (id: number) => {
        return apiCall<Role>(`/api/roles/${id}`);
    },

    create: async (role: { name: string; description?: string }) => {
        return apiCall<Role>('/api/roles', {
            method: 'POST',
            body: JSON.stringify(role),
        });
    },

    update: async (id: number, updates: Partial<Role>) => {
        return apiCall<Role>(`/api/roles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    delete: async (id: number) => {
        return apiCall<{ message: string }>(`/api/roles/${id}`, {
            method: 'DELETE',
        });
    },
};

// Category Service
export const categoryService = {
    getAll: async (params?: { page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', (params.limit || 100).toString());

        const url = `/api/categories${searchParams.toString() ? `?${searchParams}` : ''}`;
        return apiCall<PaginatedResponse<Category>>(url);
    },

    getById: async (id: number) => {
        return apiCall<Category>(`/api/categories/${id}`);
    },

    create: async (category: { name: string; description?: string }) => {
        return apiCall<Category>('/api/categories', {
            method: 'POST',
            body: JSON.stringify(category),
        });
    },

    update: async (id: number, updates: Partial<Category>) => {
        return apiCall<Category>(`/api/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    delete: async (id: number) => {
        return apiCall<{ message: string }>(`/api/categories/${id}`, {
            method: 'DELETE',
        });
    },
};

// Auth Service
export const authService = {
    login: async (username: string, password: string) => {
        const response = await apiCall<{ token: string; user: { id: number; username: string; fullName: string; role: string } }>(
            '/api/auth/login',
            {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            }
        );

        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('auth_user', JSON.stringify(response.user));
        }

        return response;
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }
    },

    getCurrentUser: () => {
        if (typeof window === 'undefined') return null;
        const user = localStorage.getItem('auth_user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('auth_token');
    },

    isAuthenticated: () => {
        return !!authService.getToken();
    },
};
