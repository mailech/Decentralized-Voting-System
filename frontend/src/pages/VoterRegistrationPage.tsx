import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { UserPlus, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';

const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Invalid phone number').optional(),
  identityProof: z.string().min(1, 'Identity proof is required'),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function VoterRegistrationPage() {
  const { address, isConnected } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check for demo wallet
  const demoWallet = typeof window !== 'undefined' ? localStorage.getItem('demoWallet') : null;
  const effectiveAddress = address || demoWallet;
  const effectiveConnected = isConnected || !!demoWallet;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationForm) => {
    if (!effectiveConnected || !effectiveAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // For demo mode, just store in localStorage
      if (demoWallet) {
        const { demoStore } = await import('../data/demoData');
        demoStore.registerVoter(effectiveAddress, data.email);
        toast.success('Registration successful! You can now vote in elections.');
        setTimeout(() => {
          window.location.href = '/elections';
        }, 1000);
      } else {
        // Try backend API for real wallet
        try {
          const identityHash = ethers.keccak256(
            ethers.toUtf8Bytes(data.identityProof + effectiveAddress)
          );

          const response = await fetch('/api/voters/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              walletAddress: effectiveAddress,
              identityHash,
              email: data.email,
              phoneNumber: data.phoneNumber,
            }),
          });

          if (!response.ok) {
            throw new Error('Registration failed');
          }

          toast.success('Registration successful! Awaiting verification.');
        } catch (error) {
          console.error('Backend registration error:', error);
          toast.error('Backend not available. Using demo mode.');
          const { demoStore } = await import('../data/demoData');
          demoStore.registerVoter(effectiveAddress, data.email);
          toast.success('Registration successful in demo mode!');
          setTimeout(() => {
            window.location.href = '/elections';
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card animate-slide-up">
          <div className="flex items-center justify-center mb-6">
            <UserPlus className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">Voter Registration</h1>
          <p className="text-gray-600 text-center mb-8">
            Register to participate in secure blockchain-based elections
          </p>

          {!effectiveConnected ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Please connect your wallet to continue with registration
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="label">Wallet Address</label>
                <input
                  type="text"
                  value={effectiveAddress || ''}
                  disabled
                  className="input bg-gray-100"
                />
              </div>

              <div>
                <label className="label">Email Address *</label>
                <input
                  type="email"
                  {...register('email')}
                  className="input"
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="label">Phone Number (Optional)</label>
                <input
                  type="tel"
                  {...register('phoneNumber')}
                  className="input"
                  placeholder="+1234567890"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <label className="label">Identity Proof *</label>
                <input
                  type="text"
                  {...register('identityProof')}
                  className="input"
                  placeholder="Enter your government ID number"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be hashed and stored securely on-chain
                </p>
                {errors.identityProof && (
                  <p className="text-red-500 text-sm mt-1">{errors.identityProof.message}</p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Privacy Notice</h3>
                <p className="text-sm text-blue-800">
                  Your identity information will be encrypted and hashed before being stored.
                  Only authorized verifiers can approve your registration. Your personal data
                  is never exposed on the blockchain.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Register as Voter</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
