'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api/admin';
import type {
    DashboardMetrics,
    UserListItem,
    CardListItem,
    EngagementMetrics,
    GrowthMetrics
} from '@/lib/api/admin';
import { Users, CreditCard, TrendingUp, Eye, DollarSign, Activity } from 'lucide-react';

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [cards, setCards] = useState<CardListItem[]>([]);
    const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
    const [growth, setGrowth] = useState<GrowthMetrics | null>(null);
    const [betaStatus, setBetaStatus] = useState<{
        isBetaMode: boolean;
        maxUsers: number | null;
        currentUsers: number;
        spotsRemaining: number;
        limitReached: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'cards' | 'engagement' | 'growth'>('overview');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const [metricsData, usersData, cardsData, engagementData, growthData, betaData] = await Promise.all([
                adminAPI.getMetrics(),
                adminAPI.getUsers({ limit: 100 }),
                adminAPI.getCards({ limit: 50 }),
                adminAPI.getEngagement(),
                adminAPI.getGrowth(30),
                adminAPI.getBetaStatus(),
            ]);

            setMetrics(metricsData);
            setUsers(usersData);
            setCards(cardsData);
            setEngagement(engagementData);
            setGrowth(growthData);
            setBetaStatus(betaData);
        } catch (error) {
            console.error('Failed to load admin data:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">🔒 Founder Admin Panel</h1>
                    <p className="text-sm text-gray-500 mt-1">Private dashboard for business intelligence</p>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        {[
                            { id: 'overview', label: 'Overview', icon: Activity },
                            { id: 'users', label: 'Users', icon: Users },
                            { id: 'cards', label: 'Cards', icon: CreditCard },
                            { id: 'engagement', label: 'Engagement', icon: Eye },
                            { id: 'growth', label: 'Growth', icon: TrendingUp },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                                    ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'overview' && (
                    <OverviewTab metrics={metrics} betaStatus={betaStatus} />
                )}

                {activeTab === 'users' && (
                    <UsersTab users={users} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                )}

                {activeTab === 'cards' && (
                    <CardsTab cards={cards} />
                )}

                {activeTab === 'engagement' && (
                    <EngagementTab engagement={engagement} />
                )}

                {activeTab === 'growth' && (
                    <GrowthTab growth={growth} />
                )}
            </main>
        </div>
    );
}

// Overview Tab Component
function OverviewTab({ metrics, betaStatus }: {
    metrics: DashboardMetrics | null;
    betaStatus: {
        isBetaMode: boolean;
        maxUsers: number | null;
        currentUsers: number;
        spotsRemaining: number;
        limitReached: boolean;
    } | null;
}) {
    if (!metrics) return null;

    const stats = [
        { label: 'Total Users', value: metrics.totalUsers, icon: Users, color: 'blue', change: `+${metrics.newUsersThisMonth} this month` },
        { label: 'Total Cards', value: metrics.totalCards, icon: CreditCard, color: 'green', change: `+${metrics.cardsCreatedThisMonth} this month` },
        { label: 'Active Users (7d)', value: metrics.activeUsers7d, icon: Activity, color: 'purple', change: `${metrics.activeUsers30d} in 30d` },
        { label: 'Paid Users', value: metrics.paidUsers, icon: DollarSign, color: 'yellow', change: `${((metrics.paidUsers / metrics.totalUsers) * 100).toFixed(1)}% conversion` },
    ];

    return (
        <div className="space-y-6">
            {/* Beta Status Alert (if active) */}
            {betaStatus?.isBetaMode && (
                <div className={`rounded-lg p-4 ${betaStatus.limitReached
                        ? 'bg-red-50 border border-red-200'
                        : betaStatus.spotsRemaining <= 5
                            ? 'bg-yellow-50 border border-yellow-200'
                            : 'bg-blue-50 border border-blue-200'
                    }`}>
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {betaStatus.limitReached ? (
                                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className={`text-sm font-medium ${betaStatus.limitReached
                                    ? 'text-red-800'
                                    : betaStatus.spotsRemaining <= 5
                                        ? 'text-yellow-800'
                                        : 'text-blue-800'
                                }`}>
                                {betaStatus.limitReached ? '🔒 Beta Limit Reached' : '🚀 Beta Testing Active'}
                            </h3>
                            <div className={`mt-2 text-sm ${betaStatus.limitReached
                                    ? 'text-red-700'
                                    : betaStatus.spotsRemaining <= 5
                                        ? 'text-yellow-700'
                                        : 'text-blue-700'
                                }`}>
                                <p>
                                    <strong>{betaStatus.currentUsers}</strong> of <strong>{betaStatus.maxUsers}</strong> beta spots filled
                                    {betaStatus.limitReached ? ' - New signups are blocked' : ` - ${betaStatus.spotsRemaining} spots remaining`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 bg-${stat.color}-100 rounded-md p-3`}>
                                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-sm text-gray-500">{stat.change}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <MetricCard title="User Activity">
                    <div className="space-y-2">
                        <MetricRow label="New today" value={metrics.newUsersToday} />
                        <MetricRow label="New this week" value={metrics.newUsersThisWeek} />
                        <MetricRow label="Active (7d)" value={metrics.activeUsers7d} />
                    </div>
                </MetricCard>

                <MetricCard title="Card Creation">
                    <div className="space-y-2">
                        <MetricRow label="Created today" value={metrics.cardsCreatedToday} />
                        <MetricRow label="Created this week" value={metrics.cardsCreatedThisWeek} />
                        <MetricRow label="Avg per user" value={(metrics.totalCards / metrics.totalUsers).toFixed(1)} />
                    </div>
                </MetricCard>

                <MetricCard title="Subscription Metrics">
                    <div className="space-y-2">
                        <MetricRow label="Free users" value={metrics.freeUsers} />
                        <MetricRow label="Paid users" value={metrics.paidUsers} />
                        <MetricRow label="MRR" value={`$${metrics.mrr.toFixed(2)}`} />
                    </div>
                </MetricCard>
            </div>
        </div>
    );
}

// Users Tab Component
function UsersTab({
    users,
    searchTerm,
    setSearchTerm
}: {
    users: UserListItem[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}) {
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow">
                <input
                    type="text"
                    placeholder="Search users by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Users Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cards</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{user.full_name || 'No name'}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.total_cards}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.subscription_status === 'paid'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.subscription_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.last_active ? new Date(user.last_active).toLocaleDateString() : 'Never'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Cards Tab Component
function CardsTab({ cards }: { cards: CardListItem[] }) {
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {cards.map((card) => (
                        <tr key={card.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{card.name}</div>
                                    <div className="text-sm text-gray-500">/{card.slug}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm text-gray-900">{card.owner_name}</div>
                                    <div className="text-sm text-gray-500">{card.owner_email}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(card.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${card.is_published
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {card.is_published ? 'Published' : 'Draft'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {card.views_count}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Engagement Tab Component
function EngagementTab({ engagement }: { engagement: EngagementMetrics | null }) {
    if (!engagement) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <MetricCard title="Total Views">
                    <div className="text-3xl font-bold text-gray-900">{engagement.totalViews}</div>
                </MetricCard>

                <MetricCard title="Daily Active Users">
                    <div className="text-3xl font-bold text-gray-900">{engagement.dailyActiveUsers}</div>
                </MetricCard>

                <MetricCard title="Weekly Active Users">
                    <div className="text-3xl font-bold text-gray-900">{engagement.weeklyActiveUsers}</div>
                </MetricCard>
            </div>

            {/* Top Cards */}
            <MetricCard title="Top Cards by Views">
                <div className="space-y-2">
                    {engagement.topCards.map((card, idx) => (
                        <div key={card.slug} className="flex justify-between items-center py-2 border-b last:border-0">
                            <div>
                                <span className="text-sm font-medium text-gray-900">#{idx + 1} {card.name}</span>
                                <span className="text-xs text-gray-500 ml-2">/{card.slug}</span>
                            </div>
                            <span className="text-sm font-semibold text-blue-600">{card.views} views</span>
                        </div>
                    ))}
                </div>
            </MetricCard>

            {/* Views Chart */}
            <MetricCard title="Views This Week">
                <div className="space-y-1">
                    {engagement.viewsThisWeek.map((day) => (
                        <div key={day.date} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-24">{new Date(day.date).toLocaleDateString()}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                <div
                                    className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                                    style={{ width: `${Math.min((day.count / Math.max(...engagement.viewsThisWeek.map(d => d.count))) * 100, 100)}%` }}
                                >
                                    <span className="text-xs text-white font-semibold">{day.count}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </MetricCard>
        </div>
    );
}

// Growth Tab Component
function GrowthTab({ growth }: { growth: GrowthMetrics | null }) {
    if (!growth) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <MetricCard title="Avg Cards per User">
                    <div className="text-3xl font-bold text-gray-900">{growth.avgCardsPerUser}</div>
                </MetricCard>

                <MetricCard title="Conversion Rate">
                    <div className="text-3xl font-bold text-gray-900">{growth.conversionRate}%</div>
                </MetricCard>
            </div>

            <MetricCard title="User Growth (Last 30 Days)">
                <div className="space-y-1">
                    {growth.userGrowth.slice(-14).map((day) => (
                        <div key={day.date} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-24">{new Date(day.date).toLocaleDateString()}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                <div
                                    className="bg-green-600 h-6 rounded-full flex items-center justify-end pr-2"
                                    style={{ width: `${Math.min((day.count / Math.max(...growth.userGrowth.map(d => d.count))) * 100, 100)}%` }}
                                >
                                    <span className="text-xs text-white font-semibold">{day.count}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </MetricCard>

            <MetricCard title="Card Growth (Last 30 Days)">
                <div className="space-y-1">
                    {growth.cardGrowth.slice(-14).map((day) => (
                        <div key={day.date} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-24">{new Date(day.date).toLocaleDateString()}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                <div
                                    className="bg-purple-600 h-6 rounded-full flex items-center justify-end pr-2"
                                    style={{ width: `${Math.min((day.count / Math.max(...growth.cardGrowth.map(d => d.count))) * 100, 100)}%` }}
                                >
                                    <span className="text-xs text-white font-semibold">{day.count}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </MetricCard>
        </div>
    );
}

// Helper Components
function MetricCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
            {children}
        </div>
    );
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{label}</span>
            <span className="text-sm font-semibold text-gray-900">{value}</span>
        </div>
    );
}
