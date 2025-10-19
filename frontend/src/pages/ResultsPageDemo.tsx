import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, TrendingUp } from 'lucide-react';
import { demoStore } from '../data/demoData';

export default function ResultsPageDemo() {
  const { electionId } = useParams();
  const navigate = useNavigate();

  const election = demoStore.getElection(Number(electionId));

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Election Not Found</h2>
          <button
            onClick={() => navigate('/elections')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Elections
          </button>
        </div>
      </div>
    );
  }

  // Sort candidates by votes
  const sortedCandidates = [...election.candidates].sort((a, b) => b.votes - a.votes);
  const winner = sortedCandidates[0];
  const maxVotes = Math.max(...election.candidates.map(c => c.votes), 1);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/elections')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Elections
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.name}</h1>
          <p className="text-gray-600 mb-6">{election.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Votes</p>
                  <p className="text-2xl font-bold text-gray-900">{election.totalVotes}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Candidates</p>
                  <p className="text-2xl font-bold text-gray-900">{election.candidates.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{election.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Winner Announcement */}
        {election.status === 'closed' && election.totalVotes > 0 && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-8 mb-6 text-white">
            <div className="flex items-center gap-6">
              <Trophy className="h-20 w-20" />
              <div>
                <h2 className="text-3xl font-bold mb-2">Winner Announced!</h2>
                <p className="text-xl mb-1">{winner.name}</p>
                <p className="text-lg opacity-90">{winner.party}</p>
                <p className="text-2xl font-bold mt-2">
                  {winner.votes} votes ({((winner.votes / election.totalVotes) * 100).toFixed(1)}%)
                </p>
              </div>
              <img
                src={winner.imageUrl}
                alt={winner.name}
                className="w-32 h-32 rounded-full border-4 border-white ml-auto"
              />
            </div>
          </div>
        )}

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Results</h2>

          <div className="space-y-6">
            {sortedCandidates.map((candidate, index) => {
              const percentage = election.totalVotes > 0
                ? (candidate.votes / election.totalVotes) * 100
                : 0;
              const barWidth = election.totalVotes > 0
                ? (candidate.votes / maxVotes) * 100
                : 0;

              return (
                <div key={candidate.id} className="relative">
                  {/* Rank Badge */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0
                          ? 'bg-yellow-400 text-yellow-900'
                          : index === 1
                          ? 'bg-gray-300 text-gray-700'
                          : index === 2
                          ? 'bg-orange-300 text-orange-900'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      {/* Candidate Info */}
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          src={candidate.imageUrl}
                          alt={candidate.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
                          <p className="text-sm text-blue-600 font-semibold">{candidate.party}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{candidate.votes}</p>
                          <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                            index === 0
                              ? 'bg-gradient-to-r from-green-400 to-green-600'
                              : index === 1
                              ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                              : 'bg-gradient-to-r from-gray-400 to-gray-600'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        >
                          <div className="h-full flex items-center justify-end pr-3">
                            <span className="text-white font-semibold text-sm">
                              {candidate.votes} votes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {election.totalVotes === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No votes have been cast yet.</p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">About This Election</h3>
          <p className="text-sm text-blue-800 mb-2">{election.description}</p>
          <div className="flex gap-4 text-sm text-blue-700">
            <span>Start: {new Date(election.startDate).toLocaleDateString()}</span>
            <span>•</span>
            <span>End: {new Date(election.endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
