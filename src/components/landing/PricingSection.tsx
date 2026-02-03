'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import Script from 'next/script';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'sonner';
import { loadRazorpayScript } from '@/lib/razorpay';

import { ComparisonTable } from './ComparisonTable';

interface PricingSectionProps {
    user: any;
    onLoginClick: () => void;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

// Helper Component (Outside to prevent re-renders)
const PlanCardComponent = ({ plan, type, isCurrent, isUpgrade, buttonText, onAction, loading, lifetimeStatus }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={`rounded-[2rem] p-4 shadow-xl border flex flex-col relative ${type === 'LIFETIME' || isUpgrade
            ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-2xl z-10'
            : 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800'
            }`}
    >
        {(isUpgrade || type === 'LIFETIME') && (
            <div className="absolute -top-4 right-8 bg-[#171717] dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-lg z-10">
                {type === 'LIFETIME' ? 'BEST VALUE' : 'RECOMMENDED'}
            </div>
        )}

        {/* Header */}
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-[1.5rem] p-8 mb-6 text-center relative overflow-hidden">
            {type === 'LIFETIME' && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-50"></div>
            )}
            <span className="inline-block px-4 py-1.5 bg-white dark:bg-neutral-700 rounded-full text-sm font-semibold mb-4 text-neutral-600 dark:text-neutral-300 shadow-sm">
                {plan?.name || (type === 'FREE' ? 'Basic' : type === 'LIFETIME' ? 'Lifetime' : 'Pro')}
            </span>
            <div className="flex items-center justify-center gap-2 flex-wrap">
                {plan?.original_price_inr && (
                    <span className="text-2xl text-neutral-400 line-through">₹{plan.original_price_inr}</span>
                )}
                <span className="text-5xl font-bold text-neutral-900 dark:text-white">
                    ₹{plan?.price_inr !== undefined ? plan.price_inr : (type === 'FREE' ? 0 : 399)}
                </span>
                <span className="text-neutral-500 text-lg">
                    {type === 'FREE' ? '/forever' : type === 'LIFETIME' ? ' one-time' : `/${type === 'MONTHLY' ? 'mo' : 'yr'}`}
                </span>
            </div>
            {type === 'LIFETIME' && (
                <div className="mt-2 text-xs font-mono text-neutral-500">
                    {lifetimeStatus?.remaining} SPOTS LEFT
                </div>
            )}
        </div>

        {/* Features */}
        <div className="px-4 flex-grow">
            <ul className="space-y-4 mb-8">
                {(plan?.features || ['Feature 1', 'Feature 2']).map((f: string) => (
                    <li key={f} className="flex gap-3 text-neutral-600 dark:text-neutral-400">
                        <Check className="w-5 h-5 text-neutral-900 dark:text-white flex-shrink-0" /> {f}
                    </li>
                ))}
            </ul>
        </div>

        {/* Button */}
        <div className="px-4 pb-4">
            <button
                onClick={onAction}
                disabled={isCurrent || !!loading}
                className={`w-full py-4 font-bold text-lg rounded-xl transition-all shadow-lg text-center
                        ${isCurrent
                        ? 'bg-neutral-100 text-neutral-400 cursor-default border border-neutral-200'
                        : 'bg-[#171717] dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-[0.98]'
                    }
                    `}
            >
                {loading === type ? 'Processing...' : buttonText || (isCurrent ? 'Current Plan' : 'Get Started')}
            </button>
        </div>
    </motion.div>
);

export function PricingSection({ user, onLoginClick }: PricingSectionProps) {
    const [plans, setPlans] = useState<any[]>([]);
    const [lifetimeStatus, setLifetimeStatus] = useState<{
        count: number;
        isSoldOut: boolean;
        remaining: number;
    } | null>(null);
    const [loading, setLoading] = useState<string | null>(null);

    const [userPlanType, setUserPlanType] = useState<'FREE' | 'MONTHLY' | 'YEARLY' | 'LIFETIME' | null>(null);

    // Initial Data Fetch (Run once)
    useEffect(() => {
        fetchLifetimeStatus();
        fetchPlans();
    }, []);

    // User Subscription Fetch (Run when user changes)
    useEffect(() => {
        if (user?.id) {
            fetchUserSubscription();
        } else {
            setUserPlanType('FREE');
        }
    }, [user?.id]);

    async function fetchLifetimeStatus() {
        try {
            const data = await apiClient.get<any>('/api/payments/lifetime/status');
            setLifetimeStatus(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchPlans() {
        try {
            const data = await apiClient.get<any[]>('/api/payments/plans');
            if (data) setPlans(data);
        } catch (err) {
            console.error("Failed to fetch plans:", err);
        }
    }

    async function fetchUserSubscription() {
        try {
            const data = await apiClient.get<{ plan_type: 'FREE' | 'MONTHLY' | 'YEARLY' | 'LIFETIME' }>('/api/payments/subscription');
            setUserPlanType(data?.plan_type || 'FREE');
        } catch (err) {
            console.error("Failed to fetch subscription:", err);
            // Default to FREE if error (e.g. auth error or network)
            setUserPlanType('FREE');
        }
    }

    // ... imports

    const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');

    // ... fetch logic exists ...

    const handlePayment = async (planType: 'LIFETIME' | 'MONTHLY' | 'YEARLY', planCode?: string) => {
        // ... existing payment logic ...
        // (Keeping the existing handlePayment implementation as is, just ensure it handles the toggle state if needed)
        // Actually, I need to copy the full handlePayment logic because I'm replacing the whole component body effectively.
        // Wait, I can't just copy "..." in the tool.
        // I will reimplement handlePayment fully in the replacement string to be safe, or just target the return statement + state additions?
        // The user wants a TOGGLE. 

        if (!user) {
            onLoginClick();
            return;
        }

        // Prevent redundant payment (Basic check, backend has stronger check)
        if (userPlanType === planType) {
            toast.info("You are already on this plan.");
            return;
        }

        setLoading(planType);

        try {
            // Load Razorpay Script if not present
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error("Failed to load payment gateway. Please check your connection.");
                setLoading(null);
                return;
            }

            if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
                console.error("❌ Missing Razorpay Key ID");
                toast.error("Configuration Error: Payment Key Missing");
                setLoading(null);
                return;
            }

            if (planType === 'LIFETIME') {
                const order: any = await apiClient.post('/api/payments/lifetime/order', {});
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: order.amount,
                    currency: order.currency,
                    name: "Cardfil",
                    description: "Lifetime Access",
                    image: "https://placehold.co/400x400/171717/ffffff?text=C",
                    order_id: order.id,
                    handler: async function (response: any) {
                        try {
                            await apiClient.post('/api/payments/lifetime/verify', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });
                            toast.success("Lifetime access activated! 🎉");
                            window.location.reload();
                        } catch (err) {
                            toast.error("Payment verification failed");
                        }
                    },
                    prefill: { name: user.user_metadata?.full_name, email: user.email },
                    theme: { color: "#171717" },
                    modal: { backdropclose: false, escape: true, handleback: true, confirm_close: true, animation: true }
                };
                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            } else {
                if (!planCode) return;
                const sub: any = await apiClient.post('/api/subscriptions/create', { plan_code: planCode });
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    subscription_id: sub.id,
                    name: "Cardfil Premium",
                    description: planType === 'MONTHLY' ? "Monthly Subscription" : "Yearly Subscription",
                    image: "https://placehold.co/400x400/171717/ffffff?text=C",
                    handler: async function (response: any) {
                        toast.success("Subscription activated! check dashboard.");
                        window.location.reload();
                    },
                    prefill: { name: user.user_metadata?.full_name, email: user.email },
                    theme: { color: "#171717" }
                };
                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Payment initialization failed");
        } finally {
            setLoading(null);
        }
    };

    const isLifetimeAvailable = !lifetimeStatus?.isSoldOut && (lifetimeStatus?.remaining ?? 0) > 0;

    // Plans Data
    const lifetimePlan = plans.find(p => (p.billing_cycle === 'ONE_TIME' || p.code.includes('LIFETIME')) && p.code !== 'FREE');
    const freePlan = plans.find(p => p.code === 'FREE') || { name: 'Basic Plan', price_inr: 0, features: [] };
    const monthlyPlan = plans.find(p => p.billing_cycle === 'MONTHLY' && p.code !== 'FREE');
    const yearlyPlan = plans.find(p => p.billing_cycle === 'YEARLY' && p.code !== 'FREE');



    const renderContent = () => {
        // --- CASE 1: LIFETIME SUBSCRIBER ---
        if (userPlanType === 'LIFETIME') {
            return (
                <div className="max-w-md mx-auto">
                    <PlanCardComponent
                        plan={lifetimePlan}
                        type="LIFETIME"
                        isCurrent={true}
                        isUpgrade={false}
                        loading={loading}
                        lifetimeStatus={lifetimeStatus} />
                </div>
            );
        }

        // --- CASE 2: YEARLY SUBSCRIBER ---
        if (userPlanType === 'YEARLY') {
            return (
                <div className="max-w-md mx-auto">
                    <PlanCardComponent
                        plan={yearlyPlan}
                        type="YEARLY"
                        isCurrent={true}
                        isUpgrade={false}
                        loading={loading}
                        lifetimeStatus={lifetimeStatus} />
                </div>
            );
        }

        // --- CASE 3: MONTHLY SUBSCRIBER ---
        if (userPlanType === 'MONTHLY') {
            return (
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                    <PlanCardComponent
                        plan={monthlyPlan}
                        type="MONTHLY"
                        isCurrent={true}
                        isUpgrade={false}
                        buttonText="Current Plan"
                        loading={loading}
                        lifetimeStatus={lifetimeStatus}
                    />
                    <PlanCardComponent
                        plan={yearlyPlan}
                        type="YEARLY"
                        isCurrent={false}
                        isUpgrade={true}
                        buttonText="Upgrade to Yearly"
                        onAction={() => handlePayment('YEARLY', yearlyPlan?.code)}
                        loading={loading}
                        lifetimeStatus={lifetimeStatus}
                    />
                </div>
            );
        }

        // --- CASE 4: FREE / NO PLAN (Standard vs Exclusive Logic) ---
        // "when user is not subscribed... show basic plan (Current)"

        if (isLifetimeAvailable) {
            // Lifetime Exclusive View
            return (
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                    <PlanCardComponent
                        plan={freePlan}
                        type="FREE"
                        isCurrent={true}
                        isUpgrade={false}
                        loading={loading}
                        lifetimeStatus={lifetimeStatus}
                    />
                    <PlanCardComponent
                        plan={lifetimePlan}
                        type="LIFETIME"
                        isCurrent={false}
                        isUpgrade={true}
                        buttonText="Get Lifetime Access"
                        onAction={() => handlePayment('LIFETIME')}
                        loading={loading}
                        lifetimeStatus={lifetimeStatus}
                    />
                </div>
            );
        } else {
            // Standard View (Free + Pro Toggle)
            const displayedProPlan = billingCycle === 'MONTHLY' ? monthlyPlan : yearlyPlan;

            return (
                <div>
                    <div className="flex justify-center mb-12">
                        <div className="bg-neutral-100 dark:bg-neutral-900 p-1 rounded-full inline-flex relative border border-neutral-200 dark:border-neutral-800">
                            <div
                                className={`absolute inset-y-1 rounded-full bg-white dark:bg-neutral-800 shadow-sm transition-all duration-300 ease-out`}
                                style={{
                                    left: billingCycle === 'MONTHLY' ? '4px' : '50%',
                                    width: 'calc(50% - 4px)'
                                }}
                            />
                            <button
                                onClick={() => setBillingCycle('MONTHLY')}
                                className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors ${billingCycle === 'MONTHLY' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('YEARLY')}
                                className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors ${billingCycle === 'YEARLY' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700'}`}
                            >
                                Yearly <span className="text-[10px] text-green-500 font-bold ml-1">-20%</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                        <PlanCardComponent
                            plan={freePlan}
                            type="FREE"
                            isCurrent={true}
                            isUpgrade={false}
                            loading={loading}
                            lifetimeStatus={lifetimeStatus}
                        />
                        <PlanCardComponent
                            plan={displayedProPlan}
                            type={billingCycle}
                            isCurrent={false}
                            isUpgrade={true}
                            buttonText={`Upgrade to ${billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly'}`}
                            onAction={() => handlePayment(billingCycle, displayedProPlan?.code)}
                            loading={loading}
                            lifetimeStatus={lifetimeStatus}
                        />
                    </div>
                </div>
            );
        }
    };


    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />

            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-neutral-900 dark:text-white tracking-tight">
                    {userPlanType === 'LIFETIME' ? "Welcome to the Club" :
                        isLifetimeAvailable && userPlanType === 'FREE' ? "Exclusive Early Access" : "Simple, Transparent Pricing"}
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                    {userPlanType === 'LIFETIME' ? "You have lifetime access to all features." :
                        userPlanType === 'YEARLY' || userPlanType === 'MONTHLY' ? "Manage your subscription below." :
                            isLifetimeAvailable
                                ? "Join the founders club. Pay once, own it forever. Limited spots available."
                                : "Choose the plan that fits your needs. Upgrade anytime."}
                </p>
            </div>

            {renderContent()}
            <p className="text-center text-xs text-neutral-400 mt-12 flex items-center justify-center gap-1">
                Free helps you share. Pro helps you convert.
            </p>
            <ComparisonTable />


            <p className="text-center text-xs text-neutral-400 mt-12 flex items-center justify-center gap-1">
                <Info className="w-3 h-3" /> Secure payment via Razorpay. Backend verified.
            </p>
        </div>
    );
}
