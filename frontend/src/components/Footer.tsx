import { Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Decentralized Voting System</h3>
            <p className="text-gray-400 text-sm">
              Secure, transparent, and verifiable blockchain-based voting platform
              ensuring integrity and privacy throughout the election lifecycle.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/elections" className="text-gray-400 hover:text-white transition-colors">
                  Active Elections
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-400 hover:text-white transition-colors">
                  Voter Registration
                </a>
              </li>
              <li>
                <a href="/verify" className="text-gray-400 hover:text-white transition-colors">
                  Verify Vote
                </a>
              </li>
              <li>
                <a href="/admin/login" className="text-gray-400 hover:text-white transition-colors">
                  Admin Portal
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="mailto:support@dvs.example.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Decentralized Voting System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
