// src/lib/api/admin.ts
import { apiClient } from '../apiClient';

export interface DashboardMetrics {
    totalUsers: number;
    totalCards: number;
    activeUsers7d: number;
    activeUsers30d: number;
    subscribedUsers: number;
    freeUsers: number;
    paidUsers: number;
    totalRevenue: number;
    mrr: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    cardsCreatedToday: number;
    cardsCreatedThisWeek: number;
    cardsCreatedThisMonth: number;
}

export interface UserListItem {
    id: string;
    email: string;
    full_name: string | null;
    created_at: string;
    total_cards: number;
    last_active: string | null;
    subscription_status: string;
    role: string | null;
}

export interface CardListItem {
    id: string;
    slug: string;
    name: string;
    owner_name: string;
    owner_email: string;
    created_at: string;
    updated_at: string;
    is_published: boolean;
    views_count: number;
    theme: any;
}

export interface SubscriptionListItem {
    user_id: string;
    user_email: string;
    user_name: string;
    plan_name: string;
    status: string;
    start_date: string;
    amount: number;
    renewal_type: string;
}

export interface EngagementMetrics {
    totalViews: number;
    totalClicks: number;
    totalQrScans: number;
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    viewsThisWeek: { date: string; count: number }[];
    topCards: { slug: string; name: string; views: number }[];
}

export interface GrowthMetrics {
    userGrowth: { date: string; count: number }[];
    cardGrowth: { date: string; count: number }[];
    revenueGrowth: { date: string; amount: number }[];
    avgCardsPerUser: number;
    conversionRate: number;
}

export interface FeedbackItem {
    id: string;
    user_id: string;
    user_email?: string;
    user_name?: string;
    type: string;
    message: string;
    rating: number;
    path: string;
    created_at: string;
    status: string;
}

export interface WaitlistEntry {
    id: string;
    email: string;
    created_at: string;
    status: string;
}

export const adminAPI = {
    /**
     * Get dashboard metrics
     */
    async getMetrics(): Promise<DashboardMetrics> {
        return apiClient.get<DashboardMetrics>('/api/v1/admin/metrics');
    },

    /**
     * Get list of users
     */
    async getUsers(params?: { limit?: number; offset?: number; search?: string }): Promise<UserListItem[]> {
        const query = new URLSearchParams();
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.offset) query.append('offset', params.offset.toString());
        if (params?.search) query.append('search', params.search);

        const queryString = query.toString();
        return apiClient.get<UserListItem[]>(`/api/v1/admin/users${queryString ? `?${queryString}` : ''}`);
    },

    /**
     * Get user details by ID
     */
    async getUserById(userId: string): Promise<any> {
        return apiClient.get<any>(`/api/v1/admin/users/${userId}`);
    },

    /**
     * Get list of cards
     */
    async getCards(params?: { limit?: number; offset?: number }): Promise<CardListItem[]> {
        const query = new URLSearchParams();
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.offset) query.append('offset', params.offset.toString());

        const queryString = query.toString();
        return apiClient.get<CardListItem[]>(`/api/v1/admin/cards${queryString ? `?${queryString}` : ''}`);
    },

    /**
     * Get subscriptions
     */
    async getSubscriptions(): Promise<SubscriptionListItem[]> {
        return apiClient.get<SubscriptionListItem[]>('/api/v1/admin/subscriptions');
    },

    /**
     * Get engagement metrics
     */
    async getEngagement(): Promise<EngagementMetrics> {
        return apiClient.get<EngagementMetrics>('/api/v1/admin/engagement');
    },

    /**
     * Get growth metrics
     */
    async getGrowth(days: number = 30): Promise<GrowthMetrics> {
        return apiClient.get<GrowthMetrics>(`/api/v1/admin/growth?days=${days}`);
    },

    /**
     * Get beta testing status
     */
    async getBetaStatus(): Promise<{
        isBetaMode: boolean;
        maxUsers: number | null;
        currentUsers: number;
        spotsRemaining: number;
        limitReached: boolean;
    }> {
        return apiClient.get(`/api/v1/admin/beta-status`);
    },

    /**
     * Get feedback
     */
    async getFeedback(params?: { limit?: number; offset?: number }): Promise<FeedbackItem[]> {
        const query = new URLSearchParams();
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.offset) query.append('offset', params.offset.toString());

        const queryString = query.toString();
        return apiClient.get<FeedbackItem[]>(`/api/v1/admin/feedback${queryString ? `?${queryString}` : ''}`);
    },

    /**
     * Get waitlist
     */
    async getWaitlist(params?: { limit?: number; offset?: number }): Promise<WaitlistEntry[]> {
        const query = new URLSearchParams();
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.offset) query.append('offset', params.offset.toString());

        const queryString = query.toString();
        return apiClient.get<WaitlistEntry[]>(`/api/v1/admin/waitlist${queryString ? `?${queryString}` : ''}`);
    },
};
