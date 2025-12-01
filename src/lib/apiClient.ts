// src/lib/apiClient.ts
/**
 * Typed API Client for SmartCard Backend
 * 
 * Provides type-safe HTTP methods (GET, POST, PATCH, DELETE) for interacting
 * with the Express backend API. Handles authentication, error responses, and
 * generic typing for responses.
 * 
 * Security: Never exposes service role keys. Uses public anon key only when
 * needed for Supabase public endpoints.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

/**
 * Standard API error response
 */
export interface APIError {
    success: false;
    error_code?: string;
    message: string;
    details?: unknown;
}

/**
 * Standard API success response
 */
export interface APISuccess<T = unknown> {
    success: true;
    data: T;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    success: true;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export type APIResponse<T> = APISuccess<T> | APIError;

/**
 * Custom API Error class
 */
export class APIClientError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public errorCode?: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'APIClientError';
    }
}

/**
 * Get authorization header with current session token
 */
async function getAuthHeader(): Promise<Record<string, string>> {
    // Dynamic import to avoid issues with server-side rendering
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const { createClient } = await import('./supabaseClient');
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.access_token) {
            return {
                'Authorization': `Bearer ${session.access_token}`,
            };
        }
    } catch (error) {
        console.error('Failed to get auth header:', error);
    }

    return {};
}

/**
 * Base fetch wrapper with error handling
 */
async function fetchWithErrorHandling<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new APIClientError(
                data.message || `HTTP ${response.status}`,
                response.status,
                data.error_code,
                data.details
            );
        }

        // Handle both new format { success: true, data: ... } and legacy direct responses
        if (data.success === false) {
            throw new APIClientError(
                data.message || 'API request failed',
                response.status,
                data.error_code,
                data.details
            );
        }

        // Return data property if present (new format), otherwise return entire response (legacy)
        return (data.success && data.data !== undefined ? data.data : data) as T;
    } catch (error) {
        if (error instanceof APIClientError) {
            throw error;
        }

        if (error instanceof Error) {
            throw new APIClientError(error.message, 0);
        }

        throw new APIClientError('Unknown error occurred', 0);
    }
}

/**
 * API Client class
 */
export class APIClient {
    private baseURL: string;

    constructor(baseURL: string = API_BASE) {
        this.baseURL = baseURL;
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const authHeaders = await getAuthHeader();

        return fetchWithErrorHandling<T>(`${this.baseURL}${endpoint}`, {
            method: 'GET',
            ...options,
            headers: {
                ...authHeaders,
                ...options.headers,
            },
        });
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        data?: unknown,
        options: RequestInit = {}
    ): Promise<T> {
        const authHeaders = await getAuthHeader();

        return fetchWithErrorHandling<T>(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
            headers: {
                ...authHeaders,
                ...options.headers,
            },
        });
    }

    /**
     * PATCH request
     */
    async patch<T>(
        endpoint: string,
        data: unknown,
        options: RequestInit = {}
    ): Promise<T> {
        const authHeaders = await getAuthHeader();

        return fetchWithErrorHandling<T>(`${this.baseURL}${endpoint}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            ...options,
            headers: {
                ...authHeaders,
                ...options.headers,
            },
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const authHeaders = await getAuthHeader();

        return fetchWithErrorHandling<T>(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
            ...options,
            headers: {
                ...authHeaders,
                ...options.headers,
            },
        });
    }

    /**
     * Public POST (no auth header) - for view tracking
     */
    async postPublic<T>(
        endpoint: string,
        data: unknown,
        options: RequestInit = {}
    ): Promise<T> {
        return fetchWithErrorHandling<T>(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options,
        });
    }
}

/**
 * Default API client instance
 */
export const apiClient = new APIClient();
