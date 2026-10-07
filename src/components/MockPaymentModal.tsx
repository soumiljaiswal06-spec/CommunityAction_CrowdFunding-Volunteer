import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CheckCircle2, AlertCircle, X, CreditCard, Smartphone, Building, Sparkles } from 'lucide-react';

interface MockPaymentModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProject: Project) => void;
}

const PRESET_AMOUNTS = [250, 500, 1000, 2500, 5000];

export const MockPaymentModal: React.FC<MockPaymentModalProps> = ({
  project,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [donorName, setDonorName] = useState(user?.name || '');
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('500');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ amount: number; title: string; txId: string } | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount(String(val));
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    setAmount(Number(val) || 0);
  };

  const handleProceedToPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount (minimum ₹1)');
      return;
    }
    setError(null);
    setStep('processing');

    // Simulate 1.2 second secure bank gateway verification
    setTimeout(async () => {
      try {
        const methodLabel = paymentMethod === 'upi' ? 'UPI Demo' : paymentMethod === 'card' ? 'Debit/Credit Card Demo' : 'NetBanking Demo';
        const res = await fetch(`/api/projects/${project.id}/donations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            userName: donorName.trim() || user?.name || 'Anonymous Supporter',
            userId: user?.id || null,
            message: message.trim() || 'Glad to contribute to our community!',
            paymentMethod: methodLabel,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Payment failed');
          setStep('form');
          return;
        }

        // Trigger confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas-confetti unsupported
        }

        setSuccessInfo({
          amount: data.donation.amount,
          title: data.project.title,
          txId: data.donation.id,
        });

        onSuccess(data.project);
        setStep('success');
      } catch (err: any) {
        setError(err.message || 'Payment simulation failed');
        setStep('form');
      }
    }, 1200);
  };

  const handleResetAndClose = () => {
    setStep('form');
    setError(null);
    setSuccessInfo(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* College Demo Banner */}
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>DEMO / MOCK PAYMENT SIMULATOR • NO REAL MONEY CHARGED</span>
          </div>
          <button onClick={handleResetAndClose} className="text-slate-950 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'form' && (
          <form onSubmit={handleProceedToPay} className="p-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Support Initiative
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 line-clamp-1">{project.title}</h3>
                <p className="text-xs text-slate-500">📍 {project.location}</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Amount Selection */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Select Contribution Amount (₹ INR)
              </label>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {PRESET_AMOUNTS.map(preset => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => handleSelectPreset(preset)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      amount === preset
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">₹</span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter custom amount"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-base"
                />
              </div>
            </div>

            {/* Donor Name & Optional Message */}
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Your Name / Display Name
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={e => setDonorName(e.target.value)}
                  placeholder="e.g. Anita Sharma (or leave blank for Anonymous)"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Encouragement Message (Optional)
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="e.g. Great job! Glad to support our local neighborhood."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Simulated Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Simulated Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span className="block text-xs font-semibold">UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <span className="block text-xs font-semibold">Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  <span className="block text-xs font-semibold">NetBanking</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <span>Authorize Mock Payment (₹{amount.toLocaleString()})</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 'processing' && (
          <div className="p-10 text-center space-y-4">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
            <h4 className="text-lg font-bold text-slate-900">Processing Simulated Payment...</h4>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Simulating payment gateway confirmation for ₹{amount.toLocaleString()} via{' '}
              {paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Debit Card' : 'NetBanking'}.
            </p>
          </div>
        )}

        {step === 'success' && successInfo && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-1">Donation Successful!</h4>
            <p className="text-sm text-emerald-700 font-semibold mb-4">
              You contributed ₹{successInfo.amount.toLocaleString()} to "{successInfo.title}"
            </p>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 mb-6 text-left space-y-1">
              <div className="flex justify-between">
                <span>Transaction Ref:</span>
                <span className="font-mono font-bold text-slate-800">{successInfo.txId}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-emerald-600">Simulated / Verified</span>
              </div>
              <div className="flex justify-between">
                <span>Impact:</span>
                <span className="text-slate-800">Project progress updated immediately</span>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow transition-all"
            >
              Done & Return to Project
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
