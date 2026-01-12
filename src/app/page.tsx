'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Navbar } from "@/components/organisms/Navbar";
import { CardPreview } from "@/components/CardPreview";
import { HeroMockup } from "@/components/landing/HeroMockup";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { DetailedFeatures } from "@/components/landing/DetailedFeatures";
import { UseCaseCards } from "@/components/landing/UseCaseCards";
import { PricingSimple } from "@/components/landing/PricingSimple";
import { PricingSection } from "@/components/landing/PricingSection";
import { AuthModal } from '@/components/auth/AuthModal';
import { apiClient } from '@/lib/apiClient';
// import { SocialProof } from "@/components/landing/SocialProof";

const SAMPLE_CARDS = [
  {
    id: 'alex',
    slug: 'alex-rivera',
    name: 'Alex Rivera',
    title: 'Senior Product Designer',
    company: 'Design Co.',
    about: 'Senior product designer focused on building intuitive and scalable digital products across web and mobile platforms.',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60',
    theme: {
      name: 'dark',
      color: '#171717',
      shape: 'geometric',
      dividerColor: '#171717'
    },
    custom_data: {
      domain: 'Product & UX',
      additional_links: [
        { label: 'Behance', url: '#' },
        { label: 'Dribbble', url: '#' }
      ],
      custom_highlights: [
        { label: 'Projects', value: '50+' }
      ],
      cta_button: {
        text: 'Book Consultation',
        link: '#'
      }
    }
  },

  {
    id: 'priya',
    slug: 'priya-sharma',
    name: 'Priya Sharma',
    title: 'Computer Science Undergraduate',
    company: 'Stanford University',
    about: 'Computer science undergraduate with a strong interest in software engineering and applied machine learning.',
    email: 'priya@edu.com',
    phone: '+1 (555) 987-6543',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60',
    theme: {
      name: 'light',
      color: '#3b82f6',
      shape: 'wave',
      dividerColor: '#3b82f6'
    },
    custom_data: {
      domain: 'Computer Science',
      additional_links: [
        { label: 'GitHub', url: '#' },
        { label: 'LinkedIn', url: '#' }
      ],
      custom_highlights: [
        { label: 'GPA', value: '3.9' }
      ],
      cta_button: {
        text: 'View Resume',
        link: '#'
      }
    }
  },

  {
    id: 'james',
    slug: 'james-wilson',
    name: 'James Wilson',
    title: 'Luxury Real Estate Agent',
    company: 'Prime Properties',
    about: 'Luxury real estate agent specializing in high-value residential properties across prime urban locations.',
    email: 'james@prime.com',
    phone: '+1 (555) 246-8135',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60',
    theme: {
      name: 'neutral',
      color: '#1e293b',
      shape: 'slant',
      dividerColor: '#1e293b'
    },
    custom_data: {
      domain: 'Real Estate',
      additional_links: [
        { label: 'Website', url: '#' },
        { label: 'Instagram', url: '#' }
      ],
      custom_highlights: [
        { label: 'Sales Volume', value: '$50M+' }
      ],
      cta_button: {
        text: 'Schedule Viewing',
        link: '#'
      }
    }
  },

  {
    id: 'sarah',
    slug: 'sarah-chen',
    name: 'Sarah Chen',
    title: 'Founder & CEO',
    company: 'Nexus AI',
    about: 'Founder at Nexus AI, building generative AI tools used by teams across product, research, and operations.',
    email: 'sarah@nexus.ai',
    phone: '+1 (555) 369-2580',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60',
    theme: {
      name: 'accent',
      color: '#000000',
      shape: 'layered-waves',
      dividerColor: '#000000'
    },
    custom_data: {
      domain: 'Technology',
      additional_links: [
        { label: 'LinkedIn', url: '#' },
        { label: 'Twitter', url: '#' }
      ],
      custom_highlights: [
        { label: 'Users', value: '100k+' },
        { label: 'Recognition', value: 'Forbes 30 Under 30' }
      ],
      cta_button: {
        text: 'Join Waitlist',
        link: '#'
      }
    }
  }
];




export default function Home() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [betaStatus, setBetaStatus] = useState<{
    isBetaMode: boolean;
    limitReached: boolean;
    spotsRemaining: number;
    maxUsers: number | null;
  } | null>(null);
  const [betaLoading, setBetaLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % SAMPLE_CARDS.length);
    }, 4000); // 4 seconds per card

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    checkBetaStatus();
    checkUserStatus();
  }, []);

  async function checkUserStatus() {
    try {
      const userData = await apiClient.get<any>('/api/v1/auth/me');
      setUser(userData);
    } catch (err) {
      // User not logged in
    }
  }

  async function checkBetaStatus() {
    try {
      const status = await apiClient.get<{
        isBetaMode: boolean;
        maxUsers: number | null;
        currentUsers: number;
        spotsRemaining: number;
        limitReached: boolean;
      }>('/api/v1/beta/status');
      setBetaStatus(status);
    } catch (error) {
      console.error('Failed to check beta status:', error);
      setBetaStatus({ isBetaMode: false, limitReached: false, spotsRemaining: 0, maxUsers: null });
    } finally {
      setBetaLoading(false);
    }
  }

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openSignup = () => {
    if (betaStatus?.isBetaMode && betaStatus.limitReached) {
      // Redirect to beta-limit page instead of opening auth modal
      window.location.href = '/beta-limit';
      return;
    }
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">

      <Navbar
        isLandingPage={true}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />

      {/* 1. Hero Section - "Quiet Confidence" */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-24 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
            >
              {/* Tagline */}
              <span className="tagline mb-4 md:mb-6 block dark:text-neutral-400 text-sm md:text-base">BEYOND A BUSINESS CARD</span>

              {/* Headline */}
              <h1 className="mb-4 md:mb-6 text-neutral-900 dark:text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                Don't just share details.<br />Capture the interest.
              </h1>

              {/* Subtext */}
              <p className="text-lg md:text-xl text-secondary dark:text-neutral-400 mb-6 md:mb-8 leading-relaxed">
                The post-meeting interaction is where opportunities are lost. Cardfil ensures you're saved instantly and gives you visibility into who's actually looking.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {betaLoading ? (
                  <div className="w-full sm:w-auto px-8 py-3 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse">
                    <span className="invisible">Loading...</span>
                  </div>
                ) : betaStatus?.isBetaMode && betaStatus.limitReached ? (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => window.location.href = '/beta-limit'}
                      className="btn-primary dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-700 w-full sm:w-auto"
                    >
                      Join Waitlist
                    </button>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 text-center">
                      All beta spots filled
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (user) {
                          window.location.href = '/mycards';
                        } else {
                          openSignup();
                        }
                      }}
                      className="btn-primary dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 w-full sm:w-auto"
                    >
                      {user ? 'Go to Dashboard' : 'Create your Card'}
                      {!user && betaStatus?.isBetaMode && betaStatus.spotsRemaining <= 5 && !betaStatus.limitReached && (
                        <span className="ml-2 text-xs">({betaStatus.spotsRemaining} left)</span>
                      )}
                    </button>
                    <Link href="/demo/profile-card" className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white font-medium flex items-center justify-center gap-2 transition-colors w-full sm:w-auto py-2">
                      View example
                      <ArrowRight className="w-4 h-4" strokeWidth={2} />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            {/* Mockup - Card Carousel */}
            <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[420px] h-[550px] sm:h-[800px] lg:h-[900px] perspective-1000">
              <div className="scale-[0.9] sm:scale-90 lg:scale-100 origin-top lg:origin-center h-full w-full flex justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={SAMPLE_CARDS[currentCardIndex].id}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute w-full shadow-2xl rounded-3xl"
                    style={{ maxWidth: '400px' }}
                  >
                    <CardPreview
                      card={SAMPLE_CARDS[currentCardIndex] as any}
                      theme={{
                        ...SAMPLE_CARDS[currentCardIndex].theme,
                        profileTheme: SAMPLE_CARDS[currentCardIndex].theme.name
                      }}
                      isPublicView={true}
                      disableFlip={true}
                      disableInteractions={true}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Decorative Elements around the card */}
                <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full opacity-50 dark:opacity-30" />
                <div className="absolute -z-10 -bottom-10 -left-10 w-3/4 h-3/4 bg-blue-500/20 blur-3xl rounded-full opacity-50 dark:opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Before & After Section */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white">Stop losing opportunities to friction</h2>
          </motion.div>
          <BeforeAfter />
        </div>
      </section>

      {/* 3. Features Grid - "Premium Tool" Vibe */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white">Visibility beyond the handshake</h2>
            <p className="text-lg md:text-xl text-secondary dark:text-neutral-400 max-w-2xl mx-auto">
              Don't just hand out a card and hope. Track interest, manage leads, and showcase your best work.
            </p>
          </motion.div>
          <FeatureGrid />
        </div>
      </section>

      {/* 3.5. Deep Dive Features */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <DetailedFeatures />
        </div>
      </section>

      {/* 4. Segmentation - Use Cases */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white">One Card. Multiple Impact.</h2>
          </motion.div>
          <UseCaseCards />
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-neutral-50 dark:bg-neutral-900/50">
        <PricingSection
          user={user}
          onLoginClick={openLogin}
        />
      </section>

      {/* 6. Social Proof */}
      {/* <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <SocialProof />
        </div>
      </section> */}

      {/* 7. Final CTA - "The Closer" */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-neutral-900 dark:bg-neutral-950 border-t border-neutral-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-white mb-6 text-3xl md:text-4xl font-bold">
              Turn your visibility into value.
            </h2>
            <p className="text-lg md:text-xl text-neutral-300 dark:text-neutral-400 mb-8">
              Start tracking your impact today. It takes 2 minutes to look professional.
            </p>
            {betaStatus?.isBetaMode && betaStatus.limitReached ? (
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={() => window.location.href = '/beta-limit'}
                  className="bg-yellow-600 text-white hover:bg-yellow-700 px-8 py-4 rounded-md font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-98 w-full sm:w-auto"
                >
                  Join Waitlist
                </button>
                <p className="text-sm text-neutral-400">
                  Beta testing full - Get notified when we launch
                </p>
              </div>
            ) : (
              <Link href="/signup">
                <button className="bg-white text-neutral-900 hover:bg-neutral-100 px-8 py-4 rounded-md font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-98 w-full sm:w-auto">
                  Claim your username
                  {betaStatus?.isBetaMode && betaStatus.spotsRemaining && betaStatus.spotsRemaining <= 5 && (
                    <span className="ml-2 text-xs text-neutral-600">({betaStatus.spotsRemaining} spots left)</span>
                  )}
                </button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 md:py-12 px-4 md:px-6 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-neutral-900 text-sm font-bold">C</span>
              </div>
              <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                © 2025 Cardfil. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-8">
              <Link
                href="/terms"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm transition-colors font-medium"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm transition-colors font-medium"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
