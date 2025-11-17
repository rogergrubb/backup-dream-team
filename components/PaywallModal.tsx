
import React from 'react';

interface PaywallModalProps {
  onClose: () => void;
  onPurchase: (rounds: number) => void;
  onSubscribe: (tier: 'monthly' | 'yearly') => void;
}

const creditPacks = [
  { rounds: 25, price: 4.99, label: 'Starter' },
  { rounds: 50, price: 8.99, label: 'Basic' },
  { rounds: 100, price: 14.99, label: 'Pro', popular: true },
  { rounds: 500, price: 29.99, label: 'Power User' },
];

const subscriptionPacks = [
  { tier: 'monthly' as const, price: 4.99, label: 'Monthly Unlimited' },
  { tier: 'yearly' as const, price: 24.99, label: 'Yearly Unlimited', popular: true },
]

export const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onPurchase, onSubscribe }) => {
  // Mock handler for Stripe checkout
  const handlePurchaseClick = (rounds: number) => {
    console.log(`Simulating purchase of ${rounds} rounds.`);
    alert(`Thank you for your purchase! ${rounds} rounds have been added to your account. (This is a simulation)`);
    onPurchase(rounds);
  };

  const handleSubscribeClick = (tier: 'monthly' | 'yearly') => {
    console.log(`Simulating subscription to ${tier} plan.`);
    alert(`Thank you for subscribing! Your ${tier} plan is now active. (This is a simulation)`);
    onSubscribe(tier);
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-blue-500/30 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform animate-scale-up">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Unlock Full Potential</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        
        <div className="p-8 overflow-y-auto">
          <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
            You've used your initial free rounds. Choose an option below to continue collaborating with the Dream Team.
          </p>
          
          {/* --- Purchase Rounds Section --- */}
          <div>
            <h3 className="text-xl font-bold text-center text-white mb-2">Purchase Interaction Rounds</h3>
            <p className="text-center text-gray-400 mb-6 text-sm">Pre-paid rounds for immediate use. Rounds do not expire.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {creditPacks.map(pack => (
                <div key={pack.rounds} className={`relative bg-gray-800/50 p-6 rounded-lg border-2 transition-all duration-300 hover:border-blue-500 hover:scale-105 flex flex-col text-center ${pack.popular ? 'border-blue-500' : 'border-gray-700'}`}>
                  {pack.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>
                  )}
                  <h3 className="text-xl font-semibold text-white mt-2">{pack.label}</h3>
                  <p className="text-5xl font-bold text-blue-400 my-4">{pack.rounds}</p>
                  <p className="text-gray-400 mb-6">Rounds</p>
                  <button 
                    onClick={() => handlePurchaseClick(pack.rounds)}
                    className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
                  >
                    Buy for ${pack.price}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="my-10 border-t border-gray-700/50"></div>

          {/* --- Bring Your Own Key Section --- */}
          <div>
            <h3 className="text-xl font-bold text-center text-white mb-2">Or, Bring Your Own API Key</h3>
            <p className="text-center text-gray-400 mb-6 text-sm">Enjoy unlimited usage of our collaborative tools. You only pay for your own API key usage with your provider.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {subscriptionPacks.map(pack => (
                    <div key={pack.tier} className={`relative bg-gray-800/50 p-6 rounded-lg border-2 transition-all duration-300 hover:border-purple-500 hover:scale-105 flex flex-col text-center ${pack.popular ? 'border-purple-500' : 'border-gray-700'}`}>
                        {pack.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Best Value</div>
                        )}
                        <h3 className="text-xl font-semibold text-white mt-2">{pack.label}</h3>
                        <p className="text-gray-400 my-4">Get unlimited access to our collaboration, transcription, and AI management technology.</p>
                        <button 
                            onClick={() => handleSubscribeClick(pack.tier)}
                            className="mt-auto w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
                        >
                            Subscribe for ${pack.price}
                        </button>
                    </div>
                ))}
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold text-white">Need a Custom Solution?</h3>
            <p className="text-gray-400 mt-2">We offer tailored packages for enterprise clients with unique needs.</p>
            <a 
              href="mailto:enterprise@multipowerai.example.com?subject=Inquiry%20about%20Enterprise%20Solutions" 
              className="mt-4 inline-block bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Inquire about Enterprise Solutions
            </a>
          </div>
          <p className="text-xs text-gray-600 text-center mt-8">Payments are processed securely. This is a simulated payment flow for demonstration purposes.</p>
        </div>
      </div>
    </div>
  );
};