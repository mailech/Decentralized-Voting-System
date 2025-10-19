import { Link } from 'react-router-dom';
import { Vote, Shield, FileCheck, TrendingUp, Lock, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 animate-slide-up">
              Decentralized Voting System
            </h1>
            <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Experience secure, transparent, and verifiable elections powered by blockchain technology.
              Your vote matters, and we ensure it's counted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn btn-primary bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                Register to Vote
              </Link>
              <Link
                to="/elections"
                className="btn bg-primary-700 text-white hover:bg-primary-800 px-8 py-3 text-lg border-2 border-white"
              >
                View Elections
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DVS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Tamper-Proof</h3>
              <p className="text-gray-600">
                Votes are encrypted and stored on the blockchain, making them immutable and secure
                from tampering.
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <FileCheck className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Transparent & Verifiable</h3>
              <p className="text-gray-600">
                Every vote can be independently verified while maintaining voter anonymity through
                cryptographic proofs.
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <Lock className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Privacy Protected</h3>
              <p className="text-gray-600">
                Advanced encryption ensures your vote remains private while still being publicly
                verifiable.
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Voter Authentication</h3>
              <p className="text-gray-600">
                Secure wallet-based or ID-verified registration ensures only eligible voters can
                participate.
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Results</h3>
              <p className="text-gray-600">
                View election results in real-time with complete audit trails and transparency.
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <Vote className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Simple, intuitive interface makes voting accessible to everyone, regardless of
                technical expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">Register</h3>
              <p className="text-gray-600">
                Connect your wallet and complete identity verification
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">Choose Election</h3>
              <p className="text-gray-600">Browse active elections and select one to participate in</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">Cast Vote</h3>
              <p className="text-gray-600">
                Select your candidate and submit your encrypted vote on-chain
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-bold mb-2">Verify & Track</h3>
              <p className="text-gray-600">
                Verify your vote was counted and track election results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make Your Voice Heard?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of voters who trust DVS for secure and transparent elections.
          </p>
          <Link
            to="/register"
            className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-lg inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
