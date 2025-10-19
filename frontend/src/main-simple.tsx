import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

function SimpleApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-12 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Decentralized Voting System
          </h1>
          <p className="text-xl mb-8">
            Secure, transparent, and verifiable blockchain-based voting
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Register to Vote
            </button>
            <button className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold border-2 border-white hover:bg-blue-800">
              View Elections
            </button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-blue-600 text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Secure & Tamper-Proof</h3>
            <p className="text-gray-600">
              Votes are encrypted and stored on the blockchain, making them immutable.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-blue-600 text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">Transparent & Verifiable</h3>
            <p className="text-gray-600">
              Every vote can be independently verified on the blockchain.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-blue-600 text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Anonymous & Private</h3>
            <p className="text-gray-600">
              Your vote remains private while being publicly verifiable.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            ✅ Frontend is working! Now testing full Web3 integration...
          </p>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SimpleApp />
    </BrowserRouter>
  </React.StrictMode>
);
