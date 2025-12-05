import Link from "next/link";
import { ArrowRight, Zap, Share2, Sparkles, Check } from 'lucide-react';
import { Button } from "@/components/molecules/Button";
import { Navbar } from "@/components/organisms/Navbar";

export default function Home() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Create in 1 Minute',
      description: 'Build your professional digital card in under 60 seconds'
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Share with Link or QR',
      description: 'Share instantly via unique link or downloadable QR code'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Clean, Premium Design',
      description: 'Beautiful templates that make you look professional'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      features: [
        'One digital card',
        'Basic themes',
        'QR code generation',
        'Unlimited shares',
        'SmartShare branding'
      ]
    },
    {
      name: 'Pro',
      price: '$9',
      period: '/month',
      features: [
        'Unlimited cards',
        'All premium themes',
        'Remove branding',
        'Analytics dashboard',
        'Custom domains',
        'Priority support'
      ],
      highlighted: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="mb-6">
                Your Professional Digital Business Card
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Create, customize, and share beautiful digital business cards in seconds. Modern, minimal, and made for professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg">
                    Create Card Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8 md:p-12">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm mx-auto">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mb-4" />
                    <h3 className="text-xl font-semibold mb-2">John Doe</h3>
                    <p className="text-muted-foreground mb-1">Product Designer</p>
                    <p className="text-muted-foreground text-sm">Tech Company</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4">Everything you need to stand out</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional features designed to help you make the best first impression
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-3xl p-8 ${plan.highlighted
                  ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-2xl scale-105'
                  : 'bg-card border-2 border-border'
                  }`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${!plan.highlighted && 'text-foreground'}`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className={`text-lg ${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 ${plan.highlighted ? 'text-primary-foreground' : 'text-primary'}`} />
                      <span className={plan.highlighted ? 'text-primary-foreground/90' : 'text-foreground'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button
                    fullWidth
                    variant={plan.highlighted ? 'secondary' : 'primary'}
                    size="lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-foreground text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-primary-foreground mb-6">Ready to create your digital card?</h2>
          <p className="text-xl text-muted-foreground/80 mb-8">
            Join thousands of professionals using SmartShare to grow their network
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="text-muted-foreground">© 2025 SmartShare. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
