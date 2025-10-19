import { Link } from 'react-router-dom';
import { Vote, Users, CheckCircle, TrendingUp } from 'lucide-react';

export default function DemoPage() {
  const demoElections = [
    {
      id: 1,
      name: 'Student Council Election 2025',
      description: 'Vote for your student council representatives',
      candidates: ['Alice Johnson', 'Bob Smith', 'Carol Williams'],
      status: 'Active',
      totalVotes: 156,
    },
    {
      id: 2,
      name: 'Community Board Election',
      description: 'Choose your community board members',
      candidates: ['David Brown', 'Emma Davis', 'Frank Miller'],
      status: 'Active',
      totalVotes: 89,
    },
    {
      id: 3,
      name: 'Tech Club President',
      description: 'Select the next tech club president',
      candidates: ['Grace Lee', 'Henry Wilson'],
      status: 'Upcoming',
      totalVotes: 0,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to the Voting System! 🎉
        </h1>
        <p className="text-lg text-gray-600">
          You're connected with a demo wallet. Here's what you can do:
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
          <Vote className="h-12 w-12 text-blue-600 mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-2">Cast Your Vote</h3>
          <p className="text-sm text-gray-600">Choose your candidates</p>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-2">Verify Vote</h3>
          <p className="text-sm text-gray-600">Check your vote on blockchain</p>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center">
          <Users className="h-12 w-12 text-purple-600 mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-2">View Results</h3>
          <p className="text-sm text-gray-600">See live vote counts</p>
        </div>

        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 text-center">
          <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-2">Track Progress</h3>
          <p className="text-sm text-gray-600">Monitor election status</p>
        </div>
      </div>

      {/* Demo Elections */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Demo Elections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoElections.map((election) => (
            <div
              key={election.id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{election.name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    election.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {election.status}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{election.description}</p>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Candidates:</p>
                <ul className="space-y-1">
                  {election.candidates.map((candidate, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {candidate}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  {election.totalVotes} votes cast
                </span>
                {election.status === 'Active' ? (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold">
                    Vote Now
                  </button>
                ) : (
                  <button className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed">
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
        <h2 className="text-2xl font-bold mb-4">How to Use This System</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                1
              </span>
              Register as Voter
            </h3>
            <p className="text-gray-700 ml-11">
              Click "Register to Vote" and fill out the form with your details. This is required
              before you can cast votes.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                2
              </span>
              Browse Elections
            </h3>
            <p className="text-gray-700 ml-11">
              Go to "Elections" page to see all active and upcoming elections you can participate
              in.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                3
              </span>
              Cast Your Vote
            </h3>
            <p className="text-gray-700 ml-11">
              Select an election, review candidates, and cast your vote. Your vote is encrypted and
              stored on the blockchain.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                4
              </span>
              Verify & Track
            </h3>
            <p className="text-gray-700 ml-11">
              Use "Verify Vote" to confirm your vote was recorded. View results in real-time as
              votes are counted.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Get Started - Register Now
          </Link>
          <Link
            to="/elections"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-50 font-semibold border-2 border-blue-600"
          >
            View All Elections
          </Link>
        </div>
      </div>
    </div>
  );
}
