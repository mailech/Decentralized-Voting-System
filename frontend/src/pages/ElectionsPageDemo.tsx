import { Link } from 'react-router-dom';
import { Calendar, Users, Vote, Clock, CheckCircle } from 'lucide-react';
import { demoStore } from '../data/demoData';

export default function ElectionsPageDemo() {
  const elections = demoStore.getElections();
  const demoWallet = localStorage.getItem('demoWallet');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Vote className="h-4 w-4" />;
      case 'upcoming':
        return <Clock className="h-4 w-4" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Elections</h1>
          <p className="text-lg text-gray-600">
            Browse and participate in active elections. Your vote matters!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Elections</p>
                <p className="text-3xl font-bold text-gray-900">{elections.length}</p>
              </div>
              <Vote className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-3xl font-bold text-green-600">
                  {elections.filter(e => e.status === 'active').length}
                </p>
              </div>
              <Clock className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Votes Cast</p>
                <p className="text-3xl font-bold text-purple-600">
                  {elections.reduce((sum, e) => sum + e.totalVotes, 0)}
                </p>
              </div>
              <Users className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Elections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {elections.map((election) => {
            const hasVoted = demoWallet ? demoStore.hasVoted(election.id, demoWallet) : false;

            return (
              <div
                key={election.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">{election.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                        election.status
                      )}`}
                    >
                      {getStatusIcon(election.status)}
                      {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2">{election.description}</p>

                  {/* Dates */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(election.startDate).toLocaleDateString()}</span>
                    </div>
                    <span>→</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(election.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Candidates Preview */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      {election.candidates.length} Candidates
                    </p>
                    <div className="flex -space-x-2">
                      {election.candidates.slice(0, 4).map((candidate) => (
                        <img
                          key={candidate.id}
                          src={candidate.imageUrl}
                          alt={candidate.name}
                          className="w-10 h-10 rounded-full border-2 border-white"
                          title={candidate.name}
                        />
                      ))}
                      {election.candidates.length > 4 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                          +{election.candidates.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{election.totalVotes} votes cast</span>
                    </div>

                    {hasVoted && (
                      <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Voted
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/election/${election.id}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center font-semibold"
                    >
                      View Details
                    </Link>

                    {election.status === 'active' && !hasVoted && (
                      <Link
                        to={`/vote/${election.id}`}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-center font-semibold"
                      >
                        Vote Now
                      </Link>
                    )}

                    {election.status === 'closed' && (
                      <Link
                        to={`/results/${election.id}`}
                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-center font-semibold"
                      >
                        View Results
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {elections.length === 0 && (
          <div className="text-center py-12">
            <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Elections Available</h3>
            <p className="text-gray-600">Check back later for upcoming elections.</p>
          </div>
        )}
      </div>
    </div>
  );
}
