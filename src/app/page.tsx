'use client';

import Link from "next/link";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Navbar } from "@/components/organisms/Navbar";
import { HeroMockup } from "@/components/landing/HeroMockup";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { UseCaseCards } from "@/components/landing/UseCaseCards";
import { PricingSimple } from "@/components/landing/PricingSimple";
import { SocialProof } from "@/components/landing/SocialProof";

export default function Home() {
  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950">
      <Navbar isLandingPage={true} />

      {/* 1. Hero Section - "Quiet Confidence" */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              {/* Tagline */}
              <span className="tagline mb-6 block dark:text-neutral-400">PROFESSIONAL IDENTITY</span>

              {/* Headline */}
              <h1 className="mb-6 text-neutral-900 dark:text-white">
                Your professional identity, in one link.
              </h1>

              {/* Subtext */}
              <p className="text-xl text-secondary dark:text-neutral-400 mb-8 leading-relaxed">
                Replace Scattered PDFs and links with a single, permanent profile. Your work, contact details, and portfolio links in one place.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <button className="btn-primary dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100">
                    Create your profile
                  </button>
                </Link>
                <Link href="#" className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white font-medium flex items-center gap-2 transition-colors">
                  View example
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </div>
            </motion.div>

            {/* Right - Mockup */}
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* 2. Before & After Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-neutral-900 dark:text-white">From scattered links to one profile</h2>
          </motion.div>
          <BeforeAfter />
        </div>
      </section>

      {/* 3. Features Grid - "Premium Tool" Vibe */}
      <section className="py-24 px-6 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-neutral-900 dark:text-white">Designed for professional visibility</h2>
            <p className="text-xl text-secondary dark:text-neutral-400 max-w-2xl mx-auto">
              Everything required to represent yourself clearly and professionally.
            </p>
          </motion.div>
          <FeatureGrid />
        </div>
      </section>

      {/* 4. Segmentation - Use Cases */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-neutral-900 dark:text-white">Built for the serious.</h2>
          </motion.div>
          <UseCaseCards />
        </div>
      </section>

      {/* 5. Pricing */}
      <section className="py-24 px-6 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-neutral-900 dark:text-white">Simple, transparent pricing</h2>
          </motion.div>
          <PricingSimple />
        </div>
      </section>

      {/* 6. Social Proof */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <SocialProof />
        </div>
      </section>

      {/* 7. Final CTA - "The Closer" */}
      <section className="py-24 px-6 bg-neutral-900 dark:bg-neutral-950 border-t border-neutral-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-white mb-6">
              Be visible. Be credible. Be remembered.
            </h2>
            <p className="text-xl text-neutral-300 dark:text-neutral-400 mb-8">
              It takes 2 minutes to look professional.
            </p>
            <Link href="/signup">
              <button className="bg-white text-neutral-900 hover:bg-neutral-100 px-8 py-4 rounded-md font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-98">
                Claim your username
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12 px-6 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-neutral-900 text-sm font-bold">S</span>
              </div>
              <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                © 2025 SmartShare. All rights reserved.
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
    </div>
  );
}
