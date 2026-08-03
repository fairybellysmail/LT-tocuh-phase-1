import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Globe, Loader2, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface ImpactTier {
  id: string;
  livesLabel: string;
  livesCount: number | string;
  description: string;
  popular?: boolean;
}

const IMPACT_TIERS: ImpactTier[] = [
  {
    id: '10',
    livesLabel: '10 Lives',
    livesCount: 10,
    description: 'Provide emergency food and basic health kits for 10 individuals.',
  },
  {
    id: '100',
    livesLabel: '100 Lives',
    livesCount: 100,
    description: 'Empower a whole neighborhood with clean water and primary care.',
    popular: true,
  },
  {
    id: '1000',
    livesLabel: '1,000 Lives',
    livesCount: 1000,
    description: 'Sponsor scalable health, shelter, and education programs across a village.',
  },
  {
    id: '10000',
    livesLabel: '10,000+ Lives',
    livesCount: '10,000+',
    description: 'Transform entire regional health and community protection networks.',
  },
];

export default function DonatePage() {
  const [selectedTierId, setSelectedTierId] = useState<string>('100');
  const [customLives, setCustomLives] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const impactStats = [
    { icon: <Heart className="h-6 w-6 text-brand-primary" />, label: "Lives Impacted", value: "10,000+" },
    { icon: <Globe className="h-6 w-6 text-brand-primary" />, label: "Communities Reached", value: "50+" },
    { icon: <ShieldCheck className="h-6 w-6 text-brand-primary" />, label: "Transparency Score", value: "100%" },
  ];

  // Selected tier helper
  const selectedTier = IMPACT_TIERS.find((t) => t.id === selectedTierId);

  // Compute active lives text
  let activeLivesText = selectedTier ? selectedTier.livesLabel : 'Custom Impact';
  let activeLivesCount = selectedTier ? selectedTier.livesCount : 100;

  if (customLives) {
    const numLives = parseInt(customLives, 10);
    if (!isNaN(numLives) && numLives > 0) {
      activeLivesText = `${numLives.toLocaleString()} Lives`;
      activeLivesCount = numLives;
    }
  }

  const handleDonate = async () => {
    setIsLoading(true);
    setError(null);

    // Compute backend contribution amount silently without showing any pricing to the user
    const internalAmount = typeof activeLivesCount === 'number' ? Math.max(10, activeLivesCount) : 100;

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: internalAmount,
          lives: activeLivesText,
          description: `LiftersTouch Contribution intended to save and impact ${activeLivesText}`
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize.');
      }

      const { error: stripeError } = await (stripe as any).redirectToCheckout({
        sessionId: session.id,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err: any) {
      console.error('Donation error:', err);
      setError(err.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container-page">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            Support Our <span className="text-brand-primary">Mission</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-brand-muted"
          >
            Your contribution directly empowers, protects, and transforms human lives. Choose how many lives you intend to save today.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Donation / Impact Selection Form */}
          <div className="lg:col-span-2 card p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">Select Intended Lives to Save</h3>
                <p className="text-sm text-brand-muted mt-1">
                  Pick a direct impact tier or enter a custom number of lives.
                </p>
              </div>
              <Sparkles className="h-6 w-6 text-brand-accent hidden sm:block" />
            </div>

            {/* Impact Tiers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {IMPACT_TIERS.map((tier) => {
                const isSelected = selectedTierId === tier.id && !customLives;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      setSelectedTierId(tier.id);
                      setCustomLives('');
                    }}
                    className={`relative p-5 text-left rounded-brand border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-brand-primary bg-brand-alt-bg/60 shadow-md ring-1 ring-brand-primary/30'
                        : 'border-black/5 hover:border-brand-primary/40 bg-white'
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-3 right-4 px-2.5 py-0.5 bg-brand-accent text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                        Most Popular
                      </span>
                    )}

                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className={`h-5 w-5 ${isSelected ? 'text-brand-primary' : 'text-brand-muted'}`} />
                        <span className="text-xl font-bold text-brand-text">
                          {tier.livesLabel}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-brand-muted leading-relaxed">
                      {tier.description}
                    </p>

                    {isSelected && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-primary">
                        <CheckCircle2 className="h-4 w-4" /> Selected Goal
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Impact Goal Input */}
            <div className="p-5 bg-black/5 rounded-brand mb-8 space-y-4">
              <h4 className="text-sm font-bold text-brand-text">Or Enter Custom Impact Goal</h4>
              <div>
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">
                  Custom Number of Lives
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={customLives}
                    onChange={(e) => { 
                      setCustomLives(e.target.value); 
                      setSelectedTierId('');
                    }}
                    className="w-full px-4 py-2.5 bg-white rounded-brand border border-black/10 focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm font-semibold" 
                    placeholder="e.g. 500 lives" 
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Selected Impact Summary Box */}
            <div className="p-4 mb-8 bg-brand-primary/10 border border-brand-primary/20 rounded-brand flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary block mb-0.5">
                  Your Impact Commitment
                </span>
                <p className="text-lg font-extrabold text-brand-text">
                  Save {activeLivesText}
                </p>
              </div>
              <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
                <CheckCircle2 className="h-5 w-5" /> Ready to Support
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-brand text-sm font-medium">
                {error}
              </div>
            )}

            <button 
              onClick={handleDonate}
              disabled={isLoading}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connecting to Secure Payment...
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5 fill-current" />
                  Proceed to Support {activeLivesText}
                </>
              )}
            </button>
            <p className="mt-4 text-center text-sm text-brand-muted">
              100% Secure contribution processing. Direct community impact.
            </p>
          </div>

          {/* Impact Sidebar */}
          <div className="space-y-8">
            <div className="card p-6 bg-brand-alt-bg border-none">
              <h4 className="mb-4">Why Support Us?</h4>
              <div className="space-y-6">
                {impactStats.map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-xs text-brand-muted uppercase tracking-wider font-bold">{stat.label}</p>
                      <p className="text-lg font-bold">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card p-6 border-brand-primary/20">
              <h4 className="mb-2">Ongoing Impact Giving</h4>
              <p className="text-sm text-brand-muted mb-4">
                Join our "Lifters Circle" by setting up recurring community support.
              </p>
              <button 
                className="btn-secondary w-full"
                onClick={() => alert('Ongoing support is currently being set up. Please contact us for details.')}
              >
                Set Up Recurring Impact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
