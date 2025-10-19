import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Vote, Home, FileCheck, Shield } from 'lucide-react';
import DemoWalletButton from './DemoWalletButton';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Vote className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">DVS</span>
            </Link>

            <div className="hidden md:flex space-x-4">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/elections"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/elections')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Vote className="h-4 w-4" />
                <span>Elections</span>
              </Link>

              <Link
                to="/verify"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/verify')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileCheck className="h-4 w-4" />
                <span>Verify Vote</span>
              </Link>

              <Link
                to="/admin/login"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin/login')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DemoWalletButton />
            <div className="text-sm text-gray-500">or</div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
