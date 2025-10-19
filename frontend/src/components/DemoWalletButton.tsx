import { useState } from 'react';
import { Wallet } from 'lucide-react';

export default function DemoWalletButton() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');

  const connectDemo = () => {
    // Generate a random demo address
    const demoAddress = '0x' + Math.random().toString(16).substring(2, 42);
    setAddress(demoAddress);
    setConnected(true);
    localStorage.setItem('demoWallet', demoAddress);
  };

  const disconnect = () => {
    setConnected(false);
    setAddress('');
    localStorage.removeItem('demoWallet');
  };

  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span className="font-mono text-sm">
            {address.substring(0, 6)}...{address.substring(38)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectDemo}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
    >
      <Wallet className="h-4 w-4" />
      Connect Demo Wallet
    </button>
  );
}
